import React, { Component } from 'react';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import { green50 } from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import fetch from 'unfetch';

import Menu from './components/Menu';
import GreenNavMap from './components/GreenNavMap';

import { testCoordinatesValidity, calculateRangePolygonEPSG3857 } from './reachability';

const GreenNavServerAddress = 'http://localhost:6833/';

const styles = {
  label: {
    color: green50
  },
};

export default class GreenNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openInfoDialog: false,
      openContactDialog: false,
      openMapDialog: false,
      mapType: 0,
      temperatureEnabled: false,
      trafficEnabled: false,
      windEnabled: false,
      findingRoute: false,
      rangePolygonCoordinates: undefined,
      locationPickerCoordinates: undefined,
      rangeFromField: '',
      rangeFromFieldSelected: false,
      rangeToField: '',
      rangeToFieldSelected: false,
    };

    this.setRangePolygonCoordinates = this.setRangePolygonCoordinates.bind(this);
    this.setLocationPickerCoordinates = this.setLocationPickerCoordinates.bind(this);
  }

  setRangePolygonCoordinates(coord) {
    this.setState({ rangePolygonCoordinates: coord });
  }

  setLocationPickerCoordinates(coord) {
    this.setState({ locationPickerCoordinates: coord });
    if (this.state.rangeFromFieldSelected) {
      this.setState({ rangeFromField: coord });
    }
    else if (this.state.rangeToFieldSelected) {
      this.setState({ rangeToField: coord });
    }
  }

  getRangeVisualisation = (range) => {
    const coord = this.state.rangePolygonCoordinates;

    if (!coord) {
      alert('Please allow access to your current location or pick a starting location');
    }
    else {
      this.showLoader();
      testCoordinatesValidity(coord)
        .then((res) => {
          if (res) {
            const vertices = calculateRangePolygonEPSG3857(range, coord);
            this.hideLoader();
            this.map.setRangePolygon(vertices);
          }
          else {
            this.hideLoader();
            alert('No valid routes were found from your starting location.');
          }
        });
    }
  }

  getRoutes = (waypoints) => {
    var routes = [];
    let counterRoutes = 0;
    console.log(waypoints);
    if (waypoints.length > 0) {
      this.showLoader();
    }

    for(let i = 0; i < waypoints.length-1; i++) {
      const startOsmId = waypoints[i];
      const destinationOsmId = waypoints[i+1];
      const url = `${GreenNavServerAddress}astar/from/${startOsmId}/to/${destinationOsmId}`;
      fetch(url)
        .then(response => {
          if (response.status > 400) {
            throw new Error('Failed to load route data!');
          }
          else {
            return response.json();
          }
        })
        .then(routeReceived => {
          //The array received from rt-library is actually from dest to orig, so we gotta reverse for now.
          routes[i] = routeReceived.reverse();
          counterRoutes++;
          //We use counterRoutes instead of "i" because we don't know the order that routes will be received.
          if(counterRoutes == waypoints.length-1) {
              let finalRoute = [];
              routes.forEach(route => finalRoute = finalRoute.concat(route));
              this.hideLoader();
              this.map.setRoute(finalRoute);
          }
        })
        .catch(err => {
          this.hideLoader();
          console.error(`Error: ${err}`);
        });
      }
  }

  toggleDrawer = () => {
    this.drawer.toggle(this.updateMapSize);
  }

  updateMapSize = () => {
    this.map.updateSize();
  }

  handleInfoOpen = () => {
    this.setState({ openInfoDialog: true });
  }

  handleInfoClose = () => {
    this.setState({ openInfoDialog: false });
  }

  handleContactOpen = () => {
    this.setState({ openContactDialog: true });
  }

  handleContactClose = () => {
    this.setState({ openContactDialog: false });
  }

  handleMapOpen = () => {
    this.setState({ openMapDialog: true });
  }

  handleMapClose = () => {
    this.setState({ openMapDialog: false });
  }

  mapTypeChange = (event, index, value) => {
    this.setState({ mapType: value });
    this.map.setMapType(value);
  }

  toggleTraffic = () => {
    this.setState({ trafficEnabled: !this.state.trafficEnabled });
    this.map.toggleTraffic();
  }

  toggleWind = () => {
    this.setState({ windEnabled: !this.state.windEnabled });
    this.map.toggleWind();
  }

  toggleTemperature = () => {
    this.setState({ temperatureEnabled: !this.state.temperatureEnabled });
    this.map.toggleTemperature();
  }

  showLoader = () => {
    // show loader for requests that take more than 400ms to complete
    this.searchTimeout = setTimeout(() => {
      this.setState({ findingRoute: true });
    }, 400);
  }

  hideLoader = () => {
    clearTimeout(this.searchTimeout);
    this.setState({ findingRoute: false });
  }

  updateRangeFromSelected = (e) => {
    this.setState({
      rangeFromFieldSelected: e,
      rangeToFieldSelected: !e
    });
  }

  updateRangeToSelected = (e) => {
    this.setState({
      rangeFromFieldSelected: !e,
      rangeToFieldSelected: e
    });
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
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Toolbar>
          <ToolbarGroup firstChild>
            <FontIcon className="material-icons" onClick={this.toggleDrawer}>
              menu</FontIcon>
            <img alt="GreenNav" src="/images/logo-64.png" />
          </ToolbarGroup>

          <ToolbarGroup>
            <ToolbarTitle text="Map Options" />
            <FontIcon className="material-icons" onTouchTap={this.handleMapOpen}>
              map</FontIcon>
            <ToolbarSeparator />
            <FlatButton
              label="Info"
              labelStyle={styles.label}
              onTouchTap={this.handleInfoOpen}
              icon={<FontIcon className="material-icons" color={green50}>info</FontIcon>}
            />
            <FlatButton
              label="Contact"
              labelStyle={styles.label}
              onTouchTap={this.handleContactOpen}
              icon={<FontIcon className="material-icons" color={green50}>email</FontIcon>}
            />

          </ToolbarGroup>
        </Toolbar>

        <div style={{ display: 'flex', flex: '1 0' }}>
          <Menu
            autoCompleteAddress={GreenNavServerAddress}
            locationPickerCoordinates={this.state.locationPickerCoordinates}
            ref={c => (this.drawer = c)}
            open
            getRoutes={this.getRoutes}
            getRangeVisualisation={this.getRangeVisualisation}
            updateRangeFromField={val => this.setState({ rangeFromField: val })}
            updateRangeFromSelected={this.updateRangeFromSelected}
            rangeFromField={this.state.rangeFromField}
            updateRangeToField={val => this.setState({ rangeToField: val })}
            updateRangeToSelected={this.updateRangeToSelected}
            rangeToField={this.state.rangeToField}
          />
          <GreenNavMap
            ref={c => (this.map = c)}
            mapType={this.state.mapType}
            findingRoute={this.state.findingRoute}
            setRangePolygonCoordinates={this.setRangePolygonCoordinates}
            setLocationPickerCoordinates={this.setLocationPickerCoordinates}
          />
        </div>

        <Dialog
          title=""
          actions={infoActions}
          modal={false}
          open={this.state.openInfoDialog}
          onRequestClose={this.handleInfoClose}
        >
          <h2>Green Navigation</h2>
          <p>The GreenNav organization is a community of young researchers and students at the
            University of Lübeck.We decided not long ago to go open source in order to collaborate
            with others and to show what we are working on.
          </p>
          <p>The projects of the GreenNav organization are closely related to the student projects
            at the university’s computer science program. However, with this organisation we
            invite everyone to participate in the development of experimental routing systems.
          <br />
            <a href="http://greennav.github.io/what-is-greennav.html">
              Get more information about GreenNav
            </a>
          </p>
        </Dialog>

        <Dialog
          title=""
          actions={contactActions}
          modal={false}
          open={this.state.openContactDialog}
          onRequestClose={this.handleContactClose}
        >
          <h2>Contact</h2>
          <p>There are several ways to contact us. For questions about coding, issues, etc. please
            use <a href="https://github.com/Greennav">Github</a>
          </p>
          <p>For more general questions use our <a href="https://plus.google.com/communities/110704433153909631379">G+ page</a> or <a href="https://groups.google.com/forum/#!forum/greennav">Google Groups</a></p>
        </Dialog>

        <Dialog
          title="Map Settings"
          actions={mapActions}
          modal={false}
          open={this.state.openMapDialog}
          onRequestClose={this.handleMapClose}
        >
          <SelectField
            floatingLabelText="Map Type"
            value={this.state.mapType}
            onChange={this.mapTypeChange}
          >
            <MenuItem value={0} primaryText="OpenStreetMap" />
            <MenuItem value={1} primaryText="Google Map" />
          </SelectField>
          <h2>Overlays</h2>
          <Toggle
            label="Traffic"
            toggled={this.state.trafficEnabled}
            onToggle={this.toggleTraffic}
            labelPosition="right"
            thumbSwitchedStyle={styles.thumbSwitched}
            trackSwitchedStyle={styles.trackSwitched}
          />
          <Toggle
            label="Temperature"
            toggled={this.state.temperatureEnabled}
            onToggle={this.toggleTemperature}
            labelPosition="right"
            thumbSwitchedStyle={styles.thumbSwitched}
            trackSwitchedStyle={styles.trackSwitched}
          />
          <Toggle
            label="Wind"
            toggled={this.state.windEnabled}
            onToggle={this.toggleWind}
            labelPosition="right"
            thumbSwitchedStyle={styles.thumbSwitched}
            trackSwitchedStyle={styles.trackSwitched}
          />
        </Dialog>
      </div>
    );
  }
}
