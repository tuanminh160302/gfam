import { useEffect } from 'react';

import './App.scss';

import { connect } from 'react-redux';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { setSignInState } from './redux/signInState/signInState.actions'

import Header from './components/header/header.component';
import LoginPage from './pages/login-page/login-page.component';
import NewsFeed from './pages/newsfeed/newsfeed.component';
import Profile from './pages/profile/profile.component';

const App = ({isSignedIn, setSignInState}) => {

  const location = useLocation()
  const pathname = location.pathname
  const navigate = useNavigate()

  useEffect(() => {
    console.log(pathname)
    console.log("re-render")
  }, [pathname])

  const auth = getAuth();
 
  useEffect(() => {
      onAuthStateChanged(auth, (user) => {
          if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              setSignInState(true)
              console.log('signed in')
              // ...
          } else {
              // User is signed out
              setSignInState(false)
              console.log('signed out')
              // ...
          }
      });
  }, [auth, setSignInState, location.pathname])

  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path='/login' element={<LoginPage />}></Route>
        <Route path='/' element={<NewsFeed />}></Route>
        <Route path='/:username' element={<Profile />}></Route>
      </Routes>
    </div>
  );
}

const mapStateToProps = ({isSignedIn}) => ({
  isSignedIn: isSignedIn.isSignedIn
})

const mapDispatchToProps = (dispatch) => ({
  setSignInState: (isSignedIn) => {dispatch(setSignInState(isSignedIn))}
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
