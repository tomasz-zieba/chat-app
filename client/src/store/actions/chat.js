import * as actionTypes from './actionTypes';

export const addInfo = (newInfoObj) => ({
  type: actionTypes.ADD_INFO,
  newInfoObj,
});

export const removeInfo = (infoText) => ({
  type: actionTypes.REMOVE_INFO,
  infoText,
});

const setSearchusers = (users) => ({
  type: actionTypes.ADD_SEARCH_USERS,
  users,
});

export const contactsDrawerToggle = () => ({
  type: actionTypes.CONTACTS_DRAWER_TOGGLE,
});

export const addToInvitationsList = (newInfoObj) => ({
  // type: actionTypes.ADD_TO_INVITATION_LIST,
  type: actionTypes.ADD_INFO,
  newInfoObj,
});

export const addToChatRooms = (chatRooms) => ({
  type: actionTypes.ADD_TO_CHAT_ROOMS,
  chatRooms,
});

export const addNewMessage = (message) => ({
  type: actionTypes.ADD_NEW_MESSAGE,
  message: message.message,
  chatId: message.chatId,
});

export const clearSearchedUsers = () => ({
  type: actionTypes.CLEAR_SEARCHED_USERS,
});

export const changeActiveChat = (chatId) => ({
  type: actionTypes.CHANGE_ACTIVE_CHAT,
  chatId,
});

export const searchUsers = (userName) => async (dispatch) => {
  // setBackdropOpen(true);
  const token = localStorage.getItem('token');
  try {
    const res = await fetch('/findUsers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: userName,
      }),
    });
    if (res.status === 422) {
      throw new Error('Validation failed!');
    }
    const resData = await res.json();
    dispatch(setSearchusers(resData.users));
  } catch (error) {
    dispatch(addInfo({
      userId: '', name: '', text: 'There was problem with server. Try again later.', type: 'warning',
    }));
  }
};

export const sendInvitation = (userId) => async (dispatch) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch('/sendInvitation', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: userId,
      }),
    });
    if (res.status === 422) {
      throw new Error('Validation failed!');
    }
    const resData = await res.json();
    if (res.status === 200) {
      dispatch(addInfo({
        userId: resData.userId,
        name: resData.name,
        text: resData.message,
        type: 'warning',
      }));
    }
    if (res.status === 201) {
      dispatch(addInfo({
        userId: resData.userId,
        name: resData.name,
        text: resData.message,
        type: 'success',
      }));
    }
    clearSearchedUsers();
  } catch (error) {
    clearSearchedUsers();
    dispatch(addInfo({
      userId: '', name: '', text: 'There was problem with server. Try again later.', type: 'warning',
    }));
  }
};

export const acceptInvitation = (sendInvitationUserId, infoText) => async (dispatch) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch('/acceptInvitation', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: sendInvitationUserId,
      }),
    });
    if (res.status === 422) {
      throw new Error('Validation failed!');
    }
    dispatch(removeInfo(infoText));
  } catch (error) {
    dispatch(addInfo({
      userId: '', name: '', text: 'There was problem with server. Try again later.', type: 'warning',
    }));
  }
};

export const declineInvitation = (sendInvitationUserId, userSendInvitationName, infoText) => async (dispatch) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch('/decline-invitation', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: userSendInvitationName,
        id: sendInvitationUserId,
      }),
    });
    if (res.status === 422) {
      throw new Error('Validation failed!');
    }
    dispatch(removeInfo(infoText));
  } catch (error) {
    dispatch(addInfo({
      userId: '', name: '', text: 'There was problem with server. Try again later.', type: 'warning',
    }));
  }
};

export const sendMessage = (message, author, chatId) => async (dispatch) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch('/add-message', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message,
        chatId,
        author,
      }),
    });
    if (res.status === 422) {
      throw new Error('Validation failed!');
    }
    await res.json();
  } catch (error) {
    dispatch(addInfo({
      userId: '', name: '', text: 'There was problem with server. Try again later.', type: 'warning',
    }));
  }
};
