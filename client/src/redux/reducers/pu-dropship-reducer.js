import { puDropshipAPI } from "../../api/api";

const SET_ORDERS_PU = "SET_ORDERS_PU";
const TOGGLE_IS_FETCHING = "TOGGLE_IS_FETCHING";

let initialState = {
  orders: [],
  currentPage: 1,
  totalPages: 0,
  isFetching: true,
};

const PuDropshipReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDERS_PU:
      return {
        ...state,
        orders: [...action.orders],
      };
    default:
      return state;
  }
};

export const setOrders = (orders) => {
  return {
    type: SET_ORDERS_PU,
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
    puDropshipAPI.getOrders(from, to, page).then((data) => {
      dispatch(setOrders(data.orders));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export default PuDropshipReducer;
