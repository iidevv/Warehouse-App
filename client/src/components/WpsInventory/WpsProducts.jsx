import React from "react";
import WpsProduct from "./WpsProduct";

const WpsProducts = (props) => {
  const handleInputChange = (event) => {
    props.onSearch(event.target.value);
  };

  return (
    <div className="container">
      <div className="flex flex-row justify-between w-full mb-1 sm:mb-0">
        <h2 className="text-2xl leading-tight">Catalog</h2>
        <div className="text-end">
          <div className="flex flex-col justify-center w-3/4 max-w-sm space-y-3 md:flex-row md:w-full md:space-x-3 md:space-y-0">
            <div className=" relative ">
              <input
                type="text"
                id='"form-subscribe-Filter'
                className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Product Name"
                value={props.searchKeyword}
                onChange={handleInputChange}
              />
            </div>
            {/* <button
                  className="flex-shrink-0 px-4 py-2 text-base font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200"
                  type="submit"
                >
                  Filter
                </button> */}
          </div>
        </div>
      </div>
      <div className="py-4 overflow-x-auto">
        <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                >
                  Product name
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                >
                  Updated at
                </th>
              </tr>
            </thead>
            <tbody>
              {props.products.map((m, i) => {
                return (
                  <WpsProduct
                    key={i}
                    id={m.id}
                    name={m.name}
                    updated_at={m.updated_at}
                  />
                );
              })}
            </tbody>
          </table>
          <div className="flex flex-col items-center px-5 py-5 bg-white xs:flex-row xs:justify-between">
            <div className="flex items-center">
              <button
                onClick={() => props.onCursorChanged(props.cursor.prev)}
                type="button"
                disabled={props.cursor.prev ? false : true}
                className="disabled:opacity-50 w-full p-4 text-base text-gray-600 bg-white border rounded-l-xl hover:bg-gray-100"
              >
                <svg
                  width="9"
                  fill="currentColor"
                  height="8"
                  className=""
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"></path>
                </svg>
              </button>
              <button
                onClick={() => props.onCursorChanged(props.cursor.next)}
                type="button"
                disabled={props.cursor.next ? false : true}
                className="disabled:opacity-50 w-full p-4 text-base text-gray-600 bg-white border-t border-b border-r rounded-r-xl hover:bg-gray-100"
              >
                <svg
                  width="9"
                  fill="currentColor"
                  height="8"
                  className=""
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WpsProducts;
