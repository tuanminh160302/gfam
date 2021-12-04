import inputValueTypes from "./signInData.types";

const INITIAL_STATE = {
    email: '',
    password: '',
    confirmPassword: ''
}

const signInReducer = (state=INITIAL_STATE, action) => {
    switch(action.type) {
        case inputValueTypes.GET_INPUT_VALUE:
            return {
                ...state,
                [Object.keys(action.payload)[0]]: Object.values(action.payload)[0],
            }

        default:
            return state
    }
}

export default signInReducer;