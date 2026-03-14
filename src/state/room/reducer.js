import * as types from "./ActionType";

const initialState = {
  rooms: [],
  room: null,
  loading: false,
  error: null,
  success: false,
};

export const roomReducer = (state = initialState, action) => {
  switch (action.type) {
    /* ======================
       CREATE ROOM
    ====================== */
    case types.CREATE_ROOM_REQUEST:
      return { ...state, loading: true };

    case types.CREATE_ROOM_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        rooms: [action.payload, ...state.rooms],
      };

    case types.CREATE_ROOM_FAILURE:
      return { ...state, loading: false, error: action.payload };

    /* ======================
       GET ALL ROOMS
    ====================== */
    case types.GET_ALL_ROOMS_REQUEST:
      return { ...state, loading: true };

    case types.GET_ALL_ROOMS_SUCCESS:
      return {
        ...state,
        loading: false,
        rooms: action.payload,
      };

    case types.GET_ALL_ROOMS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    /* ======================
       GET ROOMS BY HOTEL
    ====================== */
    case types.GET_ROOMS_BY_HOTEL_REQUEST:
      return { ...state, loading: true };

    case types.GET_ROOMS_BY_HOTEL_SUCCESS:
      return {
        ...state,
        loading: false,
        rooms: action.payload,
      };

    case types.GET_ROOMS_BY_HOTEL_FAILURE:
      return { ...state, loading: false, error: action.payload };

    /* ======================
       GET ROOM BY ID
    ====================== */
    case types.GET_ROOM_BY_ID_REQUEST:
      return { ...state, loading: true };

    case types.GET_ROOM_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        room: action.payload,
      };

    case types.GET_ROOM_BY_ID_FAILURE:
      return { ...state, loading: false, error: action.payload };

    /* ======================
       UPDATE ROOM
    ====================== */
    case types.UPDATE_ROOM_REQUEST:
      return { ...state, loading: true };

    case types.UPDATE_ROOM_SUCCESS:
      return {
        ...state,
        loading: false,
        rooms: state.rooms.map((r) =>
          r._id === action.payload._id ? action.payload : r
        ),
      };

    case types.UPDATE_ROOM_FAILURE:
      return { ...state, loading: false, error: action.payload };

    /* ======================
       DELETE ROOM
    ====================== */
    case types.DELETE_ROOM_REQUEST:
      return { ...state, loading: true };

    case types.DELETE_ROOM_SUCCESS:
      return {
        ...state,
        loading: false,
        rooms: state.rooms.filter((r) => r._id !== action.payload),
      };

    case types.DELETE_ROOM_FAILURE:
      return { ...state, loading: false, error: action.payload };

    /* ======================
       STAFF CLEAN ROOM
    ====================== */
    case types.CLEAN_ROOM_SUCCESS:
      return {
        ...state,
        rooms: state.rooms.map((r) =>
          r._id === action.payload._id ? action.payload : r
        ),
      };


       case types.ROOM_SEARCH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.ROOM_SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        rooms: action.payload,
      };

    case types.ROOM_SEARCH_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

      case types.ROOM_UPDATE_STATUS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };

      case types.ROOM_UPDATE_STATUS_SUCCESS:
        return {
          ...state,
          loading: false,
          rooms: state.rooms.map((r) =>
            r._id === action.payload._id ? action.payload : r
          ),
        };

      case types.ROOM_UPDATE_STATUS_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };

    default:
      return state;
  }
};
