import { combineReducers } from "redux";
import signInReducer from "./signInData/signInData.reducer";
import signInStateReducer from "./signInState/signInState.reducer";

export default combineReducers({
    signInData: signInReducer,
    isSignedIn: signInStateReducer
})