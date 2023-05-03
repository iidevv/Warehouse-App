const categoriesSearch = (props) => {
  const handleInputChange = (event) => {
    if (event.target.value.length > 2)
      props.onSearchCategories(event.target.value);
  };
  const handleButtonClick = (event) => {
    let categories =
      JSON.parse(localStorage.getItem("current_categories")) || [];

    const categoryId = event.target.id;
    const categoryName = event.target.textContent;

    const categoryExists = categories.some(
      (category) => category.category_id === categoryId
    );

    if (!categoryExists) {
      categories.push({
        category_id: categoryId,
        category_name: categoryName,
      });
      localStorage.setItem("current_categories", JSON.stringify(categories));
    }

    props.onSetCategory();
  };
  const handleButtonResetClick = (event) => {
    localStorage.setItem("current_categories", JSON.stringify([]));
    props.onSetCategory();
  };

  return (
    <>
      <div className="text-sm font-medium text-gray-700 mt-4 pt-4 border-t mb-4">
        <p className="p-1 ml-1">Current categories:</p>
        <div>
          {props.current_categories &&
            props.current_categories.map((category, i) => (
              <span
                key={i}
                className="inline-block bg-gray-600 rounded-sm text-white p-1 ml-2 mb-2"
              >
                {category.category_name}
              </span>
            ))}
        </div>
      </div>
      <div className="flex mb-3 relative flex-col lg:flex-row">
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
            className="block p-2.5 rounded-none w-full z-20 text-black border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Categories search"
            onChange={handleInputChange}
          />
        </div>
        <button
          className="bg-red-500 text-white p-2"
          onClick={handleButtonResetClick}
        >
          Reset
        </button>
      </div>
    </>
  );
};

export default categoriesSearch;
