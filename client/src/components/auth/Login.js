import React, { useState } from 'react'
import { Link, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import { showErrorMessage, showSuccessMessage } from '../utils/notification/Notification';
import { dispatchLogin } from '../../redux/actions/authAction';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

const initialState = {
  email: '',
  password: '',
  errorMessage: '',
  successMessage: ''
}


function Login() {
  const [user, setUser] = useState(initialState)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { email, password, errorMessage, successMessage } = user;

  const handleChangeInput = e => {
    const { name, value } = e.target
    setUser({ ...user, [name]:value, errorMessage: '', successMessage: '' })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await axios.post('/user/login', { 
        email, 
        password 
      })
      
      setUser({ ...user, errorMessage: '', successMessage: res.data.msg })

      // @ts-ignore
      localStorage.setItem('firstLogin', true)

      dispatch(dispatchLogin());
      navigate("/profile");
    } catch (err) {
      err.response.data.msg && setUser({ ...user, errorMessage: err.response.data.msg, successMessage: '' })
    }
  }

  const responseGoogle = (response) => {
    console.log(response);
  }

  const responseFacebook = (response) => {
    console.log(response);
  }
    
  return (
    <div className='login'>
      <h1>Login</h1>

      {/* Notification */}

      {errorMessage && showErrorMessage(errorMessage)}
      {successMessage && showSuccessMessage(successMessage)}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input 
            type='email' 
            name='email' 
            placeholder='Enter your email' 
            id='email' 
            required 
            value={email}
            onChange={handleChangeInput}
          />
        </div>
        <div>
          <label>Password</label>
          <input 
            type='password' 
            name='password' 
            placeholder='Enter your Password' 
            id='password' 
            required 
            value={password}
            onChange={handleChangeInput}
          />
        </div>
        <div className="row">
          <button type='submit'>
            Login
          </button>
          <Link to="/forget_password">Forget your password?</Link>
        </div>
        <p>Don't have an account?<Link to="/register">Sign up</Link>now</p>
      </form>

      <div className="social-media-login">
        <p>login with</p>
      </div>
      <div className="social-media">
        <GoogleLogin
          clientId="510349148423-v9mpgt4ne7vsj9i670dml5d1rfvh0blr.apps.googleusercontent.com"
          buttonText="Login with google"
          onSuccess={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />,
        <FacebookLogin
          appId="1088597931155576"
          autoLoad={false}
          fields="name,email,picture"
          callback={responseFacebook} 
        />
      </div>
    </div>
  )
}

export default Login