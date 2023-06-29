import { ordersAPI } from "../../api/api";

const SET_ORDERS = "SET_ORDERS";
const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
const TOGGLE_IS_FETCHING = "TOGGLE_IS_FETCHING";

let initialState = {
  orders: [],
  currentPage: 1,
  isFetching: true,
};

const ordersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDERS:
      return {
        ...state,
        orders: [...action.data],
      };
    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.page,
      };

    case TOGGLE_IS_FETCHING:
      return {
        ...state,
        isFetching: action.isFetching,
      };

    default:
      return state;
  }
};

export const setOrders = (data) => {
  return {
    type: SET_ORDERS,
    data,
  };
};

export const setCurrentPage = (page) => {
  return {
    type: SET_CURRENT_PAGE,
    page,
  };
};

export const setToggleIsFetching = (isFetching) => {
  return {
    type: TOGGLE_IS_FETCHING,
    isFetching,
  };
};

export const getOrders = () => {
  return (dispatch, getState) => {
    const page = getState().orders.currentPage;
    dispatch(setToggleIsFetching(true));
    ordersAPI.getOrders(page).then((data) => {
      dispatch(setOrders(data));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export const createOrder = (id) => {
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    ordersAPI.createOrder(id).then((data) => {
      console.log(data);
      // dispatch(setOrders(data));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export default ordersReducer;
