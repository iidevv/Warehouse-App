import React, { useState } from "react";
import WpsItem from "./WpsItem";
import WpsProduct from "./WpsProduct";

const WpsProducts = (props) => {
  const handleInputChange = (event) => {
    props.onSearch(event.target.value);
  };

  const [searchBy, setSearchBy] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const formElements = event.target.elements;
    const searchByValue = formElements.search_by.value;
    const searchValueValue = formElements.search_value.value;
    setSearchBy(formElements.search_by.value);
    setSearchValue(formElements.search_value.value);

    props.onItemsSearch(searchByValue, searchValueValue, "");
  };

  const handleOnPageChanged = (event) => {
    const cursor = event.target.value;
    props.onItemsSearch(searchBy, searchValue, cursor);
  };

  return (
    <div className="container">
      <div>
        <h2 className="text-2xl leading-tight mb-4">WPS Catalog</h2>
        <div className="flex flex-col-reverse lg:flex-row">
          <div className="lg:w-1/2 lg:mr-4 lg:pr-4 lg:border-r">
            <input
              type="text"
              className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Search by product name"
              value={props.searchKeyword}
              onChange={handleInputChange}
            />
          </div>
          <form
            onSubmit={handleFormSubmit}
            className="mb-4 lg:mb-0 lg:w-1/2 flex flex-col relative"
          >
            <div className="flex">
              <select
                name="search_by"
                className="rounded-lg border-transparent mr-2 border border-gray-300 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="sku">SKU</option>
              </select>
              <input
                type="text"
                name="search_value"
                className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Search by variants"
              />
              <button
                type="submit"
                className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <span className="sr-only">Search</span>
              </button>
            </div>
            <div className="flex flex-col relative lg:absolute overflow-hidden top-full left-0 w-full rounded-lg mt-2 bg-white shadow-lg">
              {props.items &&
                props.items.map((item, i) => <WpsItem key={i} item={item} />)}
              <div className="flex justify-center">
                {props.itemsCursor && props.itemsCursor.prev && (
                  <button
                    type="button"
                    onClick={handleOnPageChanged}
                    value={props.itemsCursor.prev}
                    className="py-2 px-4 text-blue-800 underline hover:no-underline"
                  >
                    Prev
                  </button>
                )}
                {props.itemsCursor && props.itemsCursor.next && (
                  <button
                    type="button"
                    onClick={handleOnPageChanged}
                    value={props.itemsCursor.next}
                    className="py-2 px-4 text-blue-800 underline hover:no-underline"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="py-4 overflow-x-auto">
        <div className="inline-block min-w-full rounded-lg shadow">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="px-5 py-3 hidden lg:table-cell text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-2 lg:px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                >
                  Product name
                </th>
                <th
                  scope="col"
                  className="px-2 lg:px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                >
                  Variants
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
                    items={m.items ? m.items.data : null}
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
