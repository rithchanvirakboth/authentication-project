import ACTIONS from "../actions/index";

const initialState = {
  user: [],
  isLogged: false, 
  isAdmin: false,
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return {
        ...state,
        // user: action.payload,
        isLogged: true,
        // isAdmin: action.payload.isAdmin,
      }
    case ACTIONS.GET_USER:
      return {
        ...state,
        // user: action.payload,
        user: action.payload.user,
        isAdmin: action.payload.isAdmin,
      }
    // case ACTIONS.LOGOUT:
    //   return {
    //     ...state,
    //     // user: [],
    //     isLogged: false,
    //     // isAdmin: false,
    //   }
      default:
        return state;
    }
}
export default authReducer;
