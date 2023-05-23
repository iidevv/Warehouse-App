const PuDropshipOrder = (props) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 mb-2 font-medium text-gray-900">
          Order #<b>{props.order.purchase_order_number}</b>
        </h3>
        <span className="px-2 py-1 uppercase  text-sm rounded text-white font-black  bg-purple-600">
          {props.order.status_message}
        </span>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-bold text-gray-500">
              Reference Number
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {props.order.reference_number}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-bold text-gray-500">Order Total</dt>
            <dd className="mt-1 text-sm text-gray-900">
              ${props.order.order_total}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-bold text-gray-500">Date</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {props.order.order_date}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-bold text-gray-500">Fee</dt>
            <dd className="mt-1 text-sm text-gray-900">
              ${props.order.drop_ship_fee}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-bold text-gray-500">Items: </dt>
            <dd className="mt-1 text-sm text-gray-900">
              <table className="min-w-full leading-normal border-t border-gray-200">
                <thead className="hidden lg:table-header-group">
                  <tr>
                    <th
                      scope="col"
                      className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                    >
                      sku
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                    >
                      ordered qty
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                    >
                      shipped qty
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                    >
                      price
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                    >
                      shipped date
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                    >
                      shipped via
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                    >
                      tracking numbers
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {props.order.line_items &&
                    props.order.line_items.map((item, i) => {
                      const link = `/pu-product/${item.part_number}`;
                      const trackingLink =
                        item.shipped[0].shipped_via == "ups_ground"
                          ? `https://www.ups.com/track?track=yes&trackNums=${item.shipped[0].tracking_numbers}`
                          : "#";
                      return (
                        <tr key={i} className="flex flex-col lg:table-row">
                          <td className="px-2 lg:px-5 py-1 lg:py-5 text-sm bg-white lg:border-b border-gray-200">
                            <span className="font-bold text-xs lg:hidden pr-2">
                              SKU:
                            </span>
                            <a
                              className="text-blue-600 underline hover:no-underline"
                              target="_blank"
                              href={link}
                            >
                              {item.part_number}
                            </a>
                          </td>
                          <td className="px-2 lg:px-5 py-1 lg:py-5 text-sm bg-white lg:border-b border-gray-200">
                            <span className="font-bold text-xs lg:hidden pr-2">
                              ORDERED QTY:
                            </span>
                            {item.ordered.quantity}
                          </td>
                          <td className="px-2 lg:px-5 py-1 lg:py-5 text-sm bg-white lg:border-b border-gray-200">
                            <span className="font-bold text-xs lg:hidden pr-2">
                              SHIPPED QTY: 
                            </span>
                            {item.shipped[0].quantity}
                          </td>
                          <td className="px-2 lg:px-5 py-1 lg:py-5 text-sm bg-white lg:border-b border-gray-200">
                            <span className="font-bold text-xs lg:hidden pr-2">
                              PRICE: 
                            </span>
                            ${item.price}
                          </td>
                          <td className="px-2 lg:px-5 py-1 lg:py-5 text-sm bg-white lg:border-b border-gray-200">
                            <span className="font-bold text-xs lg:hidden pr-2">
                              SHIPPED DATE: 
                            </span>
                            {item.shipped[0].ship_date}
                          </td>
                          <td className="px-2 lg:px-5 py-1 lg:py-5 text-sm bg-white lg:border-b border-gray-200">
                            <span className="font-bold text-xs lg:hidden pr-2">
                              SHIPPED VIA: 
                            </span>
                            {item.shipped[0].shipped_via}
                          </td>
                          <td className="px-2 lg:px-5 py-1 lg:py-5 text-sm bg-white border-b border-gray-200">
                            <span className="font-bold text-xs lg:hidden pr-2">
                              TRACKING NUMBERS: 
                            </span>
                            <a
                              className="text-blue-600 no-underline hover:underline"
                              target="_blank"
                              href={trackingLink}
                            >
                              {item.shipped[0].tracking_numbers}
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default PuDropshipOrder;
