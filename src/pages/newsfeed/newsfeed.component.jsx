import { useEffect } from 'react';

import './newsfeed.styles.scss';

import { useNavigate } from 'react-router';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { connect } from 'react-redux';
import { setSignInState } from '../../redux/signInState/signInState.actions';

const NewsFeed = ({isSignedIn, setSignInState}) => {

    let navigate = useNavigate()

    const auth = getAuth();
   
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                navigate("/", {replace: true})
                setSignInState(true)
                console.log('signed in')
                // ...
            } else {
                // User is signed out
                navigate("/login", {replace: true})
                setSignInState(false)
                console.log('signed out')
                // ...
            }
        });
    }, [auth, navigate, setSignInState])

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
                    <div className='con user'>

                    </div>

                    <div className='con suggestions'>

                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({isSignedIn}) => ({
    isSignedIn: isSignedIn.isSignedIn
  })
  
  const mapDispatchToProps = (dispatch) => ({
    setSignInState: (isSignedIn) => {dispatch(setSignInState(isSignedIn))}
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed);