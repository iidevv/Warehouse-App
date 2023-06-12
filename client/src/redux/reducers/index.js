import { combineReducers } from "redux";
import dmgInventoryReducer from "./dmg-products-reducer";
import wpsProductsReducer from "./wps-products-reducer";
import wpsProductReducer from "./wps-product-reducer";
import puProductsReducer from "./pu-products-reducer";
import puProductReducer from "./pu-product-reducer";
import inventoryReducer from "./inventory-reducer";
import PuInventoryReducer from "./pu-inventory-reducer";
import PuDropshipReducer from "./pu-dropship-reducer";
import dashboardReducer from "./dashboard-reducer";
import WpsDropshipReducer from "./wps-dropship-reducer";

export default combineReducers({
  dashboard: dashboardReducer,
  inventory: inventoryReducer,
  wpsProduct: wpsProductReducer,
  wpsProducts: wpsProductsReducer,
  puProducts: puProductsReducer,
  puInventory: PuInventoryReducer,
  puProduct: puProductReducer,
  puDropship: PuDropshipReducer,
  wpsDropship: WpsDropshipReducer,
  dmgInventory: dmgInventoryReducer,
});
