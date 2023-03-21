import { inventoryAPI } from "../../api/api";

const SET_PRODUCTS = "SET_PRODUCTS";
const SET_PRODUCTS_TOTAL = "SET_PRODUCTS_TOTAL";
const TOGGLE_IS_FETCHING = "TOGGLE_IS_FETCHING";

let initialState = {
  products: [],
  total: 0,
  page: 1,
  isFetching: true,
};

const inventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        ...state,
        products: [...action.products],
      };
    case SET_PRODUCTS_TOTAL:
      return {
        ...state,
        total: action.total,
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

export const setProducts = (products) => {
  return {
    type: SET_PRODUCTS,
    products,
  };
};

export const setProductsTotal = (total) => {
  return {
    type: SET_PRODUCTS_TOTAL,
    total,
  };
};

export const setToggleIsFetching = (isFetching) => {
  return {
    type: TOGGLE_IS_FETCHING,
    isFetching,
  };
};

export const deleteProduct = (id) => {
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    inventoryAPI.deleteProduct(id).then((data) => {
      dispatch(setToggleIsFetching(false));
      dispatch(getProducts());
    });
  };
};

export const getProducts = (name, page) => {
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    inventoryAPI.getProducts(name, page).then((data) => {
      dispatch(setProducts(data.products));
      dispatch(setProductsTotal(data.total));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export default inventoryReducer;
