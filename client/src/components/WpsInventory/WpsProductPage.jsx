import defaultImg from "../../assets/default-image.png";
import CategoriesSearch from "./../common/categoriesSearch/CategoriesSearch";

const WpsProductPage = (props) => {
  const productImg =
    props.product.images && props.product.images.length
      ? props.product.images[0].image_url
      : defaultImg;
  const handleSeoContentChange = (event) => {
    // onSetSeoContent
    console.log(event.target.value);
  };
  return (
    <div className="container">
      <div className="md:flex items-start justify-center py-12 2xl:px-20 md:px-6 px-4">
        <div className="xl:w-2/6 lg:w-2/5 w-80 bg-white shadow-lg">
          <img
            className="p-4 w-full h-96 object-contain"
            alt="main img"
            src={productImg || defaultImg}
          />
        </div>
        <div className="xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0 mt-6 bg-white shadow-lg px-8 py-10">
          <div>
            <p>{props.product.brand_name}</p>
            <h1
              className="
							lg:text-2xl
							text-xl
							font-semibold
							lg:leading-6
							leading-7
							text-gray-800
							mt-2
              mb-3
						"
            >
              {props.product.name}
            </h1>
          </div>
          <div className="mb-2 pb-2 border-b border-gray-200">
            <p className="font-bold text-lg">
              {props.product.price ? `$${props.product.price}` : ""}
            </p>
            <p>
              {props.product.weight ? `Weight: ${props.product.weight}` : ""}
            </p>
          </div>
          <div className="mb-8 pb-8 border-b border-gray-200">
            <p className="block text-sm font-medium text-gray-700">
              Description:
            </p>
            <textarea
              onChange={handleSeoContentChange}
              value={props.product.description}
              placeholder="No Description"
              className="flex-1 w-full h-56 px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            ></textarea>
          </div>
          <CategoriesSearch
            categories={props.categories}
            current_category={props.current_category}
            onSearchCategories={props.onSearchCategories}
            onSetCategory={props.onSetCategory}
          />
          <button
            onClick={() => {
              props.pushToCatalog(props.product);
            }}
            disabled={props.current_category.id ? false : true}
            className="
            disabled:opacity-50
						focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800
						text-base
						flex
						items-center
						justify-center
						leading-none
						text-white
						bg-blue-800
						w-full
						py-4
						hover:bg-gray-700
					"
          >
            Add to catalog
          </button>
        </div>
      </div>
      <div className="bg-white shadow-lg px-8 py-10"></div>
      <div>
        <h3 className=" lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 mt-2 ">
          Variants
        </h3>
        <div className="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
          <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
            <table className="min-w-full w-full leading-normal">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                  ></th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                  >
                    #
                  </th>

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
                </tr>
              </thead>
              <tbody>
                {props.product.variants &&
                  props.product.variants.map((item, i) => (
                    <tr key={i}>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <img
                          className="w-28 h-28 object-contain"
                          src={props.product.images[i].image_url || defaultImg}
                          alt="variant"
                        />
                      </td>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {i + 1}
                        </p>
                      </td>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {item.sku}
                        </p>
                      </td>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {item.option_values[0].label}
                        </p>
                      </td>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {item.inventory_level}
                        </p>
                      </td>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">
                          ${item.price}
                        </p>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WpsProductPage;
