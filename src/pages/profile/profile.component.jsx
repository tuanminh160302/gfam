import { Fragment, useEffect, useState } from 'react';
import './profile.styles.scss';
import { uploadUserAvatar } from '../../firebase/firebase.init';

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { fetchUserPost } from '../../firebase/firebase.init';
import { useLocation } from 'react-router-dom';

import UserAvt from '../../components/user-avt/user-avt.component';
import PostPreview from '../../components/post-preview/post-preview.component';

const Profile = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const auth = getAuth();
    const db = getFirestore();
    const location = useLocation();
    const pathname = location.pathname
    const user = auth.currentUser

    const [profileUserAvt, setProfileUserAvt] = useState(null)
    const [displayName, setDisplayName] = useState()
    const [editProfileRights, seteditProfileRights] = useState()
    const [toggleEditProfile, setToggleEditProfile] = useState(false)
    const [userToBeDisplayed, setUserToBeDisplayed] = useState()
    const [allPost, setAllPost] = useState([])
    const [viewPost, setViewPost] = useState(null)

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
                                const post = {[key]: data[key]}
                                allPost.push(post)
                            }
                        }
                        allPost.sort((a,b) => (Object.keys(a) > Object.keys(b) ? -1 : 1))
                        setAllPost(allPost)
                    })

                    setUserToBeDisplayed(data.userName)
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

    const handleViewPost = (e) => {
        e.preventDefault()
        setViewPost(e.target.alt)
    }

    const handleExitViewPost = () => {
        setViewPost(null)
    }

    const fullPost = (
        <div>{viewPost}</div>
    )

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
        console.log(Object.values(postContent['URLS']))
        return (
            <div className='post' key={index}>
                <div className='post-content'>
                    <img className='post-display-img' src={postDisplayImg} alt={timeStamp} onClick={(e) => {handleViewPost(e)}}/>
                </div>
            </div>
        )
    })

    const userContent = (
        <>
            <div className='profile-user-info'>
                <UserAvt className='profile-user-avt' self={false} src={profileUserAvt} />
                <div className='profile-user-details'>
                    <p className='username'>{userToBeDisplayed}</p>
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
                                {fullPost}
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
        <div className="user-profile">
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
    )
}

export default Profile;