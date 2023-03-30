import { NavLink } from "react-router-dom";

const WpsProduct = (props) => {
  return (
    <tr>
      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
        <div className="flex items-center">
          <p className="text-gray-900 whitespace-no-wrap">{props.id}</p>
        </div>
      </td>
      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
        <NavLink
          to={"/wps-product/" + props.id}
          target="_blank"
          className="text-gray-900 whitespace-no-wrap"
        >
          {props.name}
        </NavLink>
      </td>
      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
        <p className="text-gray-900 whitespace-no-wrap">{props.updated_at}</p>
      </td>
    </tr>
  );
};

export default WpsProduct;
