import userSnapTypes from "./userSnap.types";

export const setUserToken = (avtURL) => ({
    type: userSnapTypes.SET_USER_AVT,
    payload: avtURL
})