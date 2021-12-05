import { useEffect } from 'react';

import './App.scss';

import { connect } from 'react-redux';
import { Routes, Route, useNavigate } from 'react-router-dom';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { setSignInState } from './redux/signInState/signInState.actions'

import Header from './components/header/header.component';
import LoginPage from './pages/login-page/login-page.component';
import NewsFeed from './pages/newsfeed/newsfeed.component';

const App = ({isSignedIn, setSignInState}) => {

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
    <div className="App">
      <Header isLoggedIn={false}/>
      <Routes>
        <Route path='/login' element={<LoginPage />}></Route>
        <Route path='/' element={<NewsFeed />}></Route>
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
