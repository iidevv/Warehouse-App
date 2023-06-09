import express from "express";
import {
  bigCommerceInstanceV2,
  puDropshipInstance,
  puInstance,
  wpsInstance,
} from "../../instances/index.js";
import { puInventoryModel } from "../../models/puInventory.js";
import { InventoryModel } from "../../models/Inventory.js";

const router = express.Router();

// globals

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

// PU

const checkAndFormatPUOrderItems = async (orderItems) => {
  const itemsPromises = orderItems.map(async (item) => {
    try {
      const puDbProduct = await puInventoryModel.findOne({
        variants: { $elemMatch: { vendor_id: item.sku } },
      });
      let puProduct;

      if (puDbProduct == null) {
        let payload = {
          queryString: item.sku,
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

const createPUOrder = async (id, shipping, items) => {
  const order = {
    dealer_number: "DIS076",
    order_type: "DS",
    purchase_order_number: id,
    shipping_method: "ground",
    cancellation_policy: "back_order",
    ship_to_address: {
      name: `${shipping.first_name} ${shipping.last_name}`,
      address_line_1: shipping.street_1,
      address_line_2: shipping.street_2,
      city: shipping.city,
      state: convertStateNameToAbbreviation(shipping.state),
      postal_code: shipping.zip,
      country: "US",
    },
    line_items: items,
    leave_order_open: true,
  };
  try {
    const createdDropShipOrder = await puDropshipInstance.post(
      "/orders/dropship",
      order
    );
    let orderNotes = `\n#${createdDropShipOrder.data.reference_number} (PU)\nStatus: ${createdDropShipOrder.data.status_message}\nItems:\n`;
    orderNotes += createdDropShipOrder.data.line_items
      .map((item) => {
        return `#${item.part_number}, qty: ${item.ordered.quantity}`;
      })
      .join("\n");
    return orderNotes;
  } catch (error) {
    return error;
  }
};

// WPS

const checkAndFormatWPSOrderItems = async (orderItems) => {
  const itemsPromises = orderItems.map(async (item) => {
    try {
      const wpsDbProduct = await InventoryModel.findOne({
        variants: { $elemMatch: { bigcommerce_id: item.id } },
      });
      let wpsProduct;

      if (wpsDbProduct == null) {
        wpsProduct = await wpsInstance.get(`/items?filter[sku]=${item.sku}`);
      }
      if (
        wpsDbProduct !== null ||
        (wpsProduct && wpsProduct.data.meta.count === 1)
      ) {
        return {
          item_sku: item.sku,
          quantity: item.quantity,
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

const createWPSOrder = async (id, shipping, items) => {
  const cart = {
    po_number: id,
    ship_name: `${shipping.first_name} ${shipping.last_name}`,
    ship_address1: shipping.street_1,
    ship_address2: shipping.street_2,
    ship_city: shipping.city,
    ship_state: convertStateNameToAbbreviation(shipping.state),
    ship_zip: shipping.zip,
    ship_phone: shipping.phone,
    email: shipping.email,
  };
  const cartItems = items;
  const order = {
    po_number: id,
  };
  try {
    await wpsInstance.post("/carts/", cart);

    const itemsPromises = cartItems.map(async (item) => {
      try {
        const puDbProduct = await wpsInstance.post(`/carts/${id}/items`, item);
        console.log(`id - ${id}(${puDbProduct.data.data.status})`);
      } catch (error) {
        console.error(`Error adding item to cart: ${error}`);
      }
    });

    await Promise.all(itemsPromises);

    const orderItems = await wpsInstance.get(`/carts/${id}`);
    const createdDropShipOrder = await wpsInstance.post("/orders/", order);

    let orderNotes = `\n#${createdDropShipOrder.data.data.order_number} (WPS)\nStatus: ${createdDropShipOrder.data.data.status}\nItems:\n`;

    orderNotes += orderItems.data.data.items
      .map((item) => `#${item.item}, qty: ${item.quantity}`)
      .join("\n");

    return orderNotes;
  } catch (error) {
    console.error(`Error creating WPS order: ${error}`);
    throw error;
  }
};

router.post("/order/", async (req, res) => {
  const orderId = req.body.data.id;
  let orderNotes = "";
  console.log(req.body.data.id);
  try {
    // global order info
    const order = await bigCommerceInstanceV2.get(`/orders/${orderId}`);
    const orderItems = await bigCommerceInstanceV2.get(
      `/orders/${orderId}/products`
    );
    const orderShipping = await bigCommerceInstanceV2.get(
      `/orders/${orderId}/shipping_addresses`
    );

    // PU order
    const filteredPUOrderItems = await checkAndFormatPUOrderItems(orderItems);

    if (
      filteredPUOrderItems.length > 0 &&
      orderShipping[0].shipping_method !== "In-Person Pickup"
    ) {
      const puOrder = await createPUOrder(
        orderId,
        orderShipping[0],
        filteredPUOrderItems
      );
      orderNotes += puOrder;
    }

    // WPS order

    const filteredWPSOrderItems = await checkAndFormatWPSOrderItems(orderItems);

    if (
      filteredWPSOrderItems.length > 0 &&
      orderShipping[0].shipping_method !== "In-Person Pickup"
    ) {
      const wpsOrder = await createWPSOrder(
        orderId,
        orderShipping[0],
        filteredWPSOrderItems
      );
      orderNotes += wpsOrder;
    }

    await bigCommerceInstanceV2.put(`/orders/${orderId}`, {
      staff_notes: orderNotes,
    });
    res.json({ message: orderNotes });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { router as puExternalOrderRouter };
