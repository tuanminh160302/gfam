import './header.styles.scss'

import Button from '../button/button.component';
import { getAuth, signOut } from "firebase/auth";

const Header = ({isLoggedIn}) => {

    const handleSignOut = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
          // Sign-out successful.
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

export default Header;