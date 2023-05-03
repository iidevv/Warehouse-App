import defaultImg from "../../assets/default-image.png";
import chatgpt from "../../assets/chatgpt.svg";
import CategoriesSearch from "./../common/categoriesSearch/CategoriesSearch";
import PuProductPageVariants from "./PuProductPageVariants";

const PuProductPage = (props) => {
  const productImg =
    props.product.images &&
    props.product.images.length &&
    props.product.images[0]
      ? props.product.images[0].image_url
      : defaultImg;

  const handleContentChange = (event) => {
    props.onHandleContentChange(event.target.id, event.target.value);
  };
  const handleChatgptContent = () => {
    const productTitle = `Product ${props.product.brand_name} ${props.product.name} create`;
    const search_keywords = `${productTitle}  comma-separated list of 4 search keywords`;
    const meta_keywords = `${productTitle}  comma-separated list of 4 meta keywords use DMG`;
    const meta_description = `${productTitle} meta description use Discount Moto Gear`;
    const description = `${productTitle} description use Discount Moto Gear`;
    props.onGetChatgptContent("search_keywords", search_keywords);
    props.onGetChatgptContent("meta_keywords", meta_keywords);
    props.onGetChatgptContent("meta_description", meta_description);
    props.onGetChatgptContent("description", description);
  };

  const handleChangeName = (event) => {
    props.onHandleChangeName(event.target.value);
  };
  const handleRemoveAdditionalImage = (event) => {
    props.onHandleRemoveAdditionalImage(event.target.dataset.url);
  };
  const handleSetProductCreateData = (event) => {
    props.onSetProductCreateData("search", event.target.value);
  };
  return (
    <div className="container">
      {props.create_value && (
        <div className="bg-white shadow-lg mb-10 p-4 flex flex-col lg:flex-row lg:items-center">
          <p className="font-semibold mr-6 mb-2 lg:mb-0 lg:w-48">
            Combine By Name:
          </p>
          <form className="flex flex-col lg:flex-row items-start lg:items-center w-full">
            <input
              type="text"
              name="search"
              className="flex w-full px-4 py-2 mr-2 mb-2 lg:mb-0 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              onChange={handleSetProductCreateData}
              value={props.create_value}
            />
            <button
              className="flex-shrink-0 px-6 py-2 text-base font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200"
              type="submit"
            >
              Refresh
            </button>
          </form>
        </div>
      )}
      <div className="lg:flex items-start mb-10">
        <div className="lg:w-1/2">
          <div className="bg-white shadow-lg mb-4 ml-1">
            <img
              className="p-4 w-full object-contain max-h-96"
              alt="main img"
              src={productImg || defaultImg}
            />
          </div>
          <div className="flex flex-wrap">
            {props.product.images &&
              props.product.images.map((image, i) => {
                if (!image.is_additional || image.image_url == productImg)
                  return;
                return (
                  <div key={i} className="bg-white shadow-lg p-1 m-1 relative">
                    <button
                      onClick={handleRemoveAdditionalImage}
                      data-url={image.image_url}
                      className="absolute right-0 top-0 px-2 text-white bg-red-600"
                    >
                      &times;
                    </button>
                    <a
                      className="block mt-2"
                      href={image.image_url}
                      target="_blank"
                    >
                      <img
                        src={image.image_url}
                        className="w-24 h-20 object-contain"
                      />
                    </a>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="lg:w-1/2  lg:ml-6 lg:mt-0 mt-6 bg-white shadow-lg px-4 lg:px-8 py-10">
          <div>
            <p className="mb-2">{props.product.brand_name}</p>
            <p className="block text-sm font-medium text-gray-700 mb-2">
              Title:
            </p>
            <input
              className="flex w-full mb-4 px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              type="text"
              value={props.product.name}
              onChange={handleChangeName}
            />
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
            current_categories={props.current_categories}
            onSearchCategories={props.onSearchCategories}
            onSetCategory={props.onSetCategory}
          />
          <button
            onClick={() => {
              props.pushToCatalog(props.product);
            }}
            disabled={props.current_categories && props.current_categories[0] ? false : true}
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
            Add To Catalog
          </button>
        </div>
      </div>
      <div className="bg-white shadow-lg px-4 lg:px-8 py-10 mb-10">
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
          <textarea
            type="text"
            id="meta_description"
            value={props.content.meta_description}
            onChange={handleContentChange}
            className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          ></textarea>
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
        <button
          onClick={handleChatgptContent}
          className="flex items-center py-2 px-4 gpt-btn focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
        >
          <img className="w-6 h-6 mr-2" src={chatgpt} />
          <span>Chat GPT</span>
        </button>
      </div>
      <PuProductPageVariants
        variants={props.product.variants}
        onFindAndReplace={props.onFindAndReplace}
        onHandleRemoveVariants={props.onHandleRemoveVariants}
        onHandleRemoveVariant={props.onHandleRemoveVariant}
        onHandleRemoveVariantImage={props.onHandleRemoveVariantImage}
        onHandleChangeVariantName={props.onHandleChangeVariantName}
      />
    </div>
  );
};

export default PuProductPage;
