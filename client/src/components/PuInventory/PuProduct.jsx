const PuProduct = (props) => {
  return (
    <tr>
      <td className="px-2 lg:px-5 py-5 hidden lg:table-cell text-sm bg-white border-b border-gray-200">
        <div className="flex items-center">
          <p>SKU: {props.data && props.data.partNumber}</p>
          {/* <p className="text-gray-900 whitespace-no-wrap">{props.data.product && props.data.product.id}</p> */}
        </div>
      </td>
      <td className="px-2 lg:px-5 py-5 text-sm bg-white border-b border-gray-200">
        {props.data.product && props.data.product.name}
      </td>
    </tr>
  );
};

export default PuProduct;
