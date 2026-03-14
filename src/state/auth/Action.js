import { api } from "../../Admin/config/apiConfig";

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
  UPDATE_AVATAR_REQUEST,
  UPDATE_AVATAR_SUCCESS,
  UPDATE_AVATAR_FAILURE,
} from "./ActionType";

export const clearAuthMessage = () => ({
  type: "CLEAR_AUTH_MESSAGE",
});

// Register Actions
export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });

  try {
    const { data } = await api.post("/api/auth/signup", userData);

    // 🔥 Persist OTP flow state
    localStorage.setItem("pendingOtpVerification", "true");
    localStorage.setItem("otpEmail", userData.email);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: {
        message: data.message,
        pendingEmail: userData.email, // still keep Redux copy if needed
      },
    });
  } catch (error) {
    dispatch({
      type: REGISTER_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Login Actions
const loginRequest = () => ({ type: LOGIN_REQUEST });
const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error });
const loginSuccess = (jwt, user) => ({
  type: LOGIN_SUCCESS,
  payload: { jwt, user },
});

export const login = (userData) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const { data } = await api.post("/api/auth/login", userData);
    const { jwt, user } = data;

    localStorage.setItem("jwt", jwt);
    localStorage.setItem("user", JSON.stringify(user));

    dispatch(loginSuccess(jwt, user));
    dispatch(getUser(jwt, user));
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    dispatch(loginFailure(msg));
  }
};

// Get User Actions
const getUserRequest = () => ({ type: GET_USER_REQUEST });
const getUserSuccess = (user) => ({ type: GET_USER_SUCCESS, payload: user });
const getUserFailure = (error) => ({ type: GET_USER_FAILURE, payload: error });

export const getUser = () => async (dispatch) => {
  dispatch(getUserRequest());
  try {
    const { data } = await api.get("/api/auth/profile");
    dispatch(getUserSuccess(data));
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    dispatch(getUserFailure(msg));
  }
};
// Get All Users Action

export const getAllUser = () => async (dispatch) => {
  dispatch({ type: GET_ALL_USERS_REQUEST });
  try {
    const response = await api.get("/api/auth/users");
    dispatch({ type: GET_ALL_USERS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_ALL_USERS_FAILURE, payload: error.message });
  }
};

// Logout Action
export const logout = () => (dispatch) => {
  localStorage.removeItem("jwt");
  dispatch({ type: LOGOUT_SUCCESS, payload: null });
  localStorage.clear();
};

export const updateUserProfile = (user) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const response = await api.put(`api/auth/updateProfile`, user);
    const updatedUser = response.data;
    dispatch({ type: UPDATE_USER_SUCCESS, payload: updatedUser });
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({ type: UPDATE_USER_FAILURE, payload: errorMessage });
  }
};

export const deleteUser = (userId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });

    await api.delete(`/api/auth/${userId}`);

    dispatch({
      type: DELETE_USER_SUCCESS,
      payload: userId,
    });
  } catch (error) {
    dispatch({
      type: DELETE_USER_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
  dispatch({ type: FORGOT_PASSWORD_REQUEST });
  try {
    const { data } = await api.post("/api/auth/forgot-password", { email });
    dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data.message });
  } catch (error) {
    dispatch({
      type: FORGOT_PASSWORD_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Reset Password
export const resetPassword = (token, password) => async (dispatch) => {
  dispatch({ type: RESET_PASSWORD_REQUEST });
  try {
    const { data } = await api.post(`/api/auth/reset-password/${token}`, {
      password,
    });
    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.message });
  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Send OTP
export const sendOtp = (phone) => async (dispatch) => {
  dispatch({ type: SEND_OTP_REQUEST });
  try {
    const { data } = await api.post("/api/auth/send-otp", { phone });
    dispatch({ type: SEND_OTP_SUCCESS, payload: data.message });
  } catch (error) {
    dispatch({
      type: SEND_OTP_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Verify OTP
export const verifyOtp =
  ({ email, otp }) =>
  async (dispatch) => {
    dispatch({ type: VERIFY_OTP_REQUEST });

    try {
      const { data } = await api.post("/api/auth/verify-otp", {
        email,
        otp,
      });

      // 🔥 Clear OTP flow state
      localStorage.removeItem("pendingOtpVerification");
      localStorage.removeItem("otpEmail");

      dispatch({
        type: VERIFY_OTP_SUCCESS,
        payload: data.message, // "Email verified successfully"
      });
    } catch (error) {
      dispatch({
        type: VERIFY_OTP_FAILURE,
        payload: error.response?.data?.message || "OTP verification failed",
      });
    }
  };

export const resendEmailOtp =
  ({ email }) =>
  async (dispatch) => {
    dispatch({ type: RESEND_OTP_REQUEST });

    try {
      const { data } = await api.post("/api/auth/resend-otp", { email });

      dispatch({
        type: RESEND_OTP_SUCCESS,
        payload: data.message, // "OTP resent successfully"
      });
    } catch (error) {
      dispatch({
        type: RESEND_OTP_FAILURE,
        payload: error.response?.data?.message || "Failed to resend OTP",
      });
    }
  };

export const googleLogin = (token) => async (dispatch) => {
  dispatch({ type: GOOGLE_LOGIN_REQUEST });
  try {
    const { data } = await api.post("/api/auth/google-login", { token });

    dispatch({
      type: GOOGLE_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("jwt", data.jwt);
  } catch (error) {
    dispatch({
      type: GOOGLE_LOGIN_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};


export const updateAvatar =
  (file) => async (dispatch) => {
    try {
      dispatch({
        type: UPDATE_AVATAR_REQUEST,
      });

      const formData = new FormData();
      formData.append("avatar", file);

      const { data } = await api.put(
        "/api/auth/avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch({
        type: UPDATE_AVATAR_SUCCESS,
        payload: data.avatar,
      });

    } catch (error) {

      dispatch({
        type: UPDATE_AVATAR_FAILURE,
        payload:
          error.response?.data?.message ||
          error.message,
      });

    }
  };