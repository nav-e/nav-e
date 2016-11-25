import React, { Component, PropTypes } from 'react';
import { red600 } from 'material-ui/styles/colors';

var ol = require('openlayers');

const styles = {
  container: {
    flex: 1,
    height: '100vh'
  }
}

export default class GNMap extends Component {

  constructor(props) {
    super(props);

    var lineStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: red600,
        width: 4
      })
    });

    var routeLayer = new ol.layer.Vector({
      style: lineStyle
    });

    var osmLayer = new ol.layer.Tile({
      visible: true,
      source: new ol.source.OSM()
    })

    var googleLayer = new ol.layer.Tile({
      visible: false,
      source: new ol.source.OSM({
        url: 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        attributions: [
          new ol.Attribution({ html: '© Google' }),
          new ol.Attribution({ html: '<a href="https://developers.google.com/maps/terms">Terms of Use.</a>' })
        ]
      })
    });

    var map = new ol.Map({
      layers: [osmLayer, googleLayer, routeLayer],
      view: new ol.View({
        center: ol.proj.fromLonLat([this.props.longitude, this.props.latitude]),
        zoom: this.props.zoom
      })
    });

    this.state = {
      map : map
    }
  }

  componentDidMount () {
    this.state.map.setTarget(this.refs.map)
    window.addEventListener("resize", this.updateSize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateSize);
  }

  updateSize = () => {
    this.state.map.updateSize()
  }

  setMapType = mapType => {
    if(mapType == 0) {
      this.state.map.getLayers().getArray()[0].setVisible(true); 
      this.state.map.getLayers().getArray()[1].setVisible(false);
    }
    else {
      this.state.map.getLayers().getArray()[1].setVisible(true); 
      this.state.map.getLayers().getArray()[0].setVisible(false);      
    }
  }

  setRoute = route => {
    var coords = [];
    route.forEach(point => {
      coords.push([point.longitude, point.latitude]);
    });
    var lineString = new ol.geom.LineString(coords);
    lineString.transform('EPSG:4326', 'EPSG:3857');

    var feature = new ol.Feature({
      geometry: lineString,
      name: 'Line'
    });

    var source = new ol.source.Vector({
      features: [feature]
    });

    this.state.map.getView().setCenter(ol.proj.transform([coords[0][0], coords[0][1]], 'EPSG:4326', 'EPSG:3857'));
    this.state.map.getView().setZoom(18);
    this.state.map.getLayers().getArray()[2].setSource(source);   
  }

  render() {
    return (
      <div style={styles.container} ref="map"></div>
    );
  }
}

GNMap.propTypes = {
  longitude: PropTypes.number,
  latitude: PropTypes.number,
  zoom: PropTypes.number
}

GNMap.defaultProps = {
  longitude: 11.566,
  latitude: 48.139,
  zoom: 11
};