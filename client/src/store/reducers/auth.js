import * as actionTypes from '../actions/actionTypes';

const initialState = {
  isAuth: false,
  authToken: null,
  userId: null,
  userName: null,
  onlineUsers: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isAuth: true,
        authToken: action.token,
        userId: action.userId,
        userName: action.userName,
        onlineUsers: action.onlineUsers,
      };
    case actionTypes.AUTH_FAIL:
      return {
        ...state,
        isAuth: false,
        authToken: null,
        userId: null,
      };
    case actionTypes.AUTH_LOGOUT:
      return {
        ...state,
        isAuth: false,
        authToken: null,
        userId: null,
      };
    case actionTypes.RELATION_USER_DISCONNECTED: {
      const onlineUsersDisconnectUpdated = [...state.onlineUsers].filter((onlineUserId) => onlineUserId !== action.disconnectUserId);
      return {
        ...state,
        onlineUsers: onlineUsersDisconnectUpdated,
      };
    }
    case actionTypes.RELATION_USER_CONNECTED: {
      const onlineUsersConnectUpdated = [...state.onlineUsers].filter((onlineUserId) => onlineUserId !== action.connectUserId);
      onlineUsersConnectUpdated.push(action.connectUserId);
      return {
        ...state,
        onlineUsers: onlineUsersConnectUpdated,
      };
    }
    default:
      return state;
  }
};

export default reducer;
