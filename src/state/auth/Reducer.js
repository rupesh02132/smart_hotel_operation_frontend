import {
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  LOGIN_REQUEST,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  UPDATE_USER_REQUEST,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_FAILURE,
  GET_ALL_USERS_REQUEST,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  UPDATE_AVATAR_REQUEST,
  UPDATE_AVATAR_SUCCESS,
  UPDATE_AVATAR_FAILURE,
  VERIFY_EMAIL_REQUEST,
  VERIFY_EMAIL_SUCCESS,
  VERIFY_EMAIL_FAILURE,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILURE,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  SEND_OTP_REQUEST,
  SEND_OTP_SUCCESS,
  SEND_OTP_FAILURE,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAILURE,
  GOOGLE_LOGIN_REQUEST,
  GOOGLE_LOGIN_SUCCESS,
  GOOGLE_LOGIN_FAILURE,
  RESEND_OTP_REQUEST,
  RESEND_OTP_SUCCESS,
  RESEND_OTP_FAILURE,
} from "./ActionType";

const initialState = {
  isLoading: false,
  error: null,
  jwt: null,
  user: null,
  avatar: null,
  users: [],
  success: false,
  otpVerified: false,
  pendingEmail: null,
  message: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // ================= BASIC REQUEST =================
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case GET_USER_REQUEST:
    case GET_ALL_USERS_REQUEST:
    case UPDATE_USER_REQUEST:
    case DELETE_USER_REQUEST:
    case UPDATE_AVATAR_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
        success: false,
      };

    // ================= REGISTER =================
 case REGISTER_SUCCESS:
  return {
    ...state,
    isLoading: false,
    success: true,
    message: action.payload.message,
    pendingEmail: action.payload.pendingEmail, 
  };
    case REGISTER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // ================= LOGIN =================
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        success: true,
        user: action.payload,
        jwt: action.payload.jwt,
      };

    case LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // ================= USER =================
    case GET_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isLoading: false,
      };

    case GET_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // ================= USERS =================
    case GET_ALL_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
        isLoading: false,
      };

    case GET_ALL_USERS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // ================= UPDATE =================
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isLoading: false,
      };

    case UPDATE_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // ================= DELETE =================
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.filter((u) => u._id !== action.payload),
        isLoading: false,
      };

    case DELETE_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // ================= OTP FLOW =================
    case SEND_OTP_REQUEST:
    case VERIFY_OTP_REQUEST:
    case RESEND_OTP_REQUEST:
    case VERIFY_EMAIL_REQUEST:
    case FORGOT_PASSWORD_REQUEST:
    case RESET_PASSWORD_REQUEST:
    case GOOGLE_LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
        message: null,
      };

    case SEND_OTP_SUCCESS:
    case RESEND_OTP_SUCCESS:
    case VERIFY_EMAIL_SUCCESS:
    case FORGOT_PASSWORD_SUCCESS:
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        success: true,
        message: action.payload,
      };

    case VERIFY_OTP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        otpVerified: true,
        message: action.payload,
      };

    case VERIFY_OTP_FAILURE:
    case SEND_OTP_FAILURE:
    case RESEND_OTP_FAILURE:
    case VERIFY_EMAIL_FAILURE:
    case FORGOT_PASSWORD_FAILURE:
    case RESET_PASSWORD_FAILURE:
    case GOOGLE_LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // ================= GOOGLE =================
    case GOOGLE_LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        success: true,
        user: action.payload,
        jwt: action.payload.jwt,
        message: "Google login successful",
      };

    // ================= AVATAR =================
    case UPDATE_AVATAR_SUCCESS:
      return {
        ...state,
        avatar: action.payload,
        isLoading: false,
      };

    case UPDATE_AVATAR_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // ================= LOGOUT =================
    case LOGOUT_SUCCESS:
      return {
        ...initialState,
      };

    case "CLEAR_AUTH_MESSAGE":
      return {
        ...state,
        message: null,
        error: null,
      };

    default:
      return state;
  }
};