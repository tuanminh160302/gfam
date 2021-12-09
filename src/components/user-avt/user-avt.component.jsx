import './user-avt.styles.scss'

import { getAuth } from 'firebase/auth';

const UserAvt = ({onClick, className, self, src}) => {

    const auth = getAuth();
    const user = auth.currentUser;
    let url = null;
    
    if (user) {
        url = user.photoURL
    }

    return (
        <>
            <img className={className} src={self ? url : src} alt="" onClick={onClick}/>
        </>
    )
}

export default UserAvt;