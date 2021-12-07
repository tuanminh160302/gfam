import { useState } from 'react';

import './header.styles.scss'

import UserAvt from '../../assets/media/user-avt.jpg';
import { ReactComponent as LogOutBtn } from '../../assets/media/power.svg';

import Button from '../button/button.component';
import { getAuth, signOut } from "firebase/auth";
import { connect } from 'react-redux';

import { getInputValue } from '../../redux/signInData/signInData.actions';

const Header = ({ isSignedIn, setData }) => {

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
        }).catch((error) => {
            // An error happened.
        });
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
                        <img src={UserAvt} alt="" className="user-avt" onClick={() => { handleToggleUserNav() }} />
                    </div>
                    : <div className='header-nav'>

                    </div>
                }

                {isSignedIn &&
                    <div className={`${toggleUserNav && 'appear'} user-nav`}>
                        <LogOutBtn className='nav log-out' onClick={() => { handleSignOut() }} />
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