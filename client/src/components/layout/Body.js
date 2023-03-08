import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../auth/Login';
import Register from '../auth/Register';
import ActivateEmail from '../auth/ActivateEmail';
import { useSelector } from 'react-redux';
import NotFound from '../utils/notFound/NotFound';
import ForgetPassword from '../auth/ForgetPassword';
import ResetPassword from '../auth/ResetPassword';
import Profile from '../page/profile';
import EditUser from '../page/admin/EditUser';

function Body() {
  // @ts-ignore
  const auth = useSelector(state => state.auth)
  const { isLogged } = auth;


  return (
    <section>
      <Routes>
        <Route path="/login" element={isLogged ? <NotFound /> : <Login />} />
        <Route path="/register" element={isLogged ? <NotFound /> : <Register />} />
        <Route path="/forget_password" element={isLogged ? <NotFound /> : <ForgetPassword />} />
        <Route path="/user/reset/:token" element={isLogged ? <NotFound /> : <ResetPassword />} />
        <Route path="/profile" element={isLogged ? <Profile /> : <NotFound />} />
        <Route path="/edit/:id" element={isLogged ? <EditUser /> : <NotFound />} />

        <Route path="/user/activate/:activation_token" element={<ActivateEmail />}/>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </section>
  )
}

export default Body