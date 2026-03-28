const initialState = {
  loading: false,
  notifications: [],
};

export const notificationReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "NOTI_REQUEST":
      return { ...state, loading: true };

    case "NOTI_SUCCESS":
      return {
        loading: false,
        notifications: action.payload,
      };

    case "NOTI_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n._id === action.payload
            ? { ...n, read: true }
            : n
        ),
      };

    case "NOTI_DELETE":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n._id !== action.payload
        ),
      };

    default:
      return state;
  }
};