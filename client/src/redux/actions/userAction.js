import ACTIONS from "../actions/index";
import axios from "axios";

export const getAllUsers = async (token) => {
  const res = await axios.get('/user/admin', {
    headers: { Authorization: token }
  })
  return res
}

export const dispatchGetAllUsers = (res) => {
  return {
    type: ACTIONS.GET_ALL_USERS,
    payload: res.data
    }
  }
