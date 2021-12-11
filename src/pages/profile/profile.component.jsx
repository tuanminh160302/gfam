import { useEffect, useState } from 'react';
import './profile.styles.scss';
import { uploadUserAvatar } from '../../firebase/firebase.init';

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';

const Profile = () => {

    const auth = getAuth();
    const db = getFirestore();
    const location = useLocation();
    const pathname = location.pathname
    const userCollectionRef = collection(db, 'users');
    const user = auth.currentUser

    const [editProfile, setEditProfile] = useState()

    const [userToBeDisplayed, setUserToBeDisplayed] = useState();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const {uid} = user
                const userRef = doc(db, 'users', uid)
                getDoc(userRef).then((snapshot) => {
                    if (pathname.slice(1) === snapshot.data().userName) {
                        setEditProfile(true)
                    }
                })
            }
        })

        const queryUserToBeDisplayed = query(userCollectionRef, where("userName", "==", pathname.slice(1)))
        getDocs(queryUserToBeDisplayed).then((querySnapshot) => {
            if(querySnapshot.size === 1) {
                querySnapshot.forEach((snapshot) => {
                    // Process data to be displayed
                    const data = snapshot.data()
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
    }, [])

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

    return (
        <div className="user-profile">
            {editProfile ?
                <form onSubmit={(e) => { handleSubmitFile(e) }}>
                    <input type="file" onChange={(e) => { handleFileChange(e) }} />
                    <button type='submit'>Upload</button>
                </form>
            : null}
            <p>This page is of user</p>
            <p>{userToBeDisplayed}</p>
        </div>
    )
}

export default Profile;