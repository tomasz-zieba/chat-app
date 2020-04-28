import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { fade, makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#ffffff',
    marginLeft: 0,
    width: '100%',
    display: 'flex',
    [theme.breakpoints.up('xs')]: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginTop: '10px',
      width: 'auto',
    },
  },
  inputRoot: {
    color: 'inherit',
    width: 'calc(100% - 55px)',
    paddingLeft: '10px',
  },
  inputInput: {
    padding: theme.spacing(2, 1, 2, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: '5px',
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '100%',
    },
  },
  menuButton: {
    backgroundColor: fade(theme.palette.secondary.main, 0.9),
    color: '#ffffff',
    borderRadius: '3px',
    height: '53px',
    margin: '0',
    padding: '15px',
    fontSize: '0',
    '&:hover': {
      backgroundColor: fade(theme.palette.secondary.main, 1),
    },
  },
}));

export default function Search({ searchUsers }) {
  const classes = useStyles();

  const [searchFliedText, setSearchFliedText] = useState('');

  return (
    <div className={classes.search}>
      <IconButton onClick={() => searchUsers(searchFliedText)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
        <Icon>search</Icon>
      </IconButton>
      <InputBase
        onChange={(event) => setSearchFliedText(event.target.value)}
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 'aria-label': 'search' }}
      />
    </div>
  );
}

Search.propTypes = {
  searchUsers: PropTypes.arrayOf(PropTypes.object).isRequired,
};
