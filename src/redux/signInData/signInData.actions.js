import inputValueTypes from "./signInData.types";

export const getInputValue = (valueObject) => ({
    type: inputValueTypes.GET_INPUT_VALUE,
    payload: valueObject
})