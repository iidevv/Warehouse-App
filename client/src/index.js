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
import UPInventory from './routes/UPInventory';

function AuthRoute({ component: Component, ...rest }) {
  const isAuthenticated = localStorage.getItem("userID") ? true : false;
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

const router = createBrowserRouter(
  [
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
          path: "/wps-catalog",
          element: <WPSInventory />,
        },
        {
          path: "/pu-catalog",
          element: <UPInventory />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
        {
          path: "/wps-product/:id",
          element: <WpsProductPageContainer />,
        },
      ],
    },
  ]
);

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
