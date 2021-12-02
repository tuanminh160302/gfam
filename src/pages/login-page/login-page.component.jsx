import { useState } from 'react'
import './login-page.styles.scss';
import FormInput from '../../login-form/loginForm.components';

import { connect } from 'react-redux'
import { getInputValue } from '../../redux/signInData/signInData.actions';

const LoginPage = ({email, password, setData}) => {

    const handleInputChange = (e) => {
        const {name, value} = e.target 
        const dataObject = {
            [name]: value
        }
        setData(dataObject)
        console.log(email, password)
    }

    return (
        <div className='login-page'>
            <form className='login-form'>
                <FormInput 
                    inputType='login-form-input'
                    name='email'
                    type='email'
                    labelText='Username'
                    onChange={(e) => {handleInputChange(e)}}
                    value={email}
                />

                <FormInput 
                    inputType='login-form-input'
                    name='password'
                    type='password'
                    labelText='Password'
                    onChange={(e) => {handleInputChange(e)}}
                    value={password}
                />
            </form>
        </div>
    )
}

const mapStateToProps = ({signInData}) => ({
    email: signInData.email,
    password: signInData.password
})

const mapDispatchToProps = (dispatch) => ({
    setData: (data) => {dispatch(getInputValue(data))}
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);