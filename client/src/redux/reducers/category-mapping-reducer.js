import { categoryMappingAPI, dmgProductAPI } from "../../api/api";

const SET_CATEGORIES = "SET_CATEGORIES";
const SET_CATEGORIES_TOTAL = "SET_CATEGORIES_TOTAL";
const SET_PAGINATION = "SET_PAGINATION";
const SET_QUERY = "SET_QUERY";
const TOGGLE_IS_FETCHING = "TOGGLE_IS_FETCHING";
const SET_STATUS = "SET_STATUS";
const SET_DMG_CATEGORIES = "SET_DMG_CATEGORIES";
const SET_CATEGORY = "SET_CATEGORY";

let initialState = {
  categories: [],
  total: 0,
  dmg_categories: [],
  pagination: {
    page: 1,
    nextPage: null,
    prevPage: null,
    totalPages: 0,
  },
  query: {},
  isFetching: true,
};

const categoryMappingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CATEGORIES:
      return {
        ...state,
        categories: [...action.categories],
      };
    case SET_CATEGORIES_TOTAL:
      return {
        ...state,
        total: action.total,
      };
    case SET_PAGINATION:
      return {
        ...state,
        pagination: action.pagination,
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
    case SET_DMG_CATEGORIES:
      return {
        ...state,
        dmg_categories: action.categories,
      };
    case SET_CATEGORY:
      console.log("Current categories:", state.categories);
      console.log("Action category:", action.category);

      const updatedCategories = [...state.categories].map((cat) =>
        cat.id === action.category.id ? action.category : cat
      );

      console.log("Updated categories:", updatedCategories);

      return {
        ...state,
        categories: updatedCategories,
      };
    default:
      return state;
  }
};

export const setCategories = (categories) => {
  return {
    type: SET_CATEGORIES,
    categories,
  };
};

export const setCategoriesTotal = (total) => {
  return {
    type: SET_CATEGORIES_TOTAL,
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

export const setDMGCategories = (categories) => {
  return {
    type: SET_DMG_CATEGORIES,
    categories,
  };
};

export const setCategory = (category) => {
  return {
    type: SET_CATEGORY,
    category,
  };
};

export const getCategories = (vendor, query, page) => {
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    categoryMappingAPI.getCategories(vendor, query, page).then((data) => {
      dispatch(setCategories(data.categories));
      dispatch(setPagination(data.pagination));
      dispatch(setCategoriesTotal(data.total));
      dispatch(setQuery(data.query));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export const searchDMGCategories = (query) => {
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    dmgProductAPI.getCategories(query).then((data) => {
      dispatch(setDMGCategories(data.data.data));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export const updateCategory = (vendor, data) => {
  console.log(data);
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    categoryMappingAPI.updateCategory(vendor, data).then((updatedCategory) => {
      dispatch(setCategory(updatedCategory));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export default categoryMappingReducer;
