import { useState } from "react";

const DMGCategoriesSearch = (props) => {
  const handleInputChange = (event) => {
    props.onSearchDMGCategories(event.target.value);
  };
  const handleButtonClick = (event) => {
    const data = {
      vendor_id: props.vendor_id,
      id: event.target.id,
      name: event.target.dataset.name,
      url: event.target.dataset.url,
    };
    props.onUpdateCategory(data);
  };

  return (
    <>
      <div className="flex mb-3 relative flex-col lg:flex-row">
        <div
          id="dropdown-search"
          className="z-10 absolute top-full bg-white divide-y divide-gray-100 shadow w-full lg:w-96"
        >
          <ul
            className="text-sm text-gray-700 max-h-96 overflow-y-auto"
            aria-labelledby="dropdown-button-2"
          >
            {props.dmg_categories.map((m, i) => {
              return (
                <li className="flex items-center border-b" key={i}>
                  <a
                    className="text-blue-600 underline hover:no-underline px-4 py-2 block w-full"
                    target="_blank"
                    href={`https://discountmotogear.com${m.custom_url?.url}`}
                  >
                    {m.name}
                  </a>
                  <button
                    type="button"
                    className="text-left px-4 py-2 text-sm text-white bg-blue-800 hover:bg-gray-700"
                    id={m.id}
                    data-name={m.name}
                    data-url={`https://discountmotogear.com${m.custom_url?.url}`}
                    onClick={handleButtonClick}
                  >
                    Add
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="relative w-full mt-0">
          <input
            type="text"
            id="category-search"
            className="block p-2.5 rounded-none w-full z-20 text-black border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Categories search"
            onChange={handleInputChange}
          />
        </div>
      </div>
    </>
  );
};

const Category = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <tr className="table-row">
      <td className="w-1/2 px-5 py-5 text-sm bg-white border-b border-gray-200 border-r">
        <p className="font-normal text-sm text-gray-900 whitespace-no-wrap">
          <a
            className="underline hover:no-underline"
            href={props.category?.vendor_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {props.category?.vendor_name}
          </a>
        </p>
      </td>
      <td className="w-1/2 px-5 py-5 text-sm bg-white border-b border-gray-200">
        <div className="flex mb-2">
          <p className="mr-1 pr-1 border-r">
            {props.category?.name ? props.category?.name : "None"}
          </p>
          <button
            className="text-blue-600 underline"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "Close" : "Edit"}
          </button>
        </div>
        {isOpen && (
          <DMGCategoriesSearch
            onUpdateCategory={props.onUpdateCategory}
            vendor_id={props.category?.vendor_id}
            dmg_categories={props.dmg_categories}
            onSearchDMGCategories={props.onSearchDMGCategories}
          />
        )}
      </td>
    </tr>
  );
};

export default Category;
