import defaultImg from "../../assets/default-image.png";

const WpsProductPage = (props) => {
  debugger
  let name,
    description,
    items,
    inventory,
    images,
    image = defaultImg;
  if (props.product) {
    name = props.product.data.name;
    description = props.product.data.description;
    items = props.items.data;
    images = props.images.data;
    inventory = props.inventory.data;
  }
// debugger
  return (
    <div className="">
      <div className="md:flex items-start justify-center py-12 2xl:px-20 md:px-6 px-4">
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
              {description ? description : "No description"}
            </p>
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
        <div className="max-w-4xl px-4">
          <div className="py-8">
            <div className="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
              <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                      >
                        ID
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
                        QTY
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
                    {items &&
                      items.map((item, i) => (
                        <tr key={i}>
                          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {item.id}
                            </p>
                          </td>
                          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                            <img
                              className="w-28 h-28 object-contain"
                              src={
                                images[i] &&
                                "https://" +
                                images[i].domain +
                                images[i].path +
                                images[i].filename
                              }
                              alt=""
                            />
                          </td>
                          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {item.sku}
                            </p>
                          </td>
                          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {item.name}
                            </p>
                          </td>
                          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {inventory[i] &&
                                inventory[i].total}
                            </p>
                          </td>
                          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                            <p className="text-gray-900 whitespace-no-wrap">
                              ${item.list_price}
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
      </div>
    </div>
  );
};

export default WpsProductPage;
