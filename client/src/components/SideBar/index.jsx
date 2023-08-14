import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.svg";
import LogoutButton from "../common/logoutButton/LogoutButton.jsx";
import { useState } from "react";
const SideBar = (props) => {
  const useHttps = process.env.REACT_APP_USE_HTTPS === "true";
  const [menuActive, setMenuActive] = useState(false);
  const handleSetMenuActive = () => {
    setMenuActive((prevState) => !prevState);
  };
  let menuClass = menuActive
    ? "fixed right-0 top-0 z-40 h-screen my-4 ml-4 shadow-lg w-80 lg:block lg:relative"
    : "fixed hidden right-0 top-0 z-40 h-screen my-4 ml-4 shadow-lg w-80 lg:block lg:relative";
  return (
    <>
      <button
        onClick={handleSetMenuActive}
        className="bg-white p-1.5 z-20 rounded-sm fixed right-2 shadow-md top-4 lg:hidden"
      >
        <svg
          width="36"
          height="28"
          viewBox="0 0 36 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 2H34"
            stroke="black"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-blue-600"
          />
          <path
            d="M2 14H34"
            stroke="black"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-blue-600"
          />
          <path
            d="M2 26H34"
            stroke="black"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-blue-600"
          />
        </svg>
      </button>
      <div className={menuClass}>
        <button
          onClick={handleSetMenuActive}
          className="bg-white p-1.5 rounded-sm absolute right-4 text-red-600 top-0 lg:hidden text-4xl"
        >
          &times;
        </button>
        <div className="flex flex-col h-full bg-white rounded-2xl">
          <div className="flex items-center justify-center pt-6">
            {useHttps ? <img src={logo} alt="DMG" /> : ""}
          </div>
          <nav className="mt-6">
            <ul>
              <li>
                <NavLink
                  to="/"
                  onClick={handleSetMenuActive}
                  className={({ isPending, isActive }) =>
                    isActive ? "active-menu-link" : "menu-link"
                  }
                >
                  <span className="mx-4 text-sm font-normal">Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/orders"
                  onClick={handleSetMenuActive}
                  className={({ isPending, isActive }) =>
                    isActive ? "active-menu-link" : "menu-link"
                  }
                >
                  <span className="mx-4 text-sm font-normal">Orders</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/catalogs"
                  onClick={handleSetMenuActive}
                  className={({ isPending, isActive }) =>
                    isActive ? "active-menu-link" : "menu-link"
                  }
                >
                  <span className="mx-4 text-sm font-normal">Catalogs</span>
                </NavLink>
              </li>
              <li className="has-submenu">
                <span className="menu-link mx-4 text-sm font-normal">
                  Dropshipping
                </span>
                <ul>
                  <li>
                    <NavLink
                      to="/dropship-pu"
                      onClick={handleSetMenuActive}
                      className={({ isPending, isActive }) =>
                        isActive ? "active-menu-link" : "menu-link"
                      }
                    >
                      <span className="mx-4 text-sm font-normal">
                        PU Dropship
                      </span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dropship-wps"
                      onClick={handleSetMenuActive}
                      className={({ isPending, isActive }) =>
                        isActive ? "active-menu-link" : "menu-link"
                      }
                    >
                      <span className="mx-4 text-sm font-normal">
                        WPS Dropship
                      </span>
                    </NavLink>
                  </li>
                </ul>
              </li>
              {/* <li>
                <NavLink
                  to="/settings"
                  onClick={handleSetMenuActive}
                  className={({ isPending, isActive }) =>
                    isActive ? "active-menu-link" : "menu-link"
                  }
                >
                  <span className="mx-4 text-sm font-normal">Settings</span>
                </NavLink>
              </li> */}
            </ul>
          </nav>
          <div className="mt-auto mb-24 lg:mb-12 py-2 px-6">
            <LogoutButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
