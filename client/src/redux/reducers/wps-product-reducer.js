import { wpsProductAPI, dmgProductAPI } from "./../../api/api";

const SET_PRODUCT_PAGE = "SET_PRODUCT_PAGE";
const SET_INFO_ALERT = "SET_INFO_ALERT";
const SET_CATEGORIES = "SET_CATEGORIES";
const SET_CURRENT_CATEGORY = "SET_CURRENT_CATEGORY";
const TOGGLE_IS_FETCHING = "TOGGLE_IS_FETCHING";
const SET_SEO_CONTENT = "SET_SEO_CONTENT";

let initialState = {
  productData: [],
  isFetching: true,
  info: {},
  categories: [],
  current_category: {},
  seoContent: {
    page_title: "",
    description: "",
    meta_keywords: "",
    meta_description: "",
  },
};

const wpsProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCT_PAGE:
      return {
        ...state,
        productData: action.productData,
      };
    case SET_SEO_CONTENT:
      return {
        ...state,
        seoContent: action.seoContent,
      };
    case SET_INFO_ALERT:
      return {
        ...state,
        info: action.message,
      };
    case SET_CATEGORIES:
      return {
        ...state,
        categories: action.categories,
      };
    case TOGGLE_IS_FETCHING:
      return {
        ...state,
        isFetching: action.isFetching,
      };
    case SET_CURRENT_CATEGORY:
      return {
        ...state,
        current_category: action.current_category,
      };
    default:
      return state;
  }
};

export const setProduct = (productData) => {
  return {
    type: SET_PRODUCT_PAGE,
    productData,
  };
};

export const setSeoContent = (seoContent) => {
  return {
    type: SET_SEO_CONTENT,
    seoContent,
  };
};

export const setAlert = (message) => {
  return {
    type: SET_INFO_ALERT,
    message,
  };
};

export const setToggleIsFetching = (isFetching) => {
  return {
    type: TOGGLE_IS_FETCHING,
    isFetching,
  };
};

export const setCategories = (categories) => {
  return {
    type: SET_CATEGORIES,
    categories,
  };
};

export const setCategory = (name, id) => {
  return {
    type: SET_CURRENT_CATEGORY,
    current_category: { name, id },
  };
};

export const resetCategories = () => {
  return {
    type: SET_CATEGORIES,
    categories: [],
  };
};

export const searchCategories = (query) => {
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    dmgProductAPI.getCategories(query).then((data) => {
      dispatch(setCategories(data.data.data));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export const createBigcommerceProduct = (data) => {
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    dmgProductAPI.createProduct(data).then((message) => {
      dispatch(setAlert(message.data));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export const getProduct = (id) => {
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    wpsProductAPI.getProduct(id).then((data) => {
      dispatch(setProduct(data));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export default wpsProductReducer;
