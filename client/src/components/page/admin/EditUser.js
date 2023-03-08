import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector }  from 'react-redux';
import axios from 'axios';
import { showErrorMessage, showSuccessMessage } from '../../utils/notification/Notification';


function EditUser() {
  const { id } = useParams();

  const navigate = useNavigate();
  const [editUser, setEditUser] = useState([]);
  // @ts-ignore
  const users = useSelector(state => state.users);
  // @ts-ignore
  const token = useSelector(state => state.token);
  
  const [checkAdmin, setCheckAdmin] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [num, setNum] = useState(0);


  useEffect(() => {
    if(users.length !== 0){
      users.forEach(user => {
        if(user._id === id){
          setEditUser(user);
          setCheckAdmin(user.role === "1" ? true : false);
        }
      })  
    }else{
      navigate('/profile')
    }
  }, [users, id, navigate])

  const handleUpdate = async () => {
    try {
      if(num % 2 !== 0){
        // @ts-ignore
        const res = await axios.patch(`/user/update_role/${editUser._id}`, {
          role: checkAdmin ? 1 : 0
        }, {
          headers: {Authorization: token}
        })

        setSuccess(res.data.msg);
        setNum(0);
      }
    } catch (error) {
      setError(error.response.data.msg);
    }
  }

  const handleChecked = () => {
    // @ts-ignore
    setSuccess('');
    // @ts-ignore
    setError('');
    setCheckAdmin(!checkAdmin);
    setNum(num + 1);

  }


  return (
    <>
      <div className='go-back'>
        <button 
          className='go-back-btn'
          onClick={() => navigate('/profile')}
        >
          <i className="fa fa-arrow-left"></i> 
          Go Back
        </button>
      </div>
      <div className="edit_user">
        <div className="container">
          <div className="header">
            <h2>Edit User</h2>  
          </div>
          <div className="body">
            <div className="form-group">
              <label htmlFor="name">Username</label>
              <input 
                type="text" 
                name="userName" 
                id="userName" 
                // @ts-ignore
                defaultValue={editUser.userName} 
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="text" 
                name="email" 
                id="email" 
                // @ts-ignore
                defaultValue={editUser.email} 
                disabled  
              />
            </div>
          </div>
          <div className="admin-chcekbox">
            <input id="setAdmin" type="checkbox" hidden checked={checkAdmin} onChange={handleChecked} />
            <label htmlFor="setAdmin">Set as Admin</label>
          </div>
          <div className="button">
            <button type="button" className="btn btn-primary" onClick={handleUpdate}>Update</button>
          </div>

          <div className="showMessage">
            {error && showErrorMessage(error)}
            {success && showSuccessMessage(success)}
          </div>
        </div>
      </div>
    </>
  )
}

export default EditUser