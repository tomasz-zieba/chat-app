import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Media from 'react-media';

import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Drawer from '@material-ui/core/Drawer';

import Search from '../Components/Search';
import ChatMessages from '../Components/ChatMessages';
import * as actions from '../store/actions/index';

const useStyles = makeStyles((theme) => ({
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.4em',
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0, 150, 136, .1)',
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 150, 136, 1)',
      outline: '1px solid slategrey',
    },
  },
  root: { flexGrow: 1, height: 'calc(100% - 48px)', display: 'flex' },
  chatMenu: {
    // eslint-disable-next-line max-len
    width: '300px', height: '100%', minHeight: 'fit-content', backgroundColor: fade(theme.palette.primary.light, 0.8), borderRadius: '0', overflow: 'hidden', overflowY: 'scroll', scrollbarWidth: 'thin',
  },
  menuButton: { marginRight: theme.spacing(2) },
  title: { flexGrow: 1, display: 'none', [theme.breakpoints.up('sm')]: { display: 'block' } },
  searchResult: {
    margin: '8px 9px', position: 'absolute', width: '282px', zIndex: '1',
  },
  fixedAlert: { margin: '3px 0', paddingRight: '30px' },
  alertWrapper: { position: 'fixed', width: '100%', bottom: '0' },
  chip: {
    border: '2px dashed rgba(0, 150, 136, .9)',
    paddingLeft: '60px',
    position: 'relative',
    width: '283px',
    margin: '8px',
    height: '50px',
    borderRadius: '5px',
    justifyContent: 'space-between',
    textTransform: 'none',
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    '&::before': {
      top: '3px',
      left: '3px',
      width: '41px',
      height: '40px',
      content: '""',
      position: 'absolute',
      borderRadius: '5px',
    },
    '&[data-online="online"]::before': { background: '#4caf50' },
    '&[data-online="offline"]::before': { background: '#dd2c00' },
  },
  chipActive: {
    width: '283px',
    paddingLeft: '60px',
    position: 'relative',
    margin: '8px',
    height: '50px',
    borderRadius: '5px',
    justifyContent: 'space-between',
    textTransform: 'none',
    color: '#ffffff',
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
    },
    '&::before': {
      top: '5px',
      left: '5px',
      width: '41px',
      height: '40px',
      content: '""',
      position: 'absolute',
      borderRadius: '5px',
    },
    '&[data-online="online"]::before': { background: '#4caf50' },
    '&[data-online="offline"]::before': { background: '#dd2c00' },
  },
  chatMessages: {
    width: 'calc(100% - 300px)',
    height: '100%',
    background: 'transparent',
    [theme.breakpoints.down(979)]: {
      width: '100%',
    },
  },
  MuiChipRoot: { display: 'none' },
  searchInfo: { display: 'block', textAlign: 'center', fontSize: '20px' },
}));

function ChatApp() {
  const classes = useStyles();

  const dispatch = useDispatch();
  const addInfo = (infoObj) => dispatch(actions.addInfo(infoObj));
  const setSearchUsers = (users) => dispatch(actions.searchUsers(users));
  const clearSearchedUsers = () => dispatch(actions.clearSearchedUsers());
  const sendInvitation = (userId) => dispatch(actions.sendInvitation(userId));
  const changeActiveChat = (chatId) => dispatch(actions.changeActiveChat(chatId));
  const contactsDrawerToggle = () => dispatch(actions.contactsDrawerToggle());

  const searchUsers = useSelector((state) => state.chat.searchUsers);
  const userChats = useSelector((state) => state.chat.userChats);
  const activeChat = useSelector((state) => state.chat.activeChat);
  const onlineUsers = useSelector((state) => state.auth.onlineUsers);
  const contactsDrawerOpen = useSelector((state) => state.chat.contactsDrawerOpen);

  const sendInvValidation = (userId, userName) => {
    const isUserInChatList = userChats.filter((chat) => chat.interlocutor === userName);
    if (isUserInChatList.length) {
      addInfo({
        userId,
        name: userName,
        text: `${userName} is already on your chat list. No need to send invitation.`,
        type: 'warning',
      });
      return false;
    }
    sendInvitation(userId);
    return true;
  };
  return (
    <>
      <div className={classes.root}>
        <Media
          query="(min-width: 980px)"
          render={() => (
            <Paper elevation={3} className={classes.chatMenu}>
              <Search searchUsers={setSearchUsers} />
              {searchUsers != null
                ? (
                  <ClickAwayListener onClickAway={() => clearSearchedUsers()}>
                    <Paper elevation={3} className={classes.searchResult}>
                      <List dense className={classes.list}>
                        {!searchUsers.length ? <div className={classes.searchInfo}>Nothing was found.</div> : ''}
                        {
                        searchUsers.map((user) => (
                          <ListItem key={user.id} button onClick={() => sendInvValidation(user.id, user.name)}>
                            <ListItemText primary={user.name} />
                            <Icon color="primary">add_circle</Icon>
                          </ListItem>
                        ))
                        }
                      </List>
                    </Paper>
                  </ClickAwayListener>
                )
                : ''}
              <div>
                {userChats.map((chat) => (
                  <Button
                    onClick={() => changeActiveChat(chat.chatId)}
                    key={chat.chatId}
                    label={chat.interlocutor}
                    color="primary"
                    className={activeChat !== null && activeChat.chatId === chat.chatId ? classes.chipActive : classes.chip}
                    data-online={onlineUsers !== undefined && onlineUsers.includes(chat.interlocutorId) ? 'online' : 'offline'}
                  >
                    {chat.interlocutor}
                  </Button>
                ))}
              </div>
            </Paper>
          )}
        />
        <Media
          query="(max-width: 979px)"
          render={() => (
            <Drawer
              anchor="right"
              open={contactsDrawerOpen}
              onClose={() => contactsDrawerToggle()}
            >
              <Paper elevation={3} className={classes.chatMenu}>
                <Search searchUsers={setSearchUsers} />
                {searchUsers != null
                  ? (
                    <ClickAwayListener onClickAway={() => clearSearchedUsers()}>
                      <Paper elevation={3} className={classes.searchResult}>
                        <List dense className={classes.list}>
                          {searchUsers.map((user) => (
                            <ListItem key={user.id} button onClick={() => sendInvValidation(user.id, user.name)}>
                              <ListItemText primary={user.name} />
                              <Icon color="primary">add_circle</Icon>
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </ClickAwayListener>
                  )
                  : ''}
                <div>
                  {userChats.map((chat) => (
                    <Button
                      onClick={() => changeActiveChat(chat.chatId)}
                      key={chat.chatId}
                      label={chat.interlocutor}
                      color="primary"
                      className={activeChat !== null && activeChat.chatId === chat.chatId ? classes.chipActive : classes.chip}
                      data-online={onlineUsers !== undefined && onlineUsers.includes(chat.interlocutorId) ? 'online' : 'offline'}
                    >
                      {chat.interlocutor}
                    </Button>
                  ))}
                </div>
              </Paper>
            </Drawer>
          )}
        />
        <Paper elevation={3} className={classes.chatMessages}>
          {activeChat !== null
            ? (
              <ChatMessages
                chatId={activeChat.chatId}
                interlocutor={activeChat.interlocutor}
                chat={activeChat.chat}
              />
            )
            : ''}
        </Paper>
      </div>
    </>
  );
}

export default ChatApp;
