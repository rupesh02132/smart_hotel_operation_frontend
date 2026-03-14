import { api } from "../../Admin/config/apiConfig";

export const FETCH_METRICS_REQUEST = "FETCH_METRICS_REQUEST";
export const FETCH_METRICS_SUCCESS = "FETCH_METRICS_SUCCESS";
export const FETCH_METRICS_FAILURE = "FETCH_METRICS_FAILURE";

export const fetchAdminMetrics = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_METRICS_REQUEST });

    const { data } = await api.get("/api/admin/metrics");

    dispatch({ type: FETCH_METRICS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FETCH_METRICS_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};
