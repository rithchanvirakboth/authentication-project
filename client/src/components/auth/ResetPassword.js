import React, { useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { showErrorMessage, showSuccessMessage } from '../utils/notification/Notification';
import { isLength, isMatch } from '../validation/Validation';

const initialState = {
  password: '',
  confirmPassword: '',
  error: '',
  success: ''
}

function ResetPassword() {
  const { token } = useParams()
  const [data, setData] = useState(initialState)
  
  const { password, confirmPassword, error, success } = data

  const handleChangeInput = e => {
    const { name, value } = e.target
    setData({ ...data, [name]:value, error: '', success: '' })
  }


  const handleResetPassword = async (e) => {
    if(isLength(password))
      return setData({ ...data, error: 'Password must be at least 6 characters.', success: '' })
    if(!isMatch(password, confirmPassword))
      return setData({ ...data, error: 'Password did not match.', success: '' })
    try{
      const res = await axios.post('/user/reset', {password}, {
        headers: { Authorization: token }
      })
      return setData({ ...data, error: '', success: res.data.msg })
      
    }catch(err) {
      setData({ ...data, error: err.response.data.msg, success: '' })
    }
  }


  return (
    <div className='forget_password'>
      <h2>Reset your password</h2>
      <div className="row">
        {error && showErrorMessage(error)}
        {success && showSuccessMessage(success)}
      </div>
      <p>Enter password and confirmation password below to reset your password.</p>
      <input 
        type="password" 
        name="password" 
        id="password" 
        placeholder="Enter your password" 
        value={password} 
        onChange={handleChangeInput}
      />
      <input 
        type="password" 
        name="confirmPassword" 
        id="confirmPassword" 
        placeholder="Enter your confirmation password" 
        value={confirmPassword} 
        onChange={handleChangeInput}
      />
      <div className="button">
        <button onClick={handleResetPassword}>Reset password</button>
      </div>
    </div>
  )
}

export default ResetPassword