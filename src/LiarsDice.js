import React from 'react';
import {db, key} from './firestore';
import gameState_enum from './enums';
import Players from './Players';
import { Fab, Typography, TextField, List, ListItem, ListItemText } from '@material-ui/core';
import Die from './dice/Die';
import 'react-dice-complete/dist/react-dice-complete.css'

class LiarsDice extends React.Component {
  // todos
  // add a go home button
  // add a reset session button
  // add error message
  // create a share url button
  // total nuber of dice alive <<<<
  // who did the bet <<<
  // sounds
  // whose turns it is <<<<<<
  // continue to roll per player 
  // start betting button is it needed
  // who had what
  // for called value display total <<<<
  // on result page word differently for loser being caller or better

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    var {session, player} = this.props;
    db.ref(`${key}/${session}`).on("value", snapshot => {
      // should i change this?
      var {players, gameState, up, order, bet, loser} = snapshot.val()
      this.setState({
        loading: false,
        player: players[player],
        gameState,
        players,
        up,
        order,
        bet,
        loser,
      })

    });
  }

  _renderWaiting = () => {
    var {players} = this.state;

    return (
      <div>
        <h3>Waiting for game to start</h3>

        {Object.keys(players).length > 1 && <Fab variant="extended" color="primary" aria-label="join" onClick={this.startGame} >
          Start Game
        </Fab>}
      </div>
    )
  }


  shuffle = (array) => {
    var currentIndex = array.length;
    var temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  startGame = () => {
    var {session} = this.props;
    var {players} = this.state;
  
    db.ref(`${key}/${session}`).update(
      {
        up: 0,
        order: this.shuffle(Object.keys(players)),
        gameState: gameState_enum.rolling,
      });

  }


  // =================================
  _renderDice = () => {
    var {player} = this.props;
    var {players, gameState, order, up} = this.state;
    var {nums} = players[player];

    var component  = (
      <div>
        {order && (
          <div>
            <Typography>
            there are {this.totalNumOfDie()} in the game
            </Typography>
            <Typography>
              {order[up%order.length]} is up
            </Typography>
          </div>)}
        {nums && nums.map((value, index) => {
          return (
            <Die key={`die-${index}`} currentValue={value} />
          );
        })}
        {gameState === gameState_enum.rolling && (!nums && order.filter(name=> name===player).length === 1? 
          <Fab variant="extended" color="primary" aria-label="join" onClick={this.rollAll}>Roll Dice</Fab> :
          this._renderStartBetting())
        }
      </div>
    );

    // if (!nums) {
    //   this.reactDice.rollAll(nums);
    // }

    return component;
  }

  totalNumOfDie = () => {
    var {players, order} = this.state;

    var total = 0;
    order.forEach(player => {
      total += players[player].dice
    })

    return total;
  }


  rollAll = () => {
    var {session, player} = this.props;
    var {players, order} = this.state;
    var {dice} = players[player];

    // this.reactDice.rol lAll()
    // this.setState({ rolling: true })

    db.ref(`${key}/${session}/players/${player}`).update(
      {
        nums: new Array(dice).fill(0).map((_) => Math.floor(Math.random() * 6)+1),
      });
  }
  // =============================


  _renderStartBetting = () => {

    var {players, order} = this.state;
    var doneRolling = order.filter(player => !players[player].nums).length === 0;

    return (doneRolling? 
      <Fab variant="extended" color="primary" aria-label="join" onClick={this.startBetting}>Start Betting</Fab>:
      <h4>waiting for everyone to roll</h4>)    
  }

  startBetting = () => {
    var {session} = this.props;

    db.ref(`${key}/${session}`).update(
      {
        gameState: gameState_enum.betting,
      });
  }
  // ======================================


  _renderBetting = () => {
    var {up, order, bet} = this.state;
    var {player} = this.props;

    return( 
      <div>
        {!!bet && <Typography>{order[up%order.length]} bet is {bet.count}(the count) {bet.num}(the number on the die)</Typography>}
        {order[up%order.length] === player && 
          <div>
            <TextField id="count" label="Count" variant="outlined" />
            <TextField id="num" label="Die Value" variant="outlined" />
            <Fab variant="extended" color="primary" onClick={this.raise} >Bet</Fab>
            {!!bet && <Fab variant="extended" color="primary" onClick={this.callLiar} >Call The LIAR</Fab>}
          </div>
        }
      </div>
    );

  }

  totalUpDice = () => {
    var {players, order} = this.state;

    var totals = new Array(7).fill(0);

    order.forEach(player => {
      players[player].nums.forEach(num => {
        totals[num]++
      })
    });
    return totals;
  }

  callLiar = () => {
    var {session} = this.props;
    var {players, bet, up, order} = this.state;


    var totals = this.totalUpDice();


    var loser;
    if(totals[bet.num] + totals[1] < bet.count) { // the bet was a lie

      loser = order[(up-1)%order.length]
    } else { // the call was wrong
      loser = order[up%order.length]
    }
    order.forEach(player => {
      players[player].nums = null
      if(player === loser) {
        players[player].dice--
 
      }
    })

    db.ref(`${key}/${session}`).update(
      {
        gameState: gameState_enum.result,
        loser
      });
  }

  raise = () => {
    var {up, bet} = this.state;
    var {session} = this.props;
    var count = document.getElementById("count").value;
    var num = document.getElementById("num").value;


    if(!!count)
      count = parseInt(count);
    else 
      return;
    if(!!num)
      num = parseInt(num);
    else 
      return;

    if (count<1)
      return;
    if(num <= 1)
      return
    
    if(num > 6)
      return

    if(bet === undefined || (bet.count < count) || (bet.count === count && bet.num < num)) {
      db.ref(`${key}/${session}`).update(
        {
          up: up+1,
          bet: {
            count,
            num,
          }
        });
    }
  }

  // ===========

  _renderResults() {
    var {loser, order, bet} = this.state;

    var totals = this.totalUpDice();

    return(
      <div>
        <Typography>
          The round is over 
        </Typography>
        <Typography>
          {loser} lost a die on bet {bet.count} {bet.num} as there were {totals[bet.num] + totals[1]}
        </Typography>
        <div>
          <List>
            <ListItem>
              <ListItemText>
                dice totals
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                1 {totals[1]}
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                2 {totals[2]}
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                3 {totals[3]}
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                4 {totals[4]}
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                5 {totals[5]}
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                6 {totals[6]}
              </ListItemText>
            </ListItem>


          </List>
        </div>
        <Fab variant="extended" color="primary" onClick={this.nextRound} >Continue</Fab>
  
      </div>
    )
  }

  nextRound = () => {
    var {session} = this.props;
    var {order, players, loser} = this.state;

    order.forEach(player => {
      players[player].nums = null
      if(player === loser) {
        players[player].dice--
        if(players[player].dice === 0) {
          order = order.filter(name => player!== name)
        }
      }
    })
    var state = gameState_enum.rolling;
    if(order.length === 1) {
      state= gameState_enum.waiting;
      order = null;
    }
    db.ref(`${key}/${session}`).update(
      {
        gameState: state,
        loser: null,
        players,
        bet: null,
        order
      });
  }

  render() {
    var {session} = this.props;
    var {loading, gameState, players, order} = this.state;

    if(loading)
      return (<h2>loading...</h2>);
      
    return (
      <div>
        {gameState === gameState_enum.waiting && this._renderWaiting()}

        {this._renderDice()}
        {gameState === gameState_enum.betting && this._renderBetting()}
        {gameState === gameState_enum.result && this._renderResults()}
        <Players players={players} order={order} session={session} />
      </div>
    ) 
  }
}
export default LiarsDice;
