import React from 'react';
import SessionsPage from './SessionsPage';
import PlayersPage from './PlayersPage';
import {db, key} from './firestore';
import Game from './Game'
import NavBar from './navBar'
import gameState_enum from './enums';
import { getCookie } from './Cookies';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      session: null,
      player: null,
    };
  }

  getQueryVariables = () => {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    var map = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        map[pair[0]] = pair[1];
    }
    return map;
  }

  componentDidMount() {
    var {session, player} = this.getQueryVariables();
    if(session) {
      session = session.toUpperCase();
      db.ref(`${key}/${session}`).once("value", sess => {
        if(sess.val()  !== null) {
          this.setState(
            {
              session, 
              config: sess.val().config,
            }
          );
          if (getCookie("session") === session && !player) {
            player = getCookie("player");
          }
          if(player) {
            player = player.toUpperCase();
            db.ref(`${key}/${session}/players/${player}`).once("value", play => {
              if(play.val() !== null) {
                this.setState({player});
              }
            });
          }     
        }
      });
    }
  }

  setValue = (newMap) => {
    this.setState(newMap);
  }

  reset = () => {
    var {session} = this.state;

    db.ref(`${key}/${session}`).once("value", snapshot => {
      const players = {};
      Object.keys(snapshot.val().players).forEach((name) => {
        players[name] = {name, on: 0, aviable: 0}
      });

      db.ref(`${key}/${session}`).update(
        {
          gameState: gameState_enum.waiting,
          order: [],
          artSets: {},
          max: null,
          players
        });
    });
  }

  render() {
    var {session, player} = this.state;

    return (
      <div>
        <NavBar session={session} name={'telestrations'}  repo={'telestration'} reset= {this.reset} />
        {session && <h2>You {player && `(${player})`} are part of session {session} </h2>}
        {session == null && <SessionsPage setAppState={this.setValue}/>}
        {session != null && player == null && <PlayersPage session={session} setAppState={this.setValue} />}
        {session != null && player != null && <Game session={session} player={player} />}
      </div>
    );
  }
}
export default App;
