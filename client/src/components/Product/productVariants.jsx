import React, { useState, useEffect } from "react";
import defaultImg from "../../assets/default-image.png";
import chatgpt from "../../assets/chatgpt.svg";

const ProductVariants = (props) => {
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [lastCheckedIndex, setLastCheckedIndex] = useState(null);
  const [checkboxStates, setCheckboxStates] = useState({});

  useEffect(() => {
    if (props.variants) {
      const initialCheckboxStates = props.variants.reduce((acc, variant) => {
        acc[variant.id] = false;
        return acc;
      }, {});
      setCheckboxStates(initialCheckboxStates);
    }
  }, [props.variants]);

  const handleRemoveVariant = (event) => {
    props.onHandleRemoveVariant(
      +event.target.id,
      +event.target.dataset.variant_id
    );
  };

  const handleRemoveVariantImage = (event) => {
    props.onHandleRemoveVariantImage(
      +event.target.id,
      +event.target.dataset.variant_id
    );
  };
  const handleChangeVariantName = (event) => {
    props.onHandleChangeVariantName(
      +event.target.dataset.id,
      event.target.value
    );
  };
  const handleCheckboxChange = (event, index) => {
    const variantId = event.target.dataset.variant_id;
    const isChecked = event.target.checked;

    // Update the checkbox state
    setCheckboxStates({
      ...checkboxStates,
      [variantId]: isChecked,
    });

    if (isChecked) {
      if (lastCheckedIndex !== null) {
        const startIndex = Math.min(index, lastCheckedIndex);
        const endIndex = Math.max(index, lastCheckedIndex);

        for (let i = startIndex; i <= endIndex; i++) {
          const id = props.variants[i].id;
          if (!selectedVariants.some((item) => item.variantId === id)) {
            setSelectedVariants((prevSelectedVariants) => [
              ...prevSelectedVariants,
              { dataId: i, variantId: id },
            ]);
            setCheckboxStates((prevState) => ({
              ...prevState,
              [id]: true,
            }));
          }
        }
      } else {
        setSelectedVariants([
          ...selectedVariants,
          { dataId: index, variantId: variantId },
        ]);
      }

      setLastCheckedIndex(index);
    } else {
      setSelectedVariants(
        selectedVariants.filter((item) => item.variantId !== variantId)
      );

      if (index === lastCheckedIndex) {
        setLastCheckedIndex(null);
      }
    }
  };

  const handleRemoveSelectedVariants = () => {
    const idsToRemove = selectedVariants.map(({ dataId }) => dataId);
    const variantIdsToRemove = selectedVariants.map(
      ({ variantId }) => variantId
    );

    // Remove all selected variants at once
    props.onHandleRemoveVariants(idsToRemove, variantIdsToRemove);

    // Reset the selected variants state
    setSelectedVariants([]);
    setLastCheckedIndex(null);
  };

  const handleFindAndReplace = (event) => {
    event.preventDefault();
    const formElements = event.target.elements;
    const find = formElements.find.value;
    const replace = formElements.replace.value;
    props.onFindAndReplace(find, replace);
  };

  const handleNormalizeNames = (event) => {
    event.preventDefault();
    props.onHandleNormalizeNames(props.variants);
  };

  return (
    <div className="bg-white shadow-lg lg:px-8 py-10">
      <div className="px-4 lg:px-0">
        <h3 className="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 mb-6">
          Variants
        </h3>
        <span className="block text-sm font-medium text-gray-700 mb-2">
          Find and Replace variant names:
        </span>
        <form
          onSubmit={handleFindAndReplace}
          className="flex flex-col lg:flex-row mb-4"
        >
          <input
            className="mb-2 lg:mb-0 lg:mr-2 px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            type="text"
            id="find"
            placeholder="Find"
          />
          <input
            className="mb-2 lg:mb-0 lg:mr-2 px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            type="text"
            id="replace"
            placeholder="Replace with"
          />
          <button
            type="submit"
            className="px-4 py-2 text-base text-white bg-blue-600 border border-blue-600 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            Apply Filter
          </button>
        </form>
        <div className="overflow-hidden block pb-4">
          <div className="bg-white shadow-lg pb-4 flex gap-2">
            <button
              onClick={handleNormalizeNames}
              className="flex items-center py-2 px-4 gpt-btn focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
            >
              <img className="w-6 h-6 mr-2" src={chatgpt} />
              <span>Normalize names</span>
            </button>
            <button
              onClick={handleRemoveSelectedVariants}
              className="m-1 py-2 px-4 z-20 bg-red-600 hover:bg-red-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
            >
              Remove Selected
            </button>
          </div>
        </div>
      </div>
      <div className="inline-block w-11/12 lg:w-full h-screen-80 scrollbar overflow-y-auto relative">
        <table className="min-w-full w-full leading-normal">
          <thead className="hidden lg:table-header-group">
            <tr>
              <th
                scope="col"
                className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              ></th>
              <th
                scope="col"
                className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              ></th>
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
                Name
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              >
                Stock
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {props.variants &&
              props.variants.map((item, i) => {
                let checked = checkboxStates[item.id] || false;
                let itemClass = checked
                  ? "relative flex flex-col pt-8 bg-red-100 lg:pt-0 lg:table-row border-b-8 lg:border-b border-gray-100"
                  : "relative flex flex-col pt-8 lg:pt-0 lg:table-row border-b-8 lg:border-b border-gray-100";
                return (
                  <tr className={itemClass} key={i}>
                    <td className="px-2 py-1 lg:px-5 lg:py-5 text-sm  lg:border-t border-gray-200">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-2 z-10 lg:static w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        data-variant_id={item.id}
                        checked={checked}
                        onChange={(event) => handleCheckboxChange(event, i)}
                      />
                    </td>
                    <td className="lg:w-28 px-2 py-1 lg:px-5 lg:py-5 text-sm  lg:border-t border-gray-200 relative">
                      <img
                        className="w-full h-20 lg:w-28 lg:h-28 object-contain mb-1"
                        src={item.image_url || defaultImg}
                        alt="variant"
                      />
                      {item.image_url && (
                        <button
                          onClick={handleRemoveVariantImage}
                          id={i}
                          data-variant_id={item.id}
                          className="text-red-600 w-full text-center lg:border-t"
                        >
                          Remove Image
                        </button>
                      )}
                    </td>
                    <td className="px-2 py-1 lg:px-5 lg:py-5 text-sm  lg:border-t border-gray-200">
                      <p className="text-gray-900 whitespace-no-wrap">
                        <span className="lg:hidden">SKU: </span>
                        {item.sku}
                      </p>
                    </td>
                    <td className="px-2 py-1 lg:px-5 lg:py-5 text-sm  lg:border-t border-gray-200">
                      {item.option_values[0]
                        ? `${item.option_values[0].option_display_name}:`
                        : ""}
                      <input
                        className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400  border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:lg:border-transparent"
                        type="text"
                        data-id={i}
                        value={item.option_values[0].label}
                        onChange={handleChangeVariantName}
                      />
                      <br />
                      {item.option_values[1]
                        ? `${item.option_values[1].option_display_name}: ${item.option_values[1].label}`
                        : ""}
                    </td>
                    <td className="px-2 py-1 lg:px-5 lg:py-5 text-sm  lg:border-t border-gray-200">
                      <p className="text-gray-900 whitespace-no-wrap">
                        <span className="lg:hidden">STOCK: </span>
                        <b>{item.inventory_level}</b>
                      </p>
                    </td>
                    <td className="px-2 py-1 lg:px-5 lg:py-5 text-sm  lg:border-t border-gray-200">
                      <p className="text-gray-900 whitespace-no-wrap">
                        ${item.price}
                      </p>
                    </td>
                    <td className="px-2 py-1 lg:px-5 lg:py-5 text-sm  lg:border-t border-gray-200">
                      <button
                        onClick={handleRemoveVariant}
                        id={i}
                        data-variant_id={item.id}
                        className="absolute right-4 rounded-lg px-1 top-2 z-10 text-white bg-red-600 lg:bg-transparent lg:static lg:text-red-600 text-left"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="overflow-hidden block pt-4">
        <div className="shadow-t-lg block pt-4"></div>
      </div>
    </div>
  );
};

export default ProductVariants;
