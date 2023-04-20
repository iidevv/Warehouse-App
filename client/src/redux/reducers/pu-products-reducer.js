import { puProductsAPI } from "../../api/api";

const SET_PRODUCTS = "SET_PRODUCTS";
const SET_SEARCH_KEYWORD = "SET_SEARCH_KEYWORD";
const SET_TOTAL_COUNT = "SET_TOTAL_COUNT";
const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
const TOGGLE_IS_FETCHING = "TOGGLE_IS_FETCHING";
let initialState = {
  products: [],
  totalCount: 0,
  currentPage: 0,
  totalPages: 0,
  totalProducts: 0,
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
    case SET_TOTAL_COUNT:
      return {
        ...state,
        totalCount: action.totalCount,
        totalPages: Math.ceil(action.totalCount / 20),
      };
    case SET_SEARCH_KEYWORD:
      return {
        ...state,
        searchKeyword: action.searchKeyword,
      };
    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.currentPage,
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

export const setTotalCount = (totalCount) => {
  return {
    type: SET_TOTAL_COUNT,
    totalCount,
  };
};

export const setCurrentPage = (currentPage) => {
  return {
    type: SET_CURRENT_PAGE,
    currentPage,
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

export const getProducts = (name, page) => {
  let offset = page * 20;
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    puProductsAPI.getProducts(name, offset).then((data) => {
      dispatch(setProducts(data.result.hits));
      dispatch(setTotalCount(data.result.total));
      dispatch(setCurrentPage(page));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export default puProductsReducer;
