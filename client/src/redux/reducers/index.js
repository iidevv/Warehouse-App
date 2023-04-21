import { combineReducers } from "redux";
import dmgInventoryReducer from "./dmg-products-reducer";
import wpsProductsReducer from "./wps-products-reducer";
import wpsProductReducer from "./wps-product-reducer";
import inventoryReducer from "./inventory-reducer";
import puProductsReducer from "./pu-products-reducer";
import puProductReducer from "./pu-product-reducer";
import PuInventoryReducer from "./pu-inventory-reducer";

export default combineReducers({
  inventory: inventoryReducer,
  puInventory: PuInventoryReducer,
  dmgInventory: dmgInventoryReducer,
  wpsInventory: wpsProductsReducer,
  wpsProduct: wpsProductReducer,
  puInventory: puProductsReducer,
  puProduct: puProductReducer,
});
