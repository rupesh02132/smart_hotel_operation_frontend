import { api } from "../../Admin/config/apiConfig";
import {
  HOST_ROOM_STATUS_REQUEST,
  HOST_ROOM_STATUS_SUCCESS,
  HOST_ROOM_STATUS_FAIL,
  MARK_CLEANED_REQUEST,
  MARK_CLEANED_SUCCESS,
  MARK_CLEANED_FAIL,
  AVAILABILITY_REQUEST,
  AVAILABILITY_SUCCESS,
  AVAILABILITY_FAIL,
  HOUSEKEEPING_TASKS_REQUEST,
  HOUSEKEEPING_TASKS_SUCCESS,
  HOUSEKEEPING_TASKS_FAIL,
} from "./ActionType";

// ✅ GET Host Room Status
export const getHostRoomStatusAction = () => async (dispatch) => {
  try {
    dispatch({ type: HOST_ROOM_STATUS_REQUEST });

    const { data } = await api.get("/api/housekeeping/host/status");

    dispatch({
      type: HOST_ROOM_STATUS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: HOST_ROOM_STATUS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ PUT Clean Room
export const markRoomCleaned = (roomId) => async (dispatch) => {
  try {
    dispatch({ type: MARK_CLEANED_REQUEST });

    const { data } = await api.put(`/api/housekeeping/clean/${roomId}`);

    dispatch({
      type: MARK_CLEANED_SUCCESS,
      payload: data, // { message, room }
    });
  } catch (error) {
    dispatch({
      type: MARK_CLEANED_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ POST Update Availability
export const updateAvailabilityAction =
  (id, availability) => async (dispatch) => {
    try {
      dispatch({ type: AVAILABILITY_REQUEST });

      const { data } = await api.post(`/api/housekeeping/${id}/availability`, {
        availability,
      });

      dispatch({
        type: AVAILABILITY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: AVAILABILITY_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// ✅ GET Staff Cleaning Tasks
export const getHousekeepingTasksAction = () => async (dispatch) => {
  try {
    dispatch({ type: HOUSEKEEPING_TASKS_REQUEST });

    const { data } = await api.get("/api/housekeeping/tasks");

    dispatch({
      type: HOUSEKEEPING_TASKS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: HOUSEKEEPING_TASKS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
