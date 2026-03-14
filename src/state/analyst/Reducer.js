import {
  ANALYTICS_REQUEST,
  ANALYTICS_SUCCESS,
  ANALYTICS_FAILURE,
  ANALYTICS_RESET,
} from "./ActionType";

/* ============================================
   ANALYTICS REDUCER
============================================ */

const initialState = {
  loading: false,
  analytics: null,
  error: null,
};

export const analyticsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ANALYTICS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ANALYTICS_SUCCESS:
      return {
        ...state,
        loading: false,
        analytics: action.payload,
      };

    case ANALYTICS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ANALYTICS_RESET:
      return initialState;

    default:
      return state;
  }
};
