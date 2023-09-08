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
import { Auth } from "./routes/Auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PuDropship from "./routes/PuDropship";
import WpsDropship from "./routes/WpsDropship";
import Cookies from "js-cookie";
import Orders from "./routes/Orders";
import ProductContainer from "./components/Product/productContainer";
import CatalogContainer from "./components/Catalog/CatalogContainer";
import DashboardContainer from "./components/Dashboard/DashboardContainer";
import Catalogs from "./routes/Catalogs";
import CategoryMappingContainer from "./components/CategoryMapping/CategoryMappingContainer";

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
        path: "/catalog",
        element: <CatalogContainer />,
      },
      {
        path: "/catalogs",
        element: <Catalogs />,
      },
      {
        path: "/category-mapping",
        element: <CategoryMappingContainer />,
      },
      {
        path: "/product/:id",
        element: <ProductContainer />,
      },
      {
        path: "/products",
        element: <DashboardContainer />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/dropship-pu",
        element: <PuDropship />,
      },
      {
        path: "/dropship-wps",
        element: <WpsDropship />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  // </React.StrictMode>
);

reportWebVitals();
