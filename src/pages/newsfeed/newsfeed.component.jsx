import { useEffect, useRef, useCallback, Fragment } from 'react';
import ReactDOM from 'react-dom';
import './newsfeed.styles.scss';

import { connect } from 'react-redux';
import { setSignInState } from '../../redux/signInState/signInState.actions';

import { getFirestore, doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

import UserAvt from '../../components/user-avt/user-avt.component';

const NewsFeed = ({ isSignedIn, setSignInState }) => {

    const db = getFirestore();    
    const userCollectionRef = collection(db, 'users')
    const hasFetchData = useRef(false)

    const memoizedFetchSuggestions = useCallback(() => {
        const queryAllUser = query(userCollectionRef)
        getDocs(queryAllUser).then((querySnapshot) => {
            const suggestionsUsers = []
            querySnapshot.forEach((snapshot) => {
                const avatarURL = snapshot.data().avatarURL
                suggestionsUsers.push(avatarURL)
            })
            const content = 
            <div>
                {suggestionsUsers.map((user, index) => {
                    return (
                        <Fragment key={index}>
                            <UserAvt className='user-avt' self={false} src={user}/>
                        </Fragment>
                    )
                })}
            </div>

            ReactDOM.render(content, document.getElementById('suggestions'))
        })
    }, [userCollectionRef])

    useEffect(() => {
        if (!hasFetchData.current) {
            hasFetchData.current = true

            memoizedFetchSuggestions()
        }
    }, [memoizedFetchSuggestions])

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
                    <div className='con user' id='users'>

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