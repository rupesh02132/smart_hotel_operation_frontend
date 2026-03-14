import {
  HOUSEKEEPING_TASKS_REQUEST,
  HOUSEKEEPING_TASKS_SUCCESS,
  HOUSEKEEPING_TASKS_FAIL,

  MARK_CLEANED_REQUEST,
  MARK_CLEANED_SUCCESS,
  MARK_CLEANED_FAIL,

  HOST_ROOM_STATUS_REQUEST,
  HOST_ROOM_STATUS_SUCCESS,
  HOST_ROOM_STATUS_FAIL,

  AVAILABILITY_REQUEST,
  AVAILABILITY_SUCCESS,
  AVAILABILITY_FAIL,
} from "./ActionType";

/* ============================
   ✅ INITIAL STATE (CLEAN)
============================ */
const initialState = {
  /* Staff Tasks */
  tasksLoading: false,
  tasks: [],
  tasksError: null,

  /* Clean Room */
  cleanLoading: false,
  cleanSuccess: false,
  cleanError: null,

  /* Host Room Status */
  roomsLoading: false,
  rooms: [],
  roomsError: null,

  /* Availability */
  availabilityLoading: false,
  availabilitySuccess: false,
  availabilityError: null,
  availabilityMessage: null,
};

/* ============================
   ✅ REDUCER
============================ */
export const housekeepingReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {

    /* ========= STAFF TASKS ========= */
    case HOUSEKEEPING_TASKS_REQUEST:
      return {
        ...state,
        tasksLoading: true,
        tasksError: null,
      };

    case HOUSEKEEPING_TASKS_SUCCESS:
      return {
        ...state,
        tasksLoading: false,
        tasks: action.payload,
      };

    case HOUSEKEEPING_TASKS_FAIL:
      return {
        ...state,
        tasksLoading: false,
        tasksError: action.payload,
      };

    /* ========= MARK CLEAN ========= */
    case MARK_CLEANED_REQUEST:
      return {
        ...state,
        cleanLoading: true,
        cleanSuccess: false,
        cleanError: null,
      };

    case MARK_CLEANED_SUCCESS:
      return {
        ...state,
        cleanLoading: false,
        cleanSuccess: true,
      };

    case MARK_CLEANED_FAIL:
      return {
        ...state,
        cleanLoading: false,
        cleanError: action.payload,
      };

    /* ========= HOST ROOM STATUS ========= */
    case HOST_ROOM_STATUS_REQUEST:
      return {
        ...state,
        roomsLoading: true,
        roomsError: null,
      };

    case HOST_ROOM_STATUS_SUCCESS:
      return {
        ...state,
        roomsLoading: false,
        rooms: action.payload,
      };

    case HOST_ROOM_STATUS_FAIL:
      return {
        ...state,
        roomsLoading: false,
        roomsError: action.payload,
      };

    /* ========= AVAILABILITY ========= */
    case AVAILABILITY_REQUEST:
      return {
        ...state,
        availabilityLoading: true,
        availabilitySuccess: false,
        availabilityError: null,
        availabilityMessage: null,
      };

    case AVAILABILITY_SUCCESS:
      return {
        ...state,
        availabilityLoading: false,
        availabilitySuccess: true,
        availabilityMessage: action.payload?.message,
      };

    case AVAILABILITY_FAIL:
      return {
        ...state,
        availabilityLoading: false,
        availabilityError: action.payload,
      };

    default:
      return state;
  }
};