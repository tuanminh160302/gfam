import userSnapTypes from "./userSnap.types";

const INITIAL_STATE = {
    userToken: ""
}

const userSnapReducer = (state=INITIAL_STATE, action) => {
    switch(action.case) {
        case userSnapTypes.SET_USER_AVT:
            return {
                ...state,
                userToken: action.payload
            }
        
        default:
            return state
    }
}

export default userSnapReducer;