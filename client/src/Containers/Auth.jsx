import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '../Components/TextField';

import * as actions from '../store/actions/index';

const useStyles = makeStyles((theme) => ({
  buttonWrapper: {
    textAlign: 'center',
  },
  button: {
    background: theme.palette.secondary.main,
    marginTop: '100px',
    width: '150px',
    height: '100px',
    margin: '10px',
    '&:hover': {
      background: theme.palette.secondary.light,
    },
  },
  toolbar: {
    background: theme.palette.primary.light,
    width: '300px',
    height: '100%',
  },
  buttonDrawer: {
    width: '100%',
    marginTop: '30px',
    boxShadow: 'none',
    background: theme.palette.secondary.main,
    '&:hover': {
      background: theme.palette.secondary.light,
      boxShadow: 'none',
    },
  },
}));

function Auth() {
  const classes = useStyles(() => ({}));

  const [logindrawerOpen, toggleLoginDrawer] = useState(false);
  const [signupdrawerOpen, toggleSignupDrawer] = useState(false);

  const [loginUserName, setLoginUserName] = useState('');
  const [loginUserPassword, setLoginUserPassword] = useState('');

  const [signinUserName, setSigninUserName] = useState('');
  const [signinUserPassword, setSigninUserPassword] = useState('');
  const [signinUserPasswordConfirmed, setSigninUserPasswordConfirmed] = useState('');

  const dispatch = useDispatch();
  const addInfo = (infoObj) => dispatch(actions.addInfo(infoObj));
  const authSignup = (name, password) => dispatch(actions.authSignup(name, password));
  const authLogin = (name, password) => dispatch(actions.authLogin(name, password));

  const onSignupValidator = (event) => {
    event.preventDefault();
    if (signinUserName.length < 5) {
      addInfo({
        userId: '',
        name: signinUserName,
        text: 'User name should be minimum 5 characters long.',
        type: 'warning',
      });
      return false;
    }
    if (signinUserPassword !== signinUserPasswordConfirmed) {
      addInfo({
        userId: '',
        name: signinUserName,
        text: 'Password does not match',
        type: 'warning',
      });
      return false;
    }
    authSignup(signinUserName, signinUserPassword);
    toggleSignupDrawer(false);
    return true;
  };

  const loginSubmit = (event) => {
    event.preventDefault();
    if (loginUserName.length < 5) {
      addInfo({
        userId: '',
        name: loginUserName,
        text: 'User name should be minimum 5 characters long.',
        type: 'warning',
      });
      return false;
    }
    authLogin(loginUserName, loginUserPassword);
    toggleLoginDrawer(false);
    return true;
  };

  return (
    <>
      <div className={classes.buttonWrapper}>
        <Button className={classes.button} onClick={() => toggleLoginDrawer(!logindrawerOpen)}>Log in</Button>
        <Button className={classes.button} onClick={() => toggleSignupDrawer(!signupdrawerOpen)}>sign up</Button>
        <Drawer
          anchor="left"
          open={logindrawerOpen}
          onClose={() => toggleLoginDrawer(false)}
        >
          <div
            className={classes.toolbar}
          >
            <div style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
              <form
                onSubmit={loginSubmit}
                style={{ width: '251px', margin: '20px' }}
              >
                <TextField type="text" label="Name" changed={(event) => setLoginUserName(event.target.value)} value={loginUserName} />
                <TextField type="password" label="Password" changed={(event) => setLoginUserPassword(event.target.value)} value={loginUserPassword} />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  color="primary"
                  className={classes.buttonDrawer}
                >
                  Login
                </Button>
              </form>
            </div>
          </div>
        </Drawer>
        <Drawer
          anchor="left"
          open={signupdrawerOpen}
          onClose={() => toggleSignupDrawer(false)}
        >
          <div
            className={classes.toolbar}
          >
            <div style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
              <form
                onSubmit={(e) => onSignupValidator(e)}
                style={{ width: '251px', margin: '20px' }}
              >
                <TextField label="Name (min. 5 signs)" type="text" changed={(event) => setSigninUserName(event.target.value)} value={signinUserName} />
                <TextField label="Password (min. 5 signs)" type="password" changed={(event) => setSigninUserPassword(event.target.value)} value={signinUserPassword} />
                <TextField label="Confirm password" type="password" changed={(event) => setSigninUserPasswordConfirmed(event.target.value)} value={signinUserPasswordConfirmed} />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  color="primary"
                  className={classes.buttonDrawer}
                >
                  Sign up
                </Button>
              </form>
            </div>
          </div>
        </Drawer>
      </div>
    </>
  );
}

export default Auth;
