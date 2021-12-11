import { useEffect, useState} from 'react';

import './header.styles.scss'

import { ReactComponent as LogOutBtn } from '../../assets/media/power.svg';
import { ReactComponent as ProfileBtn } from '../../assets/media/profile.svg';
import { ReactComponent as SavedBtn } from '../../assets/media/saved.svg';
import { ReactComponent as SettingsBtn } from '../../assets/media/settings.svg';
import { ReactComponent as SwitchBtn } from '../../assets/media/switch.svg';
import { ReactComponent as HomeBtn } from '../../assets/media/home.svg';
import { ReactComponent as CreateBtn } from '../../assets/media/create.svg';

import Button from '../button/button.component';
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { uploadUserPost } from '../../firebase/firebase.init';
import { connect } from 'react-redux';

import { getInputValue } from '../../redux/signInData/signInData.actions';
import { setSignInState } from '../../redux/signInState/signInState.actions';

import { useNavigate, useLocation } from 'react-router';

import UserAvt from '../user-avt/user-avt.component';

import gsap from 'gsap';

const Header = ({ isSignedIn, setData, setSignInState }) => {

    const auth = getAuth()
    const user = auth.currentUser
    const db = getFirestore()
    let userName = null
    const navigate = useNavigate()
    const [toggleUserNav, setToggleUserNav] = useState(false);
    const location = useLocation()
    const pathname = location.pathname

    const [createPost, setCreatePost] = useState(false)

    useEffect(() => {
        setToggleUserNav(false)
    }, [pathname])

    if (user) {
        const {uid} = user
        const userRef = doc(db, "users", uid)
        getDoc(userRef).then((snapshot) => {
            if (snapshot.data()) {
                userName = snapshot.data().userName
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }

    document.addEventListener(('click'), (e) => {
        if (e.target.nodeName !== 'path' && e.target.nodeName !== 'svg') {
            const clickTarget = e.target.className.split(" ")[0]
            if (clickTarget !== "nav-redirect" && clickTarget !== "user-avt") {
                setToggleUserNav(false)
            }
        }
    })

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
            setSignInState(false)
        }).catch((error) => {
            console.log(error)
        });
    }

    const handleSignInRedirect = () => {
        if (pathname !== '/') {
            navigate("/")
        } else {
            window.location.reload()
        }
    }

    const handleProfileRedirect = () => {
        if (pathname !== `/${userName}`) {
            navigate(`/${userName}`)
        } else {
            setToggleUserNav(false)
        }
    }

    const handleCreatePost = () => {
        setCreatePost(true)
        gsap.to('.new-post', {scale: 1, opacity: 1, duration: .15})
        gsap.to('body', {overflow: 'hidden'})
    }

    const handleExitCreatePost = () => {
        setCreatePost(false)
        gsap.to('.new-post', {scale: 1.1, opacity: 0, duration: .15})
        gsap.to('body', {overflow: 'auto'})
    }

    let fileList = null;

    const handleSubmitFile = (e) => {
        e.preventDefault()

        fileList.forEach((file) => console.log(file.name))

        if (user) {
            uploadUserPost(user, fileList, "first ever post").then(() => {
                console.log("Successfully created the post")
            })
        }
    }

    const handleFileChange = (e) => {
        e.preventDefault()

        fileList = Object.values(e.target.files)
    }   

    return (
        <div className='header'>
            <div className='container'>
                {isSignedIn
                    ? 
                    <div className='header-nav'>
                        <HomeBtn className='icon' onClick={() => {handleSignInRedirect()}}/>
                        <CreateBtn className='icon' onClick={() => {handleCreatePost()}}/>
                        <UserAvt className='user-avt' self={true} onClick={() => { handleToggleUserNav() }}/>
                    </div>
                    : 
                    <div className='header-nav'>
                        <HomeBtn className='icon' onClick={() => {handleSignInRedirect()}}/>
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

                    <div className={`${!createPost ? 'hidden' : null} new-post-container`}>
                        <div className="new-post-exit" onClick={() => {handleExitCreatePost()}}></div>
                        <div className="new-post">
                            <form onSubmit={(e) => { handleSubmitFile(e) }}>
                                <input type="file" multiple onChange={(e) => { handleFileChange(e) }} />
                                <button type='submit'>Upload</button>
                            </form>
                        </div>
                    </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ isSignedIn }) => ({
    isSignedIn: isSignedIn.isSignedIn
})

const mapDispatchToProps = (dispatch) => ({
    setData: (data) => { dispatch(getInputValue(data)) },
    setSignInState: (isSignedIn) => {dispatch(setSignInState(isSignedIn))}
})

export default connect(mapStateToProps, mapDispatchToProps)(Header);