import React from 'react';
import Typography from '@material-ui/core/Typography';

class Information extends React.Component {
  
  render() {

    return (
      <div>
        <Typography  variant="h6" >
          How To Play
        </Typography>
        <Typography>
          1) Either create or join a session.
        </Typography>
        <Typography>
          2) Wait for all the other players to join then click start.
        </Typography>
        <Typography>
          3) Enter the Title of your image and draw it. When done hit submit.
        </Typography>
        <Typography>
          4) Wait for the person before you to finish there round.
        </Typography>
        <Typography>
          5) When you recieve an image you guess what the title should be. When you get a Title draw the image.
        </Typography>
        <Typography>
          6) When everything is done review the images!
        </Typography>
      </div>
    );
  }
}

export default Information;