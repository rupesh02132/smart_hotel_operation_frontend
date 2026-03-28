import { api } from "../../Admin/config/apiConfig";

export const getMyNotifications = () => async (dispatch) => {
  dispatch({ type: "NOTI_REQUEST" });

  try {
    const res = await api.get("/api/notifications/my");

    dispatch({
      type: "NOTI_SUCCESS",
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: "NOTI_FAIL",
      payload: err.message,
    });
  }
};

export const markNotificationRead = (id) => async (dispatch) => {
  await api.put(`/api/notifications/${id}/read`);

  dispatch({
    type: "NOTI_READ",
    payload: id,
  });
};

export const deleteNotification = (id) => async (dispatch) => {
  await api.delete(`/api/notifications/${id}`);

  dispatch({
    type: "NOTI_DELETE",
    payload: id,
  });
};