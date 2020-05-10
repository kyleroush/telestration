import React from 'react';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import {db, key} from './firestore';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

function PlayersPage(props) {

  const setPlayer = ()=> {
    var {session} = props;
    var player = document.getElementById("name").value.toUpperCase();
    db.ref(`${key}/${session}/players/${player}`).once("value", snapshot => {

      if (snapshot.val() === null) {

        db.ref(`${key}/${session}/players/${player}`).update({
          player,
          on: 0,
          aviable: 0
        })

        props.setAppState({player});
        window.history.pushState({},  session, `?session=${session}&player=${player}`)
      } else {
        console.log("already exist")
      }
    });
  };
  return (
    <List>
      <ListItem>
        <TextField id="name" label="Name" variant="outlined" />
        <Fab variant="extended" color="primary" aria-label="join" className={useStyles().margin} onClick={setPlayer}>
          Create player
        </Fab>
      </ListItem>
    </List>
  );
}

export default PlayersPage;
