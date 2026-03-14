import { api } from "../../Admin/config/apiConfig";

import {
  CREATE_LISTING_FAILURE,
  CREATE_LISTING_REQUEST,
  CREATE_LISTING_SUCCESS,
} from "./ActionType";
import {
  DELETE_LISTING_FAILURE,
  DELETE_LISTING_REQUEST,
  DELETE_LISTING_SUCCESS,
} from "./ActionType";
import {
  FIND_LISTINGS_FAILURE,
  FIND_LISTINGS_REQUEST,
  FIND_LISTINGS_SUCCESS,
} from "./ActionType";

import {
  GET_LISTING_FAILURE,
  GET_LISTING_REQUEST,
  GET_LISTING_SUCCESS,
} from "./ActionType";
import {
  UPDATE_LISTING_FAILURE,
  UPDATE_LISTING_REQUEST,
  UPDATE_LISTING_SUCCESS,
} from "./ActionType";
import {
  GET_LISTING_BY_ID_FAILURE,
  GET_LISTING_BY_ID_REQUEST,
  GET_LISTING_BY_ID_SUCCESS,
} from "./ActionType";
import { API_BASE_URL } from "../../Admin/config/apiConfig";
import {
  GET_ALL_LISTINGS_FAILURE,

  GET_ALL_LISTINGS_REQUEST,
  GET_ALL_LISTINGS_SUCCESS,
  HOST_LISTINGS_REQUEST,
  HOST_LISTINGS_SUCCESS,
  HOST_LISTINGS_FAIL,
    MY_LISTINGS_REQUEST,
  MY_LISTINGS_SUCCESS,
  MY_LISTINGS_FAIL,

} from "./ActionType";

// export const findListing = (query) => async (dispatch) => {

//   dispatch({ type: FIND_LISTINGS_REQUEST });
//   console.log("query..", query);

//   try {
//     const {city, skip, limit} = query;
//        const url = `${API_BASE_URL}/api/listings?city=${city||""}&skip=${skip||""}&limit=${limit||""}`;

//     // const url = `${API_BASE_URL}/api/listings?category=${category||""}&city=${city||""}&guests=${guests||""}`;
//     const response = await api.get(url);

//     dispatch({ type: FIND_LISTINGS_SUCCESS, payload: response.data });
//     console.log("response", response);
//   } catch (error) {
//     const errorMessage = error.response?.data?.message || error.message;
//     dispatch({ type: FIND_LISTINGS_FAILURE, payload: errorMessage });
//   }
// };

export const findListing = (query) => async (dispatch) => {
  dispatch({ type: FIND_LISTINGS_REQUEST });

  try {
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value);
      }
    });

    const url = `${API_BASE_URL}/api/listings?${params.toString()}`;
    const response = await api.get(url);

    dispatch({ type: FIND_LISTINGS_SUCCESS, payload: response.data });
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;

    dispatch({
      type: FIND_LISTINGS_FAILURE,
      payload: errorMessage,
    });
  }
};

export const createListing = (listing) => async (dispatch) => {
  console.log("Sending listing:", listing);
  console.log("JWT", localStorage.getItem("jwt"));

  dispatch({ type: CREATE_LISTING_REQUEST });

  try {
    const { data } = await api.post("/api/listings/create", listing, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    dispatch({ type: CREATE_LISTING_SUCCESS, payload: data });
    console.log("create listing data", data);
  } catch (error) {
    dispatch({
      type: CREATE_LISTING_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const updateListing = (listing) => async (dispatch) => {
  console.log("Sending listing:", listing);
  dispatch({ type: UPDATE_LISTING_REQUEST, payload: null });
  try {
    const { data } = await api.put(
      `/api/listings/${listing.id}/update`,
      listing.listingData,
    );
    dispatch({ type: UPDATE_LISTING_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: UPDATE_LISTING_FAILURE, payload: error.message });
  }
};

export const deleteListing = (listingId) => async (dispatch) => {
  dispatch({ type: DELETE_LISTING_REQUEST, payload: null });
  try {
    await api.delete(`/api/listings/${listingId}/delete`);
    dispatch({ type: DELETE_LISTING_SUCCESS, payload: listingId });
  } catch (error) {
    dispatch({ type: DELETE_LISTING_FAILURE, payload: error.message });
  }
};

export const listListingDetails = (listingId) => async (dispatch) => {
  dispatch({ type: GET_LISTING_REQUEST, payload: null });
  try {
    const { data } = await api.get(`/api/listings/${listingId}`);
    dispatch({ type: GET_LISTING_SUCCESS, payload: data });
    console.log("lisiting by id", data);
  } catch (error) {
    dispatch({ type: GET_LISTING_FAILURE, payload: error.message });
  }
};

export const getListingById = (listingId) => async (dispatch) => {
  console.log("listing", listingId);
  dispatch({ type: GET_LISTING_BY_ID_REQUEST });

  try {
    const { data } = await api.get(`/api/listings/${listingId}`);
    dispatch({ type: GET_LISTING_BY_ID_SUCCESS, payload: data });
    console.log("lisiting by id", data);
  } catch (error) {
    dispatch({ type: GET_LISTING_BY_ID_FAILURE, payload: error.message });
  }
};

export const getAllListings = () => async (dispatch) => {
  dispatch({ type: GET_ALL_LISTINGS_REQUEST, payload: null });
  try {
    const { data } = await api.get(`/api/listings/all`);
    dispatch({ type: GET_ALL_LISTINGS_SUCCESS, payload: data });
    console.log("all listings", data);
  } catch (error) {
    dispatch({ type: GET_ALL_LISTINGS_FAILURE, payload: error.message });
  }
};



export const getHostListingsAction = () => async (dispatch) => {
  try {
    dispatch({ type: HOST_LISTINGS_REQUEST });

    const { data } = await api.get("/api/listings/host/my-listings");

    dispatch({
      type: HOST_LISTINGS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: HOST_LISTINGS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getMyListingsAction = () => async (dispatch) => {
  try {
    dispatch({ type: MY_LISTINGS_REQUEST });

    const { data } = await api.get("/api/listings/my-listings");

    dispatch({
      type: MY_LISTINGS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MY_LISTINGS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};


