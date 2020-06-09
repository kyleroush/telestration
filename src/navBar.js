import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import { TextField, Divider } from '@material-ui/core';

import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Information from './infromtation';

class NavBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      el: null,
    };
  }
  render() {
    const classes = {
      grow: {
        flexGrow: 1,
      },
      sectionDesktop: {
        display: 'none'
      },
    };
    return (
      <div className="grow">
        <AppBar position="static">
          <Toolbar>
            {/* <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
            >
              <MenuIcon />
            </IconButton> */}
            <Typography className={classes.title} variant="h6" noWrap>
              {this.props.name}
            </Typography>
            <div className="grow" />
            <div className="sectionDesktop">
              <PopupState variant="popover" popupId="info-popup">
                {(popupState) => (
                  <React.Fragment>
                    <IconButton  color="inherit"  {...bindTrigger(popupState)}>
                      <InfoIcon />
                    </IconButton>
                    <Menu {...bindMenu(popupState)}>
                      <Information />
                    </Menu>
                  </React.Fragment>
                )}
              </PopupState>
              <PopupState variant="popover" popupId="menu-popup">
                {(popupState) => (
                  <React.Fragment>
                    <IconButton color="inherit" {...bindTrigger(popupState)}>
                      <MoreIcon />
                    </IconButton>
                    <Menu {...bindMenu(popupState)}>
                      {this.props.session && <MenuItem onClick={() => window.location.href = `/${this.props.repo}`} >To Home Page</MenuItem>}
                      {this.props.reset && this.props.session && <div>
                          <MenuItem onClick={this.props.reset} >Reset Session</MenuItem>
                          <Divider />
                        </div>
                      }
                      {this.props.session && <div>
                        <MenuItem >To share</MenuItem>
                        <MenuItem >
                          <TextField value={document.URL}/>
                        </MenuItem>
                        <MenuItem >Copy Url</MenuItem>
                        <Divider />
                      </div>}
                      <MenuItem onClick={() => window.location.href = `http://www.github.com/kyleroush/${this.props.repo}/issues`} >Log issue</MenuItem>

                    </Menu>
                  </React.Fragment>
                )}
              </PopupState>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default NavBar;
