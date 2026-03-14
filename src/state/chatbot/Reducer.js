import {
  CHATBOT_ADD_USER_MESSAGE,
  CHATBOT_REQUEST,
  CHATBOT_SUCCESS,
  CHATBOT_FAIL,
  CHATBOT_RESET,
} from "./ActionType";

const initialState = {
  messages: [
    {
      sender: "bot",
      text: "👋 Welcome to SmartHotel Concierge. How can I help you?",
      time: new Date().toLocaleTimeString(),
    },
  ],
  loading: false,
  error: null,
};

export const chatbotReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHATBOT_ADD_USER_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case CHATBOT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CHATBOT_SUCCESS:
      return {
        ...state,
        loading: false,
        messages: [...state.messages, action.payload],
      };

    case CHATBOT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CHATBOT_RESET:
      return initialState;

    default:
      return state;
  }
};
