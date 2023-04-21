import React, { useState, useEffect } from "react";
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
  const idColor = props.id ? generateColorById(props.id) : "";
  let stock;
  if (props.stock) {
    stock = props.stock.reduce(
      (total, local) => total + local.quantity,
      0
    );
  }
  // Состояние для отслеживания загрузки изображения
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    // Сброс состояния загрузки изображения при изменении идентификатора продукта
    setIsImageLoaded(false);
  }, [props.id]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };
  let image =  props.image || defaultImg;
  return (
    <tr style={{ borderLeft: `15px solid ${idColor}` }}>
      <td className="px-2 lg:px-5 py-5 hidden lg:table-cell text-sm bg-white border-b border-gray-200">
        {props.id}
      </td>
      <td className="px-2 lg:px-5 py-5 text-sm bg-white border-b border-gray-200">
        <img
          className="w-32 h-24 object-contain"
          src={isImageLoaded ? image : defaultImg}
          alt="img"
          onLoad={handleImageLoad}
        />
      </td>
      <td className="px-2 lg:px-5 py-5 text-sm bg-white border-b border-gray-200">
        {props.sku}
      </td>
      <td className="px-2 lg:px-5 py-5 text-sm bg-white border-b border-gray-200">
        {props.name}
      </td>
      <td className="px-2 lg:px-5 py-5 text-sm bg-white border-b border-gray-200">
        {stock}
      </td>
      <td className="px-2 lg:px-5 py-5 text-sm bg-white border-b border-gray-200">
        ${props.price}
      </td>
    </tr>
  );
};

export default PuProduct;
