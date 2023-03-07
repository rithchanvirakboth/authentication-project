import ACTIONS from "./index";
import axios from "axios";

export const dispatchLogin = () => {
  return {
    type: ACTIONS.LOGIN,
  };
}

export const getUser = async (token) => {
  const res = await axios.get('/user/information', {
    headers: { Authorization: token }
  });
  return res;
}

export const dispatchGetUser = (res) => {
  return {
    type: ACTIONS.GET_USER,
    payload: {
      user: res.data,
      isAdmin: res.data.role === 1 ? true : false
    }
  }
}
