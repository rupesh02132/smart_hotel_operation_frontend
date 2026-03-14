import {
    CREATE_PAYMENT_REQUEST,
    CREATE_PAYMENT_SUCCESS,
    CREATE_PAYMENT_FAILURE,
    UPDATE_PAYMENT_REQUEST,
    UPDATE_PAYMENT_SUCCESS,
    UPDATE_PAYMENT_FAILURE,
      HOST_EARNINGS_REQUEST,
  HOST_EARNINGS_SUCCESS,
  HOST_EARNINGS_FAIL,
    RAZORPAY_REDIRECT_REQUEST,
    RAZORPAY_REDIRECT_SUCCESS,
    RAZORPAY_REDIRECT_FAIL,
    RAZORPAY_REDIRECT_RESET,
  } from "./ActionType";
  
  const initialState = {
 loading: false,
  earnings: 0,
  totalBookings: 0,
  error: null,

    create: {
      loading: false,
      data: null,
      error: null,
    },
    paymentLink: null,
    jwt: localStorage.getItem("jwt") || null,
    update: {
      loading: false,
      data: null,
      error: null,
    },
  };
  
  const paymentReducer = (state = initialState, action) => {
    switch (action.type) {
      // Create Payment
      case CREATE_PAYMENT_REQUEST:
        return {
          ...state,
          create: {
            ...state.create,
            loading: true,
            error: null,
          },
          paymentLink: null,
        };
      case CREATE_PAYMENT_SUCCESS:
        return {
          ...state,
          create: {
            loading: false,
            data: action.payload,
            error: null,
          },
          paymentLink: action.payload,
        };
      case CREATE_PAYMENT_FAILURE:
        return {
          ...state,
          create: {
            loading: false,
            data: null,
            error: action.payload,
          },
        };
  
      // Update Payment
      case UPDATE_PAYMENT_REQUEST:
        return {
          ...state,
          update: {
            ...state.update,
            loading: true,
            error: null,
          },
        };
      case UPDATE_PAYMENT_SUCCESS:
        return {
          ...state,
          update: {
            loading: false,
            data: action.payload,
            error: null,
          },
        };
      case UPDATE_PAYMENT_FAILURE:
        return {
          ...state,
          update: {
            loading: false,
            data: null,
            error: action.payload,
          },
        };

            case HOST_EARNINGS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case HOST_EARNINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        earnings: action.payload.totalEarnings,
        totalBookings: action.payload.totalBookings,
      };

    case HOST_EARNINGS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

       case RAZORPAY_REDIRECT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case RAZORPAY_REDIRECT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        data: action.payload,
      };

    case RAZORPAY_REDIRECT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case RAZORPAY_REDIRECT_RESET:
      return initialState;
  
      default:
        return state;
    }
  };
  
  export default paymentReducer;
  