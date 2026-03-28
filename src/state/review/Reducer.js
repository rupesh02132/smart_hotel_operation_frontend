import {
  CREATE_REVIEW_REQUEST,
  CREATE_REVIEW_SUCCESS,
  CREATE_REVIEW_FAIL,
  GET_LISTING_REVIEWS_REQUEST,
  GET_LISTING_REVIEWS_SUCCESS,
  GET_LISTING_REVIEWS_FAIL,
  GET_ALL_REVIEWS_REQUEST,
  GET_ALL_REVIEWS_SUCCESS,
  GET_ALL_REVIEWS_FAIL,
  DELETE_REVIEW_SUCCESS,
  RESPOND_REVIEW_SUCCESS,
} from "./ActionType";

const initialState = {
  loading: false,
  error: null,
  success: false,
  reviews: [],
  adminReviews: [],
};

export const reviewReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    /* ⭐ REQUEST */
    case CREATE_REVIEW_REQUEST:
    case GET_LISTING_REVIEWS_REQUEST:
    case GET_ALL_REVIEWS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };

    /* ⭐ CREATE SUCCESS */
    case CREATE_REVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        reviews: [action.payload, ...state.reviews],
      };

    /* ⭐ LISTING REVIEWS */
    case GET_LISTING_REVIEWS_SUCCESS:
      return {
        ...state,
        loading: false,
        reviews: action.payload,
      };

    /* ⭐ ADMIN REVIEWS */
    case GET_ALL_REVIEWS_SUCCESS:
      return {
        ...state,
        loading: false,
        adminReviews: action.payload,
      };

    /* ⭐ DELETE */
    case DELETE_REVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        reviews: state.reviews.filter(
          (r) => r._id !== action.payload
        ),
        adminReviews: state.adminReviews.filter(
          (r) => r._id !== action.payload
        ),
      };

    /* ⭐ RESPOND */
    case RESPOND_REVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        adminReviews: state.adminReviews.map((r) =>
          r._id === action.payload._id
            ? action.payload
            : r
        ),
      };

    /* ⭐ FAIL */
    case CREATE_REVIEW_FAIL:
    case GET_LISTING_REVIEWS_FAIL:
    case GET_ALL_REVIEWS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    /* ⭐ RESET */
    case "REVIEW_RESET":
      return {
        ...state,
        success: false,
      };

    default:
      return state;
  }
};