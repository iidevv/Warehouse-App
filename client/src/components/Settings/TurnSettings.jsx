import React from "react";

const TurnSettings = (props) => {
  const handleRebuildClick = () => {
    props.onRebuildTurnProducts();
  };

  const updateStatus = props.status.update_status ? `Rebuilding (${props.status.update_status})` : "Rebuilding...";

  return (
    <div className="relative w-full px-4 py-6 bg-white shadow-lg">
      <h2 className="text-xl mb-2">TURN14 Settings</h2>
      <button
        onClick={() => {
          handleRebuildClick();
        }}
        disabled={props.status.is_updating}
        className="py-2 mb-2 px-4 disabled:opacity-50 w-auto bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
      >
        {props.status.is_updating ? `${updateStatus}` : "Rebuild catalog"}
      </button>
      <p className="text-sm mb-2 text-gray-700">{props.status.is_updating ? "" : props.status.update_status}</p>
    </div>
  );
};

export default TurnSettings;
