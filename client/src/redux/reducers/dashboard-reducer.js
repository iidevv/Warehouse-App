import { dashboardAPI } from "../../api/api";

const SET_DATA = "SET_DATA";

// vendor connection point

const SET_DATA_WPS = "SET_DATA_WPS";
const SET_DATA_PU = "SET_DATA_PU";
const SET_DATA_HH = "SET_DATA_HH";
const SET_DATA_LS = "SET_DATA_LS";
const SET_DATA_TURN = "SET_DATA_TURN";
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
  hhData: {
    noChangesTotal: 0,
    updatedTotal: 0,
    createdTotal: 0,
    errorTotal: 0,
    total: 0,
  },
  lsData: {
    noChangesTotal: 0,
    updatedTotal: 0,
    createdTotal: 0,
    errorTotal: 0,
    total: 0,
  },
  turnData: {
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
    case SET_DATA_HH:
      return {
        ...state,
        hhData: { ...action.data },
      };
    case SET_DATA_LS:
      return {
        ...state,
        lsData: { ...action.data },
      };
    case SET_DATA_TURN:
      return {
        ...state,
        turnData: { ...action.data },
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

export const setDataHH = (data) => {
  return {
    type: SET_DATA_HH,
    data,
  };
};

export const setDataLS = (data) => {
  return {
    type: SET_DATA_LS,
    data,
  };
};

export const setDataTURN = (data) => {
  return {
    type: SET_DATA_TURN,
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
      dispatch(setDataHH(data.hhData));
      dispatch(setDataLS(data.lsData));
      dispatch(setDataTURN(data.turnData));
      dispatch(setToggleIsFetching(false));
    });
  };
};

export default dashboardReducer;
