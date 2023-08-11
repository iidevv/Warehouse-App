import { catalogAPI } from "../../api/api";

const SET_PRODUCTS = "SET_PRODUCTS";
const SET_VENDOR = "SET_VENDOR";
const SET_META = "SET_META";
const SET_SEARCH = "SET_SEARCH";
const SET_OFFSET = "SET_OFFSET";
const TOGGLE_IS_FETCHING = "TOGGLE_IS_FETCHING";

let initialState = {
  vendor: "",
  search: "",
  offset: "",
  products: [],
  meta: {
    current: "",
    next: "",
    prev: "",
    total: null,
  },
  isFetching: true,
};

const catalogReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        ...state,
        products: [...action.products],
      };
    case SET_VENDOR:
      return {
        ...state,
        vendor: action.vendor,
      };
    case SET_META:
      return {
        ...state,
        meta: action.meta,
      };
    case SET_SEARCH:
      return {
        ...state,
        search: action.search,
      };
    case SET_OFFSET:
      return {
        ...state,
        offset: action.offset,
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

export const setVendor = (vendor) => {
  return {
    type: SET_VENDOR,
    vendor,
  };
};

export const setMeta = (meta) => {
  return {
    type: SET_META,
    meta,
  };
};

export const setSearch = (search) => {
  return {
    type: SET_SEARCH,
    search,
  };
};

export const setOffset = (offset) => {
  return {
    type: SET_OFFSET,
    offset,
  };
};

export const setToggleIsFetching = (isFetching) => {
  return {
    type: TOGGLE_IS_FETCHING,
    isFetching,
  };
};

export const getProducts = (vendor, offset, search) => {
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    catalogAPI.getProducts(vendor, offset, search).then((data) => {
      dispatch(setProducts(data.data));
      dispatch(setMeta(data.meta));
      dispatch(setOffset(offset));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export default catalogReducer;
