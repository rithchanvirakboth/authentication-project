import React, { useState} from 'react';
import axios from 'axios';
import { isEmail } from '../validation/Validation';
import { showErrorMessage, showSuccessMessage } from '../utils/notification/Notification';

const initialState = {
  email: '',
  error: '',
  success: ''
}

function ForgetPassword() {
  const [data, setData] = useState(initialState)

  const { email, error, success } = data
  
  const handleChangeInput = e => {
    const { name, value } = e.target
    setData({ ...data, [name]:value, error: '', success: '' })
  }

  const forgetPassword = async () => {
    if(!isEmail(email))
      return setData({ ...data, error: 'Invalid email.', success: '' })
    try {
      const res = await axios.post('/user/forget', {email})
      return setData({ ...data, error: '', success: res.data.msg })
    }catch(err) {
      setData({ ...data, error: err.response.data.msg, success: '' })
    }
  }

  return (
    <div className='forget_password'>
      <h2>Forgot your password?</h2>
      <div className="row">
        {error && showErrorMessage(error)}
        {success && showSuccessMessage(success)}
      </div>
      <p>Enter your email address below and we'll send you instructions on how to reset your password.</p>
      <input 
        type="email" 
        name="email" 
        id="email" 
        placeholder="Enter your email address" 
        value={email} 
        onChange={handleChangeInput}
      />
      <div className="button">
        <button onClick={forgetPassword}>Verify your email</button>
      </div>
    </div>
  )
}

export default ForgetPassword