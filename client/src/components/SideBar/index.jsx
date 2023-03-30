import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.svg";
const SideBar = (props) => {
  const useHttps = process.env.REACT_APP_USE_HTTPS === "true";
  return (
    <div className="relative hidden h-screen my-4 ml-4 shadow-lg lg:block w-80">
      <div className="h-full bg-white rounded-2xl">
        <div className="flex items-center justify-center pt-6">
          {useHttps ? <img src={logo} alt="DMG" /> : ""}
        </div>
        <nav className="mt-6">
          <ul>
            <li>
              <NavLink
                to="/"
                className={({ isPending, isActive }) =>
                  isActive ? "active-menu-link" : "menu-link"
                }
              >
                <span className="mx-4 text-sm font-normal">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wps-inventory"
                className={({ isPending, isActive }) =>
                  isActive ? "active-menu-link" : "menu-link"
                }
              >
                <span className="mx-4 text-sm font-normal">WPS</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                className={({ isPending, isActive }) =>
                  isActive ? "active-menu-link" : "menu-link"
                }
              >
                <span className="mx-4 text-sm font-normal">Settings</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SideBar;
