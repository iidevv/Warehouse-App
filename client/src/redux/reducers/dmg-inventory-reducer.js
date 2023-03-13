import { dmgProductAPI } from "./../../api/api";

const SET_PRODUCTS = "SET_PRODUCTS";
const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";

let initialState = {
  products: [],
  pageSize: 20,
  totalCount: 0,
  currentPage: 1,
  isFetching: true,
};

const dmgProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        ...state,
        products: [...action.products],
      };
    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.currentPage,
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

export const setCurrentPage = (currentPage) => {
  return {
    type: SET_CURRENT_PAGE,
    currentPage,
  };
};

export const getProducts = (currentPage, pageSize) => {
  return (dispatch) => {
    dmgProductAPI.getProducts(currentPage, pageSize).then((data) => {
      dispatch(setCurrentPage(currentPage));
      dispatch(setProducts(data));
    });
  };
};

export default dmgProductReducer;
