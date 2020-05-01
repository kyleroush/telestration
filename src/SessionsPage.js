import React from 'react';
import {TextField, Fab, Collapse, ListItemText} from '@material-ui/core';
import {ExpandLess, ExpandMore} from '@material-ui/icons';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import {db, key} from './firestore';

class SessionsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      action: null,
      config : {},
      open: false,
    };
    this.action_enum = {
      create: "create",
      join: "join",
    }
  }

  create = () => {
    var session = document.getElementById("session").value;

    db.ref(`${key}/${session}`).once("value", snapshot => {

      if (snapshot.val() === null) {
        var {config} = this.state;
        db.ref(`${key}/${session}`).update({session, config});
        this.props.setAppState({session, config});
        window.history.pushState({}, session, `?session=${session}`);
      } else {
        console.log("already exisit")

      }
    });
  }

  join = () => {
    var session = document.getElementById("session").value;
    var {config} = this.state;

    db.ref(`${key}/${session}`).once("value", snapshot => {

      if (snapshot.val() !== null ) {
        this.props.setAppState({session, config});
        window.history.pushState({}, session, `?session=${session}`);
      }else {
        // todo i need to warn that it isnt valid
        console.log("doesnt exisit")
      }
    });
  };

  _render_actions = () => {

    return(
      <div>
        <Fab variant="extended" color="primary" aria-label="create" 
            onClick={() => this.setState({ action: this.action_enum.cerate })}>
          Create New Session
        </Fab>
        <Fab variant="extended" color="primary" aria-label="join" 
            onClick={() => this.setState({ action: this.action_enum.join })}>
          Join Session
        </Fab>
      </div>
    );
  }

  _render_create = () => {
    var {open} = this.state

    return(
      <div>
        <h1>create</h1>
        <TextField id="session" label="Session" variant="outlined" />
        
        <List>
          <ListItem button onClick={ () => this.setState({open: !open}) }>
          
            <ListItemText primary="Config" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List >
            </List>
          </Collapse>
        </List>

        <Fab variant="extended" color="primary" aria-label="create" onClick={this.create} >
          Create New Session
        </Fab>
      </div>
    )
  }

  _render_join = () => {

    return(
      <div>
        <h1>join</h1>
        <TextField id="session" label="Session" variant="outlined" />

        <Fab variant="extended" color="primary" aria-label="create" onClick={this.join}>
          Join
        </Fab>
      </div>
    )
  }

  render() {
    if (this.state.action === null)
      return this._render_actions();
    if (this.state.action === this.action_enum.cerate)
      return this._render_create();
    if (this.state.action === this.action_enum.join)
      return this._render_join();
    
  }
}

export default SessionsPage;
