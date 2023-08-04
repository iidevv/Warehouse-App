import React, { useState } from "react";
import HhProduct from "./HhProduct";

const HhProducts = (props) => {
  let currentPage = +props.currentPage;
  let totalPages = +props.totalPages;
  const handleInputChange = (event) => {
    props.onSearch(event.target.value);
  };
  const handlePageChanged = (p) => {
    props.onPageChanged(p);
  };
  return (
    <div className="container">
      <div>
        <h2 className="text-2xl leading-tight mb-4">Helmet House Catalog</h2>
        <div className="flex items-center">
          <div className="lg:w-1/2 pr-2 mr-2 border-r">
            <input
              type="text"
              className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Search..."
              value={props.searchKeyword}
              onChange={handleInputChange}
            />
          </div>
          <p className="p-1 rounded-sm shadow-sm bg-white font-bold">
            {props.totalCount}
          </p>
        </div>
      </div>
      <div className="py-4 overflow-x-auto">
        <div className="inline-block min-w-full rounded-lg shadow">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="px-5 py-3 hidden lg:table-cell text-sm text-center font-normal text-gray-800 uppercase bg-white border-b border-gray-200"
                ></th>
                <th
                  scope="col"
                  className="px-5 py-3 hidden lg:table-cell text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                >
                  SKU
                </th>
                <th
                  scope="col"
                  className="px-2 lg:px-5 py-3 hidden lg:table-cell text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 hidden lg:table-cell text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 hidden lg:table-cell text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                >
                  STOCK
                </th>
              </tr>
            </thead>
            <tbody>
              {props.products &&
                props.products.map((product, i) => {
                  if (product) {
                    return (
                      <HhProduct
                        key={i}
                        id={product.objectID}
                        image={product.list_image}
                        sku={"-"}
                        name={product.product_name}
                        stock={"-"}
                        url={product.direct_link}
                        price={product.price}
                      />
                    );
                  } else {
                    return null;
                  }
                })}
            </tbody>
          </table>
          <div className="flex flex-col items-center px-5 py-5 bg-white xs:flex-row xs:justify-between">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => {
                  handlePageChanged(currentPage - 1);
                }}
                disabled={currentPage == 0 ? true : false}
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
                type="button"
                onClick={() => {
                  handlePageChanged(currentPage + 1);
                }}
                disabled={currentPage + 1 == totalPages ? true : false}
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

export default HhProducts;
