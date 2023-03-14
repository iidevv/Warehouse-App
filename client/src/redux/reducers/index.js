import { combineReducers } from "redux";
import dmgInventoryReducer from "./dmg-inventory-reducer";
import wpsProductReducer from './wps-inventory-reducer';

export default combineReducers({
  dmgInventory: dmgInventoryReducer,
  wpsInventory: wpsProductReducer 
});
