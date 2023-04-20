import "./App.css";
import { Outlet } from "react-router-dom";
import SideBar from "./components/SideBar/index";

function App() {
  return (
    <div>
      <main className="relative h-screen overflow-hidden bg-gray-100 rounded-2xl">
        <div className="flex items-start justify-between">
          <SideBar />
          <div className="flex flex-col w-full pl-0 md:py-4 md:space-y-4">
            <div className="h-screen py-10 overflow-y-auto scroll-smooth scroll-container">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
