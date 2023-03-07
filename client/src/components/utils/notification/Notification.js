import React from 'react'

export const showErrorMessage = (msg) => {
  return <div className='error_msg'>{msg}</div>
}

export const showSuccessMessage = (msg) => {
  return <div className='success_msg'>{msg}</div>
}
