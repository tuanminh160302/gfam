import signInState from "./signInState.types";

export const setSignInState = (isSignedIn) => ({
    type: signInState.SET_SIGN_IN_STATE,
    payload: isSignedIn
})