import './header.styles.scss'

import Button from '../button/button.component';
import { getAuth, signOut } from "firebase/auth";
import { connect } from 'react-redux';

import { getInputValue } from '../../redux/signInData/signInData.actions';

const Header = ({isLoggedIn, setData}) => {

    const handleSignOut = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
          // Sign-out successful.
          const dataKeys = ['email', 'userName', 'displayName', 'password', 'confirmPassword'];
          for (const key of dataKeys) {
              const dataObject = {
                  [key]: ''
              }
              setData(dataObject)
          }
        }).catch((error) => {
          // An error happened.
        });
    }

    return (
        <div className='header'>
            {isLoggedIn 
            ? <div className='header-nav'>
                
            </div>
            : <div className='header-nav'>
                {/* <Button text="Log In" background='black' color='white' textSize='1.25rem'/>
                <Button text="Sign Up" background='black' color='white' textSize='1.25rem'/> */}
            </div>
            }

            <Button 
                background='black'
                text='Sign Out'
                color='white'
                onClick={() => {handleSignOut()}}
            />
        </div>
    )
}



const mapDispatchToProps = (dispatch) => ({
    setData: (data) => { dispatch(getInputValue(data)) }
})

export default connect(null, mapDispatchToProps)(Header);