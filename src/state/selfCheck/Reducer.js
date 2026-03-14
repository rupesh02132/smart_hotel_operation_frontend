import {
  QR_GENERATE_REQUEST,
  QR_GENERATE_SUCCESS,
  QR_GENERATE_FAIL,
  QR_GENERATE_RESET,
  SELF_CHECKIN_REQUEST,
  SELF_CHECKIN_SUCCESS,
  SELF_CHECKIN_FAIL,
  SELF_CHECKOUT_REQUEST,
  SELF_CHECKOUT_SUCCESS,
  SELF_CHECKOUT_FAIL,
  SELF_CHECK_CLEAR,
  QR_VERIFY_REQUEST,
  QR_VERIFY_SUCCESS,
  QR_VERIFY_FAIL
} from "./ActionType";

const initialState = {
  loading: false,
  error: null,

  // QR state
  qr: null,

  // Self check state
  success: false,
  booking: null,
  message: null,
};

export const selfCheckReducer = (state = initialState, action) => {
  switch (action.type) {

    /* ======================================
       QR GENERATION
    ====================================== */

    case QR_GENERATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case QR_GENERATE_SUCCESS:
      return {
        ...state,
        loading: false,
        qr: action.payload,   // { qrToken, qrImage, expiresAt }
        error: null,
      };

    case QR_GENERATE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case QR_GENERATE_RESET:
      return {
        ...state,
        qr: null,
        error: null,
      };


    case QR_VERIFY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };

    case QR_VERIFY_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload,
      };

    case QR_VERIFY_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };


    /* ======================================
       SELF CHECK-IN / CHECK-OUT
    ====================================== */

    case SELF_CHECKIN_REQUEST:
    case SELF_CHECKOUT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
        message: null,
      };

    case SELF_CHECKIN_SUCCESS:
    case SELF_CHECKOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        booking: action.payload.booking,
        message: action.payload.message,
        error: null,
      };

    case SELF_CHECKIN_FAIL:
    case SELF_CHECKOUT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };

    case SELF_CHECK_CLEAR:
      return {
        ...state,
        success: false,
        booking: null,
        message: null,
        error: null,
      };

    default:
      return state;
  }
};