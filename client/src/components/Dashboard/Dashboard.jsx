import { useState, useEffect } from "react";

const Dashboard = (props) => {
  const createNewDate = (current_date) => {
    const date = new Date(current_date);
    const options = {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return date.toLocaleString("en-US", options);
  };
  const handleDeleteClick = (event) => {
    const id = +event.target.id;
    props.onDeleteProduct(id);
  };

  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const toggleDropdown = (index) => {
    setActiveDropdownIndex(activeDropdownIndex === index ? null : index);
  };

  const handlePageClick = (name, page, statusFilter, searchFilter) => {
    props.onPageChanged(name, page, statusFilter, searchFilter);
  };

  const [statusFilter, setStatusFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [isInitialSearch, setIsInitialSearch] = useState(true);

  const handleUpdateClick = (vendor_id, name) => {
    props.onUpdateProducts(vendor_id, name, statusFilter);
  };

  const handleFilterChange = (event) => {
    const target = event.target;
    if (isInitialSearch) setIsInitialSearch(false);
    if (target.type === "select-one") {
      setStatusFilter(target.value);
    } else if (target.type === "text") {
      setSearchFilter(target.value);
    }
  };

  useEffect(() => {
    if (isInitialSearch) return;
    props.onFilterChanged("", "", statusFilter, searchFilter);
  }, [statusFilter, searchFilter, isInitialSearch]);

  const renderPageNumbers = () => {
    const pageNumbers = [];

    let leftSide = props.currentPage - 2;
    let rightSide = props.currentPage + 2;

    if (leftSide < 1) {
      rightSide += 1 - leftSide;
      leftSide = 1;
    }
    if (rightSide > props.totalPages) {
      leftSide -= rightSide - props.totalPages;
      rightSide = props.totalPages;
    }

    for (let i = 1; i <= props.totalPages; i++) {
      if (
        i === 1 ||
        i === props.totalPages ||
        (i >= leftSide && i <= rightSide)
      ) {
        pageNumbers.push(
          <button
            key={i}
            disabled={props.currentPage === i}
            onClick={() => handlePageClick("", i, statusFilter, searchFilter)}
            type="button"
            className="w-full px-4 py-2 text-base text-indigo-500 bg-white border-t border-b hover:bg-gray-100 disabled:text-black"
          >
            {i}
          </button>
        );
      } else if (i === leftSide - 1 || i === rightSide + 1) {
        pageNumbers.push(
          <span
            key={i}
            className="w-full px-4 py-2 text-base text-indigo-500 bg-white border-t border-b hover:bg-gray-100 disabled:text-black"
          >
            ...
          </span>
        );
      }
    }

    return pageNumbers;
  };
  return (
    <div className="m-5 lg:w-full">
      <div className="flex flex-row items-center w-full mb-6">
        <h2 className="text-2xl leading-tight mr-6">
          WPS Products ({props.total})
        </h2>
        <button
          onClick={() => {
            handleUpdateClick();
          }}
          disabled={props.status}
          className="py-2 px-4 disabled:opacity-50 w-auto bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
        >
          {props.status ? "Processing" : "Update"}
        </button>
      </div>
      <div className="flex flex-row items-stretch w-full mb-6">
        <select
          onChange={handleFilterChange}
          className="rounded-lg border-transparent mr-4 border border-gray-300 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        >
          <option value="">Status</option>
          <option value="Error">Error</option>
          <option value="Created">Created</option>
          <option value="Updated">Updated</option>
          <option value="No changes">No changes</option>
        </select>
        <input
          onChange={handleFilterChange}
          className="rounded-lg border-transparent appearance-none border border-gray-300 w-full lg:w-72 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          type="text"
          placeholder="search..."
        />
      </div>
      <div className="inline-block min-w-full rounded-lg shadow">
        <table className="min-w-full leading-normal">
          <thead className="hidden lg:table-header-group">
            <tr>
              <th
                scope="col"
                className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              >
                Product Name
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              >
                Last updated
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {props.products &&
              props.products.map((m, i) => {
                if (m) {
                  return (
                    <tr key={i} className="flex flex-col lg:table-row">
                      <td className="px-5 py-1 lg:py-5 text-sm bg-white lg:border-b border-gray-200">
                        <p className="text-xl font-bold lg:font-normal lg:text-sm lg:text-gray-900 whitespace-no-wrap">
                          {m.product_name}{" "}
                          {m.create_type == "search" ? " (Combined)" : ""}
                        </p>
                      </td>
                      <td className="px-5 py-1 lg:py-5 text-sm bg-white lg:border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {createNewDate(m.last_updated)}
                        </p>
                      </td>
                      <td className="px-5 py-1 lg:py-5 text-sm bg-white lg:border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {m.status}
                        </p>
                      </td>
                      <td className="relative px-5 pb-4 lg:py-5 text-sm bg-white border-b-8 lg:border-b border-gray-100">
                        <button
                          className="text-blue-600 hover:text-indigo-900 mr-1 pr-1 border-r"
                          data-product-id={m.bigcommerce_id}
                          onClick={() => {
                            handleUpdateClick(m.vendor_id, m.product_name);
                          }}
                        >
                          Update
                        </button>
                        <button
                          onClick={() => toggleDropdown(i)}
                          className="text-red-600 hover:text-indigo-900"
                        >
                          Delete
                        </button>
                        {activeDropdownIndex === i && (
                          <div className="absolute top-1/2 -translate-y-1/2 bg-white shadow-md rounded-sm px-1 py-1 border z-10">
                            <button
                              onClick={() => toggleDropdown(i)}
                              className="text-blue-600 mr-2 hover:underline"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleDeleteClick}
                              id={m.bigcommerce_id}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
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
              onClick={() => handlePageClick("", props.currentPage - 1)}
              disabled={props.currentPage === 1 ? true : false}
              type="button"
              className="disabled:bg-gray-100 w-full p-4 text-base text-gray-600 bg-white border-l border-t border-b rounded-l-xl hover:bg-gray-100"
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
            <div className="hidden lg:flex">{renderPageNumbers()}</div>
            <button
              type="button"
              disabled={props.currentPage === props.totalPages ? true : false}
              onClick={() => handlePageClick("", props.currentPage + 1)}
              className="disabled:bg-gray-100 w-full p-4 text-base text-gray-600 bg-white border-t border-b border-r rounded-r-xl hover:bg-gray-100"
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
    </div>
  );
};

export default Dashboard;
