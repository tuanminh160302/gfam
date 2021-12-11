import { useEffect } from 'react';

import './App.scss';

import { connect } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { getFirestore, doc, onSnapshot} from 'firebase/firestore';

import { setSignInState } from './redux/signInState/signInState.actions'

import Header from './components/header/header.component';
import LoginPage from './pages/login-page/login-page.component';
import NewsFeed from './pages/newsfeed/newsfeed.component';
import Profile from './pages/profile/profile.component';

const App = ({isSignedIn, setSignInState}) => {

  const auth = getAuth();
  const db = getFirestore();
 
  useEffect(() => {
      onAuthStateChanged(auth, (user) => {
          if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              const {uid} = user
              onSnapshot(doc(db, 'users', uid), (doc) => {
                if (doc.data()) {
                  setSignInState(true)
                  console.log('signed in')
                }
              })
              // ...
          } else {
              // User is signed out
              setSignInState(false)
              console.log('signed out')
              // ...
          }
      });
  }, [auth, setSignInState, db])

  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path='/' element={isSignedIn===false ? <LoginPage /> : <NewsFeed />}></Route>
        {/* <Route path='/login' element={<LoginPage />}></Route>
        <Route path='/' element={<NewsFeed />}></Route> */}
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
