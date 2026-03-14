import {
  FETCH_METRICS_REQUEST,
  FETCH_METRICS_SUCCESS,
  FETCH_METRICS_FAILURE,
} from "./Action";

const initialState = {
  loading: false,
  metrics: null,
  error: null,
};

export const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_METRICS_REQUEST:
      return { ...state, loading: true };

    case FETCH_METRICS_SUCCESS:
      return { loading: false, metrics: action.payload, error: null };

    case FETCH_METRICS_FAILURE:
      return { loading: false, metrics: null, error: action.payload };

    default:
      return state;
  }
};
