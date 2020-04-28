import * as actionTypes from '../actions/actionTypes';

const initialState = {
  searchUsers: null,
  invitationsList: [],
  userChats: [],
  infoList: [],
  backdropOpen: false,
  activeChat: null,
  contactsDrawerOpen: false,
};

function getUniqueListBy(arr, key) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INFO: {
      if (Array.isArray(action.newInfoObj)) {
        const infoWithDuplicates = [...state.infoList, ...action.newInfoObj];
        const uniqueInfoList = getUniqueListBy(infoWithDuplicates, 'text');
        return {
          ...state,
          infoList: uniqueInfoList,
        };
      }
      const isInfoInInfoList = state.infoList.filter((infoItem) => infoItem.text === action.newInfoObj.text);
      if (isInfoInInfoList.length) {
        return {
          ...state,
        };
      }
      const updatedAddInfoList = [...state.infoList, action.newInfoObj];
      return {
        ...state,
        infoList: updatedAddInfoList,
      };
    }
    case actionTypes.REMOVE_INFO: {
      const updatedRemoveInfoList = [...state.infoList].filter((infoElem) => infoElem.text !== action.infoText);
      return {
        ...state,
        infoList: updatedRemoveInfoList,
      };
    }
    case actionTypes.OPEN_BACKDROP:
      return {
        ...state,
        backdropOpen: true,
      };
    case actionTypes.CLOSE_BACKDROP:
      return {
        ...state,
        backdropOpen: false,
      };
    case actionTypes.ADD_SEARCH_USERS:
      return {
        ...state,
        searchUsers: action.users,
      };
    case actionTypes.CLEAR_SEARCHED_USERS:
      return {
        ...state,
        searchUsers: null,
      };
    case actionTypes.ADD_TO_CHAT_ROOMS: {
      const newUserChats = [...state.userChats, ...action.chatRooms];
      return {
        ...state,
        userChats: newUserChats,
      };
    }
    case actionTypes.ADD_TO_INVITATION_LIST: {
      const newInvitationsList = [...state.invitationsList, ...action.invitation];
      return {
        ...state,
        invitationsList: newInvitationsList,
      };
    }
    case actionTypes.REMOVE_FROM_INVITATION_LIST: {
      const updatedInvitationsList = state.invitationsList.filter((invitation) => invitation.userId !== action.userId);
      return {
        ...state,
        invitationsList: updatedInvitationsList,
      };
    }
    case actionTypes.ADD_NEW_MESSAGE: {
      const updatedChat = state.userChats.map((chatRoom) => {
        if (chatRoom.chatId === action.chatId) {
          chatRoom.chat.push(action.message);
        }
        return chatRoom;
      });
      return {
        ...state,
        userChats: updatedChat,
      };
    }
    case actionTypes.CHANGE_ACTIVE_CHAT: {
      const updateAcitvedChat = state.userChats.filter((chat) => chat.chatId === action.chatId);
      return {
        ...state,
        activeChat: updateAcitvedChat[0],
      };
    }
    case actionTypes.CONTACTS_DRAWER_TOGGLE:
      return {
        ...state,
        contactsDrawerOpen: !state.contactsDrawerOpen,
      };
    default:
      return state;
  }
};

export default reducer;
