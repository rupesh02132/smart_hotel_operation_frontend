import { api } from "../../Admin/config/apiConfig";

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
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
  RESPOND_REVIEW_REQUEST,
  RESPOND_REVIEW_SUCCESS,
  RESPOND_REVIEW_FAIL,
} from "./ActionType";

/* ⭐ CREATE REVIEW */
export const createReview = (review) => async (dispatch) => {
  dispatch({ type: CREATE_REVIEW_REQUEST });

  try {
    const { data } = await api.post("/api/reviews", review);

    dispatch({
      type: CREATE_REVIEW_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: CREATE_REVIEW_FAIL,
      payload: err.message,
    });
  }
};

/* ⭐ GET LISTING REVIEWS */
export const getListingReviews = (id) => async (dispatch) => {
  dispatch({ type: GET_LISTING_REVIEWS_REQUEST });

  try {
    const { data } = await api.get(
      `/api/reviews/listing/${id}`
    );

    dispatch({
      type: GET_LISTING_REVIEWS_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: GET_LISTING_REVIEWS_FAIL,
      payload: err.message,
    });
  }
};

/* ⭐ ADMIN GET ALL */
export const getAllReviews = () => async (dispatch) => {
  dispatch({ type: GET_ALL_REVIEWS_REQUEST });

  try {
    const { data } = await api.get("/api/reviews");

    dispatch({
      type: GET_ALL_REVIEWS_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: GET_ALL_REVIEWS_FAIL,
      payload: err.message,
    });
  }
};

/* ⭐ DELETE */
export const deleteReview = (id) => async (dispatch) => {
  dispatch({ type: DELETE_REVIEW_REQUEST });

  try {
    await api.delete(`/api/reviews/${id}`);

    dispatch({
      type: DELETE_REVIEW_SUCCESS,
      payload: id,
    });
  } catch (err) {
    dispatch({
      type: DELETE_REVIEW_FAIL,
      payload: err.message,
    });
  }
};

/* ⭐ RESPOND */
export const respondToReview =
  (id, response) => async (dispatch) => {
    dispatch({ type: RESPOND_REVIEW_REQUEST });

    try {
      const { data } = await api.post(
        `/api/reviews/${id}/respond`,
        { response }
      );

      dispatch({
        type: RESPOND_REVIEW_SUCCESS,
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: RESPOND_REVIEW_FAIL,
        payload: err.message,
      });
    }
  };