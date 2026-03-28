import { api } from "../../Admin/config/apiConfig";
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

/* =====================================================
   GENERATE QR (ADMIN / STAFF)
===================================================== */
export const generateQr =
  (bookingId, typeInput = "checkin") =>
  async (dispatch) => {
    try {
      dispatch({ type: QR_GENERATE_REQUEST });

      /* =========================
         NORMALIZE TYPE
      ========================== */

      let type = typeInput;

      // if object passed → extract
      if (typeof typeInput === "object") {
        type = typeInput.type;
      }

      // safety lowercase
      type = String(type).toLowerCase();

      if (!["checkin", "checkout"].includes(type)) {
        throw new Error("Invalid QR type sent from UI");
      }

      const { data } = await api.post(
        `/api/qr/generate/${bookingId}`,
        { type }
      );

      dispatch({
        type: QR_GENERATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: QR_GENERATE_FAIL,
        payload:
          error.response?.data?.message ||
          error.message,
      });
    }
  };


export const verifyQr = (token) => async (dispatch) => {
  try {
    dispatch({ type: QR_VERIFY_REQUEST });

    const { data } = await api.post(
      `/api/qr/verify/${token}`
    );

    dispatch({
      type: QR_VERIFY_SUCCESS,
      payload: data.message,
    });

  } catch (error) {
    dispatch({
      type: QR_VERIFY_FAIL,
      payload:
        error.response?.data?.message ||
        error.message,
    });
  }
};
/* Optional: Clear QR */
export const clearQr = () => ({
  type: QR_GENERATE_RESET,
});




/* =========================================
   SELF CHECK-IN
========================================= */
export const selfCheckIn = (token) => async (dispatch) => {
  try {
    dispatch({ type: SELF_CHECKIN_REQUEST });

    const { data } = await api.put(
      `/api/qr/self-checkin/${token}`
    );

    dispatch({
      type: SELF_CHECKIN_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: SELF_CHECKIN_FAIL,
      payload:
        error.response?.data?.message ||
        error.message,
    });
  }
};


/* =========================================
   SELF CHECK-OUT
========================================= */
export const selfCheckOut = (token) => async (dispatch) => {
  try {
    dispatch({ type: SELF_CHECKOUT_REQUEST });

    const { data } = await api.put(
      `/api/qr/self-checkout/${token}`
    );

    dispatch({
      type: SELF_CHECKOUT_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: SELF_CHECKOUT_FAIL,
      payload:
        error.response?.data?.message ||
        error.message,
    });
  }
};


/* =========================================
   CLEAR STATE
========================================= */
export const clearSelfCheck = () => ({
  type: SELF_CHECK_CLEAR,
});