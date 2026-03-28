
import {
  CREATE_BOOKING_REQUEST,
  CREATE_BOOKING_SUCCESS,
  CREATE_BOOKING_FAILURE,
  GET_BOOKING_REQUEST,
  GET_BOOKING_SUCCESS,
  GET_BOOKING_FAILURE,
  GET_HOST_BOOKINGS_REQUEST,
  GET_HOST_BOOKINGS_SUCCESS,
  GET_HOST_BOOKINGS_FAILURE,
  GET_BOOKINGS_BY_ID_REQUEST,
  GET_BOOKINGS_BY_ID_SUCCESS,
  GET_BOOKINGS_BY_ID_FAILURE,
  GET_DELETE_BOOKING_REQUEST,
  GET_DELETE_BOOKING_SUCCESS,
  GET_DELETE_BOOKING_FAILURE,
  GET_ALL_BOOKINGS_REQUEST,
  GET_ALL_BOOKINGS_SUCCESS,
  GET_ALL_BOOKINGS_FAIL,
  GET_BOOKINGS_ID_REQUEST,
  GET_BOOKINGS_ID_SUCCESS,
  GET_BOOKINGS_ID_FAILURE,
  BOOKING_ACCEPT_REQUEST,
  BOOKING_ACCEPT_SUCCESS,
  BOOKING_ACCEPT_FAILURE,
  BOOKING_REJECT_REQUEST,
  BOOKING_REJECT_SUCCESS,
  BOOKING_REJECT_FAILURE,
  BOOKING_ASSIGN_ROOM_REQUEST,
  BOOKING_ASSIGN_ROOM_SUCCESS,
  BOOKING_ASSIGN_ROOM_FAILURE,
  BOOKING_MANUAL_CHECKIN_REQUEST,
  BOOKING_MANUAL_CHECKIN_SUCCESS,
  BOOKING_MANUAL_CHECKIN_FAILURE,
  BOOKING_MANUAL_CHECKOUT_REQUEST,
  BOOKING_MANUAL_CHECKOUT_SUCCESS,
  BOOKING_MANUAL_CHECKOUT_FAILURE,
} from "./ActionType";

const initialState = {
  booking: null,
  allBookings: [],
  loading: false,
  error: null,
  success: false,
  userBookings: [],
  hostBookings: [],
  bookingsByListing: [],
  jwt: localStorage.getItem("jwt") || null,
};

export const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    // Create Booking
    case CREATE_BOOKING_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };

    case CREATE_BOOKING_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        booking: action.payload,
      };

    case CREATE_BOOKING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };

    // Get User Bookings
    case GET_BOOKING_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };

    case GET_BOOKING_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        userBookings: action.payload,
        booking: action.payload,
      };

    case GET_BOOKING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };

    // Get Host Bookings
    case GET_HOST_BOOKINGS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };

    case GET_HOST_BOOKINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        success: true,
        hostBookings: action.payload,
      };

    case GET_HOST_BOOKINGS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };

    case GET_BOOKINGS_BY_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };

    case GET_BOOKINGS_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        booking: action.payload,
        error: null,
        success: true,
      };

    case GET_BOOKINGS_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };

    case GET_DELETE_BOOKING_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_DELETE_BOOKING_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        allBookings: state.allBookings.filter(
          (booking) => booking._id !== action.payload,
        ),
      };
    case GET_DELETE_BOOKING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // for all booking..
    case GET_ALL_BOOKINGS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_ALL_BOOKINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        allBookings: action.payload,
      };

    case GET_ALL_BOOKINGS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_BOOKINGS_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_BOOKINGS_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        booking: action.payload,
      };

    case GET_BOOKINGS_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    /* ===== ACCEPT ===== */
    case BOOKING_ACCEPT_REQUEST:
    case BOOKING_REJECT_REQUEST:
    case BOOKING_ASSIGN_ROOM_REQUEST:
    case BOOKING_MANUAL_CHECKIN_REQUEST:
    case BOOKING_MANUAL_CHECKOUT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case BOOKING_ACCEPT_SUCCESS:
    case BOOKING_REJECT_SUCCESS:
    case BOOKING_ASSIGN_ROOM_SUCCESS:
    case BOOKING_MANUAL_CHECKIN_SUCCESS:
    case BOOKING_MANUAL_CHECKOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
      };

    case BOOKING_ACCEPT_FAILURE:
    case BOOKING_REJECT_FAILURE:
    case BOOKING_ASSIGN_ROOM_FAILURE:
    case BOOKING_MANUAL_CHECKIN_FAILURE:
    case BOOKING_MANUAL_CHECKOUT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
