import { wpsProductAPI } from "./../../api/api";

const SET_PRODUCT_PAGE = "SET_PRODUCT_PAGE";

let initialState = {
  productData: [],
  isFetching: true,
};

const wpsProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCT_PAGE:
      return {
        ...state,
        productData: action.productData,
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

export const getProduct = (id) => {
  return (dispatch) => {
    wpsProductAPI.getProduct(id).then((data) => {
      dispatch(setProduct(data));
    });
  };
};

export default wpsProductReducer;
