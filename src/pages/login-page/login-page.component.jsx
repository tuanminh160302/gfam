import { useRef } from 'react';
import './login-page.styles.scss';
import FormInput from '../../form-input/form-input.component';

import { connect } from 'react-redux'
import { getInputValue } from '../../redux/signInData/signInData.actions';
import Button from '../../components/button/button.component';

import gsap from 'gsap';

import firebaseApp from '../../firebase/firebase.init';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { createUserCredentials } from '../../firebase/firebase.init';

const LoginPage = ({ email, userName, displayName, password, confirmPassword, setData }) => {

    const loginFormRef = useRef()
    const signUpFormRef = useRef()

    const handleInputChange = (e) => {
        const { name, value } = e.target
        const dataObject = {
            [name]: value
        }
        setData(dataObject)
        // console.log(email, password)
        console.log(name, value)
    }

    const takeToSignUp = () => {
        gsap.to(loginFormRef.current, { duration: .3, opacity: 0 });
        gsap.to(loginFormRef.current, { delay: .3, duration: 0, display: 'none' });
        gsap.to(signUpFormRef.current, { delay: .3, duration: 0, display: 'block' });
        gsap.to(signUpFormRef.current, { delay: .3, duration: .3, opacity: 1 });
    }

    const takeToLogIn = () => {
        gsap.to(signUpFormRef.current, { duration: .3, opacity: 0 });
        gsap.to(signUpFormRef.current, { delay: .3, duration: 0, display: 'none' });
        gsap.to(loginFormRef.current, { delay: .3, duration: 0, display: 'block' });
        gsap.to(loginFormRef.current, { delay: .3, duration: .3, opacity: 1 });
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                await createUserCredentials(user, {email, userName, displayName})
                // console.log(user)
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage)
                // ..
            });
    }

    return (
        <div className='login-page'>
            <form className='form log-in' ref={loginFormRef}>
                <FormInput
                    inputStyle='margin-bottom'
                    name='email'
                    type='email'
                    labelText='Username'
                    onChange={(e) => { handleInputChange(e) }}
                    value={email}
                    required
                />

                <FormInput
                    name='password'
                    type='password'
                    labelText='Password'
                    onChange={(e) => { handleInputChange(e) }}
                    value={password}
                    required
                />

                <span className='instead' onClick={() => { takeToSignUp() }}>Create an account instead</span>
            </form>

            <form className='form sign-up' ref={signUpFormRef} onSubmit={(e) => { handleFormSubmit(e)}}>
                <FormInput
                    inputStyle='margin-bottom'
                    name='email'
                    type='email'
                    labelText='Email'
                    onChange={(e) => { handleInputChange(e) }}
                    value={email}
                    required
                />

                <FormInput
                    inputStyle='margin-bottom'
                    name='userName'
                    type='text'
                    labelText='Username'
                    onChange={(e) => { handleInputChange(e) }}
                    value={userName}
                    // required
                />

                <FormInput
                    inputStyle='margin-bottom'
                    name='displayName'
                    type='text'
                    labelText='Display name'
                    onChange={(e) => { handleInputChange(e) }}
                    value={displayName}
                    // required
                />

                <FormInput
                    inputStyle='margin-bottom'
                    name='password'
                    type='password'
                    labelText='Password'
                    onChange={(e) => { handleInputChange(e) }}
                    value={password}
                    required
                />

                <FormInput
                    name='confirmPassword'
                    type='password'
                    labelText='Confirm password'
                    onChange={(e) => { handleInputChange(e) }}
                    value={confirmPassword}
                    required
                />

                <span className='instead' onClick={() => { takeToLogIn() }}>Already have an account?</span>

                <Button
                    type='submit'
                    text='Sign Up'
                    background='black'
                    color='white'
                    margin='2vh 0 0 0'
                />
            </form>
        </div>
    )
}

const mapStateToProps = ({ signInData }) => ({
    email: signInData.email,
    userName: signInData.userName,
    displayName: signInData.displayName,
    password: signInData.password,
    confirmPassword: signInData.confirmPassword,
})

const mapDispatchToProps = (dispatch) => ({
    setData: (data) => { dispatch(getInputValue(data)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);