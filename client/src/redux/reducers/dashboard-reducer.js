import { dashboardAPI } from "../../api/api";

const SET_DATA = "SET_DATA";
const SET_DATA_WPS = "SET_DATA_WPS";
const SET_DATA_PU = "SET_DATA_PU";
const TOGGLE_IS_FETCHING = "TOGGLE_IS_FETCHING";

let initialState = {
  wpsData: {
    noChangesTotal: 0,
    updatedTotal: 0,
    createdTotal: 0,
    errorTotal: 0,
    total: 0,
  },
  puData: {
    noChangesTotal: 0,
    updatedTotal: 0,
    createdTotal: 0,
    errorTotal: 0,
    total: 0,
  },
  data: {
    noChangesTotal: 0,
    updatedTotal: 0,
    createdTotal: 0,
    errorTotal: 0,
    total: 0,
  },
  isFetching: true,
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DATA:
      return {
        ...state,
        data: { ...action.data },
      };
    case SET_DATA_WPS:
      return {
        ...state,
        wpsData: { ...action.data },
      };
    case SET_DATA_PU:
      return {
        ...state,
        puData: { ...action.data },
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

export const setData = (data) => {
  return {
    type: SET_DATA,
    data,
  };
};

export const setDataWPS = (data) => {
  return {
    type: SET_DATA_WPS,
    data,
  };
};

export const setDataPU = (data) => {
  return {
    type: SET_DATA_PU,
    data,
  };
};

export const setToggleIsFetching = (isFetching) => {
  return {
    type: TOGGLE_IS_FETCHING,
    isFetching,
  };
};

export const getTotals = () => {
  return (dispatch) => {
    dispatch(setToggleIsFetching(true));
    dashboardAPI.getTotals().then((data) => {
      dispatch(setData(data.data));
      dispatch(setDataWPS(data.wpsData));
      dispatch(setDataPU(data.puData));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export default dashboardReducer;
