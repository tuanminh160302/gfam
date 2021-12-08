import { useState } from 'react';

import './header.styles.scss'

import { ReactComponent as LogOutBtn } from '../../assets/media/power.svg';
import { ReactComponent as ProfileBtn } from '../../assets/media/profile.svg';
import { ReactComponent as SavedBtn } from '../../assets/media/saved.svg';
import { ReactComponent as SettingsBtn } from '../../assets/media/settings.svg';
import { ReactComponent as SwitchBtn } from '../../assets/media/switch.svg';

import Button from '../button/button.component';
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { connect } from 'react-redux';

import { getInputValue } from '../../redux/signInData/signInData.actions';

import { useNavigate, useLocation } from 'react-router';

import UserAvt from '../user-avt/user-avt.component';

const Header = ({ isSignedIn, setData }) => {

    const auth = getAuth()
    const user = auth.currentUser
    const db = getFirestore()
    let userName = null
    if (user) {
        const {uid} = user
        const userRef = doc(db, "users", uid)
        getDoc(userRef).then((snapshot) => {
            userName = snapshot.data().userName
        })
    }

    const location = useLocation()

    document.addEventListener(('click'), (e) => {
        const clickTarget = e.target.className.split(" ")[0]
        if (clickTarget !== "nav-redirect" && clickTarget !== "user-avt") {
            setToggleUserNav(false)
        }
    })

    const navigate = useNavigate()

    const [toggleUserNav, setToggleUserNav] = useState(false);

    const handleToggleUserNav = () => {
        setToggleUserNav(!toggleUserNav)
    }

    const handleSignOut = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            // Sign-out successful.
            const dataKeys = ['email', 'userName', 'displayName', 'password', 'confirmPassword'];
            for (const key of dataKeys) {
                const dataObject = {
                    [key]: ''
                }
                setData(dataObject)
                setToggleUserNav(false)
            }
            navigate("/login")
        }).catch((error) => {
            // An error happened.
        });
    }

    const handleSignInRedirect = () => {
        navigate("/login")
    }

    const handleProfileRedirect = () => {
        const pathname = location.pathname
        if (pathname !== `/${userName}`) {
            navigate(`/${userName}`)
        } else {
            setToggleUserNav(false)
        }
    }

    return (
        <div className='header'>
            <div className='container'>
                {isSignedIn
                    ? <div className='header-nav'>
                        {/* <Button 
                    className='sign-out-btn'
                    text='Sign Out'
                    onClick={() => {handleSignOut()}}
                /> */}
                        {/* <img src={} alt="" className="user-avt" onClick={() => { handleToggleUserNav() }} /> */}
                        <UserAvt className='user-avt' onClick={() => { handleToggleUserNav() }}/>
                    </div>
                    : <div className='header-nav'>
                        <span onClick={() => {handleSignInRedirect()}}>Please sign in</span>
                    </div>
                }

                    {isSignedIn &&
                    <div className={`${toggleUserNav && 'appear'} user-nav`}>
                        <div className='nav-redirect nav' onClick={() => {handleProfileRedirect()}}>
                            <ProfileBtn className='icon'/>
                            <p className='nav-link'>Profile</p>
                        </div>
                        <div className='nav-redirect nav'>
                            <SavedBtn className='icon'/>
                            <p className='nav-link'>Saved</p>
                        </div>
                        <div className='nav-redirect nav'>
                            <SettingsBtn className='icon'/>
                            <p className='nav-link'>Settings</p>
                        </div>
                        <div className='nav-redirect nav'>
                            <SwitchBtn className='icon'/>
                            <p className='nav-link'>Switch accounts</p>
                        </div>
                        <div className='nav-redirect nav nav-log-out' onClick={() => { handleSignOut() }}>
                            <LogOutBtn className='icon'/>
                            <p className='nav-link'>Sign out</p>
                        </div>
                    </div>}
            </div>
        </div>
    )
}

const mapStateToProps = ({ isSignedIn }) => ({
    isSignedIn: isSignedIn.isSignedIn
})

const mapDispatchToProps = (dispatch) => ({
    setData: (data) => { dispatch(getInputValue(data)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(Header);