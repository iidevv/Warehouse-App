import { wpsProductAPI, dmgProductAPI, chatgptAPI } from "./../../api/api";

const SET_PRODUCT_PAGE = "SET_PRODUCT_PAGE";
const SET_INFO_ALERT = "SET_INFO_ALERT";
const SET_CATEGORIES = "SET_CATEGORIES";
const SET_CURRENT_CATEGORY = "SET_CURRENT_CATEGORY";
const TOGGLE_IS_FETCHING = "TOGGLE_IS_FETCHING";
const SET_CONTENT = "SET_CONTENT";
const REMOVE_VARIANT_IMAGE = "REMOVE_VARIANT_IMAGE";
const CHANGE_VARIANT_NAME = "CHANGE_VARIANT_NAME";

let initialState = {
  productData: [],
  isFetching: true,
  info: {},
  categories: [],
  current_category: {},
  content: {
    page_title: "",
    search_keywords: "",
    meta_keywords: "",
    meta_description: "",
    description: "",
  },
};

const wpsProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCT_PAGE:
      return {
        ...state,
        productData: action.productData,
      };
    case SET_CONTENT:
      return {
        ...state,
        content: {
          ...state.content,
          [action.payload.id]: action.payload.value,
        },
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
    case CHANGE_VARIANT_NAME:
      const updatedVariantsName = state.productData.variants.map(
        (variant, i) => {
          const updatedOptionValues = variant.option_values.map(
            (optionValue, index) => {
              if (index === 0) {
                return {
                  ...optionValue,
                  label:
                    i === action.payload.id
                      ? action.payload.name
                      : optionValue.label,
                };
              } else {
                return optionValue;
              }
            }
          );

          return {
            ...variant,
            option_values: updatedOptionValues,
          };
        }
      );

      return {
        ...state,
        productData: {
          ...state.productData,
          variants: updatedVariantsName,
        },
      };
    case REMOVE_VARIANT_IMAGE:
      const updatedVariants = state.productData.variants.map((variant, i) => {
        return {
          ...variant,
          image_url: i === action.payload.id ? undefined : variant.image_url,
        };
      });
      const updatedImages = state.productData.images.filter(
        (image) => image.image_url !== action.payload.image_url
      );
      return {
        ...state,
        productData: {
          ...state.productData,
          variants: updatedVariants,
          images: updatedImages,
        },
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

export const setHandleContentChange = (id, value) => {
  return {
    type: SET_CONTENT,
    payload: {
      id,
      value,
    },
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

export const removeVariantImage = (id, image_url) => {
  return {
    type: REMOVE_VARIANT_IMAGE,
    payload: {
      id,
      image_url,
    },
  };
};

export const changeVariantName = (id, name) => {
  return {
    type: CHANGE_VARIANT_NAME,
    payload: {
      id,
      name,
    },
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
    debugger;
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
      dispatch(setHandleContentChange("description", data.description));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export const getChatgptContent = (contentField, text) => {
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    chatgptAPI.getText(text).then((data) => {
      dispatch(setHandleContentChange(contentField, data.trim()));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export default wpsProductReducer;
