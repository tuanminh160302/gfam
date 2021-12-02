import './header.styles.scss'

import Button from '../button/button.component';

const Header = ({isLoggedIn}) => {
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
        </div>
    )
}

export default Header;