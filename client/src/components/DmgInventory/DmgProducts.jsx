import React from "react";
import DmgProduct from "./DmgProduct";

const DmgProducts = (props) => {
    // debugger;
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <ul>
            {/* {props.products.map((m) => {
                return (
                <DmgProduct
                    id={m.id}
                    name={m.name}
                />
                );
            })} */}
        </ul>
      </div>
    </div>
  );
};

export default DmgProducts;