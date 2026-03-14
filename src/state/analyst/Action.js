import { api } from "../../Admin/config/apiConfig";

import {
  ANALYTICS_REQUEST,
  ANALYTICS_SUCCESS,
  ANALYTICS_FAILURE,
} from "./ActionType";

/* ============================================
   FETCH HOTEL ANALYTICS (ADMIN)
============================================ */
export const fetchHotelAnalytics = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ANALYTICS_REQUEST });

    const {
      auth: { jwt },
    } = getState();

    if (!jwt) {
      throw new Error("Unauthorized: Admin login required");
    }

    const { data } = await api.get("/api/analytics", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({
      type: ANALYTICS_SUCCESS,
      payload: data.analytics,
    });
  } catch (error) {
    dispatch({
      type: ANALYTICS_FAILURE,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Analytics fetch failed",
    });
  }
};
