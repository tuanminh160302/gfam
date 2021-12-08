import './profile.styles.scss';
import { uploadUserData } from '../../firebase/firebase.init';

import { getAuth, onAuthStateChanged } from 'firebase/auth'

const Profile = () => {

    const handleSubmitFile = (e) => {

    }

    const handleFileChange = (e) => {
        e.preventDefault()

        const auth = getAuth();
        const user = auth.currentUser
        console.log(user)

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