import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import openSocket from 'socket.io-client';

import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { blueGrey, teal } from '@material-ui/core/colors';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import InfoAlert from './Components/InfoAlert';
import ChatApp from './Containers/ChatApp';
import Auth from './Containers/Auth';
import DrawerAppBar from './Components/DrawerAppBar';
import * as actions from './store/actions/index';
import chatBackground from './assets/chatBackground3.jpg';

const useStyles = makeStyles((theme) => ({
  App: {
    height: '100vh',
    fontFamily: 'Roboto',
    backgroundImage: `url(${chatBackground})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    borderRadius: '0',
  },
  backdrop: { zIndex: theme.zIndex.drawer + 1, color: '#fff' },
  fixedAlert: { margin: '3px 0', paddingRight: '30px' },
  alertWrapper: {
    position: 'fixed', width: '100%', bottom: '0', zIndex: '99999',
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: { main: blueGrey[900] }, // Purple and green play nicely together.
    secondary: { main: teal[500] }, // This is just green.A700 as hex.
  },
  MuiChip: {
    clickableColorSecondary: {
      '&:hover, &:focus': {
        backgroundColor: 'red',
      },
      '&:active': {
        backgroundColor: 'green',
      },
    },
  },
});

// eslint-disable-next-line import/no-mutable-exports
export let socket;

function App() {
  const classes = useStyles();

  const dispatch = useDispatch();
  const autoLogin = () => dispatch(actions.autoLogin());
  const addNewMessage = (message) => dispatch(actions.addNewMessage(message));
  const addToChatRooms = (chatRooms) => dispatch(actions.addToChatRooms(chatRooms));
  const addInfo = (infoObj) => dispatch(actions.addInfo(infoObj));
  const relationUserDisconnect = (disconnectUserId) => dispatch(actions.relationUserDisconnect(disconnectUserId));
  const relationUserConnect = (connectUserId) => dispatch(actions.relationUserConnect(connectUserId));

  const isAuth = useSelector((state) => state.auth.isAuth);
  const userId = useSelector((state) => state.auth.userId);
  const authToken = useSelector((state) => state.auth.authToken);
  const invitations = useSelector((state) => state.chat.invitationsList);
  const chats = useSelector((state) => state.chat.userChats);
  const backdropOpen = useSelector((state) => state.chat.backdropOpen);
  const userChats = useSelector((state) => state.chat.userChats);
  const info = useSelector((state) => state.chat.infoList);

  useEffect(() => {
    socket = openSocket('http://localhost:8080');

    socket.on('add-invitation', (invitation) => {
      addInfo(invitation);
    });

    socket.on('accept-invitation', (chat) => {
      addToChatRooms([...userChats, chat]);
      relationUserConnect(chat.interlocutorId);
    });

    socket.on('send-info', (infoSended) => {
      addInfo(infoSended);
    });
    socket.on('send-message', (message) => {
      addNewMessage(message);
    });
    socket.on('disconnectRelationUser', (disconnectUserId) => {
      relationUserDisconnect(disconnectUserId);
    });
    socket.on('connected-info', (connectedUserId) => {
      relationUserConnect(connectedUserId);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    autoLogin();
    // eslint-disable-next-line
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.App}>
        <DrawerAppBar />
        {isAuth
          ? (
            <ChatApp
              isAuth={isAuth}
              userId={userId}
              authToken={authToken}
              invitations={invitations}
              chats={chats}
            />
          )
          : <Auth />}
        <div className={classes.alertWrapper}>
          {info.length
            ? (
              <InfoAlert
                infolist={info}
              />
            ) : ''}
        </div>
        <Backdrop className={classes.backdrop} open={backdropOpen}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </ThemeProvider>
  );
}

export default App;
