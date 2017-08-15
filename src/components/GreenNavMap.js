import React, { Component, PropTypes } from 'react';
import { red600, green900 } from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';
import FontIcon from 'material-ui/FontIcon';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import MyLocation from 'material-ui/svg-icons/maps/my-location';

const ol = require('openlayers');

// Placeholder coordinates
const munichLat = 48.139;
const munichLng = 11.566;
const jordanLat = 31.949;
const jordanLng = 35.922;

const styles = {
  container: {
    height: '100%',
    width: '100%',
    position: 'relative'
  },

  map: {
    height: '100%',
    width: '100%',
    zIndex: 99
  },

  loaderWrapper: {
    zIndex: 999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    height: '100%',
    width: '100%'
  },

  hider: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    background: 'rgba(254, 254, 254, .5)'
  },

  locationDisplayContainer: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    bottom: 15,
    left: 0,
    right: 0,
  },

  locationDisplayView: {
    width: 'fit-content',
    padding: '12px 20px 12px 20px',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    fontSize: 15,
  },

  currentLocationButtton: {
    position: 'absolute',
    bottom: 16,
    right: 20,
  }
};

export default class GreenNavMap extends Component {
  constructor(props) {
    super(props);

    const lineStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: red600,
        width: 4
      })
    });

    const polygonStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(138, 159, 220, 0.9)',
        width: 2
      }),
      fill: new ol.style.Fill({
        color: 'rgba(199, 216, 240, 0.28)'
      })
    });

    const routeLayer = new ol.layer.Vector({
      style: lineStyle
    });

    const osmLayer = new ol.layer.Tile({
      visible: !this.props.mapType,
      source: new ol.source.OSM()
    });

    const googleLayer = new ol.layer.Tile({
      visible: this.props.mapType,
      source: new ol.source.OSM({
        url: 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        attributions: [
          new ol.Attribution({ html: '© Google' }),
          new ol.Attribution({ html: '<a href="https://developers.google.com/maps/terms">Terms of Use.</a>' })
        ]
      })
    });

    const rangePolygonLayer = new ol.layer.Vector({
      style: polygonStyle,
      visible: true,
    });

    // Traffic layer
    const computeQuadKey = (x, y, z) => {
      const quadKeyDigits = [];
      for (let i = z; i > 0; i -= 1) {
        let digit = 0;
        const mask = 1 << (i - 1);
        if ((x & mask) !== 0) {
          digit += 1;
        }
        if ((y & mask) !== 0) {
          digit += 2;
        }
        quadKeyDigits.push(digit);
      }
      return quadKeyDigits.join('');
    };

    const trafficLayer = new ol.layer.Tile({
      visible: false,
      source: new ol.source.XYZ({
        maxZoom: 19,
        tileUrlFunction(tileCoord, pixelRatio, projection) {
          const z = tileCoord[0];
          const x = tileCoord[1];
          const y = -tileCoord[2] - 1;
          return `http://t0.tiles.virtualearth.net/tiles/t${computeQuadKey(x, y, z)}.png`;
        }
      })
    });

    // Temperature layer
    const temperatureLayer = new ol.layer.Tile({
      opacity: 0.3,
      visible: false,
      source: new ol.source.OSM({
        url: 'http://{s}.tile.openweathermap.org/map/temp/{z}/{x}/{y}.png',
        attribution: 'Map data © OpenWeatherMap',
        crossOrigin: null,
        maxZoom: 18
      })
    });

    // Wind layer
    const windLayer = new ol.layer.Tile({
      opacity: 0.3,
      visible: false,
      source: new ol.source.OSM({
        url: 'http://{s}.tile.openweathermap.org/map/wind/{z}/{x}/{y}.png',
        attribution: 'Map data © OpenWeatherMap',
        crossOrigin: null,
        maxZoom: 18
      })
    });

    const view = new ol.View({
      center: ol.proj.fromLonLat([this.props.longitude, this.props.latitude]),
      zoom: this.props.zoom
    });

    const userLocationMarker = new ol.Overlay({
      id: 'userLocation',
      positioning: 'center-center',
      stopEvent: false
    });

    const locationPickerMarker = new ol.Overlay({
      id: 'locationPicker',
      positioning: 'center-center',
      stopEvent: false
    });

    const map = new ol.Map({
      layers: [osmLayer, googleLayer, routeLayer, trafficLayer,
        temperatureLayer, windLayer, rangePolygonLayer],
      overlays: [userLocationMarker, locationPickerMarker],
      view
    });

    map.on('singleclick', (evt) => {
      const p = evt.coordinate;
      this.props.setLocationPickerCoordinates(p);
      locationPickerMarker.setPosition(this.props.locationPickerCoordinates);
    });

    const geolocation = new ol.Geolocation({
      tracking: true,
      trackingOptions: {
        enableHighAccuracy: true
      },
      projection: view.getProjection()
    });

    geolocation.on('change', () => {
      const p = geolocation.getPosition();
      userLocationMarker.setPosition(p);
      this.props.setRangePolygonOrigin(p);
      view.setCenter([p[0], p[1]]); // centers view to position
    });

    this.state = {
      map,
      pickerPosition: undefined,
      traffic: false,
      temperature: false,
      wind: false
    };
  }

  componentDidMount() {
    const locationDisplayControl = new ol.control.Control({
      id: 'locationDisplayControl',
      element: document.getElementById('locationDisplay')
    });

    this.state.map.setTarget(this.map);
    window.addEventListener('resize', this.updateSize);
    this.state.map.getOverlayById('userLocation')
      .setElement(document.getElementById('userLocationMarker'));
    this.state.map.getOverlayById('locationPicker')
      .setElement(document.getElementById('locationPickerMarker'));
    this.state.map.addControl(locationDisplayControl);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize);
  }

  setMapType = (mapType) => {
    if (mapType === 0) {
      this.state.map.getLayers().getArray()[0].setVisible(true);
      this.state.map.getLayers().getArray()[1].setVisible(false);
    }
    else {
      this.state.map.getLayers().getArray()[1].setVisible(true);
      this.state.map.getLayers().getArray()[0].setVisible(false);
    }
  }

  setRangePolygon = (vertices, center) => {
    const polygon = new ol.geom.Polygon([vertices]);
    const feature = new ol.Feature({
      geometry: polygon
    });
    feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
    const source = new ol.source.Vector({ features: [feature] });
    this.state.map.getLayers().getArray()[6].setSource(source);
    this.state.map.getView().fit(
      polygon,
      this.state.map.getSize(),
      { padding: [20, 20, 20, 40], });
    this.state.map.getView().setCenter(center);
  }

  setRoute = (route) => {
    const coords = [];
    route.forEach((point) => {
      coords.push([point.lon, point.lat]);
    });
    const lineString = new ol.geom.LineString(coords);
    lineString.transform('EPSG:4326', 'EPSG:3857');

    const feature = new ol.Feature({
      geometry: lineString,
      name: 'Line'
    });

    const source = new ol.source.Vector({
      features: [feature]
    });

    this.state.map.getView().setCenter(ol.proj.transform([coords[0][0], coords[0][1]], 'EPSG:4326', 'EPSG:3857'));
    this.state.map.getView().fit(lineString, this.state.map.getSize());
    this.state.map.getLayers().getArray()[2].setSource(source);
  }

  getLoader = () => (
    <div style={styles.loaderWrapper}>
      <div style={styles.hider} />
      <CircularProgress style={styles.loader} />
    </div>
  )

  zoomToCurrent = () => {
    this.state.map.getView().setCenter(this.props.rangePolygonOriginCoordinates);
  }

  hideRangePolygon = () => {
    this.state.map.getLayers().getArray()[6].setSource(undefined);
  }

  toggleTraffic = () => {
    this.setState({ traffic: !this.state.traffic });
    this.state.map.getLayers().getArray()[3].setVisible(!this.state.traffic);
  }

  toggleTemperature = () => {
    this.setState({ temperature: !this.state.temperature });
    this.state.map.getLayers().getArray()[4].setVisible(!this.state.temperature);
  }

  toggleWind = () => {
    this.setState({ wind: !this.state.wind });
    this.state.map.getLayers().getArray()[5].setVisible(!this.state.wind);
  }

  updateSize = () => {
    this.state.map.updateSize();
  }

  render() {
    return (
      <div style={styles.container}>
        {this.props.findingRoute ? this.getLoader() : ''}
        <div style={styles.map} ref={c => (this.map = c)} />
        <FontIcon
          className="material-icons"
          id="userLocationMarker"
          color={green900}
        >
          my_location
        </FontIcon>
        <FontIcon
          className="material-icons"
          id="locationPickerMarker"
          color={green900}
        >
          place
        </FontIcon>
        <div
          style={styles.currentLocationButtton}
          id="currentLocationButtton"
        >
          <FloatingActionButton
            mini
            onTouchTap={this.zoomToCurrent}
          >
            <MyLocation />
          </FloatingActionButton>
        </div>
        <div
          style={styles.locationDisplayContainer}
          id="locationDisplay"
        >
          {this.props.locationPickerCoordinatesTransformed ?
            <div
              style={styles.locationDisplayView}
            >
              {this.props.locationPickerCoordinatesTransformed.map(i => i.toFixed(6))
              .join(', ')}
            </div> : null
          }
        </div>
      </div>
    );
  }
}

GreenNavMap.propTypes = {
  mapType: PropTypes.number,
  longitude: PropTypes.number,
  latitude: PropTypes.number,
  zoom: PropTypes.number,
  findingRoute: PropTypes.bool,
  locationPickerCoordinates: PropTypes.arrayOf(PropTypes.number),
  locationPickerCoordinatesTransformed: PropTypes.arrayOf(PropTypes.number),
  rangePolygonOriginCoordinates: PropTypes.arrayOf(PropTypes.number),
  setRangePolygonOrigin: PropTypes.func.isRequired,
  setLocationPickerCoordinates: PropTypes.func.isRequired
};

GreenNavMap.defaultProps = {
  mapType: 0,
  longitude: jordanLng,
  latitude: jordanLat,
  zoom: 11,
  findingRoute: false,
  locationPickerCoordinates: null,
  locationPickerCoordinatesTransformed: null,
  rangePolygonOriginCoordinates: [1287837.5738597857, 6129818.969679821]
};
