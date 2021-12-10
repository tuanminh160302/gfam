import { useRef, useEffect, useState } from 'react';
import './login-page.styles.scss';
import FormInput from '../../form-input/form-input.component';

import { connect } from 'react-redux'

import { getInputValue } from '../../redux/signInData/signInData.actions';
import { setInputField } from '../../redux/signInState/signInState.actions';
import { setSignInState } from '../../redux/signInState/signInState.actions';

import Button from '../../components/button/button.component';

import gsap from 'gsap';

import firebaseApp from '../../firebase/firebase.init';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { createUserCredentials } from '../../firebase/firebase.init';

const LoginPage = ({ setSignInState, inputFieldType, setInputField, email, userName, displayName, password, confirmPassword, setData }) => {

    const loginFormRef = useRef()
    const signUpFormRef = useRef()
    const errorMessageRef = useRef()

    useEffect(() => {
        errorMessageRef.current.innerText = ""
    }, [inputFieldType])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        const dataObject = {
            [name]: value
        }
        setData(dataObject)
    }

    const resetInputData = () => {
        const dataKeys = ['email', 'userName', 'displayName', 'password', 'confirmPassword'];
        for (const key of dataKeys) {
            const dataObject = {
                [key]: ''
            }
            setData(dataObject)
        }
    }

    const takeToSignUp = () => {
        gsap.to(loginFormRef.current, { duration: .3, opacity: 0 });
        gsap.to(loginFormRef.current, { delay: .3, duration: 0, display: 'none' });
        gsap.to(signUpFormRef.current, { delay: .3, duration: 0, display: 'block' });
        gsap.to(signUpFormRef.current, { delay: .3, duration: .3, opacity: 1 });

        resetInputData()
        setInputField('sign-up')
    }

    const takeToLogIn = () => {
        gsap.to(signUpFormRef.current, { duration: .3, opacity: 0 });
        gsap.to(signUpFormRef.current, { delay: .3, duration: 0, display: 'none' });
        gsap.to(loginFormRef.current, { delay: .3, duration: 0, display: 'block' });
        gsap.to(loginFormRef.current, { delay: .3, duration: .3, opacity: 1 });

        resetInputData()
        setInputField('log-in')
    }

    const handleSignUp = (e) => {
        e.preventDefault();

        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const {user} = userCredential;
                // console.log(user)
                createUserCredentials(user, { email, userName, displayName })
                .then(() => {
                    console.log("data created")
                    email = userName = displayName = password = confirmPassword = ''
                    setSignInState(true)
                })
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage)
                // ..
            });
    }

    const handleLogIn = (e) => {
        e.preventDefault()

        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                setSignInState(true)
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage)
                errorMessageRef.current.innerText = "Wrong Email or Password. Please recheck"
            });
    }

    return (
        <div className='login-page'>
            <form className='form log-in' ref={loginFormRef} onSubmit={(e) => { handleLogIn(e) }}>
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
                    name='password'
                    type='password'
                    labelText='Password'
                    onChange={(e) => { handleInputChange(e) }}
                    value={password}
                    required
                />

                <span className='instead' onClick={() => { takeToSignUp() }}>Create an account</span>

                <Button
                    type='submit'
                    text='Log In'
                    background='black'
                    color='white'
                    margin='2vh 0 0 0'
                />

                <span className='error-msg' ref={errorMessageRef}></span>
            </form>

            <form className='form sign-up' ref={signUpFormRef} onSubmit={(e) => { handleSignUp(e) }}>
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

const mapStateToProps = ({ signInData, isSignedIn }) => ({
    email: signInData.email,
    userName: signInData.userName,
    displayName: signInData.displayName,
    password: signInData.password,
    confirmPassword: signInData.confirmPassword,

    inputFieldType: isSignedIn.inputFieldType
})

const mapDispatchToProps = (dispatch) => ({
    setSignInState: (isSignedIn) => {dispatch(setSignInState(isSignedIn))},
    setData: (data) => { dispatch(getInputValue(data)) },
    setInputField: (type) => { dispatch(setInputField(type)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);