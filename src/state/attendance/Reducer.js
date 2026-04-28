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

const initialState = {
  loading: false,
  error: null,
  checkIn: { success: false, data: null },
  checkOut: { success: false, data: null },
  records: [],
};

export const attendanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case ATTENDANCE_CHECKIN_REQUEST:
    case ATTENDANCE_CHECKOUT_REQUEST:
    case ATTENDANCE_LIST_REQUEST:
      return { ...state, loading: true, error: null };

    case ATTENDANCE_CHECKIN_SUCCESS:
      return {
        ...state,
        loading: false,
        checkIn: { success: true, data: action.payload },
      };

    case ATTENDANCE_CHECKOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        checkOut: { success: true, data: action.payload },
      };

    case ATTENDANCE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        records: action.payload,
      };

    case ATTENDANCE_CHECKIN_FAIL:
    case ATTENDANCE_CHECKOUT_FAIL:
    case ATTENDANCE_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};