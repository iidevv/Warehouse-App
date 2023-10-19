import {
  dmgProductAPI,
  catalogAPI,
  chatgptAPI,
  optimizationAPI,
} from "./../../api/api";

const SET_PRODUCT_PAGE = "SET_PRODUCT_PAGE";
const SET_INFO_ALERT = "SET_INFO_ALERT";
const SET_CATEGORIES = "SET_CATEGORIES";
const SET_CURRENT_CATEGORY = "SET_CURRENT_CATEGORY";
const TOGGLE_IS_FETCHING = "TOGGLE_IS_FETCHING";
const SET_CONTENT = "SET_CONTENT";
const CHANGE_NAME = "CHANGE_NAME";
const REMOVE_VARIANT = "REMOVE_VARIANT";
const SET_VARIANTS = "SET_VARIANTS";
const REMOVE_VARIANTS = "REMOVE_VARIANTS";
const REMOVE_VARIANT_IMAGE = "REMOVE_VARIANT_IMAGE";
const CHANGE_VARIANT_NAME = "CHANGE_VARIANT_NAME";
const FIND_AND_REPLACE = "FIND_AND_REPLACE";
const REMOVE_ADDITIONAL_IMAGE = "REMOVE_ADDITIONAL_IMAGE";
const SET_PRODUCT_CREATE_DATA = "SET_PRODUCT_CREATE_DATA";
const SET_SEO = "SET_SEO";

let initialState = {
  productData: {
    name: "",
  },
  isFetching: true,
  info: {},
  categories: [],
  current_categories: [],
  content: {
    search_keywords: "",
    meta_keywords: "",
    meta_description: "",
    description: "",
  },
  create_type: "sku",
  create_value: "",
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCT_PAGE:
      return {
        ...state,
        productData: action.productData,
      };
    case SET_CONTENT:
      if (action.payload.id == "description" && action.payload.isGpt) {
        return {
          ...state,
          content: {
            ...state.content,
            description: action.payload.value,
          },
        };
      } else {
        return {
          ...state,
          content: {
            ...state.content,
            [action.payload.id]: action.payload.value,
          },
        };
      }
    case SET_SEO:
      return {
        ...state,
        content: action.data,
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
        current_categories: action.current_categories,
      };
    case CHANGE_NAME:
      return {
        ...state,
        productData: {
          ...state.productData,
          name: action.payload.name,
        },
      };
    case FIND_AND_REPLACE:
      const { find, replace } = action.payload;

      // Make sure find text is provided
      if (!find) {
        alert("Find text is missing");
        return state;
      }
      const updatedVariantsReplace = state.productData.variants.map(
        (variant) => {
          const updatedOptionValues = variant.option_values.map(
            (optionValue) => {
              const updatedLabel = optionValue.label.replaceAll(find, replace);
              return {
                ...optionValue,
                label: updatedLabel,
              };
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
          variants: updatedVariantsReplace,
        },
      };
    case SET_PRODUCT_CREATE_DATA:
      const { type, value } = action.payload;
      return {
        ...state,
        create_type: type,
        create_value: value,
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
    case REMOVE_ADDITIONAL_IMAGE:
      const updatedAdditionalImagesRemoveOne = state.productData.images.filter(
        (image) => image.image_url !== action.payload.url
      );
      return {
        ...state,
        productData: {
          ...state.productData,
          images: updatedAdditionalImagesRemoveOne,
        },
      };
    case REMOVE_VARIANT:
      const updatedImagesRemoveOne = state.productData.images.filter(
        (image) => image.variant_id !== action.payload.variant_id
      );
      const updatedVariantsRemoveOne = state.productData.variants.filter(
        (_, i) => i !== action.payload.id
      );
      return {
        ...state,
        productData: {
          ...state.productData,
          variants: updatedVariantsRemoveOne,
          images: updatedImagesRemoveOne,
        },
      };

    case SET_VARIANTS:
      return {
        ...state,
        productData: {
          ...state.productData,
          variants: action.payload.variants,
        },
      };
    case REMOVE_VARIANTS:
      const updatedImagesRemove = state.productData.images.filter(
        (image) => !action.payload.variantIds.includes(image.variant_id)
      );
      const updatedVariantsRemove = state.productData.variants.filter(
        (_, i) => !action.payload.ids.includes(i)
      );
      return {
        ...state,
        productData: {
          ...state.productData,
          variants: updatedVariantsRemove,
          images: updatedImagesRemove,
        },
      };
    case REMOVE_VARIANT_IMAGE:
      const updatedImages = state.productData.images.filter(
        (image) => image.variant_id !== action.payload.variant_id
      );
      const updatedVariants = state.productData.variants.map((variant, i) => {
        return {
          ...variant,
          image_url: i === action.payload.id ? undefined : variant.image_url,
        };
      });
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

export const setHandleContentChange = (id, value, isGpt) => {
  return {
    type: SET_CONTENT,
    payload: {
      id,
      value,
      isGpt,
    },
  };
};

export const setSEO = (data) => {
  return {
    type: SET_SEO,
    data,
  };
};

export const setProductCreateData = (type, value) => {
  return {
    type: SET_PRODUCT_CREATE_DATA,
    payload: {
      type,
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

export const setCategory = (categories) => {
  return {
    type: SET_CURRENT_CATEGORY,
    current_categories: categories,
  };
};

export const resetCategories = () => {
  return {
    type: SET_CATEGORIES,
    categories: [],
  };
};

export const removeVariant = (id, variant_id) => {
  return {
    type: REMOVE_VARIANT,
    payload: {
      id,
      variant_id,
    },
  };
};

export const setVariants = (variants) => {
  return {
    type: SET_VARIANTS,
    payload: {
      variants,
    },
  };
};

export const removeVariants = (ids, variantIds) => {
  return {
    type: REMOVE_VARIANTS,
    payload: { ids, variantIds },
  };
};

export const removeVariantImage = (id, variant_id) => {
  return {
    type: REMOVE_VARIANT_IMAGE,
    payload: {
      id,
      variant_id,
    },
  };
};

export const removeAdditionalImage = (url) => {
  return {
    type: REMOVE_ADDITIONAL_IMAGE,
    payload: {
      url,
    },
  };
};

export const changeName = (name) => {
  return {
    type: CHANGE_NAME,
    payload: {
      name,
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

export const findAndReplace = (find, replace) => {
  return {
    type: FIND_AND_REPLACE,
    payload: {
      find,
      replace,
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
    dispatch(setToggleIsFetching(true));
    dmgProductAPI.createProduct(data).then((message) => {
      dispatch(setAlert(message.data));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export const getProduct = (vendor, id, search, link) => {
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    catalogAPI.getProduct(vendor, id, search, link).then((data) => {
      dispatch(setProduct(data));
      dispatch(setHandleContentChange("description", data.description));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export const optimizeImages = (product) => {
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    optimizationAPI.optimizeProductImages(product).then((data) => {
      dispatch(setProduct(data));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export const normalizeNames = (variants) => {
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    chatgptAPI.normalizeNames(variants).then((data) => {
      dispatch(setVariants(data));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export const getChatgptContent = (title, description) => {
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    chatgptAPI
      .createSEO(title, description)
      .then((data) => {
        dispatch(setSEO(data));
        dispatch(setToggleIsFetching(false));
      })
      .catch((err) => {
        dispatch(setToggleIsFetching(false));
      });
  };
};

export default productReducer;
