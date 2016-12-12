import React from 'react';
import ReactDOM from 'react-dom';
import GreenNav from './GreenNav';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import gnMuiTheme from './styles/gnMuiTheme'
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();


ReactDOM.render(
  <MuiThemeProvider muiTheme={getMuiTheme(gnMuiTheme)}>
    <GreenNav />
  </MuiThemeProvider>,
  document.getElementById('root')
);
