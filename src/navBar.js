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
                          <TextField value={`https://kyleroush.github.io/${this.props.repo}/?session=${this.props.session}`}/>
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



// const useStyles = makeStyles((theme) => ({
//   grow: {
//     flexGrow: 1,
//   },
//   menuButton: {
//     marginRight: theme.spacing(2),
//   },
//   title: {
//     display: 'none',
//     [theme.breakpoints.up('sm')]: {
//       display: 'block',
//     },
//   },
//   search: {
//     position: 'relative',
//     borderRadius: theme.shape.borderRadius,
//     backgroundColor: fade(theme.palette.common.white, 0.15),
//     '&:hover': {
//       backgroundColor: fade(theme.palette.common.white, 0.25),
//     },
//     marginRight: theme.spacing(2),
//     marginLeft: 0,
//     width: '100%',
//     [theme.breakpoints.up('sm')]: {
//       marginLeft: theme.spacing(3),
//       width: 'auto',
//     },
//   },
//   searchIcon: {
//     padding: theme.spacing(0, 2),
//     height: '100%',
//     position: 'absolute',
//     pointerEvents: 'none',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   inputRoot: {
//     color: 'inherit',
//   },
//   inputInput: {
//     padding: theme.spacing(1, 1, 1, 0),
//     // vertical padding + font size from searchIcon
//     paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
//     transition: theme.transitions.create('width'),
//     width: '100%',
//     [theme.breakpoints.up('md')]: {
//       width: '20ch',
//     },
//   },
//   sectionDesktop: {
//     display: 'none',
//     [theme.breakpoints.up('md')]: {
//       display: 'flex',
//     },
//   },
//   section: {
//     display: 'flex',
//     [theme.breakpoints.up('md')]: {
//       display: 'none',
//     },
//   },
// }));

// export default function PrimarySearchAppBar(session) {
//   const classes = useStyles();
//   const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
//   const [infoAnchorEl, setInfoAnchorEl] = React.useState(null);

//   const isMenuOpen = Boolean(menuAnchorEl);
//   const isInfoOpen = Boolean(infoAnchorEl);

//   const handleInfoOpen = (event) => {
//     setInfoAnchorEl(event.currentTarget);
//   };

//   const handleinfoClose = () => {
//     setInfoAnchorEl(null);
//   };

//   const handleMenuClose = () => {
//     setMenuAnchorEl(null);
//   };

//   const handleMenuOpen = (event) => {
//     setMenuAnchorEl(event.currentTarget);
//   };

//   const infoId = 'info-id';
//   const menuId = 'menu-id';

//   const renderInfo = (
//     <span />
//   );

//   const renderMenu = (
//     <Menu
//       anchorEl={menuAnchorEl}
//       anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       id={menuId}
//       keepMounted
//       transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//       open={isMenuOpen}
//       onClose={handleMenuClose}
//     >
//       <MenuList>
//         <MenuItem>
//         </MenuItem>
//       </MenuList>
//     </Menu>
//   );

//   return (
//     <div className={classes.grow}>
//       <AppBar position="static">
//         <Toolbar>
//           {/* <IconButton
//             edge="start"
//             className={classes.menuButton}
//             color="inherit"
//             aria-label="open drawer"
//           >
//             <MenuIcon />
//           </IconButton> */}
//           <Typography className={classes.title} variant="h6" noWrap>
//             Telestrations
//           </Typography>
//           <div className={classes.grow} />
//           <div className={classes.sectionDesktop}>
//             <PopupState variant="popover" popupId="demo-popup-menu">
//               {(popupState) => (
//                 <React.Fragment>
//                   <Button  {...bindTrigger(popupState)}>
//                   <InfoIcon />
//                   </Button>
//                   <Menu {...bindMenu(popupState)}>
//                     <Information />
//                   </Menu>
//                 </React.Fragment>
//               )}
//             </PopupState>
//             <PopupState variant="popover" popupId="demo-popup-menu">
//               {(popupState) => (
//                 <React.Fragment>
//                   <IconButton {...bindTrigger(popupState)}>
//                     <MoreIcon />
//                   </IconButton>
//                   <Menu {...bindMenu(popupState)}>
//                     <MenuItem onClick={popupState.close}>
//                       <TextField value={`https://kyleroush.github.io/telestration/?session=${session}`}/>

//                       <Typography>Copy Url</Typography>
//                     </MenuItem>
//                     <MenuItem onClick={popupState.close}>Log issue</MenuItem>

//                   </Menu>
//                 </React.Fragment>
//               )}
//             </PopupState>
//           </div>
//         </Toolbar>
//       </AppBar>
//       {renderMenu}
//       {renderInfo}
//     </div>
//   );
// }
