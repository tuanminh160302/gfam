import { useEffect, useRef, useCallback, Fragment } from 'react';
import ReactDOM from 'react-dom';
import './newsfeed.styles.scss';

import { connect } from 'react-redux';
import { setSignInState } from '../../redux/signInState/signInState.actions';
import { useNavigate } from 'react-router-dom';

import { getFirestore, doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'

import UserAvt from '../../components/user-avt/user-avt.component';

const NewsFeed = ({ isSignedIn, setSignInState }) => {

    const navigate = useNavigate()
    const db = getFirestore();    
    const auth = getAuth();
    const userCollectionRef = collection(db, 'users')
    const hasFetchData = useRef(false)

    const memoizedFetchSuggestions = useCallback(() => {
        const queryAllUser = query(userCollectionRef)
        getDocs(queryAllUser).then((querySnapshot) => {
            const suggestionsUsers = []
            querySnapshot.forEach((snapshot) => {
                const data = snapshot.data()
                const userName = data.userName
                const displayName = data.displayName
                const avatarURL = data.avatarURL
                const userData = {
                    userName,
                    displayName,
                    avatarURL
                }
                suggestionsUsers.push(userData)
            })
            const content = 
            <>
                {suggestionsUsers.map((userData, index) => {
                    return (
                        <div key={index} className='user-data'>
                            <UserAvt className='user-avt' self={false} src={userData.avatarURL}/>
                            <div className='user-info'>
                                <p className='user-name' onClick={() => {navigate(`/${userData.userName}`)}}>{userData.userName}</p>
                                <p className='display-name'>{userData.displayName}</p>
                            </div>
                        </div>
                    )
                })}
            </>

            ReactDOM.render(content, document.getElementById('suggestions'))
        })
    }, [userCollectionRef])

    const memoizedFetchCurrUser = useCallback(() => {
        const user = auth.currentUser
        console.log(user)
        if (user) {
            const {uid} = user
            const userRef = doc(db, "users", uid)
            getDoc(userRef).then((snapshot) => {
                const data = snapshot.data()
                const userName = data.userName
                const displayName = data.displayName

                const content = 
                <div className='user-data'>
                    <UserAvt className='user-avt' self={true}/>
                    <div className='user-info'>
                        <p className='user-name' onClick={() => {navigate(`/${userName}`)}}>{userName}</p>
                        <p className='display-name'>{displayName}</p>
                    </div>
                </div>

                ReactDOM.render(content, document.getElementById('user'))
            })
        }
    }, [auth])

    useEffect(() => {
        if (!hasFetchData.current) {
            hasFetchData.current = true

            memoizedFetchSuggestions()
        }

        memoizedFetchCurrUser()

    }, [memoizedFetchSuggestions, memoizedFetchCurrUser])

    return (
        <div className='newsfeed'>
            <div className='container'>
                <div className='left-con'>
                    <div className='con stories' id='stories'>

                    </div>

                    <div className='con posts' id='posts'>

                    </div>
                </div>

                <div className='right-con'>
                    <div className='con user' id='user'>

                    </div>

                    <div className='con suggestions' id='suggestions'>

                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ isSignedIn }) => ({
    isSignedIn: isSignedIn.isSignedIn
})

const mapDispatchToProps = (dispatch) => ({
    setSignInState: (isSignedIn) => { dispatch(setSignInState(isSignedIn)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed);