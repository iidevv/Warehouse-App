import { wpsProductAPI } from "./../../api/api";

const SET_PRODUCTS = "SET_PRODUCTS";
const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";

let initialState = {
  products: [],
  totalCount: 0,
  currentPage: "",
  nextPage: "",
  prevPage: "",
  isFetching: true,
};

const wpsProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        ...state,
        products: [...action.products],
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

export const getProducts = (currentPage) => {
  return (dispatch) => {
    wpsProductAPI.getProducts(currentPage).then((data) => {
      dispatch(setProducts(data.data));
    });
  };
};

export default wpsProductReducer;
