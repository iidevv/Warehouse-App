import Order from "./Order";

const Orders = (props) => {
  let currentPage = +props.currentPage;
  const handlePageChanged = (p) => {
    props.onPageChanged(p);
  };
  return (
    <div className="m-5">
      <div className="mb-6">
        <h1 className="text-2xl leading-tight">Orders</h1>
      </div>
      <div>
        {props.orders &&
          props.orders.map((order, i) => {
            return <Order key={i} order={order} onCreateOrder={props.onCreateOrder} />;
          })}
      </div>
      <div className="flex flex-col items-center px-5 py-5 bg-white xs:flex-row xs:justify-between">
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => {
              handlePageChanged(currentPage - 1);
            }}
            disabled={currentPage == 1 ? true : false}
            className="disabled:opacity-50 w-full p-4 text-base text-gray-600 bg-white border rounded-l-xl hover:bg-gray-100"
          >
            <svg
              width="9"
              fill="currentColor"
              height="8"
              viewBox="0 0 1792 1792"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"></path>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => {
              handlePageChanged(currentPage + 1);
            }}
            disabled={false}
            className="disabled:opacity-50 w-full p-4 text-base text-gray-600 bg-white border-t border-b border-r rounded-r-xl hover:bg-gray-100"
          >
            <svg
              width="9"
              fill="currentColor"
              height="8"
              viewBox="0 0 1792 1792"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;
