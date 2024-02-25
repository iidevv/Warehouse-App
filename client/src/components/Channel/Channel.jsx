import { useState, useEffect } from "react";

const Channel = (props) => {
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

  const [searchFilter, setSearchFilter] = useState("");
  const [isInitialSearch, setIsInitialSearch] = useState(true);

  const handleUpdateClick = () => {
    props.onUpdateProducts();
  };
  const handleRefreshClick = () => {
    props.onRefreshProducts();
  };

  const handleFilterChange = (event) => {
    const target = event.target;
    if (isInitialSearch) setIsInitialSearch(false);
    switch (target.id) {
      case "search":
        setSearchFilter(target.value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isInitialSearch) return;
    const query = {};
    if (searchFilter) query.sku = new RegExp(searchFilter, "i").toString();
    props.onFilterChanged(query);
  }, [searchFilter, isInitialSearch]);

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
    <div className="p-5 lg:w-full">
      <div className="flex flex-row items-center w-full mb-6">
        <div className="d-flex flex-col mr-6">
          <h2 className="text-2xl leading-tight">
            {props.vendor} Products ({props.total})
          </h2>
        </div>
        <button
          onClick={() => {
            handleUpdateClick();
          }}
          disabled={props.status.is_updating}
          className="py-2 px-4 mr-2 disabled:opacity-50 w-auto bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
        >
          Bulk update
        </button>
        <button
          onClick={() => {
            handleRefreshClick();
          }}
          disabled={props.status.is_updating}
          className="py-2 px-4 disabled:opacity-50 w-auto bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
        >
          Rebuild list
        </button>
      </div>
      <div className="flex flex-row items-stretch w-full mb-6">
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
                Price
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              >
                Quantity
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              >
                Last update
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
                          {m.price}
                        </p>
                      </td>
                      <td className="px-5 py-1 lg:py-5 text-sm bg-white lg:border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {m.quantity}
                        </p>
                      </td>
                      <td className="px-5 py-1 lg:py-5 text-sm bg-white lg:border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {createNewDate(m.updatedAt)}
                        </p>
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

export default Channel;
