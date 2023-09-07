import { useState, useEffect } from "react";

const DMGCategoriesSearch = (props) => {
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

    // props.onSetCategory();
  };
  const handleButtonResetClick = (event) => {
    localStorage.setItem("current_categories", JSON.stringify([]));
    // props.onSetCategory();
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

const CategoryMapping = (props) => {
  const handlePageClick = (query, page) => {
    props.onPageChanged(query, page);
  };

  const [searchFilter, setSearchFilter] = useState("");
  const [isInitialSearch, setIsInitialSearch] = useState(true);

  const handleUpdateClick = (query = {}, bulk = false) => {
    props.onUpdateProducts(query, bulk);
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
    if (searchFilter) query.vendor_name = new RegExp(searchFilter, "i");
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
    <div className="m-5 lg:w-full">
      <div className="flex flex-row items-center w-full mb-6">
        <h2 className="text-2xl leading-tight">
          {props.vendor} Category Mapping ({props.total})
        </h2>
      </div>
      <div className="flex flex-row items-stretch w-full mb-6">
        <input
          id="search"
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
                Vendor category
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              >
                DMG category
              </th>
            </tr>
          </thead>
          <tbody>
            {props.categories &&
              props.categories.map((m, i) => {
                if (m) {
                  return (
                    <tr key={i} className="flex flex-col lg:table-row">
                      <td className="px-5 py-1 lg:py-5 text-sm bg-white lg:border-b border-gray-200 border-r">
                        <p className="text-xl font-bold lg:font-normal lg:text-sm lg:text-gray-900 whitespace-no-wrap">
                          <a
                            className="underline hover:no-underline"
                            href={m.vendor_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {m.vendor_name}
                          </a>
                        </p>
                      </td>
                      <td className="px-5 py-1 lg:py-5 text-sm bg-white lg:border-b border-gray-200">
                        <DMGCategoriesSearch
                          onSearchDMGCategories={props.onSearchDMGCategories}
                          categories={props.dmg_categories}
                          current_categories={props.dmg_current_categories}
                        />
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

export default CategoryMapping;
