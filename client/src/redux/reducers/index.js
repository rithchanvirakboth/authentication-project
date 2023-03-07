import { combineReducers } from 'redux';
import auth from './authReducers';
import token from './tokenReducer';

export default combineReducers({
  auth,
  token,
});
