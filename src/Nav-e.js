import React, { Component } from 'react';
import ol from 'openlayers';
import Snackbar from 'material-ui/Snackbar';
import fetch from 'unfetch';
import Navbar from './components/Navbar';
import Menu from './components/Menu';
import NaveMap from './components/Nav-eMap';

import { testCoordinatesValidity, getRangeAnxietyPolygonWithCoordinate } from './reachability';

const NaveServerAddress = 'http://localhost:8080/';

export default class Nav_e extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openInvalidRouteSnackbar: false,
      openAllowAccessSnackbar: false,
      openIndicateStartSnackbar: false,
      openRemainingRangeSnackbar: false,
      mapType: 0,
      unitsType: 0,
      temperatureEnabled: false,
      trafficEnabled: false,
      openMapDialog: false,
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
      snackbarMessage: ''
    };

    this.setLocationPickerCoordinates = this.setLocationPickerCoordinates.bind(this);
    this.setUserLocationCoordinates = this.setUserLocationCoordinates.bind(this);
    this.setRangePolygonAutocompleteOrigin = this.setRangePolygonAutocompleteOrigin.bind(this);
    this.setRangePolygonAutocompleteDestination = this.setRangePolygonAutocompleteDestination.bind(this);
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
        rangeFromField: nCoord.map(i => i.toFixed(6)).join(', ')
      });
    } else if (this.state.rangeToFieldSelected) {
      this.setState({
        rangePolygonDestinationCoordinates: coord,
        rangeToField: nCoord.map(i => i.toFixed(6)).join(', ')
      });
    }
  }

  getRoutes = waypoints => {
    const routes = [];
    let counterRoutes = 0;
    if (waypoints.length > 0) {
      this.showLoader();
    }

    for (let i = 0; i < waypoints.length - 1; i += 1) {
      const startOsmId = waypoints[i];
      const destinationOsmId = waypoints[i + 1];
      const url = `${NaveServerAddress}astar/from/${startOsmId}/to/${destinationOsmId}`;
      fetch(url)
        .then(response => {
          if (response.status > 400) {
            console.log('Server Error');
            throw new Error('Failed to load route data!');
          } else {
            return response.text();
          }
        })
        .then(routeReceived => {
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
          } catch (err) {
            throw new Error(routeReceived);
          }
        })
        .catch(error => {
          this.hideLoader();
          this.handleErrorFailedRequestOpen(error.message);
        });
    }
  };

  getRangeVisualisation = range => {
    const coord = this.state.rangePolygonOriginCoordinates;
    if (!coord) {
      this.handleAllowAccessSnackbarOpen();
    } else {
      this.showLoader();
      // test if origin coordinate has valid roads
      testCoordinatesValidity(coord).then(res => {
        if (res) {
          // gets vertices of range anxiety polygon
          getRangeAnxietyPolygonWithCoordinate(coord, range).then(vertices => {
            this.hideLoader();
            if (vertices !== false) {
              this.map.setRangePolygon(vertices, coord);
              this.setState({ rangePolygonVisible: true });
            } else {
              this.handleInvalidRouteSnackbarOpen();
            }
          });
        } else {
          this.hideLoader();
          this.handleInvalidRouteSnackbarOpen();
        }
      });
    }
  };

  hideRangeVisualisation = () => {
    this.map.hideRangePolygon();
    this.setState({ rangePolygonVisible: false });
  };
  toggleDrawer = () => {
    this.drawer.toggle(this.updateMapSize);
  };

  updateMapSize = () => {
    this.map.updateSize();
  };

  handleErrorFailedRequestOpen = error => {
    this.setState({ openErrorFailedSnackbar: true, snackbarMessage: error });
  };

  handleErrorFailedRequestClose = () => {
    this.setState({ openErrorFailedSnackbar: false, snackbarMessage: '' });
  };

  handleIndicateStartSnackbarOpen = () => {
    this.setState({ openIndicateStartSnackbar: true });
  };

  handleIndicateStartSnackbarClose = () => {
    this.setState({ openIndicateStartSnackbar: false });
  };

  handleRemainingRangeSnackbarOpen = () => {
    this.setState({ openRemainingRangeSnackbar: true });
  };

  handleRemainingRangeSnackbarClose = () => {
    this.setState({ openRemainingRangeSnackbar: false });
  };

  handleInvalidRouteSnackbarOpen = () => {
    this.setState({ openInvalidRouteSnackbar: true });
  };

  handleInvalidRouteSnackbarClose = () => {
    this.setState({ openInvalidRouteSnackbar: false });
  };

  handleAllowAccessSnackbarOpen = () => {
    this.setState({ openAllowAccessSnackbar: true });
  };

  handleAllowAccessSnackbarClose = () => {
    this.setState({ openAllowAccessSnackbar: false });
  };

  mapTypeChange = (event, index, value) => {
    this.setState({ mapType: value });
    this.map.setMapType(value);
  };

  unitsTypeChange = (event, index, value) => {
    this.drawer.convertUnits(value);
    this.setState({ unitsType: value });
  };

  toggleTraffic = () => {
    this.setState({ trafficEnabled: !this.state.trafficEnabled });
    this.map.toggleTraffic();
  };

  toggleWind = () => {
    this.setState({ windEnabled: !this.state.windEnabled });
    this.map.toggleWind();
  };

  toggleTemperature = () => {
    this.setState({ temperatureEnabled: !this.state.temperatureEnabled });
    this.map.toggleTemperature();
  };

  showLoader = () => {
    // show loader for requests that take more than 400ms to complete
    this.searchTimeout = setTimeout(() => {
      this.setState({ findingRoute: true });
    }, 400);
  };

  hideLoader = () => {
    clearTimeout(this.searchTimeout);
    this.setState({ findingRoute: false });
  };

  updateRangeFromSelected = e => {
    // selects rangeFromField and unselect rangeToField
    this.setState({
      rangeFromFieldSelected: e,
      rangeToFieldSelected: !e
    });
  };

  updateRangeToSelected = e => {
    // selects rangeToField and unselects rangeFromField
    this.setState({
      rangeFromFieldSelected: !e,
      rangeToFieldSelected: e
    });
  };

  updateRangeFromField = val => {
    this.setState({ rangeFromField: val });
    const coord = this.isEPSG4326Coordinate(val);
    if (coord) {
      this.setState({
        rangePolygonOriginCoordinates: ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857')
      });
    }
  };

  updateRangeToField = val => {
    this.setState({ rangeToField: val });
    const coord = this.isEPSG4326Coordinate(val);
    if (coord) {
      this.setState({
        rangePolygonDestinationCoordinates: ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857')
      });
    }
  };

  isEPSG4326Coordinate = val => {
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
  };

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Navbar
          mapType={this.state.mapType}
          unitsTypeChangeType={this.state.unitsTypeChangeType}
          mapTypeChange={this.mapTypeChange}
          toggleTraffic={this.toggleTraffic}
          toggleTemperature={this.toggleTemperature}
          toggleWind={this.toggleWind}
          temperatureEnabled={this.state.temperatureEnabled}
          windEnabled={this.state.windEnabled}
          trafficEnabled={this.state.trafficEnabled}
          toggleDrawer={this.toggleDrawer}
          unitsTypeChange={this.unitsTypeChange}
          locationPickerCoordinates={this.state.locationPickerCoordinates}
          locationPickerCoordinatesTransformed={this.state.locationPickerCoordinatesTransformed}
          findingRoute={this.state.findingRoute}
          userLocationCoordinates={this.state.userLocationCoordinates}
          setLocationPickerCoordinates={this.setLocationPickerCoordinates}
          setUserLocationCoordinates={this.setUserLocationCoordinates}
        />

        <div style={{ display: 'flex', flex: '1 0' }}>
          <Menu
            autoCompleteAddress={NaveServerAddress}
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
          <NaveMap
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
      </div>
    );
  }
}
