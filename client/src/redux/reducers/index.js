import { combineReducers } from "redux";
import wpsProductsReducer from "./wps-products-reducer";
import wpsProductReducer from "./wps-product-reducer";
import puProductsReducer from "./pu-products-reducer";
import puProductReducer from "./pu-product-reducer";
import inventoryReducer from "./inventory-reducer";
import PuDropshipReducer from "./pu-dropship-reducer";
import dashboardReducer from "./dashboard-reducer";
import WpsDropshipReducer from "./wps-dropship-reducer";
import ordersReducer from "./orders-reducer";
import hhProductsReducer from "./hh-products-reducer";
import hhProductReducer from "./hh-product-reducer";

export default combineReducers({
  dashboard: dashboardReducer,
  inventory: inventoryReducer,
  orders: ordersReducer,
  wpsProduct: wpsProductReducer,
  wpsProducts: wpsProductsReducer,
  puProducts: puProductsReducer,
  puProduct: puProductReducer,
  hhProducts: hhProductsReducer,
  hhProduct: hhProductReducer,
  puDropship: PuDropshipReducer,
  wpsDropship: WpsDropshipReducer,
});
