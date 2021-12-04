import { useEffect } from 'react';

import './App.scss';

import { connect } from 'react-redux';
import { Routes, Route, useNavigate } from 'react-router-dom';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

import Header from './components/header/header.component';
import LoginPage from './pages/login-page/login-page.component';

const App = () => {

  let navigate = useNavigate()

  const auth = getAuth();
 
  useEffect(() => {
      onAuthStateChanged(auth, (user) => {
          if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              const uid = user.uid;
              navigate("/")
              console.log('signed in')
              // ...
          } else {
              // User is signed out
              navigate("/login")
              console.log('signed out')
              // ...
          }
      });
  }, [auth])

  return (
    <div className="App">
      <Header isLoggedIn={false}/>
      <Routes>
        <Route path='/login' element={<LoginPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
