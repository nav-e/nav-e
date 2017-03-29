import React, { Component, PropTypes } from 'react';
import { red600, green600, blue600 } from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';

const ol = require('openlayers');

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
  }
};

export default class GreenNavMap extends Component {

  constructor(props) {
    super(props);


    const defaultStyles = {
      'route' : new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: red600,
          width: 4
        })
      }),
      'markerStart' : new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: green600,
            width: 4
          })
      }),
      'markerEnd' : new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: red600,
          width: 4
        })
      }),
      'markerStopOver' : new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: blue600,
          width: 4
        })
      })
    };
    
    const routeLayer = new ol.layer.Vector({
      style: function(feature, resolution) {
         return defaultStyles[feature.get('name')];
      }
    });

    const osmLayer = new ol.layer.Tile({
      visible: true,
      source: new ol.source.OSM()
    });

    const googleLayer = new ol.layer.Tile({
      visible: false,
      source: new ol.source.OSM({
        url: 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        attributions: [
          new ol.Attribution({ html: '© Google' }),
          new ol.Attribution({ html: '<a href="https://developers.google.com/maps/terms">Terms of Use.</a>' })
        ]
      })
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

    const map = new ol.Map({
      layers: [osmLayer, googleLayer, routeLayer, trafficLayer, temperatureLayer, windLayer],
      view: new ol.View({
        center: ol.proj.fromLonLat([this.props.longitude, this.props.latitude]),
        zoom: this.props.zoom
      })
    });

    this.state = {
      map,
      traffic: false,
      temperature: false,
      wind: false
    };
  }

  componentDidMount() {
    this.state.map.setTarget(this.map);
    window.addEventListener('resize', this.updateSize);
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

  getFeaturesMarkers = (markersCoordinate) => {
    const features = [];
    markersCoordinate.forEach(function(el, i) {
      let featureName = 'markerStopOver';
      if (i == 0) {
         featureName = 'markerStart';
      } else if (i == markersCoordinate.length-1) {
          featureName = 'markerEnd';
      }

      const circle = new ol.geom.Circle(el, 0.0001);
      circle.transform('EPSG:4326', 'EPSG:3857');
      const feature = new ol.Feature({
        geometry: circle,
        name: featureName
      });
      
      features.push(feature);

    });

    return features;
  }

  setRoute = (route) => {
    const coords = [];
    route.forEach((point) => {
      coords.push([point.lon, point.lat]);
    });
    const lineString = new ol.geom.LineString(coords);
    lineString.transform('EPSG:4326', 'EPSG:3857');

    const featureRoute = new ol.Feature({
      geometry: lineString,
      name: 'route'
    });
    const features = this.getFeaturesMarkers([coords[coords.length-1], coords[0]]);
    features.push(featureRoute);
    const source = new ol.source.Vector({
      features: features
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
      </div>
    );
  }
}

GreenNavMap.propTypes = {
  longitude: PropTypes.number,
  latitude: PropTypes.number,
  zoom: PropTypes.number,
  findingRoute: PropTypes.bool
};

GreenNavMap.defaultProps = {
  longitude: 11.566,
  latitude: 48.139,
  zoom: 11,
  findingRoute: false
};
