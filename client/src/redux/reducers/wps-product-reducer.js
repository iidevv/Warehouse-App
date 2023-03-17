import { wpsProductAPI, dmgProductAPI } from "./../../api/api";

const SET_PRODUCT_PAGE = "SET_PRODUCT_PAGE";
const SET_INFO_ALERT = "SET_INFO_ALERT";
let initialState = {
  productData: [],
  isFetching: true,
  info: {}
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
    message
  };
}

export const createBigcommerceProduct = (data) => {
  return (dispatch) => {
    dmgProductAPI.createProduct(data).then((message) => {
      dispatch(setAlert(message.data));
    });
  }
}

export const getProduct = (id) => {
  return (dispatch) => {
    wpsProductAPI.getProduct(id).then((data) => {
      dispatch(setProduct(data));
    });
  };
};

export default wpsProductReducer;
