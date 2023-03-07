import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Body from './components/layout/Body';
import Header from './components/layout/Header';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ACTIONS from './redux/actions';
import { dispatchLogin, getUser, dispatchGetUser } from './redux/actions/authAction';

function App() {
  const dispatch = useDispatch();
  // @ts-ignore
  const auth = useSelector(state => state.auth);
    // @ts-ignore
  const token = useSelector(state => state.token);

  useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin');
    if (firstLogin) {
      const refreshToken = async () => {

        const res = await axios.post('/user/refresh_token', null);
        dispatch({ type: ACTIONS.GET_TOKEN, payload: res.data.access_token });

      }
      refreshToken();
    }
  }, [auth.isLogged, dispatch])

  useEffect(() => {
    if(token){
      const getUsers =  () => {
        dispatch(dispatchLogin());
        return getUser(token).then(res => {
          dispatch(dispatchGetUser(res));
        })
      }
      getUsers();
    }
  }, [token, dispatch])
      
  return (
    <Router>
      <div className="App">
        <Header />
        <Body />
      </div>
    </Router>
  );
}

export default App;
