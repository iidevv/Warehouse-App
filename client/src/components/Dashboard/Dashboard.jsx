import React, { useState } from "react";

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

  const handleUpdateClick = () => {
    props.onUpdateProducts();
  };
  const handlePageClick = (name, page) => {
    props.onPageChanged(name, page);
  };
  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= props.totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          disabled={props.currentPage === i ? true : false}
          onClick={() => handlePageClick("", i)}
          type="button"
          className="w-full px-4 py-2 text-base text-indigo-500 bg-white border-t border-b hover:bg-gray-100 disabled:text-black"
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };
  return (
    <div className="container">
      <div className="flex flex-row items-center w-full mb-6">
        <h2 className="text-2xl leading-tight mr-6">
          Synced Products ({props.total})
        </h2>
        <button
          onClick={handleUpdateClick}
          disabled={props.status}
          className="py-2 px-4 disabled:opacity-50 w-auto bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
        >
          {props.status ? "Processing" : "Update"}
        </button>
      </div>
      <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th
                scope="col"
                className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              >
                Vendor
              </th>
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
            {props.products.map((m, i) => {
              return (
                <tr key={i}>
                  <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {m.vendor}
                    </p>
                  </td>
                  <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {m.product_name}
                    </p>
                  </td>
                  <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {createNewDate(m.last_updated)}
                    </p>
                  </td>
                  <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {m.status}
                    </p>
                  </td>
                  <td className="relative px-5 py-5 text-sm bg-white border-b border-gray-200">
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
                          className="text-blue-600 mr-2 pr-2 border-r"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDeleteClick}
                          id={m.bigcommerce_id}
                          className="text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
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
            {renderPageNumbers()}
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
