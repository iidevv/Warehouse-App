import { combineReducers } from "redux";
import dmgInventoryReducer from "./dmg-inventory-reducer";

export default combineReducers({
  dmgInventory: dmgInventoryReducer,
});
