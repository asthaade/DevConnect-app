import { configureStore } from "@reduxjs/toolkit";
import connectionReducer from './connectionSlice';
import feedReducer from './feedSlice';
import requestReducer from './requestSlice';
import userReducer from './userSlice';


const appStore = configureStore({
    reducer : {
        user : userReducer,
        feed : feedReducer,
        connections: connectionReducer,
        requests : requestReducer,
    },
})

export default appStore;