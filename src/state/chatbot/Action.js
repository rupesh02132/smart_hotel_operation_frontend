import { api } from "../../Admin/config/apiConfig";

import {
  CHATBOT_ADD_USER_MESSAGE,
  CHATBOT_REQUEST,
  CHATBOT_SUCCESS,
  CHATBOT_FAIL,
  CHATBOT_RESET,
} from "./ActionType";

/* =========================================
   ADD USER MESSAGE (Local Store)
========================================= */
export const addUserMessage = (text) => (dispatch) => {
  dispatch({
    type: CHATBOT_ADD_USER_MESSAGE,
    payload: {
      sender: "user",
      text,
      time: new Date().toLocaleTimeString(),
    },
  });
};

/* =========================================
   SEND MESSAGE TO CHATBOT API
========================================= */
export const sendChatbotMessage =
  (message, language = "en") =>
  async (dispatch) => {
    try {
      dispatch({ type: CHATBOT_REQUEST });

      const { data } = await api.post("/api/chatbot", {
        message,
        language,
      });

      dispatch({
        type: CHATBOT_SUCCESS,
        payload: {
          sender: "bot",
          text: data.answer || "🤖 I am here to help!",
          recommendation: data.recommendation || null,
          time: new Date().toLocaleTimeString(),
        },
      });
    } catch (error) {
      dispatch({
        type: CHATBOT_FAIL,
        payload:
          error.response?.data?.message ||
          error.message ||
          "Chatbot Server Error",
      });
    }
  };

/* =========================================
   RESET CHAT
========================================= */
export const resetChatbot = () => (dispatch) => {
  dispatch({ type: CHATBOT_RESET });
};
