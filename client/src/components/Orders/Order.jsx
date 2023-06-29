import { getFormattedDate } from "../../common/index.js";
const Order = (props) => {
  let isDisabled = false;
  const handleOnShipClick = (id) => {
    props.onCreateOrder(id);
  };
  let orderStatusColor =
    props.order.payment_status == "captured"
      ? "text-white bg-green-600 rounded-sm p-1"
      : "text-white bg-red-600 rounded-sm p-1";
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Order #<b className="mr-1">{props.order.id}</b>
          <span className={orderStatusColor}>
            {props.order.payment_status || "not paid"}
          </span>
          <a
            href={`https://store-4n3dh09e13.mybigcommerce.com/manage/orders/${props.order.id}`}
            target="_blank"
            className="block underline hover:no-underline cursor-pointer text-blue-600"
          >
            Details
          </a>
        </h3>
        {props.order.payment_status === "captured" &&
          props.order.shipping_method != "In-Person Pickup" &&
          !props.order.staff_notes.includes("Items") && (
            <button
              onClick={() => {
                handleOnShipClick(props.order.id);
              }}
              disabled={isDisabled}
              className="px-4 py-2 disabled:opacity-50 text-base text-white bg-blue-600 border border-blue-600 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              Send
            </button>
          )}
      </div>
      <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
        <div className="block lg:grid grid-cols-2 gap-2">
          <div>
            <p>
              <span className="block text-sm text-gray-500">Company</span>
              {props.order.billing_address.company || "-"}
            </p>
            <p>
              <span className="block text-sm text-gray-500">First name</span>
              {props.order.billing_address.first_name}
            </p>
            <p>
              <span className="block text-sm text-gray-500">Last name</span>
              {props.order.billing_address.last_name}
            </p>
            <p>
              <span className="block text-sm text-gray-500">Email</span>
              {props.order.billing_address.email}
            </p>
            <p>
              <span className="block text-sm text-gray-500">Phone</span>
              {props.order.billing_address.phone || "-"}
            </p>
            <p>
              <span className="block text-sm text-gray-500">Address 1</span>
              {props.order.billing_address.street_1}
            </p>
            <p>
              <span className="block text-sm text-gray-500">Address 2</span>
              {props.order.billing_address.street_2 || "-"}
            </p>
            <p>
              <span className="block text-sm text-gray-500">Zip</span>
              {props.order.billing_address.zip}
            </p>
          </div>
          <div>
            <p>
              <span className="block text-sm text-gray-500">
                Shipping method
              </span>
              {props.order.shipping_method}
            </p>
            <p>
              <span className="block text-sm text-gray-500">Date</span>
              {getFormattedDate(props.order.date_created)}
            </p>
            <p>
              <span className="block text-sm text-gray-500">
                Payment method
              </span>
              {props.order.payment_method}
            </p>
            <p>
              <span className="block text-sm text-gray-500">Order total</span>$
              {props.order.total_inc_tax}
            </p>
            <p>
              <span className="block text-sm text-gray-500">
                Dropshipping status
              </span>
              {props.order.staff_notes || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
