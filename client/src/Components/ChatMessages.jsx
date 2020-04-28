import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
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
  root: {
    height: '100%',
    '& > *': {
      width: '25ch',
    },
  },
  messageWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 98px)',
    paddingTop: '20px',
    overflowY: 'scroll',
    backgroundColor: fade(theme.palette.primary.main, 0.3),
    '& > div': {
      padding: '10px',
      borderRadius: '5px',
      margin: '0 10px 5px 20px',
    },
  },
  sendWrapper: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '11px 0',
    boxShadow: '1px 1px 3px -2px rgba(0,0,0,0.2), 1px 1px 4px 0px rgba(0,0,0,0.14), 1px -1px 8px 0px rgba(0,0,0,0.12)',
    backgroundColor: theme.palette.primary.dark,
  },
  textField: {
    width: 'calc(100% - 120px)',
    marginLeft: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '5px',
  },
  button: {
    padding: '15px',
    marginLeft: '5px',
  },
  right: {
    alignSelf: 'flex-end;',
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.primary.dark,
  },
  left: {
    alignSelf: 'baseline',
    backgroundColor: theme.palette.primary.light,
    color: '#ffffff',
  },
}));

export default function ChatMessages({ chat, chatId }) {
  const classes = useStyles();

  const [message, setMessage] = useState('');

  const dispatch = useDispatch();
  const sendMessage = (messageText, author, currentChatId) => dispatch(actions.sendMessage(messageText, author, currentChatId));

  const userName = useSelector((state) => state.auth.userName);

  function updateScrollToBottom(id) {
    const element = document.getElementById(id);
    element.scrollTop = element.scrollHeight;
  }

  function onSendMessage() {
    sendMessage(message, userName, chatId);
    setMessage('');
  }

  useEffect(() => {
    updateScrollToBottom('chatWindow');
  });

  return (
    <div className={classes.root}>
      <div className={classes.messageWrapper} id="chatWindow">
        {chat.map((chatMessage) => (
          <div className={chatMessage.creator === userName ? classes.right : classes.left}>{chatMessage.text}</div>
        ))}
      </div>
      <div className={classes.sendWrapper}>
        <Button
          onClick={() => onSendMessage()}
          size="large"
          variant="contained"
          color="secondary"
          className={classes.button}
          endIcon={<Icon>send</Icon>}
        >
          Send
        </Button>
        <TextField
          autocomplete="off"
          onChange={(event) => setMessage(event.target.value)}
          className={classes.textField}
          id="outlined-secondary"
          variant="outlined"
          color="secondary"
          value={message}
        />
      </div>
    </div>
  );
}

ChatMessages.propTypes = {
  chat: PropTypes.arrayOf(PropTypes.object).isRequired,
  chatId: PropTypes.string.isRequired,
};
