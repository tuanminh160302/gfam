import './newsfeed.styles.scss';

import { connect } from 'react-redux';
import { setSignInState } from '../../redux/signInState/signInState.actions';

const NewsFeed = ({isSignedIn, setSignInState}) => {

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