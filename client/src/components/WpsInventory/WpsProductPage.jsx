import defaultImg from "../../assets/default-image.png";

const WpsProductPage = (props) => {
  let name, description, items;
  if (props.product) {
    name = props.product.data.name;
    description = props.product.data.description;
    items = props.items.data;
  }
  return (
    <div className="md:flex items-start justify-center py-12 2xl:px-20 md:px-6 px-4">
      <div className="xl:w-2/6 lg:w-2/5 w-80 md:block hidden">
        <div className="bg-white shadow-lg p-2">
          <img className="w-full" alt="img" src={defaultImg} />
        </div>
      </div>
      <div className="md:hidden">
        <img className="w-full" alt="img" src={defaultImg} />
        <div className="flex items-center justify-between mt-3 space-x-4 md:space-x-0">
          <img
            alt="img-tag-one"
            className="md:w-48 md:h-48 w-full"
            src={defaultImg}
          />
        </div>
      </div>
      <div className="xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0 mt-6 bg-white shadow-lg px-8 py-10">
        <div>
          <h1
            className="
							lg:text-2xl
							text-xl
							font-semibold
							lg:leading-6
							leading-7
							text-gray-800
							mt-2
						"
          >
            {name}
          </h1>
        </div>
        <div className="mb-8 pb-8 border-b border-gray-200">
          <p className="text-base lg:leading-tight leading-normal text-gray-600 mt-7">
            {description}
          </p>
        </div>
        <div className="mb-8">
          <p>Product Variations:</p>
          {items &&
            items.map((item) => (
              <div className="mb-8 pb-8 border-b border-gray-200">
                <p className="text-base leading-4 mt-7 text-gray-600">
                  <b>ID:</b> {item.id}
                </p>
                <p className="text-base leading-4 mt-2 text-gray-600">
                  <b>SKU:</b> {item.sku}
                </p>
                <p className="text-base leading-4 mt-2 text-gray-600">
                  <b>Name:</b> {item.name}
                </p>
                <p className="text-base leading-4 mt-2 text-gray-600">
                  <b>Price:</b> {item.list_price}
                </p>
              </div>
            ))}
        </div>
        <button
          className="
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
  );
};

export default WpsProductPage;
