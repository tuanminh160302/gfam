import { useCallback, useEffect, useState, useRef, Fragment } from 'react';
import ReactDOM from 'react-dom'
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';

import './header.styles.scss'

import { ReactComponent as LogOutBtn } from '../../assets/media/power.svg';
import { ReactComponent as ProfileBtn } from '../../assets/media/profile.svg';
import { ReactComponent as SavedBtn } from '../../assets/media/saved.svg';
import { ReactComponent as SettingsBtn } from '../../assets/media/settings.svg';
import { ReactComponent as SwitchBtn } from '../../assets/media/switch.svg';
import { ReactComponent as HomeBtn } from '../../assets/media/home.svg';
import { ReactComponent as CreateBtn } from '../../assets/media/create.svg';
import { ReactComponent as NextBtn } from '../../assets/media/next.svg';
import { ReactComponent as BackBtn } from '../../assets/media/back.svg';

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
    const dropZoneRef = useRef()
    const imagesRef = useRef()
    const [showNext, setShowNext] = useState(true)
    const [showBack, setShowBack] = useState(false)
    const cropperRef = useRef()

    const [createPost, setCreatePost] = useState(false)

    useEffect(() => {
        setToggleUserNav(false)
    }, [pathname])

    if (user) {
        const { uid } = user
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
        gsap.to('.new-post', { scale: 1, opacity: 1, duration: .15 })
        gsap.to('body', { overflow: 'hidden' })
    }

    const handleExitCreatePost = () => {
        setCreatePost(false)
        setToggleDragNDrop(true)
        setFileList([])
        setShowNext(true)
        setShowBack(false)
        gsap.to('.new-post', { scale: 1.1, opacity: 0, duration: .15 })
        gsap.to('body', { overflow: 'auto' })
    }

    //___________________________________________________HANDLE USER MEDIA SELECTION______________________________________

    const [toggleDragNDrop, setToggleDragNDrop] = useState(true);
    const [fileList, setFileList] = useState([]);

    const handleSubmitFile = (e) => {
        e.preventDefault()
        console.log(fileList)

        fileList.forEach((file) => console.log(file.name))

        if (user) {
            uploadUserPost(user, fileList, "first ever post").then(() => {
                if (fileList.length) {
                    console.log("Successfully created the post")
                }
                setFileList([])
            })
        }
    }

    const handleFileChange = (e) => {
        e.preventDefault()

        // fileList = Object.values(e.target.files)
        setFileList(Object.values(e.target.files))
    }

    const onDrop = useCallback((acceptedFiles) => {
        // Do things with files
        acceptedFiles.forEach((file) => {
            const url = URL.createObjectURL(file)
            Object.assign(file, { preview: url })
            console.log(file.preview)
        })
        setFileList(acceptedFiles)
    }, [])

    const onDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log('handle drag enter')
    }

    const onDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log('handle drag leave')
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/*',
        onDragEnter,
        onDragLeave,
        onDrop,
    })

    useEffect(() => {
        fileList.length ? setToggleDragNDrop(false) : setToggleDragNDrop(true)
        if (fileList.length === 1) {
            setShowBack(false)
            setShowNext(false)
        }
    }, [fileList])

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        console.log(croppedArea, croppedAreaPixels)
    }, [])

    const [verticalOrientation, setVerticalOrientation] = useState(null)

    const images = fileList.map((file, index) => {
        const image = new Image()
        image.src = URL.createObjectURL(file)
        image.onload = () => {
            if (image.height > image.width) {
                setVerticalOrientation(true)
            } else if (image.height < image.width) {
                setVerticalOrientation(false)
            }
        }

        return (
            // <div key={file.name} className={`${index === 0 ? 'show' : null} preview-img`}>
            //     <Cropper
            //         image={file.preview}
            //         crop={crop}
            //         zoom={zoom}
            //         aspect={4 / 3}
            //         onCropChange={setCrop}
            //         onCropComplete={onCropComplete}
            //         onZoomChange={setZoom}
            //         classes={
            //             {
            //                 containerClassName: 'cropper-container',
            //                 cropAreaClassName: 'crop-area'
            //             }
            //         }
            //         objectFit={verticalOrientation ? 'horizontal-cover' : 'vertical-cover'}
            //         restrictPosition={true}
            //     />
            // </div>
            <img className={`${index === 0 ? 'show' : null} preview-img`} key={file.name} src={file.preview} alt={file.name} />
        )
    })

    const handleEditImage = () => {
        let images = imagesRef.current.children
        for (let i = 0; i < images.length - 2; i++) {
            if (images[i].className.includes('show')) {
                const cropper = 
                <Cropper
                    image={images[i].url}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    classes={
                        {
                            containerClassName: 'cropper-container',
                            cropAreaClassName: 'crop-area'
                        }
                    }
                    objectFit={verticalOrientation ? 'horizontal-cover' : 'vertical-cover'}
                    restrictPosition={true}
                />
                
                ReactDOM.render(cropper, document.getElementById('cropper'))
                gsap.to(cropperRef.current, {display: 'block'})
                return
            }
        }
    }

    const handleNextImg = () => {
        let images = imagesRef.current.children
        for (let i = 0; i < images.length - 2; i++) {
            if (images[i].className.includes('show')) {
                images[i].classList.remove('show')
                images[i + 1].classList.add('show')
                if (i === images.length - 4) {
                    setShowNext(false)
                }
                setShowBack(true)
                return
            }
        }
    }

    const handlePrevImg = () => {
        let images = imagesRef.current.children
        for (let i = 0; i < images.length - 2; i++) {
            if (images[i].className.includes('show')) {
                images[i].classList.remove('show')
                images[i - 1].classList.add('show')
                if (i - 1 === 0) {
                    setShowBack(false)
                }
                setShowNext(true)
                return
            }
        }
    }

    return (
        <div className='header'>
            <div className='container'>
                {isSignedIn
                    ?
                    <div className='header-nav'>
                        <HomeBtn className='icon' onClick={() => { handleSignInRedirect() }} />
                        <CreateBtn className='icon' onClick={() => { handleCreatePost() }} />
                        <UserAvt className='user-avt' self={true} onClick={() => { handleToggleUserNav() }} />
                    </div>
                    :
                    <div className='header-nav'>
                        <HomeBtn className='icon' onClick={() => { handleSignInRedirect() }} />
                    </div>
                }

                {isSignedIn &&
                    <div className={`${toggleUserNav && 'appear'} user-nav`}>
                        <div className='nav-redirect nav' onClick={() => { handleProfileRedirect() }}>
                            <ProfileBtn className='icon' />
                            <p className='nav-link'>Profile</p>
                        </div>
                        <div className='nav-redirect nav'>
                            <SavedBtn className='icon' />
                            <p className='nav-link'>Saved</p>
                        </div>
                        <div className='nav-redirect nav'>
                            <SettingsBtn className='icon' />
                            <p className='nav-link'>Settings</p>
                        </div>
                        <div className='nav-redirect nav'>
                            <SwitchBtn className='icon' />
                            <p className='nav-link'>Switch accounts</p>
                        </div>
                        <div className='nav-redirect nav nav-log-out' onClick={() => { handleSignOut() }}>
                            <LogOutBtn className='icon' />
                            <p className='nav-link'>Sign out</p>
                        </div>
                    </div>}

                <div className={`${!createPost ? 'hidden' : ''} new-post-container`}>
                    <div className="new-post-exit" onClick={() => { handleExitCreatePost() }}></div>
                    <div className="new-post">
                        {toggleDragNDrop ?
                            <div className='drag-drop' ref={dropZoneRef} {...getRootProps()}>
                                {isDragActive ?
                                    <p className='guide'>Drop the files here</p> :
                                    <p className='guide'>Drag and drop some files here, or click to select files</p>}
                                <input {...getInputProps()} />
                            </div>
                            :
                            // null
                            <div className='post-content' ref={imagesRef}>
                                <div className='toolbar'>
                                    <p className='tool'>Back</p>
                                    <p className='tool' onClick={() => {handleEditImage()}}>Edit</p>
                                    <p className='tool'>Next</p>
                                </div>
                                {images}
                                <NextBtn className={`${!showNext && 'hide'} change-img next`} onClick={() => { handleNextImg() }} />
                                <BackBtn className={`${!showBack && 'hide'} change-img back`} onClick={() => { handlePrevImg() }} />
                                <div className='cropper' id='cropper' ref={cropperRef}></div>
                            </div>
                        }


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
    setSignInState: (isSignedIn) => { dispatch(setSignInState(isSignedIn)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(Header);