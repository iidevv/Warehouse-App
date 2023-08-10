import React, { useState } from "react";
import CatalogProduct from "./CatalogProduct";

const Catalog = (props) => {
  
  const handleSearch = (e) => {
    const search = e.target.value;
    props.onSearch("", search);
  };

  const onPageChanged = (page) => {
    props.onPageChanged(page, props.search);
  };

  return (
    <>
      <div>
        <h2 className="text-2xl leading-tight mb-4">
          {props.vendor} Catalog{" "}
          {props.meta.total ? `(${props.meta.total})` : ""}
        </h2>
        <div className="flex flex-col-reverse lg:flex-row">
          <div className="lg:w-1/2 flex">
            <input
              type="text"
              value={props.search}
              onChange={handleSearch}
              className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Search..."
            />
          </div>
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
                props.products.map((m, i) => {
                  if (m) {
                    return (
                      <CatalogProduct
                        key={i}
                        id={m.id}
                        name={m.name}
                        url={m.url}
                        sku={m.sku}
                        image_url={m.image_url}
                        price={m.price}
                        inventory={m.inventory}
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
                  onPageChanged(props.meta.prev);
                }}
                value={props.meta.prev}
                disabled={props.meta.prev !== null ? false : true}
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
                  onPageChanged(props.meta.next);
                }}
                disabled={props.meta.next !== null ? false : true}
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
    </>
  );
};

export default Catalog;
