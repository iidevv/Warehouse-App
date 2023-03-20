import { combineReducers } from "redux";
import dmgInventoryReducer from "./dmg-products-reducer";
import wpsProductsReducer from "./wps-products-reducer";
import wpsProductReducer from "./wps-product-reducer";
import inventoryReducer from "./inventory-reducer";

export default combineReducers({
  inventory: inventoryReducer,
  dmgInventory: dmgInventoryReducer,
  wpsInventory: wpsProductsReducer,
  wpsProduct: wpsProductReducer,
});
