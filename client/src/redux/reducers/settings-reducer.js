import { settingsAPI } from "../../api/api";

const SET_TURN_STATUS = "SET_TURN_STATUS";
const SET_LS_STATUS = "SET_LS_STATUS";
const SET_AMAZON_STATUS = "SET_AMAZON_STATUS";
const SET_SYNC_CATALOG_STATUS = "SET_SYNC_CATALOG_STATUS";

let initialState = {
  turn_status: {
    is_updating: false,
    update_status: "",
  },
  ls_catalog_status: "",
  amazon_file_status: "",
  sync_catalog_status: {
    is_updating: false,
    update_status: "",
  },
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TURN_STATUS:
      return {
        ...state,
        turn_status: action.status,
      };
    case SET_LS_STATUS:
      return {
        ...state,
        ls_catalog_status: action.status,
      };
    case SET_AMAZON_STATUS:
      return {
        ...state,
        amazon_file_status: action.status,
      };
    case SET_SYNC_CATALOG_STATUS:
      return {
        ...state,
        sync_catalog_status: action.status,
      };
    default:
      return state;
  }
};

export const setTurnStatus = (status) => {
  return {
    type: SET_TURN_STATUS,
    status,
  };
};

export const setLsStatus = (status) => {
  return {
    type: SET_LS_STATUS,
    status,
  };
};

export const setAmazonStatus = (status) => {
  return {
    type: SET_AMAZON_STATUS,
    status,
  };
};

export const setSyncCatalogStatus = (status) => {
  return {
    type: SET_SYNC_CATALOG_STATUS,
    status,
  };
};

export const getRebuildTurnStatus = () => {
  return (dispatch) => {
    settingsAPI.rebuildTurnProductsStatus().then((data) => {
      dispatch(setTurnStatus(data));
    });
  };
};

export const rebuildTurnProducts = () => {
  return (dispatch) => {
    dispatch(
      setTurnStatus({
        is_updating: true,
        update_status: "",
      })
    );
    settingsAPI.rebuildTurnProducts();
  };
};

export const uploadLSCatalog = (formData) => {
  return (dispatch) => {
    dispatch(setLsStatus("Uploading"));

    settingsAPI
      .uploadLSCatalog(formData)
      .then((data) => {
        dispatch(setLsStatus(data.status));
      })
      .catch((error) => {
        dispatch(setLsStatus("Error uploading"));
        console.error(error);
      });
  };
};

export const uploadAmazonFile = (formData) => {
  return (dispatch) => {
    dispatch(setAmazonStatus("Uploading"));

    settingsAPI
      .uploadAmazonFile(formData)
      .then((data) => {
        dispatch(setAmazonStatus(data.status));
      })
      .catch((error) => {
        dispatch(setAmazonStatus("Error uploading"));
        console.error(error);
      });
  };
};

export const syncCatalog = () => {
  return (dispatch) => {
    dispatch(
      setSyncCatalogStatus({
        is_updating: true,
        update_status: "",
      })
    );
    settingsAPI.syncCatalog();
  };
};

export const getSyncCatalogStatus = () => {
  return (dispatch) => {
    settingsAPI.syncCatalogStatus().then((data) => {
      dispatch(setSyncCatalogStatus(data));
    });
  };
};

export default settingsReducer;
