import React, { Component } from 'react';
import ol from 'openlayers';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import { green50 } from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import fetch from 'unfetch';

import Menu from './components/Menu';
import GreenNavMap from './components/GreenNavMap';

import { testCoordinatesValidity, getRangeAnxietyPolygonWithCoordinate } from './reachability';

const GreenNavServerAddress = 'http://localhost:8080/';

const styles = {
  label: {
    color: green50
  },

  unitSelectField: {
    marginLeft: '24px'
  }
};

export default class GreenNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openInfoDialog: false,
      openContactDialog: false,
      openMapDialog: false,
      openInvalidRouteSnackbar: false,
      openAllowAccessSnackbar: false,
      openIndicateStartSnackbar: false,
      openRemainingRangeSnackbar: false,
      mapType: 0,
      unitsType: 0,
      temperatureEnabled: false,
      trafficEnabled: false,
      windEnabled: false,
      findingRoute: false,
      userLocationCoordinates: undefined, // in EPSG:3857
      rangePolygonOriginCoordinates: undefined, // in EPSG:3857
      rangePolygonDestinationCoordinates: undefined, // in EPSG:3857
      rangePolygonVisible: false,
      locationPickerCoordinates: undefined, // in EPSG:3857
      locationPickerCoordinatesTransformed: undefined, // in EPSG:4326
      rangeFromField: '',
      rangeFromFieldSelected: false,
      rangeToField: '',
      rangeToFieldSelected: false,
      openErrorFailedSnackbar: false,
      snackbarMessage: '',
    };

    this.setLocationPickerCoordinates = this.setLocationPickerCoordinates.bind(this);
    this.setUserLocationCoordinates = this.setUserLocationCoordinates.bind(this);
    this.setRangePolygonAutocompleteOrigin = this.setRangePolygonAutocompleteOrigin.bind(this);
    this.setRangePolygonAutocompleteDestination =
      this.setRangePolygonAutocompleteDestination.bind(this);
  }

  setUserLocationCoordinates(coord) {
    this.setState({ userLocationCoordinates: coord });
    if (this.state.rangePolygonOriginCoordinates === undefined) {
      this.setState({ rangePolygonOriginCoordinates: coord });
    }
  }

  setRangePolygonAutocompleteOrigin(coord) {
    const nCoord = ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857');
    this.setState({
      rangePolygonOriginCoordinates: nCoord,
      locationPickerCoordinatesTransformed: coord
    });
    this.map.setAutocompleteLocationMarker(nCoord);
  }

  setRangePolygonAutocompleteDestination(coord) {
    const nCoord = ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857');
    this.setState({
      rangePolygonDestinationCoordinates: nCoord,
      locationPickerCoordinatesTransformed: coord
    });
    this.map.setAutocompleteLocationMarker(nCoord);
  }

  setLocationPickerCoordinates(coord) {
    this.setState({ locationPickerCoordinates: coord });
    const nCoord = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');
    this.setState({ locationPickerCoordinatesTransformed: nCoord });
    // update textfield with coordinate if selected
    if (this.state.rangeFromFieldSelected) {
      this.setState({
        rangePolygonOriginCoordinates: coord,
        rangeFromField: nCoord.map(i => i.toFixed(6)).join(', ') });
    }
    else if (this.state.rangeToFieldSelected) {
      this.setState({
        rangePolygonDestinationCoordinates: coord,
        rangeToField: nCoord.map(i => i.toFixed(6)).join(', ')
      });
    }
  }

  getRoutes = (waypoints) => {
    const routes = [];
    let counterRoutes = 0;
    if (waypoints.length > 0) {
      this.showLoader();
    }

    for (let i = 0; i < waypoints.length - 1; i += 1) {
      const startOsmId = waypoints[i];
      const destinationOsmId = waypoints[i + 1];
      const url = `${GreenNavServerAddress}astar/from/${startOsmId}/to/${destinationOsmId}`;
      fetch(url)
        .then((response) => {
          if (response.status > 400) {
            throw new Error('Failed to load route data!');
          }
          else {
            return response.text();
          }
        })
        .then((routeReceived) => {
          // The array received from rt-library is actually from dest to orig,
          // so we gotta reverse for now.
          try {
            routes[i] = routeReceived.reverse();
            counterRoutes += 1;
            // We use counterRoutes instead of "i" because we don't know the order that
            // routes will be received.
            if (counterRoutes === waypoints.length - 1) {
              let finalRoute = [];
              for (let j = 0; j < routes.length; j += 1) {
                finalRoute = finalRoute.concat(routes[j]);
              }
              this.hideLoader();
              this.map.setRoute(routes[0]);
            }
          }
          catch (err) {
            throw new Error(routeReceived);
          }
        })
        .catch((error) => {
          this.hideLoader();
          this.handleErrorFailedRequestOpen(error.message);
        });
    }
  }

  getRangeVisualisation = (range) => {
    const coord = this.state.rangePolygonOriginCoordinates;
    if (!coord) {
      this.handleAllowAccessSnackbarOpen();
    }
    else {
      this.showLoader();
      // test if origin coordinate has valid roads
      testCoordinatesValidity(coord)
        .then((res) => {
          if (res) {
            // gets vertices of range anxiety polygon
            getRangeAnxietyPolygonWithCoordinate(coord, range)
              .then((vertices) => {
                this.hideLoader();
                if (vertices !== false) {
                  this.map.setRangePolygon(vertices, coord);
                  this.setState({ rangePolygonVisible: true });
                }
                else {
                  this.handleInvalidRouteSnackbarOpen();
                }
              });
          }
          else {
            this.hideLoader();
            this.handleInvalidRouteSnackbarOpen();
          }
        });
    }
  }

  hideRangeVisualisation = () => {
    this.map.hideRangePolygon();
    this.setState({ rangePolygonVisible: false });
  }

  toggleDrawer = () => {
    this.drawer.toggle(this.updateMapSize);
  }

  updateMapSize = () => {
    this.map.updateSize();
  }

  handleErrorFailedRequestOpen = (error) => {
    this.setState({ openErrorFailedSnackbar: true, snackbarMessage: error });
  }

  handleErrorFailedRequestClose = () => {
    this.setState({ openErrorFailedSnackbar: false, snackbarMessage: '' });
  }

  handleIndicateStartSnackbarOpen = () => {
    this.setState({ openIndicateStartSnackbar: true });
  }

  handleIndicateStartSnackbarClose= () => {
    this.setState({ openIndicateStartSnackbar: false });
  }

  handleRemainingRangeSnackbarOpen = () => {
    this.setState({ openRemainingRangeSnackbar: true });
  }

  handleRemainingRangeSnackbarClose= () => {
    this.setState({ openRemainingRangeSnackbar: false });
  }

  handleInvalidRouteSnackbarOpen = () => {
    this.setState({ openInvalidRouteSnackbar: true });
  }

  handleInvalidRouteSnackbarClose = () => {
    this.setState({ openInvalidRouteSnackbar: false });
  }

  handleAllowAccessSnackbarOpen = () => {
    this.setState({ openAllowAccessSnackbar: true });
  }

  handleAllowAccessSnackbarClose = () => {
    this.setState({ openAllowAccessSnackbar: false });
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

  unitsTypeChange = (event, index, value) => {
    this.drawer.convertUnits(value);
    this.setState({ unitsType: value });
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
    // selects rangeFromField and unselect rangeToField
    this.setState({
      rangeFromFieldSelected: e,
      rangeToFieldSelected: !e
    });
  }

  updateRangeToSelected = (e) => {
    // selects rangeToField and unselects rangeFromField
    this.setState({
      rangeFromFieldSelected: !e,
      rangeToFieldSelected: e
    });
  }

  updateRangeFromField = (val) => {
    this.setState({ rangeFromField: val });
    const coord = this.isEPSG4326Coordinate(val);
    if (coord) {
      this.setState({
        rangePolygonOriginCoordinates: ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857')
      });
    }
  }

  updateRangeToField = (val) => {
    this.setState({ rangeToField: val });
    const coord = this.isEPSG4326Coordinate(val);
    if (coord) {
      this.setState({
        rangePolygonDestinationCoordinates: ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857')
      });
    }
  }

  isEPSG4326Coordinate = (val) => {
    const valArray = val.replace(/\s+/g, '').split(',');
    if (valArray.length === 2) {
      const lng = parseFloat(valArray[0]);
      const lat = parseFloat(valArray[1]);
      // returns formatted coordinate if true
      if (lng <= 180 && lng >= -180 && lat <= 45 && lat >= -45) {
        return [lng, lat];
      }
    }
    return false;
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
            locationPickerCoordinates={this.state.locationPickerCoordinatesTransformed}
            ref={c => (this.drawer = c)}
            open
            getRoutes={this.getRoutes}
            unitsType={this.state.unitsType}
            rangePolygonVisible={this.state.rangePolygonVisible}
            getRangeVisualisation={this.getRangeVisualisation}
            hideRangeVisualisation={this.hideRangeVisualisation}
            updateRangeFromField={this.updateRangeFromField}
            updateRangeFromSelected={this.updateRangeFromSelected}
            rangeFromField={this.state.rangeFromField}
            updateRangeToField={this.updateRangeToField}
            updateRangeToSelected={this.updateRangeToSelected}
            rangeToField={this.state.rangeToField}
            setRangePolygonAutocompleteOrigin={this.setRangePolygonAutocompleteOrigin}
            setRangePolygonAutocompleteDestination={this.setRangePolygonAutocompleteDestination}
            handleIndicateStartSnackbarOpen={this.handleIndicateStartSnackbarOpen}
            handleRemainingRangeSnackbarOpen={this.handleRemainingRangeSnackbarOpen}
            handleErrorFailedRequestOpen={this.handleErrorFailedRequestOpen}

          />
          <GreenNavMap
            ref={c => (this.map = c)}
            mapType={this.state.mapType}
            locationPickerCoordinates={this.state.locationPickerCoordinates}
            locationPickerCoordinatesTransformed={this.state.locationPickerCoordinatesTransformed}
            findingRoute={this.state.findingRoute}
            userLocationCoordinates={this.state.userLocationCoordinates}
            setLocationPickerCoordinates={this.setLocationPickerCoordinates}
            setUserLocationCoordinates={this.setUserLocationCoordinates}
          />
        </div>

        <Snackbar
          open={this.state.openErrorFailedSnackbar}
          message={this.state.snackbarMessage}
          autoHideDuration={4000}
          onRequestClose={this.handleErrorFailedRequestClose}
        />

        <Snackbar
          open={this.state.openIndicateStartSnackbar}
          message="Please select a start and destination from the suggestions"
          autoHideDuration={4000}
          onRequestClose={this.handleIndicateStartSnackbarClose}
        />

        <Snackbar
          open={this.state.openRemainingRangeSnackbar}
          message="Please indicate the remaining range of your vehicle"
          autoHideDuration={4000}
          onRequestClose={this.handleRemainingRangeSnackbarClose}
        />

        <Snackbar
          open={this.state.openInvalidRouteSnackbar}
          message="No valid routes were found from your starting location"
          autoHideDuration={4000}
          onRequestClose={this.handleInvalidRouteSnackbarClose}
        />

        <Snackbar
          open={this.state.openAllowAccessSnackbar}
          message="Please allow access to your current location or pick a starting location"
          autoHideDuration={4000}
          onRequestClose={this.handleAllowAccessSnackbarClose}
        />

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
          <SelectField
            floatingLabelText="Units"
            value={this.state.unitsType}
            style={styles.unitSelectField}
            onChange={this.unitsTypeChange}
          >
            <MenuItem value={0} primaryText="Kilometers" />
            <MenuItem value={1} primaryText="Miles" />
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
