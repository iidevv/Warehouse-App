import { puInventoryAPI, dmgProductAPI } from "../../api/api";

const SET_PRODUCTS_PU = "SET_PRODUCTS_PU";
const SET_PRODUCTS_TOTAL_PU = "SET_PRODUCTS_TOTAL_PU";
const SET_CURRENT_PAGE_PU = "SET_CURRENT_PAGE_PU";
const SET_TOTAL_PAGES_PU = "SET_TOTAL_PAGES_PU";
const TOGGLE_IS_FETCHING = "TOGGLE_IS_FETCHING";
const SET_STATUS_PU = "SET_STATUS_PU";

let initialState = {
  products: [],
  total: 0,
  currentPage: 1,
  totalPages: 0,
  isFetching: true,
  status: true,
};

const PuInventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS_PU:
      return {
        ...state,
        products: [...action.products],
      };
    case SET_PRODUCTS_TOTAL_PU:
      return {
        ...state,
        total: action.total,
      };
    case SET_CURRENT_PAGE_PU:
      return {
        ...state,
        currentPage: action.currentPage,
      };
    case SET_TOTAL_PAGES_PU:
      return {
        ...state,
        totalPages: action.totalPages,
      };
    case SET_STATUS_PU:
      return {
        ...state,
        status: action.status,
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
    type: SET_PRODUCTS_PU,
    products,
  };
};

export const setProductsTotal = (total) => {
  return {
    type: SET_PRODUCTS_TOTAL_PU,
    total,
  };
};

export const setCurrentPage = (currentPage) => {
  return {
    type: SET_CURRENT_PAGE_PU,
    currentPage,
  };
};

export const setTotalPages = (totalPages) => {
  return {
    type: SET_TOTAL_PAGES_PU,
    totalPages,
  };
};

export const setStatus = (status) => {
  return {
    type: SET_STATUS_PU,
    status,
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

    const inventoryPromise = puInventoryAPI.deleteProduct(id);
    const dmgProductPromise = dmgProductAPI.deleteProduct(id);

    Promise.all([inventoryPromise, dmgProductPromise])
      .then(() => {
        dispatch(setToggleIsFetching(false));
        dispatch(getProducts());
      })
      .catch((error) => {
        console.error("Error:", error);
        dispatch(setToggleIsFetching(false));
      });
  };
};

export const getProducts = (name, page, status, search) => {
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    puInventoryAPI.getProducts(name, page, status, search).then((data) => {
      dispatch(setProducts(data.products));
      dispatch(setProductsTotal(data.total));
      dispatch(setTotalPages(data.totalPages));
      dispatch(setCurrentPage(data.currentPage));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export const getStatus = () => {
  return (dispatch) => {
    puInventoryAPI.updateProductsStatus().then((data) => {
      dispatch(setStatus(data.status));
    });
  };
};

export const updateProducts = (vendor_id, name, status) => {
  return (dispatch) => {
    dispatch(setStatus(true));
    puInventoryAPI.updateProducts(vendor_id, name, status).then((data) => {
      dispatch(getProducts(vendor_id, name, status));
      dispatch(setStatus(false));
    });
  };
};

export default PuInventoryReducer;
