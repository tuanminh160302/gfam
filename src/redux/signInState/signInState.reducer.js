import signInState from "./signInState.types";

const INITIAL_STATE = {
    isSignedIn: null
}

const signInStateReducer = (state=INITIAL_STATE, action) => {
    switch(action.type) {
        case signInState.SET_SIGN_IN_STATE:
            return {
                ...state,
                isSignedIn: action.payload
            }

        default:
            return state
    }
}

export default signInStateReducer;