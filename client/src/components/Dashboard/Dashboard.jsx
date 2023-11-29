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
  const handlePageClick = (query, page) => {
    props.onPageChanged(query, page);
  };

  const [updateQuery, setUpdateQuery] = useState({});
  const [statusFilter, setStatusFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [discontinuedFilter, setDiscontinuedFilter] = useState("");
  const [isInitialSearch, setIsInitialSearch] = useState(true);

  const handleUpdateClick = (query = {}, bulk = false) => {
    props.onUpdateProducts(query, bulk);
  };

  const handleFilterChange = (event) => {
    const target = event.target;
    if (isInitialSearch) setIsInitialSearch(false);
    switch (target.id) {
      case "status":
        setStatusFilter(target.value);
        break;
      case "search":
        setSearchFilter(target.value);
        break;
      case "stock":
        setStockFilter(target.value);
        break;
      case "discontinued":
        setDiscontinuedFilter(target.value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isInitialSearch) return;
    const query = {};
    if (statusFilter) query.update_status = statusFilter;
    if (searchFilter) query.sku = new RegExp(searchFilter, "i").toString();
    if (stockFilter) query.inventory_status = stockFilter;
    if (discontinuedFilter) query.discontinued = discontinuedFilter;
    setUpdateQuery(query);
    props.onFilterChanged(query);
  }, [
    statusFilter,
    searchFilter,
    stockFilter,
    discontinuedFilter,
    isInitialSearch,
  ]);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    let leftSide = props.pagination.page - 2;
    let rightSide = props.pagination.page + 2;

    if (leftSide < 1) {
      rightSide += 1 - leftSide;
      leftSide = 1;
    }
    if (rightSide > props.pagination.totalPages) {
      leftSide -= rightSide - props.pagination.totalPages;
      rightSide = props.pagination.totalPages;
    }

    for (let i = 1; i <= props.pagination.totalPages; i++) {
      if (
        i === 1 ||
        i === props.pagination.totalPages ||
        (i >= leftSide && i <= rightSide)
      ) {
        pageNumbers.push(
          <button
            key={i}
            disabled={props.pagination.page === i}
            onClick={() => handlePageClick(props.query, i)}
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
        <div className="d-flex flex-col mr-6">
          <h2 className="text-2xl leading-tight">
            {props.vendor} Products ({props.total})
          </h2>
          <small>Last status: {props.status.update_status}</small>
        </div>
        <button
          onClick={() => {
            handleUpdateClick(updateQuery);
          }}
          disabled={props.total == 0 || props.status.is_updating}
          className="py-2 px-4 mr-2 disabled:opacity-50 w-auto bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
        >
          update ({props.total})
        </button>
        <button
          onClick={() => {
            handleUpdateClick({}, true);
          }}
          disabled={props.status.is_updating}
          className="py-2 px-4 disabled:opacity-50 w-auto bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
        >
          Bulk update
        </button>
      </div>
      <div className="flex flex-row items-stretch w-full mb-6">
        <select
          id="status"
          onChange={handleFilterChange}
          className="rounded-lg border-transparent mr-4 border border-gray-300 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        >
          <option value="">Status</option>
          <option value="error">Error</option>
          <option value="created">Created</option>
          <option value="updated">Updated</option>
        </select>
        <select
          id="stock"
          onChange={handleFilterChange}
          className="rounded-lg border-transparent mr-4 border border-gray-300 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        >
          <option value="">Stock</option>
          <option value="low">low</option>
          <option value="medium">medium </option>
          <option value="high">high</option>
        </select>
        <select
          id="discontinued"
          onChange={handleFilterChange}
          className="rounded-lg border-transparent mr-4 border border-gray-300 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        >
          <option value="">Discontinued</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <input
          id="search"
          onChange={handleFilterChange}
          className="rounded-lg border-transparent appearance-none border border-gray-300 w-full lg:w-72 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          type="text"
          placeholder="search sku"
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
                SKU
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              >
                Last update
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              >
                Updates Status
              </th>

              <th
                scope="col"
                className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              >
                Stock Status
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              >
                In Stock
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              >
                Discontinued
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
                          {m.sku}
                        </p>
                      </td>
                      <td className="px-5 py-1 lg:py-5 text-sm bg-white lg:border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {createNewDate(m.updatedAt)}
                        </p>
                      </td>
                      <td className="px-5 py-1 lg:py-5 text-sm bg-white lg:border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {m.update_status}{" "}
                          {m.update_log ? `(${m.update_log})` : ""}
                        </p>
                      </td>
                      <td className="px-5 py-1 lg:py-5 text-sm bg-white lg:border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {m.inventory_status}
                        </p>
                      </td>
                      <td className="px-5 py-1 lg:py-5 text-sm bg-white lg:border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {m.inventory_level}
                        </p>
                      </td>
                      <td className="px-5 py-1 lg:py-5 text-sm bg-white lg:border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {m.discontinued ? "Yes" : "No"}
                        </p>
                      </td>
                      <td className="relative px-5 pb-4 lg:py-5 text-sm bg-white border-b-8 lg:border-b border-gray-100">
                        <button
                          className="text-blue-600 hover:text-indigo-900"
                          data-product-sku={m.sku}
                          onClick={() => {
                            handleUpdateClick({ sku: m.sku });
                          }}
                        >
                          Update
                        </button>
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
              // eslint-disable-next-line no-undef
              onClick={() =>
                handlePageClick(props.query, props.pagination.prevPage)
              }
              disabled={props.pagination.prevPage ? false : true}
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
              disabled={props.pagination.nextPage ? false : true}
              // eslint-disable-next-line no-undef
              onClick={() =>
                handlePageClick(props.query, props.pagination.nextPage)
              }
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
