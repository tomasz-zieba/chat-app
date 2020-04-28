import * as actionTypes from './actionTypes';
import * as action from './index';
import { socket } from '../../App';

const loginSuccess = (authToken, userId, userName, onlineUsers) => ({
  type: actionTypes.LOGIN_SUCCESS,
  authToken,
  userId,
  userName,
  onlineUsers,
});

export const authLogout = () => {
  const userId = localStorage.getItem('userId');
  socket.emit('end', userId);

  localStorage.removeItem('token');
  localStorage.removeItem('expiryDate');
  localStorage.removeItem('userId');
  return {
    type: actionTypes.USER_LOGOUT,
  };
};

const backdropOpen = () => ({
  type: actionTypes.OPEN_BACKDROP,
});

const backdropClose = () => ({
  type: actionTypes.CLOSE_BACKDROP,
});

const authFail = () => ({
  type: actionTypes.AUTH_FAIL,
});

const checkAuthTimeout = (expirationTime) => (dispatch) => {
  setTimeout(() => {
    dispatch(authLogout());
  }, expirationTime * 1000);
};

export const relationUserDisconnect = (disconnectUserId) => ({
  type: actionTypes.RELATION_USER_DISCONNECTED,
  disconnectUserId,
});

export const relationUserConnect = (connectUserId) => ({
  type: actionTypes.RELATION_USER_CONNECTED,
  connectUserId,
});

export const autoLogin = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  if (!token) {
    dispatch(authFail());
  } else {
    const expirationDate = new Date(localStorage.getItem('expiryDate'));
    if (expirationDate <= new Date()) {
      dispatch(authFail());
    } else {
      try {
        const userId = localStorage.getItem('userId');
        dispatch(backdropOpen());
        const res = await fetch('/auth/auto-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
          }),
        });
        dispatch(backdropClose());
        if (res.status === 401) {
          throw new Error('User name or password are wrong.');
        }
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Could not authenticate you.');
        }
        const resData = await res.json();
        socket.emit('new-user', resData.userId);
        dispatch(loginSuccess(token, userId, resData.userName, resData.onlineUsers));
        if (resData.invitations.length) {
          dispatch(action.addInfo(resData.invitations));
        }
        dispatch(action.addToChatRooms(resData.chats));
        checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000);
      } catch (error) {
        dispatch(action.addInfo({
          userId: '', name: '', text: 'There was problem with server. Try again later.', type: 'warning',
        }));
      }
    }
  }
};

export const authLogin = (name, password) => async (dispatch) => {
  try {
    // setBackdropOpen(true);
    dispatch(backdropOpen());
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        password,
      }),
    });
    dispatch(backdropClose());
    if (res.status === 401) {
      throw new Error('User name or password are wrong.');
    }
    if (res.status !== 200 && res.status !== 201) {
      throw new Error('Could not authenticate you.');
    }

    // socket.emit('new-user', name);
    const resData = await res.json();
    socket.emit('new-user', resData.userId);

    const remainingMilliseconds = 60 * 60 * 1000;
    const expiryDate = new Date(
      new Date().getTime() + remainingMilliseconds,
    );
    localStorage.setItem('expiryDate', expiryDate.toISOString());
    localStorage.setItem('token', resData.token);
    localStorage.setItem('userId', resData.userId);

    checkAuthTimeout(remainingMilliseconds);
    dispatch(loginSuccess(resData.token, resData.userId, resData.userName, resData.onlineUsers));
    if (resData.invitations.length) {
      dispatch(action.addInfo(resData.invitations));
    }
    dispatch(action.addToChatRooms(resData.chats));
  } catch (error) {
    dispatch(action.addInfo({
      userId: '', name: '', text: 'There was problem with server. Try again later.', type: 'warning',
    }));
  }
};

export const authSignup = (name, password) => async (dispatch) => {
  dispatch(backdropOpen());
  try {
    const res = await fetch('/auth/signup', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
        name,
      }),
    });
    dispatch(backdropClose());
    if (res.status === 422) {
      throw new Error("Validation failed! Make sure user name isn't used yet!");
    }
    if (res.status !== 200 && res.status !== 201) {
      throw new Error('Creating a user failed!');
    }
    const resData = await res.json();

    const newInfo = {
      key: resData.userId + resData.message, text: resData.message, type: 'info', userId: resData.userId,
    };
    dispatch(action.addInfo(newInfo));
  } catch (error) {
    dispatch(action.addInfo({
      userId: '', name: '', text: 'There was problem with server. Try again later.', type: 'warning',
    }));
  }
};
