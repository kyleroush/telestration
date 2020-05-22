import React from 'react';
import {db, key} from './firestore';
import gameState_enum from './enums';
import Players from './Players';
import { Fab, Typography, TextField } from '@material-ui/core';
import { Tools, SketchField } from 'react-sketch';

class Results extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      person: 0,
    };
  }

 
  render() {
    var {order, artSets} = this.props;
    var {page, person} = this.state;

    var art = artSets[order[person]][page]
    return (
      <div>
        <h3>Results</h3>

        <Typography>the title was {art.title} (from: {art.titleFrom})</Typography>
        <SketchField
          name="sketch"
          className="canvas-area"
          ref={c => (this._sketch = c)}
          lineWidth={0}
          fillColor='transparent'
          backgroundColor='transparent'
          lineColor={'transparent'}
          width={420}
          height={420}
          value={art.image}
        />
        <Typography>(by: {art.imageFrom})</Typography>
        {!!art.guess && <Typography>the guess was {art.guess} (from: {art.guessFrom})</Typography>}
        <div>
          {page >0 && <Fab variant="extended" color="primary" aria-label="join" onClick={() => this.setState({page:page-1})} >
            Prev Page
          </Fab>}
          {page+1 <  artSets[order[person]].length&& !!artSets[order[person]][page+1].image &&<Fab variant="extended" color="primary" aria-label="join"  onClick={() => this.setState({page:page+1})} >
            Next Page
          </Fab>}
        </div>
        <div>
          {person > 0 && <Fab variant="extended" color="primary" aria-label="join" onClick={() => this.setState({person:person-1, page:0})} >
            Prev Person
          </Fab>}
          {person+1 <  order.length && <Fab variant="extended" color="primary" aria-label="join"  onClick={() => this.setState({person:person+1, page:0})} >
            Next Person
          </Fab>}
        </div>
      </div>
    ) 
  }
}
export default Results;
