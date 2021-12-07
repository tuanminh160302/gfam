import './profile.styles.scss';

import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from '@firebase/firestore';
import { uploadUserData } from '../../firebase/firebase.init';
import { updateAvt } from '../../firebase/firebase.init';

import { connect } from 'react-redux';
import { setUserAvt } from '../../redux/userSnap/userSnap.actions';

const Profile = ({ setUserAvt}) => {

    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user)

    const handleSubmitFile = (e) => {

    }

    const handleFileChange = (e) => {
        e.preventDefault()

        const file = e.target.files[0]
        const fileName = file.name
        console.log(fileName)
        uploadUserData(user, 'avatars', file, fileName, true)

        // update avt
        const url = updateAvt(user)
        // setUserAvt(url)
    }

    return (
        <div className="user-profile">
            <form onSubmit={(e) => { handleSubmitFile(e) }}>
                <input type="file" onChange={(e) => { handleFileChange(e) }} />
                <button type='submit'>Upload</button>
            </form>
        </div>
    )
}

const mapStateToProps = ({userSnap}) => ({
    avtURL: userSnap.avtURL
})

const mapDispatchToProps = (dispatch) => ({
    setUserAvt: (avtURL) => {dispatch(setUserAvt(avtURL))}
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

// ----------------------------------------------------------------------------------

import './profile.styles.scss';

import { getAuth } from "firebase/auth";
import { uploadUserData } from '../../firebase/firebase.init';

const Profile = () => {

    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user)

    const handleSubmitFile = (e) => {

    }

    const handleFileChange = (e) => {
        e.preventDefault()

        const file = e.target.files[0]
        const fileName = file.name
        console.log(fileName)
        uploadUserData(user, 'avatars', file, fileName, true)
    }

    return (
        <div className="user-profile">
            <form onSubmit={(e) => { handleSubmitFile(e) }}>
                <input type="file" onChange={(e) => { handleFileChange(e) }} />
                <button type='submit'>Upload</button>
            </form>
        </div>
    )
}

export default Profile;