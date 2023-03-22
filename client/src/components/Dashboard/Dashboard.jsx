const Dashboard = (props) => {
  debugger
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
  const handleUpdateClick = (event) => {
    const id = +event.target.id;
    console.log(id);
  }
  return (
    <div className="py-8">
      <div className="flex flex-row justify-between w-full mb-1 sm:mb-0">
        <h2 className="text-2xl leading-tight mb-4">
          Synced Products ({props.total})
        </h2>
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
                  <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                    <button onClick={handleUpdateClick} id={m.vendor_id} className="text-blue-600 hover:text-indigo-900 mr-6 pr-6 border-r-2">
                      Update
                    </button>
                    <button onClick={handleDeleteClick} id={m.vendor_id} className="text-red-600 hover:text-indigo-900">
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex flex-col items-center px-5 py-5 bg-white xs:flex-row xs:justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="w-full p-4 text-base text-gray-600 bg-white border rounded-l-xl hover:bg-gray-100"
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
              className="w-full p-4 text-base text-gray-600 bg-white border-t border-b border-r rounded-r-xl hover:bg-gray-100"
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
  );
};

export default Dashboard;
