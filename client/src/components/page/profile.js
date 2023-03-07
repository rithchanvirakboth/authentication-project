import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { isLength, isMatch } from '../validation/Validation';
import { showErrorMessage, showSuccessMessage } from '../utils/notification/Notification';

const initialState = {
  firstName: '',
  lastName: '',
  userName: '',
  password: '',
  confirmPassword: '',
  error: '',
  success: ''
}

function Profile() {

  // @ts-ignore
  const auth = useSelector(state => state.auth);
  // @ts-ignore
  const token = useSelector(state => state.token);
  
  const { user, isAdmin } = auth;
  const [data, setData] = useState(initialState);
  const { firstName, lastName, userName, email, password, confirmPassword, error, success } = data;

  const [avatar, setAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [callBack, setCallBack] = useState(false);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   if(isAdmin){

  //   }

  const handleChange = e => {
      const {name, value} = e.target
      setData({...data, [name]:value, error:'', success: ''})
  }

  const updateInformation = () => {
    try {
      axios.patch('/user/update', {
        firstName: firstName ? firstName : user.firstName,
        lastName: lastName ? lastName : user.lastName,
        userName: userName ? userName : user.userName,
        avatar: avatar ? avatar : user.avatar
      }, {
        headers: {Authorization: token}
      })
      setData({...data, error: '', success: 'Update information successfully!'})
    } catch (err) {
      setData({...data, error: err.response.data.msg, success: ''})
    }
  }

  const updatePassword = () => {
    if(isLength(password))
      return setData({...data, error: "Password must be at least 6 characters.", success: ''})
    if(!isMatch(password, confirmPassword))
      return setData({...data, error: "Password did not match.", success: ''})
      
    try {
      axios.post('/user/reset', {password}, {
        headers: {Authorization: token}
      })
      setData({...data, error: '', success: 'Update password successfully!'})
    }catch (err) {
      setData({...data, error: err.response.data.msg, success: ''})
    }
  }

  const handleUpdate = () => {
    if(firstName || lastName || userName || email || avatar) updateInformation(); 
    if(password) updatePassword();
  }

  const changeAvatar = async(e) => {
    e.preventDefault()
    try {
        const file = e.target.files[0]

        if(!file) return setData({...data, error: "No files were uploaded." , success: ''})

        if(file.size > 1024 * 1024)
            return setData({...data, error: "Size too large." , success: ''})

        if(file.type !== 'image/jpeg' && file.type !== 'image/png')
            return setData({...data, error: "File format is incorrect." , success: ''})

        let formData =  new FormData()
        formData.append('file', file)

        setLoading(true)
        const res = await axios.post('/api/upload_avatar', formData, {
            headers: {'content-type': 'multipart/form-data', Authorization: token}
        })

        setLoading(false)
        setAvatar(res.data.url)
        
    } catch (err) {
        setData({...data, error: err.response.data.msg , success: ''})
    }
  }

  return (
    <>
      <div>
        {error && showErrorMessage(error)}
        {success && showSuccessMessage(success)}
        {loading && <h3>Loading...</h3>}
      </div>


      <div className="profilePage">
        <div className="col_left">
          <h2>{isAdmin ? "Admin Profile" : "User Profile"}</h2>

          <div className="avatar">
            <img src={avatar ? avatar : user.avatar} alt="avatar" />
            <span>
              <i className="fa fa-camera"></i>
              <p>Change</p>
              <input type="file" name="file" id="file_up" onChange={changeAvatar} />
            </span>
          </div>

          <div className="form_group">
            <label htmlFor="firstName">First Name</label>
            <input 
              type="text" 
              name="firstName" 
              id="firstName" 
              defaultValue={user.firstName}
              placeholder="Your first name" 
              onChange={handleChange} 
            />
          </div>
          
          <div className="form_group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text" 
              name="lastName" 
              id="lastName" 
              defaultValue={user.lastName}
              placeholder="Your last name" 
              onChange={handleChange} 
            />
          </div>
          
          <div className="form_group">
            <label htmlFor="userName">User Name</label>
            <input 
              type="text" 
              name="userName" 
              id="userName" 
              defaultValue={user.userName} 
              placeholder="Your user name" 
              onChange={handleChange}
            />
          </div>
          
          <div className="form_group">
            <label htmlFor="email">Email</label>
            <input
              type="email" 
              name="email" 
              id="email" 
              defaultValue={user.email}
              placeholder="Your email address" 
              onChange={handleChange} 
              disabled
            />
          </div>
          
          <div className="form_group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              name="password" 
              id="password" 
              defaultValue={user.password}
              placeholder="Your password" 
              onChange={handleChange}
            />
          </div>
          
          <div className="form_group">
            <label htmlFor="cf_password">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              id="confirmPassword" 
              defaultValue={user.confirmPassword}
              placeholder="Confirm password" 
              onChange={handleChange} 
            />
          </div>
            <em style={{ color: "var(--text-danger)"}}>
               * If you update your password here, you will not be able to login quickly using google and facebook.
            </em>
          <button disabled={loading} onClick={handleUpdate}> Update </button>
        </div>

        <div className="col-right">
          <h2>{isAdmin ? "Users" : "My Orders"}</h2>
          
          <div style={{overflow: "auto"}}>
            <table className="customers">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Admin</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* {
                  users.map(user => (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        {
                          user.role === 1
                          ? user.root ? <i className="fas fa-check" title="Admin"></i>
                          : <i className="fas fa-check" title="Staff"></i>
                          : <i className="fas fa-times" title="User"></i>
                        }
                      </td>
                      <td>
                        <Link to={`/edit_user/${user._id}`}>
                          <i className="fas fa-edit" title="Edit"></i>
                        </Link>
                        <Link to="#!">
                          <i className="fas fa-trash-alt" title="Remove"></i>
                        </Link>
                      </td>
                    </tr>
                  ))
                } */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile