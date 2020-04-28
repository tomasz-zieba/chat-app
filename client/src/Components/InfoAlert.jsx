import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import * as actions from '../store/actions/index';

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: '9999',
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  fixedAlert: {
    margin: '1px 0',
  },
}));

export default function InfoAlert({ infolist }) {
  const classes = useStyles();

  const dispatch = useDispatch();
  const removeInfo = (infoText) => dispatch(actions.removeInfo(infoText));
  const declineInvitation = (sendInvitationUserId, userSendInvitationName, infoText) => dispatch(actions.declineInvitation(sendInvitationUserId, userSendInvitationName, infoText));
  const acceptInvitation = (sendInvitationUserId, infoText) => dispatch(actions.acceptInvitation(sendInvitationUserId, infoText));

  const infoList = infolist.map((info) => {
    if (info.type === 'invitation') {
      return (
        <Alert
          key={info.userId + info.type}
          className={classes.fixedAlert}
          action={(
            <div>
              <Button onClick={() => acceptInvitation(info.userId, info.text)} color="inherit" size="small">
                Accept
              </Button>
              <Button onClick={() => declineInvitation(info.userId, info.name, info.text)} color="inherit" size="small">
                Decline
              </Button>
            </div>
          )}
        >
          {info.text}
        </Alert>
      );
    } if (info.type === 'info') {
      return (
        <Alert
          onClose={() => removeInfo(info.text)}
          className={classes.fixedAlert}
          key={info.userId + info.type}
          severity="info"
        >
          {info.text}
        </Alert>
      );
    } if (info.type === 'success') {
      return (
        <Alert
          onClose={() => removeInfo(info.text)}
          className={classes.fixedAlert}
          key={info.userId + info.type}
          severity="success"
        >
          {info.text}
        </Alert>
      );
    } if (info.type === 'warning') {
      return (
        <Alert
          onClose={() => removeInfo(info.text)}
          className={classes.fixedAlert}
          key={info.userId + info.type}
          severity="warning"
        >
          {info.text}
        </Alert>
      );
    }
    return true;
  });

  return (
    <div>
      {infoList}
    </div>
  );
}

InfoAlert.propTypes = {
  infolist: PropTypes.arrayOf(PropTypes.object).isRequired,
};
