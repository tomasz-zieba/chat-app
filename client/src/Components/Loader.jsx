import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'center',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
    position: 'fixed',
    background: 'rgb(255, 255, 255, 0.3)',
    zIndex: '1',
    height: '100vh',
    width: '100vw',
    top: '0',
    left: '0',
  },
}));

export default function Loader() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  );
}
