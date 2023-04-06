import React from "react";
import Cookies from "js-cookie";

const LogoutButton = () => {
  const handleLogout = () => {
    Cookies.remove("access_token");
    localStorage.removeItem("userID");
    window.location.reload();
  };

  return (
    <button
      onClick={handleLogout}
      className="py-1 px-4  bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
