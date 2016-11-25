import React from 'react';
import ReactDOM from 'react-dom';
import GreenNav from './GreenNav';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { green700 } from 'material-ui/styles/colors';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  slider: {
    selectionColor: green700
  },
});

ReactDOM.render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <GreenNav />
  </MuiThemeProvider>,
  document.getElementById('root')
);
