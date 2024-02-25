import { channelAPI } from "../../api/api";

const SET_PRODUCTS = "SET_PRODUCTS";
const SET_PRODUCTS_TOTAL = "SET_PRODUCTS_TOTAL";
const SET_PAGINATION = "SET_PAGINATION";
const TOGGLE_IS_FETCHING = "TOGGLE_IS_FETCHING";
const SET_STATUS = "SET_STATUS";
const SET_INFO_ALERT = "SET_INFO_ALERT";
let initialState = {
  products: [],
  total: 0,
  pagination: {
    page: 1,
    nextPage: null,
    prevPage: null,
    totalPages: 0,
  },
  info: {},
  isFetching: true,
  status: {
    is_updating: false,
  },
};

const channelReducer = (state = initialState, action) => {
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

export const setToggleIsFetching = (isFetching) => {
  return {
    type: TOGGLE_IS_FETCHING,
    isFetching,
  };
};

export const setStatus = (status) => {
  return {
    type: SET_STATUS,
    status,
  };
};

export const setAlert = (message) => {
  return {
    type: SET_INFO_ALERT,
    message,
  };
};

export const getProducts = (vendor, query, page) => {
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    channelAPI.getProducts(vendor, query, page).then((data) => {
      dispatch(setProducts(data.products));
      dispatch(setPagination(data.pagination));
      dispatch(setProductsTotal(data.total));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export const updateProducts = (vendor) => {
  return (dispatch) => {
    dispatch(
      setStatus({
        is_updating: true,
      })
    );
    channelAPI.updateProducts(vendor).then((data) => {
      dispatch(setAlert(data));
    });
  };
};

export const refreshProducts = (vendor) => {
  return (dispatch) => {
    dispatch(
      setStatus({
        is_updating: true,
      })
    );
    channelAPI.refreshProducts(vendor).then((data) => {
      dispatch(setAlert(data));
    });
  };
};

export default channelReducer;
