
import { api } from "../../Admin/config/apiConfig";
import * as types from "./ActionType";




export const searchRooms = (filters) => async (dispatch) => {
  try {
    dispatch({ type: types.ROOM_SEARCH_REQUEST });

    const queryParams = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      // Skip empty / null / undefined
      if (
        value === "" ||
        value === null ||
        value === undefined ||
        value === false
      ) {
        return;
      }

      // Handle array (amenities)
      if (Array.isArray(value)) {
        value.forEach((item) => {
          queryParams.append(key, item);
        });
      } else {
        queryParams.append(key, value);
      }
    });

    const { data } = await api.get(
      `/api/rooms/search?${queryParams.toString()}`
    );

    dispatch({
      type: types.ROOM_SEARCH_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: types.ROOM_SEARCH_FAIL,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Room search failed",
    });
  }
};
/* ======================================================
   CREATE ROOM
====================================================== */
export const createRoom = (formData) => async (dispatch) => {
  try {
    dispatch({ type: types.CREATE_ROOM_REQUEST });

    const { data } = await api.post("/api/rooms/createroom", formData);

    dispatch({
      type: types.CREATE_ROOM_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: types.CREATE_ROOM_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* ======================================================
   GET ALL ROOMS
====================================================== */
export const getAllRooms = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_ALL_ROOMS_REQUEST });

    const { data } = await api.get("/api/rooms");

    dispatch({
      type: types.GET_ALL_ROOMS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_ALL_ROOMS_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* ======================================================
   GET ROOMS BY HOTEL
====================================================== */
export const getRoomsByHotel = (hotelId) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_ROOMS_BY_HOTEL_REQUEST });

    const { data } = await api.get(`/api/rooms/hotel/${hotelId}`);

    dispatch({
      type: types.GET_ROOMS_BY_HOTEL_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_ROOMS_BY_HOTEL_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* ======================================================
   GET ROOM BY ID
====================================================== */
export const getRoomById = (id) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_ROOM_BY_ID_REQUEST });

    const { data } = await api.get(`/api/rooms/${id}`);

    dispatch({
      type: types.GET_ROOM_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_ROOM_BY_ID_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* ======================================================
   UPDATE ROOM
====================================================== */
export const updateRoom = (id, formData) => async (dispatch) => {
  try {
    dispatch({ type: types.UPDATE_ROOM_REQUEST });

    const { data } = await api.put(`/api/rooms/${id}`, formData);

    dispatch({
      type: types.UPDATE_ROOM_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: types.UPDATE_ROOM_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* ======================================================
   DELETE ROOM
====================================================== */
export const deleteRoom = (id) => async (dispatch) => {
  try {
    dispatch({ type: types.DELETE_ROOM_REQUEST });

    await api.delete(`/api/rooms/${id}`);

    dispatch({
      type: types.DELETE_ROOM_SUCCESS,
      payload: id,
    });
  } catch (error) {
    dispatch({
      type: types.DELETE_ROOM_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* ======================================================
   STAFF MARK ROOM CLEANED
====================================================== */
export const markRoomCleaned = (roomId) => async (dispatch) => {
  try {
    dispatch({ type: types.CLEAN_ROOM_REQUEST });

    const { data } = await api.put(`/api/rooms/clean/${roomId}`);

    dispatch({
      type: types.CLEAN_ROOM_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: types.CLEAN_ROOM_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const updateRoomStatus = (roomId, status) => async (dispatch) => {
  try {
    dispatch({ type: types.ROOM_UPDATE_STATUS_REQUEST });

    const { data } = await api.put(`/api/rooms/${roomId}/status`, { status });

    dispatch({
      type: types.ROOM_UPDATE_STATUS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: types.ROOM_UPDATE_STATUS_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};