import { wpsProductAPI, dmgProductAPI } from "./../../api/api";

const SET_PRODUCT_PAGE = "SET_PRODUCT_PAGE";
const SET_INFO_ALERT = "SET_INFO_ALERT";
const TOGGLE_IS_FETCHING = "TOGGLE_IS_FETCHING";

let initialState = {
  productData: [],
  isFetching: true,
  info: {},
};

const wpsProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCT_PAGE:
      return {
        ...state,
        productData: action.productData,
      };
    case SET_INFO_ALERT:
      return {
        ...state,
        info: action.message,
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

export const setProduct = (productData) => {
  return {
    type: SET_PRODUCT_PAGE,
    productData,
  };
};

export const setAlert = (message) => {
  return {
    type: SET_INFO_ALERT,
    message,
  };
};

export const setToggleIsFetching = (isFetching) => {
  return {
    type: TOGGLE_IS_FETCHING,
    isFetching,
  };
};

export const createBigcommerceProduct = (data) => {
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    dmgProductAPI.createProduct(data).then((message) => {
      dispatch(setAlert(message.data));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export const getProduct = (id) => {
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    wpsProductAPI.getProduct(id).then((data) => {
      dispatch(setProduct(data));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export default wpsProductReducer;
