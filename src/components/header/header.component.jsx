import { useCallback, useEffect, useState, useRef, Fragment } from 'react';
import ReactDOM from 'react-dom'
import { useDropzone } from 'react-dropzone';

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
import { ReactComponent as DownBtn } from '../../assets/media/down.svg';
import CropperComponent from '../cropper/cropper.component';

import Button from '../button/button.component';
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { uploadUserPost } from '../../firebase/firebase.init';
import { connect } from 'react-redux';

import { getInputValue } from '../../redux/signInData/signInData.actions';
import { setSignInState } from '../../redux/signInState/signInState.actions';
import { setCropper } from '../../redux/cropImage/cropImage.actions';
import { getCropImage } from '../../redux/cropImage/cropImage.actions';

import { useNavigate, useLocation } from 'react-router';

import UserAvt from '../user-avt/user-avt.component';

import gsap from 'gsap';

const Header = ({ isSignedIn, setData, setSignInState, cropImage, showCropper, setCropper, getCropImage }) => {

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
    const textAreaRef = useRef()
    const captionSizeChange = useRef()
    const [toggleCaption, setToggleCaption] = useState(false)

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
        setCropperSrc()
        setCropper(false)
        setToggleCaption(false)
        setCaption()
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
        console.log('fileList =>', fileList)
        fileList.length ? setToggleDragNDrop(false) : setToggleDragNDrop(true)
        if (fileList.length === 1) {
            setShowBack(false)
            setShowNext(false)
        }
    }, [fileList])

    useEffect(() => {
        if (imagesRef.current && cropImage) {
            let images = imagesRef.current.children
            for (let i = 0; i < images.length; i++) {
                if (images[i].className.includes('show')) {
                    images[i].src = cropImage
                    getCropImage(null)
                    return
                }
            }
        }
    }, [cropImage])

    const images = fileList.map((file, index) => {
        return (
            <img className={`${index === 0 ? 'show' : null} preview-img }`} id={file.name} key={file.name} src={file.preview} alt={file.name} />
        )
    })

    const [cropperSrc, setCropperSrc] = useState()

    const handleEditImage = () => {
        let images = imagesRef.current.children
        for (let i = 0; i < images.length; i++) {
            if (images[i].className.includes('show')) {
                setCropperSrc(images[i].src)
                setCropper(true)
                return
            }
        }
    }

    const handleNextImg = () => {
        let images = imagesRef.current.children
        for (let i = 0; i < images.length; i++) {
            if (images[i].className.includes('show')) {
                images[i].classList.remove('show')
                images[i + 1].classList.add('show')
                if (i === images.length - 2) {
                    setShowNext(false)
                }
                setShowBack(true)
                return
            }
        }
    }

    const handlePrevImg = () => {
        let images = imagesRef.current.children
        for (let i = 0; i < images.length; i++) {
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

    const handleNextAction = () => {
        let images = imagesRef.current.children
        let filesToUpload = []
        for (let i = 0; i < images.length; i++) {
            const image = images[i]
            const url = image.src
            const fileName = fileList[i].name

            fetch(url)
                .then(async (response) => {
                    const contentType = response.headers.get('content-type')
                    return [await response.blob(), contentType]
                })
                .then(([blob, contentType]) => {
                    console.log('contentType =>', contentType)
                    const fileToUpload = new File([blob], fileName, { type: contentType })
                    filesToUpload.push(fileToUpload)
                    Object.assign(fileToUpload, { preview: url })
                    console.log(filesToUpload.length)
                    return filesToUpload.length
                }).then((resetNum) => {
                    if (resetNum === images.length) {
                        setFileList(filesToUpload)
                    }
                })
        }

        setToggleCaption(true)
    }

    const handleBackAction = () => {
        if (!toggleDragNDrop && !toggleCaption) {
            setToggleDragNDrop(true)
            setFileList([])
        } else if (!toggleDragNDrop && toggleCaption) {
            setToggleCaption(false)
        }
    }

    const [captionSmall, setCaptionSmall] = useState(false)

    const handleCaptionDown = () => {
        if (!captionSmall) {
            gsap.to(textAreaRef.current, { duration: 0, height: 'fit-content' })
            gsap.to(captionSizeChange.current, { duration: 0, rotate: '180deg' })
            setCaptionSmall(true)
        } else if (captionSmall) {
            gsap.to(textAreaRef.current, { duration: 0, height: '20vh' })
            gsap.to(captionSizeChange.current, { duration: 0, rotate: '0' })
            setCaptionSmall(false)
        }
    }

    const [caption, setCaption] = useState()

    const handleTextAreaChange = (e) => {
        e.preventDefault()

        setCaption(e.target.value)
    }

    const handlePostAction = () => {
        handleExitCreatePost()
        console.log(fileList)

        fileList.forEach((file) => console.log(file.name))

        if (user) {
            uploadUserPost(user, fileList, caption).then(() => {
                if (fileList.length) {
                    console.log("Successfully created the post")
                }
                setFileList([])
            })
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
                        <div className='toolbar'>
                            {
                                toggleDragNDrop ?
                                <p className='tool' onClick={() => {handleExitCreatePost()}}>Cancel</p> :
                                <p className='tool' onClick={() => {handleBackAction()}}>Back</p>
                            }
                            {
                                toggleDragNDrop ? null :
                                toggleCaption ?
                                    <p className='tool'>Add a caption</p> :
                                    <p className='tool' onClick={() => { handleEditImage() }}>Edit</p>
                            }
                            {
                                toggleDragNDrop ? null :
                                !toggleCaption ?
                                <p className='tool' onClick={() => { handleNextAction() }}>Next</p> :
                                <p className='tool' onClick={() => {handlePostAction()}}>Post</p>
                            }
                        </div>
                        {toggleDragNDrop ?
                            <div className='drag-drop' ref={dropZoneRef} {...getRootProps()}>
                                {isDragActive ?
                                    <p className='guide'>Drop the files here</p> :
                                    <p className='guide'>Drag and drop some files here, or click to select files</p>}
                                <input {...getInputProps()} />
                            </div>
                            :
                            // null
                            <div className='post-content'>
                                <div className='images-container' ref={imagesRef}>
                                    {images}
                                </div>
                                <NextBtn className={`${!showNext && 'hide'} change-img next`} onClick={() => { handleNextImg() }} />
                                <BackBtn className={`${!showBack && 'hide'} change-img back`} onClick={() => { handlePrevImg() }} />
                                {showCropper ?
                                    <div className='cropper' id='cropper' ref={cropperRef}>
                                        <CropperComponent src={cropperSrc} />
                                    </div> :
                                    null}
                            </div>
                        }


                        <form onSubmit={(e) => { handleSubmitFile(e) }}>
                            <input type="file" multiple onChange={(e) => { handleFileChange(e) }} />
                            <button type='submit'>Upload</button>
                        </form>

                        {toggleCaption ?
                            <div className='new-post-caption'>
                                <textarea className='caption-input' name='caption' placeholder='Add a caption...' ref={textAreaRef} onChange={(e) => {handleTextAreaChange(e)}}></textarea>
                                <DownBtn className='caption-down' ref={captionSizeChange} onClick={() => { handleCaptionDown() }} />
                            </div> :
                            null}
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ isSignedIn, cropImage }) => ({
    isSignedIn: isSignedIn.isSignedIn,
    cropImage: cropImage.cropImage,
    showCropper: cropImage.showCropper
})

const mapDispatchToProps = (dispatch) => ({
    setData: (data) => { dispatch(getInputValue(data)) },
    setSignInState: (isSignedIn) => { dispatch(setSignInState(isSignedIn)) },
    setCropper: (boolean) => (dispatch(setCropper(boolean))),
    getCropImage: (cropImage) => (dispatch(getCropImage(cropImage))),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header);