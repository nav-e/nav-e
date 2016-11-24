import React, { Component } from 'react';
import { Toolbar, ToolbarGroup, FontIcon } from 'material-ui';
import { green100 } from 'material-ui/styles/colors';

import Menu from './components/Menu';
import GNMap from './components/GNMap';

export default class GreenNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  render() {
    return (
      <div>
        <Toolbar style={{height: '64px', backgroundColor: '#1B5E20'}}>
          <ToolbarGroup firstChild={true}>
            <FontIcon className="material-icons" 
                      color="#ffffff" 
                      hoverColor={green100}
                      onClick={this.toggleDrawer}>
              menu</FontIcon>
            <img alt="GreenNav" src="/images/logo-64.png"/>
          </ToolbarGroup>
        </Toolbar>

        <div style={{display: 'flex'}}>
          <Menu />
          <GNMap />
        </div>
 
      </div>
    );
  }
}