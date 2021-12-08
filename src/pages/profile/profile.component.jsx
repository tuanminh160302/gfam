import './profile.styles.scss';
import { uploadUserData } from '../../firebase/firebase.init';

import { getAuth } from 'firebase/auth'

const Profile = () => {

    const auth = getAuth();
    const user = auth.currentUser

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
        </div>
    )
}

export default Profile;