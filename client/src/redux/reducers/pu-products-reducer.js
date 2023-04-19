import { puProductsAPI } from "../../api/api";

const SET_PRODUCTS = "SET_PRODUCTS";
const SET_SEARCH_KEYWORD = "SET_SEARCH_KEYWORD";
const SET_OFFSET = "SET_OFFSET";
const SET_TOTAL_COUNT = "SET_TOTAL_COUNT";
const TOGGLE_IS_FETCHING = "TOGGLE_IS_FETCHING";
let initialState = {
  products: [],
  totalCount: 0,
  totalPages: 0,
  offset: 0,
  meta: {
    totalProducts: 0,
    totalPages: 1,
    currentPage: 1
  },
  searchKeyword: "",
  isFetching: true,
};

const puProductsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        ...state,
        products: [...action.products],
      };
    case SET_OFFSET:
      return {
        ...state,
        offset: action.offset,
      };
    case SET_TOTAL_COUNT:
      return {
        ...state,
        meta: {...state.meta},
        totalCount: action.totalCount,
        totalPages: Math.ceil(action.totalCount / 20),
      };
    case SET_SEARCH_KEYWORD:
      return {
        ...state,
        searchKeyword: action.searchKeyword,
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

export const setOffset = (offset) => {
  return {
    type: SET_OFFSET,
    offset,
  };
};

export const setTotalCount = (totalCount) => {
  return {
    type: SET_TOTAL_COUNT,
    totalCount,
  };
};

export const setSearchKeyword = (searchKeyword) => {
  return {
    type: SET_SEARCH_KEYWORD,
    searchKeyword,
  };
};

export const setToggleIsFetching = (isFetching) => {
  return {
    type: TOGGLE_IS_FETCHING,
    isFetching,
  };
};

export const getProducts = (name, offset) => {
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    puProductsAPI.getProducts(name, offset).then((data) => {
      dispatch(setProducts(data.result.hits));
      dispatch(setTotalCount(data.result.total));
      //   dispatch(setOffset(data.meta.cursor));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export default puProductsReducer;
