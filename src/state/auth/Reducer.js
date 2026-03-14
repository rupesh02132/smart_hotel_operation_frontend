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
    RESEND_OTP_FAILURE
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


};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case GET_USER_REQUEST:
    case GET_ALL_USERS_REQUEST:
    case UPDATE_USER_REQUEST:
    case DELETE_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
        success: false,
      };

case REGISTER_SUCCESS:
  return {
    ...state,
    jwt: action.payload,
    isLoading: false,
    error: null,
    success: true,
     message: action.payload.message,
    pendingEmail: action.payload.pendingEmail, 
  };
    case LOGIN_SUCCESS:
      return {
        ...state,
        jwt: action.payload.jwt,
         user: action.payload,
        isLoading: false,
        error: null,
        success: true,
      };

    case GET_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        error: null,
      };

    case GET_ALL_USERS_SUCCESS:
      return {
        ...state,
    
        isLoading: false,
        error: null,
       users: action.payload,
      };

    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        error: null,
      };

    case DELETE_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        success: true,
        users: state.users.filter((user) => user._id !== action.payload),
      };

    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
    case GET_USER_FAILURE:
    case GET_ALL_USERS_FAILURE:
    case UPDATE_USER_FAILURE:
    case DELETE_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        success: false,
      };
// ================= AUTH EXTRA FLOWS =================

// Loading states
case VERIFY_EMAIL_REQUEST:
case FORGOT_PASSWORD_REQUEST:
case RESET_PASSWORD_REQUEST:
case SEND_OTP_REQUEST:
case VERIFY_OTP_REQUEST:
case GOOGLE_LOGIN_REQUEST:
case RESEND_OTP_REQUEST:
  return {
    ...state,
    isLoading: true,        // 🔥 use isLoading everywhere
    error: null,
    message: null,
  };

// Success states
case VERIFY_EMAIL_SUCCESS:
case FORGOT_PASSWORD_SUCCESS:
case RESET_PASSWORD_SUCCESS:
case SEND_OTP_SUCCESS:
case RESEND_OTP_SUCCESS:
  return {
    ...state,
    isLoading: false,
    success: true,
    message: action.payload,   // backend sends message string
  };

// OTP VERIFIED SUCCESS (IMPORTANT)
case VERIFY_OTP_SUCCESS:
  return {
    ...state,
    isLoading: false,
    otpVerified: true,         // 🔥 used for redirect after verify
    message: action.payload,  // "Email verified successfully"
  };

// Google login success
case GOOGLE_LOGIN_SUCCESS:
  return {
    ...state,
    isLoading: false,
    success: true,
    user: action.payload,
    jwt: action.payload.jwt,
    message: "Google login successful",
  };

// Failure states
case VERIFY_EMAIL_FAILURE:
case FORGOT_PASSWORD_FAILURE:
case RESET_PASSWORD_FAILURE:
case SEND_OTP_FAILURE:
case VERIFY_OTP_FAILURE:
case GOOGLE_LOGIN_FAILURE:
case RESEND_OTP_FAILURE:
  return {
    ...state,
    isLoading: false,
    error: action.payload,
  };


   case LOGOUT_SUCCESS:
  return {
    user: null,
    jwt: null,
    users: [],
    isLoading: false,
    error: null,
    success: false,
    otpVerified: false,   // 🔥 reset
    message: null,
  };
case "CLEAR_AUTH_MESSAGE":
  return {
    ...state,
    message: null,
    error: null,
  };

case UPDATE_AVATAR_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case UPDATE_AVATAR_SUCCESS:
      return {
        ...state,
        loading: false,
        avatar: action.payload,
      };

    case UPDATE_AVATAR_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
