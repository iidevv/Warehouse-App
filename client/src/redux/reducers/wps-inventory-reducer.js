import { wpsProductsAPI } from "./../../api/api";

const SET_PRODUCTS = "SET_PRODUCTS";
const SET_SEARCH_KEYWORD = "SET_SEARCH_KEYWORD";
const SET_CURSOR = "SET_CURSOR";

let initialState = {
  products: [],
  totalCount: 0,
  cursor: {
    current: "",
    next: "",
    prev: "",
  },
  searchKeyword: "",
  isFetching: true,
};

const wpsProductsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        ...state,
        products: [...action.products],
      };
    case SET_CURSOR:
      return {
        ...state,
        cursor: action.cursor,
      };

    case SET_SEARCH_KEYWORD:
      return {
        ...state,
        searchKeyword: action.searchKeyword,
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

export const setCursor = (cursor) => {
  return {
    type: SET_CURSOR,
    cursor,
  };
};

export const setSearchKeyword = (searchKeyword) => {
  return {
    type: SET_SEARCH_KEYWORD,
    searchKeyword,
  };
};

export const getProducts = (name, cursor) => {
  return (dispatch) => {
    wpsProductsAPI.getProducts(name, cursor).then((data) => {
      dispatch(setProducts(data.data));
      dispatch(setCursor(data.meta.cursor));
    });
  };
};

export default wpsProductsReducer;
