import './user-avt.styles.scss'

import { getAuth } from 'firebase/auth';

const UserAvt = ({onClick, className}) => {

    const auth = getAuth();
    const user = auth.currentUser;
    let url = null;
    
    if (user) {
        url = user.photoURL
    }

    return (
        <>
            <img className={className} src={url} alt="" onClick={onClick}/>
        </>
    )
}

export default UserAvt;