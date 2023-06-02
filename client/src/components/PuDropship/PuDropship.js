import PuDropshipOrder from "./PuDropshipOrder";

const PuDropship = (props) => {
  const handleOnChange = (e) => {
    console.log(e.target.value);
  }
  return (
    <div className="m-5">
      <div className="mb-6">
        <h1 className="text-2xl leading-tight">PU Dropship</h1>
        <form className="flex lg:flex-row flex-col lg:items-end py-5 my-5">
          <div className="lg:mr-6">
            <span className="font-bold text-sm mr-2 w-full block">From</span>
            <input
              type="date"
              name="date-from"
              onChange={handleOnChange}
              className="mb-2 lg:mb-0 lg:mr-2 px-4 py-2 w-full text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
          <div className="lg:mr-6">
            <span className="font-bold text-sm mr-2 w-full block">To</span>
            <input
              type="date"
              name="date-to"
              className="mb-2 lg:mb-0 lg:mr-2 px-4 py-2 w-full text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-base text-white bg-blue-600 border border-blue-600 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            Apply
          </button>
        </form>
      </div>
      <div>
        {props.orders &&
          props.orders.map((order, i) => {
            return <PuDropshipOrder key={i} order={order} />;
          })}
      </div>
      <div className="flex flex-col items-center px-5 py-5 bg-white xs:flex-row xs:justify-between">
        <div className="flex items-center justify-center">
          <button
            type="button"
            disabled={true}
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
            disabled={true}
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

export default PuDropship;
