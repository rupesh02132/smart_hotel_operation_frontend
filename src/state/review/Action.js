import { api } from "../../Admin/config/apiConfig.js";

import {
  CREATE_REVIEW_FAILURE,
  CREATE_REVIEW_REQUEST,
  CREATE_REVIEW_SUCCESS,
  DELETE_REVIEW_SUCCESS,
  GET_REVIEW_FAILURE,
  GET_REVIEW_REQUEST,
  GET_REVIEW_SUCCESS,
  GEt_ALL_REVIEWS_REQUEST,
  GEt_ALL_REVIEWS_SUCCESS,
  GEt_ALL_REVIEWS_FAILURE,
  DELETE_REVIEW_FAILURE,
  DELETE_REVIEW_REQUEST,
} from "./ActionType";

export const createReview = (review) => async (dispatch) => {
  dispatch({ type: CREATE_REVIEW_REQUEST });
  try {
    const { data } = await api.post("/api/reviews/create", review);
    dispatch({ type: CREATE_REVIEW_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CREATE_REVIEW_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getReview = (id) => async (dispatch) => {
  dispatch({ type: GET_REVIEW_REQUEST, payload: null });
  try {
    const { data } = await api.get(`/api/reviews/${id}`);
    dispatch({ type: GET_REVIEW_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: GET_REVIEW_FAILURE, payload: error.message });
  }
};

export const getAllReviews = () => async (dispatch) => {
  dispatch({ type: GEt_ALL_REVIEWS_REQUEST });
  try {
    const { data } = await api.get("/api/reviews");
    dispatch({ type: GEt_ALL_REVIEWS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GEt_ALL_REVIEWS_FAILURE, payload: error.message });
  }
};

export const deleteReview = (id) => async (dispatch) => {
  console.log("Deleting review with ID.:", id);
  dispatch({ type: DELETE_REVIEW_REQUEST });
  try {
    await api.delete(`/api/reviews/${id}/delete`);
    dispatch({ type: DELETE_REVIEW_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: DELETE_REVIEW_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
