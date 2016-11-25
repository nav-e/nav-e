import React, { Component } from 'react';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import { green100, green700, green900 } from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import Menu from './components/Menu';
import GNMap from './components/GNMap';

const GreenNavServerAddress = 'http://localhost:6833/greennav/'

const styles = {
  label: {
    color: 'white'
  }
}

export default class GreenNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDrawer: true,
      openInfoDialog: false,
      openContactDialog: false,
      openMapDialog: false,
      mapType: 0
    };
  }

  toggleDrawer = () => {
    this.setState({openDrawer: !this.state.openDrawer})
    setTimeout(() => this.refs.map.updateSize(), 100);
  }

  getRoute = () => {
    let url = GreenNavServerAddress + 'vehicles/0/routes/1234-4321/opt/energy?battery=100&algorithm=EnergyAStar';
    fetch(url)
      .then(response => response.json())
      .then(route => {
        this.refs.map.setRoute(route.route);
      });
  }

  handleInfoOpen = () => {
    this.setState({openInfoDialog: true});
  }

  handleInfoClose = () => {
    this.setState({openInfoDialog: false});
  }

  handleContactOpen = () => {
    this.setState({openContactDialog: true});
  }

  handleContactClose = () => {
    this.setState({openContactDialog: false});
  }

  handleMapOpen = () => {
    this.setState({openMapDialog: true});
  }

  handleMapClose = () => {
    this.setState({openMapDialog: false});
  }

  mapTypeChange = (event, index, value) => {
    this.setState({mapType: value});
    this.refs.map.setMapType(value);
  }

  render() {
    const infoActions = [
      <FlatButton
        label="Ok"
        onTouchTap={this.handleInfoClose}
      />,
    ];

    const contactActions = [
      <FlatButton
        label="Ok"
        onTouchTap={this.handleContactClose}
      />,
    ];
    
    const mapActions = [
      <FlatButton
        label="Finish"
        onTouchTap={this.handleMapClose}
      />,
    ];

    return (
      <div>
        <Toolbar style={{height: '64px', backgroundColor: green900}}>
          <ToolbarGroup firstChild={true}>
            <FontIcon className="material-icons" 
                      color='white' 
                      hoverColor={green100}
                      onClick={this.toggleDrawer}>
              menu</FontIcon>
            <img alt="GreenNav" src="/images/logo-64.png"/>
          </ToolbarGroup>

          <ToolbarGroup>
            <ToolbarTitle style={{color: green100}} text="Map Options" />
            <FontIcon className="material-icons" 
                      color='white'
                      onTouchTap={this.handleMapOpen}
                      hoverColor={green100}>
              map</FontIcon>
            <ToolbarSeparator style={{backgroundColor: green700}}/>
            <FlatButton label="Info" labelStyle={styles.label} onTouchTap={this.handleInfoOpen}
                          icon={<FontIcon className="material-icons" color='white'>info</FontIcon>}/>
            <FlatButton label="Contact" labelStyle={styles.label} onTouchTap={this.handleContactOpen}
                          icon={<FontIcon className="material-icons" color='white'>email</FontIcon>}/>

          </ToolbarGroup>
        </Toolbar>

        <div style={{display: 'flex'}}>
          <Menu ref="menu" open={this.state.openDrawer} getRoute={this.getRoute}/>
          <GNMap ref="map" mapType={this.state.mapType}/>
        </div>

        <Dialog
          title=""
          actions={infoActions}
          modal={false}
          open={this.state.openInfoDialog}
          onRequestClose={this.handleInfoClose}>
          <h2>Green Navigation</h2>
          <p>The GreenNav organization is a community of young researchers and students at the University of Lübeck. We decided not long ago to go open source in order to collaborate with others and to show what we are working on.</p>
          <p>The projects of the GreenNav organization are closely related to the student projects at the university’s computer science program. However, with this organisation we invite everyone to participate in the development of experimental routing systems.
          <br /><a href="http://greennav.github.io/what-is-greennav.html">Get more information about GreenNav</a>
          </p>
        </Dialog>

        <Dialog
          title=""
          actions={contactActions}
          modal={false}
          open={this.state.openContactDialog}
          onRequestClose={this.handleContactClose}>
          <h2>Contact</h2>
          <p>There are several ways to contact us. For questions about coding, issues, etc. please use <a href="https://github.com/Greennav">Github</a></p>
          <p>For more general questions use our <a href="https://plus.google.com/communities/110704433153909631379">G+ page</a> or <a href="https://groups.google.com/forum/#!forum/greennav">Google Groups</a></p>
        </Dialog>

        <Dialog
          title="Map Settings"
          actions={mapActions}
          modal={false}
          open={this.state.openMapDialog}
          onRequestClose={this.handleMapClose}>
          <SelectField
            floatingLabelText="Map Type"
            value={this.state.mapType}
            onChange={this.mapTypeChange}
          >
            <MenuItem value={0} primaryText="OpenStreetMap" />
            <MenuItem value={1} primaryText="Google Map" />
          </SelectField>
        </Dialog>        
      </div>
    );
  }
}