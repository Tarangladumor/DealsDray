import { combineReducers } from "@reduxjs/toolkit";
import adminReducer from "../slices/adminSlice"
import userReducer  from "../slices/userSlice";

const rootReducer = combineReducers({
    Admin: adminReducer,
    User : userReducer,
})

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;