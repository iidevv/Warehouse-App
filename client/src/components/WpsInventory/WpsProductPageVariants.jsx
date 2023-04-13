import React, { useState, useEffect } from "react";
import defaultImg from "../../assets/default-image.png";

const WpsProductPageVariants = (props) => {
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
    const variantId = parseInt(event.target.dataset.variant_id);
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
          const id = parseInt(props.variants[i].id);
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

  return (
    <div className="bg-white shadow-lg px-8 py-10">
      <h3 className="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 mb-6">
        Variants
      </h3>
      <span class="block text-sm font-medium text-gray-700 mb-2">Find and Replace variant names:</span>
      <form onSubmit={handleFindAndReplace} className="flex mb-4">
        <input
          className="mr-2 px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          type="text"
          id="find"
          placeholder="Find"
        />
        <input
          className="mr-2 px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full overflow-hidden">
          <table className="min-w-full w-full leading-normal">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                >
                  <button
                    onClick={handleRemoveSelectedVariants}
                    className="py-2 px-4  bg-red-600 hover:bg-red-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                  >
                    Remove Selected
                  </button>
                </th>
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
                props.variants.map((item, i) => (
                  <tr key={i}>
                    <td className="px-5 py-5 text-sm bg-white border-t border-gray-200">
                      <input
                        type="checkbox"
                        className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        data-variant_id={item.id}
                        checked={checkboxStates[item.id] || false}
                        onChange={(event) => handleCheckboxChange(event, i)}
                      />
                    </td>
                    <td className="w-28 px-5 py-5 text-sm bg-white border-t border-gray-200 relative">
                      <img
                        className="w-28 h-28 object-contain mb-1"
                        src={item.image_url || defaultImg}
                        alt="variant"
                      />
                      {item.image_url && (
                        <button
                          onClick={handleRemoveVariantImage}
                          id={i}
                          data-variant_id={item.id}
                          className="text-red-600 w-full text-center border-t"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-5 text-sm bg-white border-t border-gray-200">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {item.sku}
                      </p>
                    </td>
                    <td className="px-5 py-5 text-sm bg-white border-t border-gray-200">
                      <input
                        className="flex-1 px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        type="text"
                        data-id={i}
                        value={item.option_values[0].label}
                        onChange={handleChangeVariantName}
                      />
                    </td>
                    <td className="px-5 py-5 text-sm bg-white border-t border-gray-200">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {item.inventory_level}
                      </p>
                    </td>
                    <td className="px-5 py-5 text-sm bg-white border-t border-gray-200">
                      <p className="text-gray-900 whitespace-no-wrap">
                        ${item.price}
                      </p>
                    </td>
                    <td className="px-5 py-5 text-sm bg-white border-t border-gray-200">
                      <button
                        onClick={handleRemoveVariant}
                        id={i}
                        data-variant_id={item.id}
                        className="text-red-600 w-full text-left"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WpsProductPageVariants;
