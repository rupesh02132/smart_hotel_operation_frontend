import { api } from "../../Admin/config/apiConfig";
import {
  ATTENDANCE_CHECKIN_REQUEST,
  ATTENDANCE_CHECKIN_SUCCESS,
  ATTENDANCE_CHECKIN_FAIL,
  ATTENDANCE_CHECKOUT_REQUEST,
  ATTENDANCE_CHECKOUT_SUCCESS,
  ATTENDANCE_CHECKOUT_FAIL,
  ATTENDANCE_LIST_REQUEST,
  ATTENDANCE_LIST_SUCCESS,
  ATTENDANCE_LIST_FAIL,
} from "./ActionType";

/* =========================
   CHECK-IN
========================= */
export const staffCheckIn = () => async (dispatch) => {
  try {
    dispatch({ type: ATTENDANCE_CHECKIN_REQUEST });

    const { data } = await api.post("/api/attendance/checkin");

    dispatch({
      type: ATTENDANCE_CHECKIN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ATTENDANCE_CHECKIN_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* =========================
   CHECK-OUT
========================= */
export const staffCheckOut = () => async (dispatch) => {
  try {
    dispatch({ type: ATTENDANCE_CHECKOUT_REQUEST });

    const { data } = await api.post("/api/attendance/checkout");

    dispatch({
      type: ATTENDANCE_CHECKOUT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ATTENDANCE_CHECKOUT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* =========================
   GET ALL ATTENDANCE
========================= */
export const getAllAttendance = () => async (dispatch) => {
  try {
    dispatch({ type: ATTENDANCE_LIST_REQUEST });

    const { data } = await api.get("/api/attendance");

    dispatch({
      type: ATTENDANCE_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ATTENDANCE_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};