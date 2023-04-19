import { combineReducers } from "redux";
import dmgInventoryReducer from "./dmg-products-reducer";
import wpsProductsReducer from "./wps-products-reducer";
import wpsProductReducer from "./wps-product-reducer";
import inventoryReducer from "./inventory-reducer";
import puProductsReducer from "./pu-products-reducer";

export default combineReducers({
  inventory: inventoryReducer,
  dmgInventory: dmgInventoryReducer,
  wpsInventory: wpsProductsReducer,
  puInventory: puProductsReducer,
  wpsProduct: wpsProductReducer,
});
