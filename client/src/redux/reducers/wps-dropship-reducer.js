import { wpsDropshipAPI } from "../../api/api";

const SET_ORDERS_WPS = "SET_ORDERS_WPS";
const TOGGLE_IS_FETCHING = "TOGGLE_IS_FETCHING";

let initialState = {
  orders: [],
  currentPage: 1,
  totalPages: 0,
  isFetching: true,
};

const WpsDropshipReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDERS_WPS:
      return {
        ...state,
        orders: [...action.orders],
      };
    case TOGGLE_IS_FETCHING:
      return {
        ...state,
        isFetching: action.isFetching
      }
    default:
      return state;
  }
};

export const setOrders = (orders) => {
  return {
    type: SET_ORDERS_WPS,
    orders,
  };
};

export const setToggleIsFetching = (isFetching) => {
  return {
    type: TOGGLE_IS_FETCHING,
    isFetching,
  };
};

export const getOrders = (from, to, page) => {
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    wpsDropshipAPI.getOrders(from, to, page).then((data) => {
      dispatch(setOrders(data.data));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export default WpsDropshipReducer;
