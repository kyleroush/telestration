import React from 'react';

import {Fab, Collapse, ListItemText, List, ListItem} from '@material-ui/core';
import {ExpandLess, ExpandMore} from '@material-ui/icons';
import {db, key} from './firestore';

class Players extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  kickPlayer = (player) => {
    var {session, players, order} = this.props

    players[player] = {}
    order = order || []

    order = order.filter(name => player!== name)

    db.ref(`${key}/${session}/`).update({players, order})
  }

  render() {
    // need to render the list of the current players
    // need to add a start button

    var {players, order} = this.props;
    order = order ||  Object.keys(players)
    var {open} = this.state;

    return (
      <List>
        <ListItem button onClick={ () => this.setState({open: !open}) }>
        
          <ListItemText primary="Players" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List>
            {
              order.map((player) => {
                return(<ListItem key={player}>
                  <ListItemText>
                    player: {player}
                  </ListItemText>
                  {/* need to add a method here to add stuff via player */}

                  <Fab variant="extended" color="secondary" aria-label="join" onClick={() => this.kickPlayer(player)} >
                    Kick Player from Game
                  </Fab>
                </ListItem>);
              })
            }
          </List>
        </Collapse>
      </List>
    );
  }
}
export default Players;
