import { NavLink } from "react-router-dom";

const WpsProduct = (props) => {
  return (
    <tr>
      <td className="px-2 lg:px-5 py-5 hidden lg:table-cell text-sm bg-white border-b border-gray-200">
        <div className="flex items-center">
          <p className="text-gray-900 whitespace-no-wrap">{props.id}</p>
        </div>
      </td>
      <td className="px-2 lg:px-5 py-5 text-sm bg-white border-b border-gray-200">
        <NavLink
          to={"/wps-product/" + props.id}
          target="_blank"
          className="text-gray-900 whitespace-no-wrap underline hover:text-blue-600"
        >
          {props.name}
        </NavLink>
      </td>
      <td className="px-2 lg:px-5 py-5 text-sm bg-white border-b border-gray-200">
        {props.items && props.items.map((item, i) => {
          const total = item.inventory && item.inventory.data ? item.inventory.data.total : 0;
          const in_stock = total > 0 ? "flex items-start justify-center w-10 px-2 text-base  rounded-lg text-white bg-green-500" : "flex items-start justify-center w-10 px-2 text-base  rounded-lg text-white bg-red-500";
          return (
            <div key={i} className="flex items-center justify-between mb-1">
              <span className="block pl-1 mr-2">{item.name}</span>
              <span className={in_stock}>
                {total}
              </span>
            </div>
          );
        })}
      </td>
    </tr>
  );
};

export default WpsProduct;
