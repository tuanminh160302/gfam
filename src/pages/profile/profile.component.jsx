import './profile.styles.scss';
import { uploadUserData } from '../../firebase/firebase.init';

import { getAuth } from 'firebase/auth'
import { getFirestore, doc, getDoc, collection, getDocs, where } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';

const Profile = () => {

    const auth = getAuth();
    const db = getFirestore();
    const location = useLocation();
    const userCollectionRef = collection(db, 'users');
    const user = auth.currentUser
    const userName = useRef(null);
    if (user) {
        const {uid} = user
        const userRef = doc(db, 'users', uid)
        getDoc(userRef).then((snapshot) => {
            userName.current = snapshot.data().userName
            console.log("userName", "=>", userName.current)
        })
    }

    let file = null
    let fileName = null

    const handleFileChange = (e) => {
        e.preventDefault()

        file = e.target.files[0]
        fileName = file.name
    }

    const handleSubmitFile = (e) => {
        e.preventDefault()

        console.log(fileName)
        uploadUserData(user, 'avatars', file, fileName, true)
    }

    return (
        <div className="user-profile">
            <form onSubmit={(e) => { handleSubmitFile(e) }}>
                <input type="file" onChange={(e) => { handleFileChange(e) }} />
                <button type='submit'>Upload</button>
            </form>
            <p>This page is of user</p>
            <p>{userName.current}</p>
        </div>
    )
}

export default Profile;