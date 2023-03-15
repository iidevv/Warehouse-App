import { combineReducers } from "redux";
import dmgInventoryReducer from "./dmg-inventory-reducer";
import wpsProductsReducer from './wps-inventory-reducer';
import wpsProductReducer from './wps-product-reducer';

export default combineReducers({
  dmgInventory: dmgInventoryReducer,
  wpsInventory: wpsProductsReducer,
  wpsProduct: wpsProductReducer,
});
