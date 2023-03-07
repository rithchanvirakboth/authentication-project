import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { showErrorMessage, showSuccessMessage } from '../utils/notification/Notification';
import axios from 'axios';
import { isEmail, isEmpty, isLength, isMatch } from '../validation/Validation';

const initialState = {
  firstName: '',
  lastName: '',
  userName: '',
  email: '',
  password: '',
  confirmPassword: '',
  errorMessage: '',
  successMessage: ''
} 

function Register() {
  const [user, setUser] = useState(initialState);


  const { 
    firstName,
    lastName,
    userName,
    email,
    password,
    confirmPassword,
    errorMessage,
    successMessage
  } = user;

  const handleChangeInput = e => {
    const { name, value } = e.target;
    setUser({ ...user, [name]:value, errorMessage: '', successMessage: '' });
  }

  const handleSubmit = async e => {
    e.preventDefault();

    if(isEmpty(firstName) || isEmpty(lastName) || isEmpty(userName) || isEmpty(password))
      return setUser({ ...user, errorMessage: "Please fill in all fields", successMessage: '' });

    if(!isEmail(email))
      return setUser({ ...user, errorMessage: "Invalid email", successMessage: '' });
  
    if(isLength(password))
      return setUser({ ...user, errorMessage: "Password must be at least 6 characters", successMessage: '' });
    
    if(!isMatch(password, confirmPassword))
      return setUser({ ...user, errorMessage: "Passwords do not match", successMessage: '' });
    
    try {
      const res = await axios.post('/user/register', {
        firstName,
        lastName,
        userName,
        email,
        password,
        confirmPassword
      });

      setUser({ ...user, errorMessage: '', successMessage: res.data.msg });
    }catch (err) {
      err.response.data.msg && setUser({ ...user, errorMessage: err.response.data.msg, successMessage: '' });
    }
  }

  return (
    <div className="register">
      <h1>Register</h1>

      {/* Notification */}

      {errorMessage && showErrorMessage(errorMessage)}
      {successMessage && showSuccessMessage(successMessage)}


      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input 
            type="text"
            name='firstName'
            placeholder='Enter your first name'
            id='firstName' 
            value={firstName}
            onChange={handleChangeInput}

          />
        </div>

        <div>
          <label>Last Name</label>
          <input 
            type="text"
            name='lastName'
            placeholder='Enter your last name'
            id='lastName' 
            value={lastName}
            onChange={handleChangeInput}
            
          />
        </div>

        <div>
          <label>Username</label>
          <input 
            type="text"
            name='userName'
            placeholder='Enter your username'
            id='userName' 
            value={userName}
            onChange={handleChangeInput}
            
          />
        </div>

        <div>
          <label>Email</label>
          <input 
            type='email' 
            name='email' 
            placeholder='Enter your email' 
            id='email' 
             
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
             
            value={password}
            onChange={handleChangeInput}
          />
        </div>

        <div>
          <label>Confirm Password</label>
          <input
            type='password'
            name='confirmPassword'
            placeholder='Confirm your Password'
            id='confirmPassword'
            
            value={confirmPassword}
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <button type='submit'>
            Sign up
          </button>
          <p>Don't have an account?<Link to="/login">Sign in</Link>now</p>
        </div>
      </form>

    </div>
  )
}

export default Register