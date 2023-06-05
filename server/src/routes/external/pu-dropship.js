import express from "express";
import {
  bigCommerceInstanceV2,
  puDropshipInstance,
  puInstance,
} from "../../instances/index.js";
import { puInventoryModel } from "../../models/puInventory.js";

const router = express.Router();

const convertStateNameToAbbreviation = (stateName) => {
  const states = {
    alabama: "AL",
    alaska: "AK",
    arizona: "AZ",
    arkansas: "AR",
    california: "CA",
    colorado: "CO",
    connecticut: "CT",
    delaware: "DE",
    florida: "FL",
    georgia: "GA",
    hawaii: "HI",
    idaho: "ID",
    illinois: "IL",
    indiana: "IN",
    iowa: "IA",
    kansas: "KS",
    kentucky: "KY",
    louisiana: "LA",
    maine: "ME",
    maryland: "MD",
    massachusetts: "MA",
    michigan: "MI",
    minnesota: "MN",
    mississippi: "MS",
    missouri: "MO",
    montana: "MT",
    nebraska: "NE",
    nevada: "NV",
    "new hampshire": "NH",
    "new jersey": "NJ",
    "new mexico": "NM",
    "new york": "NY",
    "north carolina": "NC",
    "north dakota": "ND",
    ohio: "OH",
    oklahoma: "OK",
    oregon: "OR",
    pennsylvania: "PA",
    "rhode island": "RI",
    "south carolina": "SC",
    "south dakota": "SD",
    tennessee: "TN",
    texas: "TX",
    utah: "UT",
    vermont: "VT",
    virginia: "VA",
    washington: "WA",
    "west virginia": "WV",
    wisconsin: "WI",
    wyoming: "WY",
  };

  // Normalize the input
  const normalizedStateName = stateName.toLowerCase().trim();

  // Convert state name to abbreviation
  const abbreviation = states[normalizedStateName];

  // Check if abbreviation exists
  if (!abbreviation) {
    throw new Error(`No abbreviation found for state: ${stateName}`);
  }

  return abbreviation;
};

const checkAndFormatPUOrderItems = async (orderItems) => {
  const itemsPromises = orderItems.map(async (item) => {
    try {
      const puDbProduct = await puInventoryModel.findOne({
        variants: { $elemMatch: { vendor_id: item.sku } },
      });
      let puProduct;

      if (puDbProduct == null) {
        let payload = {
          queryString: "item.sku",
          pagination: {
            limit: 2,
          },
        };
        puProduct = await puInstance.post("parts/search/", payload);
      }
      if (
        puDbProduct !== null ||
        (puProduct && puProduct.data.result.total === 1)
      ) {
        return {
          line_number: item.sku,
          part_number: item.sku,
          quantity: item.quantity,
          currency: "USD",
          memo: "string",
        };
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  });
  const items = await Promise.all(itemsPromises);
  return items.filter((item) => item !== null);
};

router.post("/pu-order/", async (req, res) => {
  const orderId = req.body.data.id;
  console.log(req.body.data.id);
  try {
    const order = await bigCommerceInstanceV2.get(`/orders/${orderId}`);
    const orderItems = await bigCommerceInstanceV2.get(
      `/orders/${orderId}/products`
    );

    const filteredOrderItems = await checkAndFormatPUOrderItems(orderItems);
    if (filteredOrderItems.length > 0) {
      const orderShipping = await bigCommerceInstanceV2.get(
        `/orders/${orderId}/shipping_addresses`
      );

      const orderForPU = {
        dealer_number: "DIS076",
        order_type: "DS",
        purchase_order_number: order.id,
        shipping_method: "ground",
        cancellation_policy: "back_order",
        ship_to_address: {
          name: `${orderShipping[0].first_name} ${orderShipping[0].last_name}`,
          address_line_1: orderShipping[0].street_1,
          address_line_2: orderShipping[0].street_2,
          city: orderShipping[0].city,
          state: convertStateNameToAbbreviation(orderShipping[0].state),
          postal_code: orderShipping[0].zip,
          country: "US",
        },
        line_items: filteredOrderItems,
        leave_order_open: true,
      };

      const createdDropShipOrder = await puDropshipInstance.post(
        "/orders/dropship",
        orderForPU
      );
      let orderNotes = `#${createdDropShipOrder.data.reference_number} (PU)\nStatus: ${createdDropShipOrder.data.status_message}\nItems:\n`;
      orderNotes += createdDropShipOrder.data.line_items.map((item) => {
        return `#${item.part_number}, qty: ${item.ordered.quantity}`
      }).join('\n');
      const bigCommerceOrder = await bigCommerceInstanceV2.put(
        `/orders/${orderId}`,
        {
          staff_notes: orderNotes,
        }
      );
      console.log(bigCommerceOrder.staff_notes);
      return res.json({ message: "Note created." });
    }
    return res.status(500).json({ message: "Not found." });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { router as puExternalOrderRouter };
