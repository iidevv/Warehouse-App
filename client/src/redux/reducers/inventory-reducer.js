import { inventoryAPI, dmgProductAPI } from "../../api/api";

const SET_VENDOR = "SET_VENDOR";
const SET_PRODUCTS = "SET_PRODUCTS";
const SET_PRODUCTS_TOTAL = "SET_PRODUCTS_TOTAL";
const SET_PAGINATION = "SET_PAGINATION";
const SET_QUERY = "SET_QUERY";
const TOGGLE_IS_FETCHING = "TOGGLE_IS_FETCHING";
const SET_STATUS = "SET_STATUS";

let initialState = {
  products: [],
  total: 0,
  pagination: {
    page: 1,
    nextPage: null,
    prevPage: null,
    totalPages: 0,
  },
  query: {},
  isFetching: true,
  status: true,
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
    case SET_PAGINATION:
      return {
        ...state,
        pagination: action.pagination,
      };
    case SET_STATUS:
      return {
        ...state,
        status: action.status,
      };
    case SET_QUERY:
      return {
        ...state,
        query: action.query,
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

export const setPagination = (pagination) => {
  const { page, nextPage, prevPage, totalPages } = pagination;
  return {
    type: SET_PAGINATION,
    pagination: {
      page,
      nextPage,
      prevPage,
      totalPages,
    },
  };
};

export const setStatus = (status) => {
  return {
    type: SET_STATUS,
    status,
  };
};

export const setQuery = (query) => {
  return {
    type: SET_QUERY,
    query,
  };
};

export const setToggleIsFetching = (isFetching) => {
  return {
    type: TOGGLE_IS_FETCHING,
    isFetching,
  };
};

export const getProducts = (vendor, query, page) => {
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    inventoryAPI.getProducts(vendor, query, page).then((data) => {
      dispatch(setProducts(data.products));
      dispatch(setPagination(data.pagination));
      dispatch(setProductsTotal(data.total));
      dispatch(setQuery(data.query));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export const getStatus = () => {
  return (dispatch) => {
    inventoryAPI.updateProductsStatus().then((data) => {
      dispatch(setStatus(data.status));
    });
  };
};

export const updateProducts = (vendor, query, bulk) => {
  return (dispatch) => {
    dispatch(setStatus(true));
    inventoryAPI.updateProducts(vendor, query, bulk).then((data) => {
      dispatch(getProducts(vendor, {}));
      dispatch(setStatus(false));
    });
  };
};

export default inventoryReducer;
