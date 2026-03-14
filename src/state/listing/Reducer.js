import {
  CREATE_LISTING_REQUEST,
  CREATE_LISTING_SUCCESS,
  CREATE_LISTING_FAILURE,
  UPDATE_LISTING_REQUEST,
  UPDATE_LISTING_SUCCESS,
  UPDATE_LISTING_FAILURE,
  DELETE_LISTING_REQUEST,
  DELETE_LISTING_SUCCESS,
  DELETE_LISTING_FAILURE,
  FIND_LISTINGS_REQUEST,
  FIND_LISTINGS_SUCCESS,
  FIND_LISTINGS_FAILURE,
  GET_LISTING_REQUEST,
  GET_LISTING_SUCCESS,
  GET_LISTING_FAILURE,
  GET_LISTING_BY_ID_REQUEST,
  GET_LISTING_BY_ID_SUCCESS,
  GET_LISTING_BY_ID_FAILURE,
  GET_ALL_LISTINGS_REQUEST,
  GET_ALL_LISTINGS_SUCCESS,
  GET_ALL_LISTINGS_FAILURE,
  HOST_LISTINGS_REQUEST,
  HOST_LISTINGS_SUCCESS,
  HOST_LISTINGS_FAIL,
  
} from "./ActionType";

// src/redux/store/initialState.js
const initialState = {
  
  loading: false,
  error: null,
  success: false,

  // ---- Listings slice ----
  listings: {
    data: [],       
    loading: false, 
    error: null
  },
  listing:[],

  // ---- Auth slice ----
  auth: {
    user: null,     
    jwt: null,      
    isLoading: false,
    error: null
  }
};

export default initialState;


export const listingReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_LISTING_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case CREATE_LISTING_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        success: true,
        listing: action.payload,
      };
    case CREATE_LISTING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    case UPDATE_LISTING_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case UPDATE_LISTING_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        success: true,
        listing: action.payload,
      };
    case UPDATE_LISTING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };

    case DELETE_LISTING_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
   case DELETE_LISTING_SUCCESS:
  return {
    ...state,
    loading: false,
    success: true,
    listings:state.listings.filter((listing) => listing._id !== action.payload),
  };

    case DELETE_LISTING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    case FIND_LISTINGS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case FIND_LISTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        success: true,
        listing: action.payload,
      };
    case FIND_LISTINGS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
      case GET_LISTING_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      }
      case GET_LISTING_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        success: true,
        listing: action.payload,    
      }
      case GET_LISTING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      }


      case GET_LISTING_BY_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      }
      case GET_LISTING_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        success: true,
        listing: action.payload,
      }

      case GET_LISTING_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      }

      case GET_ALL_LISTINGS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      }
      case GET_ALL_LISTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        listings:action.payload,
        error: null,
        success: true,
        
      }
      case GET_ALL_LISTINGS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
      // ✅ HOST LISTINGS
case HOST_LISTINGS_REQUEST:
  return {
    ...state,
    listings: {
      ...state.listings,
      loading: true,
    },
  };

case HOST_LISTINGS_SUCCESS:
  return {
    ...state,
    listings: {
      data: action.payload,
      loading: false,
      error: null,
    },
  };

case HOST_LISTINGS_FAIL:
  return {
    ...state,
    listings: {
      ...state.listings,
      loading: false,
      error: action.payload,
    },
  };


    default:
      return state;
  }
};


