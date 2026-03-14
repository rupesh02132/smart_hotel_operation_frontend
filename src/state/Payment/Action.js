import { api } from "../../Admin/config/apiConfig";
import {
  CREATE_PAYMENT_FAILURE,
  CREATE_PAYMENT_REQUEST,
  CREATE_PAYMENT_SUCCESS,
  UPDATE_PAYMENT_FAILURE,
  UPDATE_PAYMENT_REQUEST,
  UPDATE_PAYMENT_SUCCESS,
    HOST_EARNINGS_REQUEST,
  HOST_EARNINGS_SUCCESS,
  HOST_EARNINGS_FAIL,
   RAZORPAY_REDIRECT_REQUEST,
  RAZORPAY_REDIRECT_SUCCESS,
  RAZORPAY_REDIRECT_FAIL,
} from "./ActionType";

// Create Payment
export const createPayment = (bookingId) => async (dispatch, getState) => {
  dispatch({ type: CREATE_PAYMENT_REQUEST });

  try {
    const {
      auth: { jwt },
    } = getState();

    const { data } = await api.post(
      `/api/payment/booking/${bookingId}`,
      {},
      {
        headers: { Authorization: `Bearer ${jwt}` },
      },
    );

    dispatch({
      type: CREATE_PAYMENT_SUCCESS,
      payload: data,
    });

    // 🔥 Redirect to Razorpay
    window.location.href = data.data.paymentUrl;
  } catch (err) {
    dispatch({
      type: CREATE_PAYMENT_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
  }
};

// Update Payment
// updateBookingPayment Action (Fix URL params)
export const updateBookingPayment = (reqData) => async (dispatch) => {
  dispatch({ type: UPDATE_PAYMENT_REQUEST });

  try {
    const { payment_id, booking_id } = reqData;

    console.log("🔁 Updating payment with:", { payment_id, booking_id });

    const { data } = await api.get(
      `/api/payment/update?payment_id=${payment_id}&booking_id=${booking_id}`,
    );

    dispatch({ type: UPDATE_PAYMENT_SUCCESS, payload: data });

    console.log("✅ Payment updated:", data);
  } catch (error) {
    const errorMsg = error?.response?.data?.message || error.message;
    console.error("Payment update failed:", errorMsg);

    dispatch({
      type: UPDATE_PAYMENT_FAILURE,
      payload: errorMsg,
    });
  }
};


// ✅ GET Host Earnings Action
export const getHostEarningsAction = () => async (dispatch) => {
  try {
    dispatch({ type: HOST_EARNINGS_REQUEST });

    const { data } = await api.get("/api/payments/hostEarnings");

    dispatch({
      type: HOST_EARNINGS_SUCCESS,
      payload: data, // { totalEarnings, totalBookings }
    });
  } catch (error) {
    dispatch({
      type: HOST_EARNINGS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};



export const handleRazorpayRedirect =
  (bookingId) => async (dispatch) => {
    try {
      dispatch({ type: RAZORPAY_REDIRECT_REQUEST });

      const { data } = await api.get(
        `/api/webhook/razorpay/payment/${bookingId}`
      );

      dispatch({
        type: RAZORPAY_REDIRECT_SUCCESS,
        payload: data,
      });

    } catch (error) {
      dispatch({
        type: RAZORPAY_REDIRECT_FAIL,
        payload:
          error.response?.data?.message ||
          error.message,
      });
    }
  };