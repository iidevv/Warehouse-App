import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import ErrorPage from "./error-page";
import reportWebVitals from "./reportWebVitals";
import Settings from "./routes/Settings";
import Index from "./routes/Index";
import store from "./redux/store";
import { Provider } from "react-redux";
import WPSInventory from "./routes/WPSInventory";
import WpsProductPageContainer from "./components/WpsInventory/WpsProductPageContainer";
import { Auth } from "./routes/Auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PUInventory from "./routes/PUInventory";
import PuDropship from "./routes/PuDropship";
import PuProductPageContainer from "./components/PuInventory/PuProductPageContainer";
import ProductsPU from "./routes/ProductsPU";
import ProductsWPS from "./routes/ProductsWPS";
import WpsDropship from "./routes/WpsDropship";
import Cookies from "js-cookie";
import Orders from "./routes/Orders";
import HHInventory from "./routes/HHInventory";
import HhProductPageContainer from "./components/HhInventory/HhProductPageContainer";
import ProductsHH from "./routes/ProductsHH";

function AuthRoute({ component: Component, ...rest }) {
  const isAuthenticated = Cookies.get("userID") ? true : false;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <Auth />;
  }

  return <Component {...rest} />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthRoute component={App} />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        index: true,
        element: <Index />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/wps-catalog",
        element: <WPSInventory />,
      },
      {
        path: "/pu-catalog",
        element: <PUInventory />,
      },
      {
        path: "/hh-catalog",
        element: <HHInventory />,
      },
      {
        path: "/dropship-pu",
        element: <PuDropship />,
      },
      {
        path: "/dropship-wps",
        element: <WpsDropship />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/products-pu",
        element: <ProductsPU />,
      },
      {
        path: "/products-wps",
        element: <ProductsWPS />,
      },
      {
        path: "/pu-product/:id",
        element: <PuProductPageContainer />,
      },
      {
        path: "/wps-product/:id",
        element: <WpsProductPageContainer />,
      },
      {
        path: "/hh-product/:id",
        element: <HhProductPageContainer />,
      },
      {
        path: "/products-hh",
        element: <ProductsHH />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
