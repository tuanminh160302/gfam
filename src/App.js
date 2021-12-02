import './App.scss';

import { connect } from 'react-redux';
import { Routes, Route, withRouter } from 'react-router-dom';

import Header from './components/header/header.component';
import LoginPage from './pages/login-page/login-page.component';

const App = () => {
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
