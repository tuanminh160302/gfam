import { combineReducers } from "redux";
import signInData from "./signInData/signInData.reducer";

export default combineReducers({
    signInData: signInData
})