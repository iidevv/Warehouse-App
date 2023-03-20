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
            <div className="container h-screen pt-2 pb-24 overflow-y-auto">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
