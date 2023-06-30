import React from "react";

const Notifications = (props) => {
  return (
    <>
      {(props.info.message) && (
        <div
          className="fixed right-10 top-10 flex ml-auto border border-blue-500 items-center p-4 mb-4 text-gray-500 bg-white rounded-lg shadow z-10"
          role="alert"
        >
          <div className="ml-3 text-sm font-normal">
            {props.info.message}
          </div>
        </div>
      )}
    </>
  );
};

export default Notifications;