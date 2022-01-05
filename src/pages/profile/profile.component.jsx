import { Fragment, useEffect, useState, useRef } from 'react';
import './profile.styles.scss';
import { uploadUserAvatar } from '../../firebase/firebase.init';

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { fetchUserPost } from '../../firebase/firebase.init';
import { useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

import { ReactComponent as NextBtn } from '../../assets/media/next.svg';
import { ReactComponent as BackBtn } from '../../assets/media/back.svg';
import UserAvt from '../../components/user-avt/user-avt.component';
import { uploadUserComment } from '../../firebase/firebase.init';

import PostPreview from '../../components/post-preview/post-preview.component';

const Profile = ({ isSignedIn }) => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const auth = getAuth();
    const db = getFirestore();
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname
    const user = auth.currentUser

    const [profileUserAvt, setProfileUserAvt] = useState(null)
    const [displayName, setDisplayName] = useState()
    const [editProfileRights, seteditProfileRights] = useState()
    const [toggleEditProfile, setToggleEditProfile] = useState(false)
    const [userToBeDisplayed, setUserToBeDisplayed] = useState()
    const [uidToBeDisplayed, setUidToBeDisplayed] = useState()
    const [postToBeViewed, setPostToBeViewed] = useState()
    const [allPost, setAllPost] = useState([])
    const [viewPost, setViewPost] = useState(false)
    const [postImages, setPostImages] = useState(null)
    const [postCaption, setPostCaption] = useState(null)
    const imagesRef = useRef()
    const [showNext, setShowNext] = useState(true)
    const [showBack, setShowBack] = useState(false)
    const [postComment, setPostComment] = useState(null)
    const [allComment, setAllComment] = useState([])
    const textAreaRef = useRef()
    const [isFollowing, setIsFollowing] = useState()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const { uid } = user
                const userRef = doc(db, 'users', uid)
                getDoc(userRef).then((snapshot) => {
                    if (pathname.slice(1) === snapshot.data().userName) {
                        seteditProfileRights(true)
                    }
                })
            }
        })

        // Get the user to be displayed data
        const userCollectionRef = collection(db, 'users');
        const queryUserToBeDisplayed = query(userCollectionRef, where("userName", "==", pathname.slice(1)))
        getDocs(queryUserToBeDisplayed).then((querySnapshot) => {
            if (querySnapshot.size === 1) {
                querySnapshot.forEach((snapshot) => {
                    // Process data to be displayed
                    const data = snapshot.data()

                    if (data.postCount) {
                        console.log('data.postCount =>', data.postCount)

                    } else {
                        console.log('this user has no post')
                    }

                    setDisplayName(data.displayName)
                    setProfileUserAvt(data.avatarURL)
                    fetchUserPost(data.uid).then((data) => {
                        const allPost = []
                        for (let key in data) {
                            if (key !== 'exist') {
                                const post = { [key]: data[key] }
                                allPost.push(post)
                            }
                        }
                        allPost.sort((a, b) => (Object.keys(a) > Object.keys(b) ? -1 : 1))
                        setAllPost(allPost)
                    })

                    setUserToBeDisplayed(data.userName)
                    setUidToBeDisplayed(data.uid)
                })
            } else if (querySnapshot.size === 0) {
                // user not found
                setUserToBeDisplayed('null')
                console.log("user not found")
            } else {
                // handle errors
                console.log('at least 2 user has same username')
            }
        })
    }, [pathname, auth, db])

    let file = null

    const handleFileChange = (e) => {
        e.preventDefault()

        file = e.target.files[0]
    }

    const handleSubmitFile = (e) => {
        e.preventDefault()

        console.log(file.name)
        if (user) {
            uploadUserAvatar(user, file)
        }
    }

    const handleExitViewPost = () => {
        setViewPost(false)
        setShowNext(true)
        setShowBack(false)
        setPostImages(null)
        setPostCaption(null)
        setPostComment(null)
        setPostToBeViewed(null)
        setAllComment([])
    }

    const fetchPostComment = (postToBeFetched) => {
        const postRef = doc(db, 'posts', uidToBeDisplayed)
        getDoc(postRef).then(async (snapshot) => {
            const data = snapshot.data()
            const allCommentObject = data[postToBeFetched].comment
            if (allCommentObject) {
                const allCommentArray = Object.keys(allCommentObject)
                allCommentArray.sort((a, b) => (a > b ? 1 : -1))
                const resolveAllComment = allCommentArray.map(async (timestamp, index) => {
                    const commentContent = allCommentObject[timestamp][0]
                    let userAvt = null
                    let userName = null
                    // console.log(commentContent)
                    const commentByUid = allCommentObject[timestamp][1]
                    const userRef = doc(db, 'users', commentByUid)
                    await getDoc(userRef).then((snapshot) => {
                        userAvt = snapshot.data().avatarURL
                        userName = snapshot.data().userName
                    })
                    return [userAvt, commentContent, userName, timestamp]
                })

                await Promise.all(resolveAllComment).then((responses) => {
                    setAllComment(responses)
                })
            }
        })
    }

    const handleRedirectUser = (e) => {
        const targetUserTag = e.target
        const userName = targetUserTag.innerHTML
        navigate(`/${userName}`)
        handleExitViewPost()
    }

    const comments = allComment.map(([userAvt, commentContent, userName, timestamp], index) => {
        const time = new Date(parseInt(timestamp))
        const timeNow = new Date()
        let timeSpan = null
        if (Math.floor((timeNow - time) / 86400000) === 0) {
            timeSpan = String(Math.floor((timeNow - time) / 3600000)) + "h"
        } else if (Math.floor((timeNow - time) / 86400000) !== 0) {
            timeSpan = String(Math.floor((timeNow - time) / 86400000)) + "d"
        }


        return (
            <Fragment key={index}>
                <div className='comment-container'>
                    <div className='comment-user-avt-container'>
                        <UserAvt className='comment-user-avt' self={false} src={userAvt} />
                    </div>
                    <p className='comment-content'>
                        <span className='comment-by' onClick={(e) => { handleRedirectUser(e) }}>{userName}</span>
                        {commentContent}
                    </p>
                </div>
                <p className='comment-timespan'>
                    {timeSpan}
                </p>
            </Fragment>
        )
    })

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

    const handleViewPost = (e) => {
        e.preventDefault()
        const viewPostRef = doc(db, 'posts', uidToBeDisplayed)
        const postToBeDisplayed = e.target.alt
        setViewPost(true)
        getDoc(viewPostRef).then((snapshot) => {
            const data = snapshot.data()
            const postContent = data[postToBeDisplayed]
            setPostToBeViewed(e.target.alt)
            const postImgs = Object.values(postContent['URLS'])
            postImgs.sort((a, b) => a[1] > b[1] ? 1 : -1)
            const caption = Object.values(postContent['caption'])
            let images = postImgs.map((imgArray, index) => {
                return (
                    <img key={index} className={`${index === 0 ? 'show' : null} post-img`} src={imgArray[0]} alt={imgArray[0]} draggable={false}></img>
                )
            })
            return [images, caption]
        }).then(([images, caption]) => {
            setPostImages(images)
            setPostCaption(caption)
            fetchPostComment(postToBeDisplayed)
        })
    }

    const posts = allPost.map((post, index) => {
        const timeStamp = Object.keys(post)[0]
        const postContent = post[timeStamp]
        const postDisplayImgArray = Object.values(postContent['URLS'])
        let postDisplayImg = null
        postDisplayImgArray.map((imgArray, index) => {
            if (imgArray[1] === 0) {
                postDisplayImg = imgArray[0]
            }
        })
        return (
            <div className='post' key={index}>
                <div className='post-content'>
                    <img className='post-display-img' src={postDisplayImg} alt={timeStamp} draggable={false} onClick={(e) => { handleViewPost(e) }} />
                </div>
            </div>
        )
    })

    const handlePostCommentChange = (e) => {
        e.preventDefault()
        setPostComment(e.target.value)
    }

    const handlePostCommentSubmit = () => {
        textAreaRef.current.value = ''
        const uidFrom = user.uid
        const commentTimeStamp = new Date().getTime()
        uploadUserComment(uidFrom, uidToBeDisplayed, postToBeViewed, [commentTimeStamp, postComment]).then(() => {
            fetchPostComment(postToBeViewed)
        })
    }

    const handleFollowAction = () => {
        isFollowing ? setIsFollowing(false) : setIsFollowing(true)
    }

    const userContent = (
        <>
            <div className='profile-user-info'>
                <UserAvt className='profile-user-avt' self={false} src={profileUserAvt} />
                <div className='profile-user-details'>
                    <div className='name-follow'>
                        <p className='username'>{userToBeDisplayed}</p>
                        <button className='follow' onClick={() => {handleFollowAction()}}>{isFollowing ? 'Unfollow' : 'Follow'}</button>
                    </div>
                    <div className='user-description'>
                        <p className='display-name'>{displayName}</p>
                        <p className='user-bio'>This is the user's bio</p>
                    </div>
                </div>
                {
                    viewPost ?
                        <div className='user-full-post-container'>
                            <div className='user-full-post-exit' onClick={() => handleExitViewPost()}></div>
                            <div className='user-full-post'>
                                <div className='post-img-container'>
                                    <div className='img-only' ref={imagesRef}>
                                        {postImages}
                                    </div>
                                    <NextBtn className={`${!showNext && 'hide'} change-img next`} onClick={() => { handleNextImg() }} />
                                    <BackBtn className={`${!showBack && 'hide'} change-img back`} onClick={() => { handlePrevImg() }} />
                                </div>
                                <div className='post-caption'>
                                    <div className='post-info-container'>
                                        <UserAvt className='post-avt' self={false} src={profileUserAvt} />
                                        <p className='post-username'>{userToBeDisplayed}</p>
                                    </div>
                                    <div className='post-comment-container'>
                                        {comments}
                                    </div>
                                    <div className='post-add-comment-container'>
                                        <textarea className='post-add-comment-input' placeholder='Add comment...' name="add-comment" ref={textAreaRef} onChange={(e) => { handlePostCommentChange(e) }}></textarea>
                                        <p className='post-add-comment-submit' onClick={() => { handlePostCommentSubmit() }}>Add</p>
                                    </div>
                                    {/* {postCaption} */}
                                </div>
                            </div>
                        </div> :
                        null
                }
            </div>
            <div className='profile-user-post'>
                {posts}
            </div>
        </>
    )

    return (
        <>
            {!isSignedIn ? <p className='sign-out-action' onClick={() => {navigate("/")}}>Sign in to view this user's profile</p> : null}
            <div className={`${!isSignedIn ? 'sign-out-alert' : null} user-profile`}>
                {/* {editProfileRights ?
                <form onSubmit={(e) => { handleSubmitFile(e) }}>
                    <input type="file" onChange={(e) => { handleFileChange(e) }} />
                    <button type='submit'>Upload</button>
                </form>
            : null}
            <p>This page is of user</p>
            <p>{userToBeDisplayed}</p> */}
                <div className='profile-container'>
                    {
                        !userToBeDisplayed ?
                            <p>Loading...</p> :
                            userContent
                    }
                </div>
            </div>
        </>
    )
}

const mapDispatchToProps = ({ isSignedIn }) => ({
    isSignedIn: isSignedIn.isSignedIn
})

export default connect(mapDispatchToProps, null)(Profile);