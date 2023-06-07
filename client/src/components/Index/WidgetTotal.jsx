import React from "react";

const WidgetTotal = (props) => {
  return (
    <>
      <div className="relative w-full px-4 py-6 bg-white shadow-lg">
        <a className="block text-xl font-medium mb-6" href={props.link}>
          Total Products - <b>{props.data.total}</b>
        </a>
        <p>
          <b>Today:</b>
        </p>
        <p>
          No Changes: <b>{props.data.noChangesTotal}</b>
        </p>
        <p>
          Updated: <b>{props.data.updatedTotal}</b>
        </p>
        <p>
          Created: <b>{props.data.createdTotal}</b>
        </p>
        <p>
          Error: <b>{props.data.errorTotal}</b>
        </p>
      </div>
    </>
  );
};

export default WidgetTotal;
