import "./App.css";
import { Outlet } from "react-router-dom";
import SideBar from "./components/SideBar/index";

function App() {
  return (
    <div>
      <main className="relative h-screen overflow-hidden bg-gray-100 rounded-2xl">
        <div className="flex items-start justify-between">
          <SideBar />
          <div className="flex flex-col w-full pl-0 md:p-4 md:space-y-4">
            <div className="h-screen pt-2 pb-24 pl-2 pr-2 overflow-auto md:pt-0 md:pr-0 md:pl-0">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
