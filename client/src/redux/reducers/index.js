import { combineReducers } from "redux";
import inventoryReducer from "./inventory-reducer";
import PuDropshipReducer from "./pu-dropship-reducer";
import dashboardReducer from "./dashboard-reducer";
import WpsDropshipReducer from "./wps-dropship-reducer";
import ordersReducer from "./orders-reducer";
import catalogReducer from "./catalog-reducer";
import productReducer from "./product-reducer";
import categoryMappingReducer from "./category-mapping-reducer";

export default combineReducers({
  dashboard: dashboardReducer,
  catalog: catalogReducer,
  product: productReducer,
  inventory: inventoryReducer,
  categoryMapping: categoryMappingReducer,
  orders: ordersReducer,
  puDropship: PuDropshipReducer,
  wpsDropship: WpsDropshipReducer,
});
