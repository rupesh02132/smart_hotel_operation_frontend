import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { authReducer } from "../state/auth/Reducer";
import { listingReducer } from "../state/listing/Reducer";
import { bookingReducer } from "../state/booking/Reducer";
import { reviewReducer } from "../state/review/Reducer";
import { ratingReducer } from "../state/rating/Reducer";
import  paymentReducer  from "../state/Payment/Reducer";
import { adminReducer } from "./admin/Reducer";
import { selfCheckReducer } from "../state/selfCheck/Reducer";
import {analyticsReducer} from "../state/analyst/Reducer";
import {housekeepingReducer} from "../state/housekeep/Reducer";
import {chatbotReducer} from "../state/chatbot/Reducer";
import {roomReducer} from "./room/reducer";
import {notificationReducer} from "./notification/Reducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
    auth: authReducer,
    listings: listingReducer,
    bookings: bookingReducer,
    review:reviewReducer,
    rating:ratingReducer,
    payment:paymentReducer,
    admin: adminReducer,
    selfCheck: selfCheckReducer,
    analytics: analyticsReducer,
    housekeeping: housekeepingReducer,
    chatbot: chatbotReducer,
    room: roomReducer,
    notification: notificationReducer,

});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

