import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(0),
    width: 251,
    '& > label': {
      color: theme.palette.secondary.main,
      zIndex: '1',
      top: '6px',
      fontSize: '14px',
      paddingLeft: '10px',
      '&.MuiInputLabel-shrink': {
        top: '-2px',
      },
    },
    '& div:after': {
      display: 'none',
    },
    '& div:before': {
      display: 'none',
    },
    '& input': {
      background: '#ffffff',
      borderBottom: 'none',
      borderRadius: '5px',
      height: '30px',
      padding: '6px 10px 7px 10px',
    },
  },
}));

export default function StandardTextField({
  label, value, changed, type,
}) {
  const classes = useStyles();

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <TextField
        type={type}
        className={classes.textField}
        label={label}
        value={value}
        margin="normal"
        onChange={(event) => changed(event)}
      />
    </div>
  );
}

StandardTextField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  changed: PropTypes.func.isRequired,
};
