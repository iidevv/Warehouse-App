const categoriesSearch = (props) => {
  const handleInputChange = (event) => {
    if (event.target.value.length > 2)
      props.onSearchCategories(event.target.value);
  };
  const handleButtonClick = (event) => {
    localStorage.setItem("category_id", event.target.id);
    localStorage.setItem("category_name", event.target.textContent);
    props.onSetCategory();
  };
  return (
    <>
      <span className="block text-sm font-medium text-gray-700 mb-2">
        Current category:
      </span>
      <div className="flex mb-3 relative flex-col lg:flex-row">
        <label
          htmlFor="category-search"
          className="flex-shrink-0 md:w-1/2 text-center cursor-pointer inline-flex items-center py-2.5 px-2 text-sm font-medium text-gray-500 bg-gray-100 border border-gray-300 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100"
        >
          <span className="mx-auto">
            {props.current_category.name ? props.current_category.name : "None"}
          </span>
        </label>
        <div
          id="dropdown-search"
          className="z-10 absolute top-full bg-white divide-y divide-gray-100 shadow w-full lg:w-96"
        >
          <ul
            className="text-sm text-gray-700 max-h-96 overflow-y-auto"
            aria-labelledby="dropdown-button-2"
          >
            {props.categories.map((m, i) => {
              return (
                <li key={i}>
                  <button
                    type="button"
                    className="inline-flex w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    id={m.id}
                    onClick={handleButtonClick}
                  >
                    {m.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="relative w-full mt-2 lg:mt-0">
          <input
            type="text"
            id="category-search"
            className="block p-2.5 rounded-none w-full z-20 text-black text-center lg:border-l-gray-50 lg:border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Category search"
            onChange={handleInputChange}
          />
        </div>
      </div>
    </>
  );
};

export default categoriesSearch;
