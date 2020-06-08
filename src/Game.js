import React from 'react';
import {db, key} from './firestore';
import gameState_enum from './enums';
import Players from './Players';
import Results from './Results';
import { Fab, Typography, TextField, Collapse, ListItemText, List, ListItem, Slider, MenuItem, Select, IconButton } from '@material-ui/core';
import { Tools, SketchField } from 'react-sketch';
import {ExpandLess, ExpandMore, Undo, Redo} from '@material-ui/icons';
import { BlockPicker } from 'react-color';

class Game extends React.Component {

  // scrolling / cnavas
  // drawing on results
  // extra tools
  // clear all button

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      lineWidth: 5,
      lineColor: 'black',
      tool: Tools.Pencil,
      toolkitOpen: false,
      canRedo: false,
      canUndo: false,
      colors: ['black', 'red', 'purple', 'blue', 'green', 'yellow', 'orange' ]
    };
    // this.empty_convas =   "{\"version\":\"2.4.3\",\"objects\":[],\"background\":\"#fffff0\"}";

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
    var {artSets, order, players, max, toolkitOpen, canRedo, canUndo} = this.state;
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
        {!art.image &&  <div>
          <List>
            <ListItem button onClick={ () => this.setState({toolkitOpen: !toolkitOpen}) }>
              <ListItemText primary="Toolkit" />
              {toolkitOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={toolkitOpen} timeout="auto" unmountOnExit>
              <List>
                <ListItem>
                  <IconButton disabled={!canUndo} onClick={this._undo}>
                    <Undo /> 
                  </IconButton>
                  <IconButton disabled={!canRedo} onClick={this._redo}>
                    <Redo /> 
                  </IconButton>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    Tool:
                  </ListItemText>
                  <Select
                    labelId="tools"
                    id="tools"
                    value={this.state.tool}
                    onChange={(event) => {
                      const tool = event.target.value
                      if(tool === 'eraser') {
                        this.setState({tool: Tools.Pencil, lineColor: '#fffff0'})
                        return;
                      }
                      this.setState({tool: event.target.value})
                    }}
                  >
                    <MenuItem value={Tools.Pencil}>Pencil</MenuItem>
                    <MenuItem value={Tools.Line}>Line</MenuItem>
                    <MenuItem value={Tools.Rectangle}>Rectangle</MenuItem>
                    <MenuItem value={Tools.Circle}>Circle</MenuItem>
                    <MenuItem value={"eraser"}>Eraser</MenuItem>
                  </Select>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    line color:
                  </ListItemText>
                  <BlockPicker triangle="hide" color={this.state.lineColor} colors={this.state.colors} 
                    onChange={(color)=> {
                      const { colors } = this.state;
                      if (colors.includes(color.hex)) {
                        colors.push(color.hex);
                      }
                      this.setState({lineColor: color.hex, colors})
                    }} />
                </ListItem>
                <ListItem>
                  <ListItemText>
                    Width:
                  </ListItemText>
                  <Slider
                    defaultValue={this.state.lineWidth}
                    valueLabelDisplay="auto"
                    step={1}
                    min={1}
                    max={25}
                    onChange={(_, width)=>this.setState({lineWidth: width})}
                  />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </div> }
        {/* {!art.image &&  
          <Typography>
            Using the {this.state.tool} with color 
            <Typography color={this.state.lineColor}>
              {this.state.lineColor}
            </Typography> 
            and width {this.state.lineWidth}
          </Typography>} */}
        <SketchField
          name="sketch"
          className="canvas-area"
          ref={c => (this._sketch = c)}
          lineColor={this.state.lineColor}
          lineWidth={art.image? 0 : this.state.lineWidth}
          fillColor='#fffff0'
          backgroundColor='#fffff0'
          width={420}
          height={420}
          tool={this.state.tool}
          value={art.image}
          onChange={this._onSketchChange}
        />
        {!!art.image &&  <TextField id="guess" label="Guess" variant="outlined" /> }
        <Fab variant="extended" color="primary" aria-label="join" onClick={this.submit} >
          Submit
        </Fab>
      </div>
    );
  }


  _onSketchChange = () => {
    let prev = this.state.canUndo;
    let now = this._sketch.canUndo();
    if (prev !== now) {
      this.setState({ canUndo: now });
    }
  };

  _undo = () => {
    this._sketch.undo();
    this.setState({
      canUndo: this._sketch.canUndo(),
      canRedo: this._sketch.canRedo(),
    });
  };

  _redo = () => {
    this._sketch.redo();
    this.setState({
      canUndo: this._sketch.canUndo(),
      canRedo: this._sketch.canRedo(),
    });
  };

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
      set.push({ title, titleFrom: player })
    } 
    
    var prev = set[set.length -1];
    if (!!guess) {
      prev.guess = guess.value;
      set[set.length -1] = prev;
      prev.guessFrom = player;

      set.push({title: guess.value, titleFrom: player });
      guess.value = "";
    } else {
      prev.image = JSON.stringify(this._sketch.toJSON());
      prev.imageFrom = player;
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
