import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import injectTapEventPlugin from 'react-tap-event-plugin';
import gnMuiTheme from './styles/gnMuiTheme';
import Nav from './Nav-e';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
//injectTapEventPlugin();

ReactDOM.render(
	<MuiThemeProvider muiTheme={getMuiTheme(gnMuiTheme)}>
		<Nav />
	</MuiThemeProvider>,
	document.getElementById('root')
);
