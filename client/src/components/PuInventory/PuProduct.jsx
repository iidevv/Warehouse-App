import React, { useState, useEffect } from "react";
import defaultImg from "../../assets/default-image.png";
import { NavLink } from 'react-router-dom';

const PuProduct = (props) => {
  let stock;
  if (props.stock) {
    stock = props.stock.reduce((total, local) => total + local.quantity, 0);
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
  let image = props.image || defaultImg;
  return (
    <tr>
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
        <NavLink
          to={"/pu-product/" + props.sku}
          target="_blank"
          className="text-gray-900 whitespace-no-wrap underline hover:text-blue-600"
        >
          {props.name}
        </NavLink>
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
