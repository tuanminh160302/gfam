import { useRef, useState } from 'react';
import './login-page.styles.scss';
import FormInput from '../../form-input/form-input.component';

import { connect } from 'react-redux'
import { getInputValue } from '../../redux/signInData/signInData.actions';
import Button from '../../components/button/button.component';

import gsap from 'gsap';

const LoginPage = ({email, password, setData}) => {

    const [confirmPassword, setConfirmPassword] = useState('')

    const loginFormRef = useRef()
    const signUpFormRef = useRef()

    const handleInputChange = (e) => {
        const {name, value} = e.target 
        const dataObject = {
            [name]: value
        }
        setData(dataObject)
        console.log(email, password)
    }

    const handleInputChangeLocal = (e) => {
        setConfirmPassword(e.target.value)
    }

    const takeToSignUp = () => {
        gsap.to(loginFormRef.current, { duration: .3, opacity: 0});
        gsap.to(loginFormRef.current, { delay: .3, duration: 0, display: 'none'});
        gsap.to(signUpFormRef.current, { delay: .3, duration: 0, display: 'block'});
        gsap.to(signUpFormRef.current, { delay: .3, duration: .3, opacity: 1});
    }

    const takeToLogIn = () => {
        gsap.to(signUpFormRef.current, { duration: .3, opacity: 0});
        gsap.to(signUpFormRef.current, { delay: .3, duration: 0, display: 'none'});
        gsap.to(loginFormRef.current, { delay: .3, duration: 0, display: 'block'});
        gsap.to(loginFormRef.current, { delay: .3, duration: .3, opacity: 1});
    }

    return (
        <div className='login-page'>
            <form className='form log-in' ref={loginFormRef}>
                <FormInput 
                    inputStyle='margin-bottom'
                    name='email'
                    type='email'
                    labelText='Username'
                    onChange={(e) => {handleInputChange(e)}}
                    value={email}
                />

                <FormInput 
                    name='password'
                    type='password'
                    labelText='Password'
                    onChange={(e) => {handleInputChange(e)}}
                    value={password}
                />

                <span className='instead' onClick={() => {takeToSignUp()}}>Create an account instead</span>
            </form>

            <form className='form sign-up' ref={signUpFormRef}>
                <FormInput 
                    inputStyle='margin-bottom'
                    name='email'
                    type='email'
                    labelText='Username'
                    onChange={(e) => {handleInputChange(e)}}
                    value={email}
                />

                <FormInput 
                    inputStyle='margin-bottom'
                    name='password'
                    type='password'
                    labelText='Password'
                    onChange={(e) => {handleInputChange(e)}}
                    value={password}
                />

                <FormInput 
                    type='password'
                    labelText='Confirm password'
                    onChange={(e) => {handleInputChangeLocal(e)}}
                    value={confirmPassword}
                />

                <span className='instead' onClick={() => {takeToLogIn()}}>Already have an account?</span>
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