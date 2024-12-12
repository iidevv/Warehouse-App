import { settingsAPI } from "../../api/api";

const SET_TURN_STATUS = "SET_STATUS";

let initialState = {
  turn_status: {
    is_updating: false,
    update_status: "",
  },
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TURN_STATUS:
      return {
        ...state,
        turn_status: action.status,
      };

    default:
      return state;
  }
};

export const setTurnStatus = (status) => {
  return {
    type: SET_TURN_STATUS,
    status,
  };
};

export const getRebuildTurnStatus = () => {
  return (dispatch) => {
    settingsAPI.rebuildTurnProductsStatus().then((data) => {
      dispatch(setTurnStatus(data));
    });
  };
};

export const rebuildTurnProducts = () => {
  return (dispatch) => {
    dispatch(
      setTurnStatus({
        is_updating: true,
        update_status: "",
      })
    );
    settingsAPI.rebuildTurnProducts();
  };
};

export default settingsReducer;
