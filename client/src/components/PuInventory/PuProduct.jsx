import defaultImg from "../../assets/default-image.png";

const PuProduct = (props) => {
  const generateColorById = (id) => {
    const hashCode = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return hash;
    };

    const intToRGB = (i) => {
      const c = (i & 0x00ffffff).toString(16).toUpperCase();
      return "00000".substring(0, 6 - c.length) + c;
    };

    return `#${intToRGB(hashCode(id.toString()))}`;
  };
  const idColor = props.data.product && props.data.product.id ? generateColorById(props.data.product.id) : '';
  let stock;
  if (props.data.inventory && props.data.inventory.locales) {
    stock = props.data.inventory.locales.reduce(
      (total, local) => total + local.quantity,
      0
    );
  }
  let image = props.data.primaryMedia ? props.data.primaryMedia.absoluteUrl : defaultImg;
  return (
    <tr style={{ borderLeft: `15px solid ${idColor}` }}>
      <td className="px-2 lg:px-5 py-5 hidden lg:table-cell text-sm bg-white border-b border-gray-200">
        {props.data.product && props.data.product.id}
      </td>
      <td className="px-2 lg:px-5 py-5 text-sm bg-white border-b border-gray-200">
        <img
          className="w-32 h-24 object-contain"
          src={image}
          alt="img"
        />
      </td>
      <td className="px-2 lg:px-5 py-5 text-sm bg-white border-b border-gray-200">
        {props.data && props.data.partNumber}
      </td>
      <td className="px-2 lg:px-5 py-5 text-sm bg-white border-b border-gray-200">
        {props.data.product && props.data.product.name}
      </td>
      <td className="px-2 lg:px-5 py-5 text-sm bg-white border-b border-gray-200">
        {stock}
      </td>
      <td className="px-2 lg:px-5 py-5 text-sm bg-white border-b border-gray-200">
        ${props.data.prices && props.data.prices.retail}
      </td>
    </tr>
  );
};

export default PuProduct;
