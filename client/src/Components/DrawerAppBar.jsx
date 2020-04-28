import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Media from 'react-media';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import * as actions from '../store/actions/index';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginLeft: theme.spacing(2),
  },
  menuLogout: {
    marginLeft: 'auto',
  },
}));

export default function DrawerAppBar() {
  const classes = useStyles();

  const dispatch = useDispatch();
  const authLogout = () => dispatch(actions.authLogout());
  const contactsDrawerToggle = () => dispatch(actions.contactsDrawerToggle());

  const isAuth = useSelector((state) => state.auth.isAuth);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit">
            ChatApp
          </Typography>
          {isAuth
            ? (
              <IconButton onClick={() => { authLogout(); }} edge="start" className={classes.menuLogout} color="inherit" aria-label="logout">
                <Icon>lock</Icon>
              </IconButton>
            )
            : ''}
          <Media
            query="(max-width: 980px)"
            render={() => (
              <IconButton onClick={() => { contactsDrawerToggle(); }} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <Icon>menu</Icon>
              </IconButton>
            )}
          />
        </Toolbar>
      </AppBar>
    </div>
  );
}
