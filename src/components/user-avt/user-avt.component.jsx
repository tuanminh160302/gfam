import { useEffect, useState } from 'react'
import './user-avt.styles.scss'

import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const UserAvt = ({onClick, className}) => {
    
    const [url, setUrl] = useState(null)

    const auth = getAuth();
    const user = auth.currentUser;
    const db = getFirestore()

    const {uid} = user
    console.log(user)

    const userRef = doc(db, "users", uid)
     
    getDoc(userRef).then(snapshot => {
        setUrl(snapshot.data().avatarURL)
    })

    return (
        <>
            <img className={className} src={url} alt="" onClick={onClick}/>
        </>
    )
}

export default UserAvt;