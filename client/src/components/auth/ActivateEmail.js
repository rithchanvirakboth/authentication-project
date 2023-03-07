import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { showErrorMessage, showSuccessMessage } from '../utils/notification/Notification';
import axios from 'axios';

function ActivateEmail() {

  const { activation_token } = useParams();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
      if(activation_token){
          const activationEmail = async () => {
              try {
                  const res = await axios.post('/user/activate', {activation_token})
                  setSuccess(res.data.msg);
              } catch (err) {
                  err.response.data.msg && setError(err.response.data.msg)
              }
          }
          activationEmail()
      }
  },[activation_token]);

  return (
    <div className="activate_page">
      { success ? showSuccessMessage(success) : '' || error ? showErrorMessage(error) : '' }
    </div>
  )
}

export default ActivateEmail