import { inventoryAPI } from "../../api/api";

const SET_PRODUCTS = "SET_PRODUCTS";
const SET_PRODUCTS_TOTAL = "SET_PRODUCTS_TOTAL";
const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
const SET_TOTAL_PAGES = "SET_TOTAL_PAGES";
const TOGGLE_IS_FETCHING = "TOGGLE_IS_FETCHING";

let initialState = {
  products: [],
  total: 0,
  currentPage: 1,
  totalPages: 0,
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
    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.currentPage,
      };
    case SET_TOTAL_PAGES:
      return {
        ...state,
        totalPages: action.totalPages,
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

export const setCurrentPage = (currentPage) => {
  return {
    type: SET_CURRENT_PAGE,
    currentPage,
  };
};

export const setTotalPages = (totalPages) => {
  return {
    type: SET_TOTAL_PAGES,
    totalPages,
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
    inventoryAPI
      .getProducts(name, page)
      .then((data) => {
        if (data && Array.isArray(data.products)) {
          dispatch(setProducts(data.products));
          dispatch(setProductsTotal(data.total));
          dispatch(setTotalPages(data.totalPages));
          dispatch(setCurrentPage(data.currentPage));
        } else {
          console.error("Ошибка: получены неверные данные:", data);
        }
        dispatch(setToggleIsFetching(false));
      })
      .catch((error) => {
        console.error("Ошибка при запросе продуктов:", error);
        dispatch(setToggleIsFetching(false));
      });
  };
};

export const updateProducts = () => {
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    inventoryAPI.updateProducts().then((data) => {
      dispatch(setToggleIsFetching(false));
      dispatch(getProducts());
    });
  };
};

export default inventoryReducer;
