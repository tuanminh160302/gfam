import { combineReducers } from "redux";
import signInReducer from "./signInData/signInData.reducer";
import signInStateReducer from "./signInState/signInState.reducer";
import userSnapReducer from "./userSnap/userSnap.reducer";
import cropImageReducer from "./cropImage/cropImage.reducer";

export default combineReducers({
    signInData: signInReducer,
    isSignedIn: signInStateReducer,
    userSnap: userSnapReducer,
    cropImage: cropImageReducer
})