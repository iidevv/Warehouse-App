import defaultImg from "../../assets/default-image.png";
import chatgpt from "../../assets/chatgpt.svg";
import CategoriesSearch from "./../common/categoriesSearch/CategoriesSearch";

const WpsProductPage = (props) => {
  const productImg =
    props.product.images && props.product.images.length
      ? props.product.images[0].image_url
      : defaultImg;

  const handleContentChange = (event) => {
    props.onHandleContentChange(event.target.id, event.target.value);
  };
  return (
    <div className="container">
      <div className="md:flex items-start mb-10">
        <div className="bg-white shadow-lg md:w-1/2">
          <img
            className="p-4 w-full object-contain"
            alt="main img"
            src={productImg || defaultImg}
          />
        </div>
        <div className="md:w-1/2 lg:ml-8 md:ml-6 md:mt-0 mt-6 bg-white shadow-lg px-8 py-10">
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
          <div className="mb-6 pb-2 border-b border-gray-200">
            <p className="font-bold text-lg">
              {props.product.price ? `$${props.product.price}` : ""}
            </p>
            <p>
              {props.product.weight ? `Weight: ${props.product.weight}` : ""}
            </p>
          </div>
          <div className="mb-6">
            <p className="block text-sm font-medium text-gray-700 mb-2">
              Vendor description:
            </p>
            <div
              className="product-description"
              dangerouslySetInnerHTML={{
                __html: props.product.description,
              }}
            />
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
            font-semibold
						bg-blue-800
						w-full
						py-4
						hover:bg-gray-700
					"
          >
            Add To {props.current_category.name}
          </button>
        </div>
      </div>
      <div className="bg-white shadow-lg px-8 py-10 mb-10">
        <h3 className="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 mb-6">
          SEO & Description
        </h3>
        <label className="block mb-4 cursor-pointer">
          <p className="block text-sm font-medium text-gray-700 mb-2">
            Page title (Custom title for the product page. If not defined, the
            product name will be used as the meta title.)
          </p>
          <input
            type="text"
            id="page_title"
            value={props.content.page_title}
            onChange={handleContentChange}
            className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </label>
        <label className="block mb-4 cursor-pointer">
          <p className="block text-sm font-medium text-gray-700 mb-2">
            Search keywords (A comma-separated list of keywords that can be used
            to locate the product when searching the store.)
          </p>
          <input
            type="text"
            id="search_keywords"
            value={props.content.search_keywords}
            onChange={handleContentChange}
            className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </label>
        <label className="block mb-4 cursor-pointer">
          <p className="block text-sm font-medium text-gray-700 mb-2">
            Meta keywords
          </p>
          <input
            type="text"
            id="meta_keywords"
            value={props.content.meta_keywords}
            onChange={handleContentChange}
            className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </label>
        <label className="block mb-4 cursor-pointer">
          <p className="block text-sm font-medium text-gray-700 mb-2">
            Meta description
          </p>
          <input
            type="text"
            id="meta_description"
            value={props.content.meta_description}
            onChange={handleContentChange}
            className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </label>
        <label className="block mb-4 cursor-pointer">
          <p className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </p>
          <textarea
            id="description"
            onChange={handleContentChange}
            value={props.content.description}
            placeholder="No Description"
            className="flex-1 w-full h-56 px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          ></textarea>
        </label>
        <button disabled className="disabled:opacity-50 flex items-center py-2 px-4 gpt-btn focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg">
          <img className="w-6 h-6 mr-2" src={chatgpt}/><span>Chat GPT</span>
        </button>
      </div>
      <div className="bg-white shadow-lg px-8 py-10">
        <h3 className="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 mb-6">
          Variants
        </h3>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full overflow-hidden">
            <table className="min-w-full w-full leading-normal">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                  >
                    #
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
                </tr>
              </thead>
              <tbody>
                {props.product.variants &&
                  props.product.variants.map((item, i) => (
                    <tr key={i}>
                      <td className="px-5 py-5 text-sm bg-white border-t border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap font-bold">
                          {i + 1}.
                        </p>
                      </td>
                      <td className="w-28 px-5 py-5 text-sm bg-white border-t border-gray-200 relative">
                        <img
                          className="w-28 h-28 object-contain mb-1"
                          src={props.product.images[i].image_url || defaultImg}
                          alt="variant"
                        />
                        <button className="text-red-600 w-full text-center">Remove</button>
                      </td>
                      <td className="px-5 py-5 text-sm bg-white border-t border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {item.sku}
                        </p>
                      </td>
                      <td className="px-5 py-5 text-sm bg-white border-t border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {item.option_values[0].label}
                        </p>
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
