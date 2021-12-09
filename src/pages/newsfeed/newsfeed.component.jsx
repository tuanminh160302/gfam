import './newsfeed.styles.scss';

import { connect } from 'react-redux';
import { setSignInState } from '../../redux/signInState/signInState.actions';

import { getFirestore, doc, getDoc, collection, getDocs, query } from 'firebase/firestore';

const NewsFeed = ({ isSignedIn, setSignInState }) => {

    const db = getFirestore();    

    const handleGetUsers = () => {
        // collection(db, 'users').then((snapshot) => {
        //     snapshot.docs
        // })
    }

    return (
        <div className='newsfeed'>
            <div className='container'>
                <div className='left-con'>
                    <div className='con stories'>

                    </div>

                    <div className='con posts'>

                    </div>
                </div>

                <div className='right-con'>
                    <div className='con user' onClick={(() => { handleGetUsers() })}>

                    </div>

                    <div className='con suggestions'>

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