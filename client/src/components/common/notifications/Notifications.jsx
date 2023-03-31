import React from "react";

const Notifications = (props) => {
  const is_product = props.info.message ? true : false;
  return (
    <>
      {(is_product || props.info.code) && (
        <div
          className="fixed right-10 top-10 flex ml-auto border border-blue-500 items-center p-4 mb-4 text-gray-500 bg-white rounded-lg shadow z-10"
          role="alert"
        >
          {is_product ? (
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
              </svg>
              <span className="sr-only">Check icon</span>
            </div>
          ) : (
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg">
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
              </svg>
              <span className="sr-only">Error icon</span>
            </div>
          )}
          <div className="ml-3 text-sm font-normal">
            {is_product ? `Product ${props.info.message.data.name} Added Successfully [${props.info.result}]` : props.info.responseBody}
          </div>
        </div>
      )}
    </>
  );
};

export default Notifications;
