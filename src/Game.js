import React from 'react';
import {db, key} from './firestore';
import gameState_enum from './enums';
import Players from './Players';
import Results from './Results';
import { Fab, Typography, TextField } from '@material-ui/core';
import { Tools, SketchField } from 'react-sketch';

class Game extends React.Component {

  // who did what resulring
  // scrolling / cnavas
  // drawing on results
  // extra tools
  // clear all button
  
  // tv show
  // age of adoline


  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      lineWidth: 5,
      lineColor: 'black',
      tool: Tools.Pencil,
    };
    this.empty_convas =   "{\"version\":\"2.4.3\",\"objects\":[],\"background\":\"#fffff0\"}";

  }

  componentDidMount() {
    var {session} = this.props;
    db.ref(`${key}/${session}`).on("value", snapshot => {

      var {players, gameState, order, artSets, max,} = snapshot.val();



      if(gameState === gameState_enum.playing) {

        gameState = gameState_enum.reviewing;
        order.forEach((element) => {
          if(players[element].on < max) {
            gameState = gameState_enum.playing;
          }
        });
      }
      this.setState({
        loading: false,
        gameState,
        players,
        order,
        artSets,
        max,
      })

    });
  }

  // ============ waiting
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
        order: this.shuffle(Object.keys(players)),
        gameState: gameState_enum.playing,
        max: Object.keys(players).length,
      });

  }

  // ============ waiting ^
  // ============ playing


  findOffset = () => {
    var {order} = this.state;
    var {player} = this.props;

    var offset = -1;
    order.forEach((element, index) => {
      if(player=== element) {
        offset = index;
      }
    });
    return offset;
  }

  _renderPlaying = () => {
    var {artSets, order, players, max} = this.state;
    var {player} = this.props;

    artSets = artSets || [];

    var offset = this.findOffset();

    var {on, aviable} = players[player];

    if(on >= max) {
      return (
        <div>
          <Typography>
            Waiting for game to end
          </Typography> 
        </div>
      )
    }

    if(on>aviable){
      return (
        <div>
          <Typography>
            Waiting on more stuff
          </Typography> 
        </div>
      )
    }

    var whose = order[(order.length+((offset-on)%order.length))%order.length]
    var artSet = artSets[whose];

    artSet = artSet || [];
    var art = artSet[artSet.length-1] || {};
    return (
      <div>
        {!art.title ? <TextField id="title" label="Title" variant="outlined" />:
                      !art.image && <Typography>The Title is {art.title}</Typography>}
        <SketchField
          name="sketch"
          className="canvas-area"
          ref={c => (this._sketch = c)}
          lineColor={this.state.lineColor}
          lineWidth={art.image? 0 : this.state.lineWidth}
          fillColor='transparent'
          backgroundColor='#fffff0'
          width={420}
          height={420}
          tool={this.state.tool}
          value={art.image ===undefined ? this.empty_convas: art.image}
        />
        {!!art.image &&  <TextField id="guess" label="Guess" variant="outlined" /> }
        <Fab variant="extended" color="primary" aria-label="join" onClick={this.submit} >
          Submit
        </Fab>
      </div>
    );
  }

  submit = () => {
    var {player, session} = this.props;
    var {order, players, artSets} = this.state;
    var title = document.getElementById("title");
    var guess = document.getElementById("guess");


    artSets = artSets || [];

    var offset = this.findOffset();
    var {on} = players[player];
    var whose = order[(order.length+((offset-on)%order.length))%order.length]

    var set = artSets[whose] || [];
    if(!!title) {
      title = title.value;
      set.push({ title })
    } 
    
    var prev = set[set.length -1];
    if (!!guess) {
      prev.guess = guess.value;
      set[set.length -1] = prev;

      set.push({title: guess.value})
      guess.value = ""
    } else {
      prev.image = JSON.stringify(this._sketch.toJSON());
      set[set.length -1] = prev;
    }
    // this._sketch

    var map = {}
    map[whose] = set;
    db.ref(`${key}/${session}/artSets/`).update(map);
    db.ref(`${key}/${session}/players/${player}`).update({on: on+1});

    var next = order[(offset+1)%order.length];
    var { aviable } = players[next];
    db.ref(`${key}/${session}/players/${next}`).update({aviable: aviable+1});
  }


  // ============ playing ^

  render() {
    var {session} = this.props;
    var {loading, gameState, players, order, artSets} = this.state;

    if(loading)
      return (<h2>loading...</h2>);
      
    return (
      <div>
        {gameState === gameState_enum.waiting && this._renderWaiting()}
        {gameState === gameState_enum.playing && this._renderPlaying()}
        {gameState === gameState_enum.reviewing && <Results order={order} artSets={artSets}/>}
        
        <Players players={players} order={order} session={session} />
      </div>
    ) 
  }
}
export default Game;
