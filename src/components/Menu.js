import React, { Component, PropTypes } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import AutoComplete from 'material-ui/AutoComplete';
import Slider from 'material-ui/Slider';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { grey800, green900, green700, lime600 } from 'material-ui/styles/colors';

const styles = {
  container: {
    width: '400px'
  },

  tab: {
    backgroundColor: green700
  },

  active: {
    backgroundColor: lime600
  },

  menu: {
    margin: '10px 25px'
  },

  floatingLabelStyle: {
    color: green700
  },

  underlineStyle: {
    borderColor: green900
  },

  underlineFocusStyle: {
    borderColor: lime600
  },

  slider: {
    width: '300px'
  },

  textField: {
    width: '300px'
  }
}

export default class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      vehicle: 0,
      open: this.props.open,
      xhrFrom: new XMLHttpRequest(),
      xhrTo: new XMLHttpRequest(),
      dataSourceFrom: [],
      dataSourceTo: [],
    }
  }

  componentDidMount() {
    this.state.xhrFrom.onreadystatechange = () => {
      if (this.state.xhrFrom.readyState === 4 && this.state.xhrFrom.status === 200) {
        let places = JSON.parse(this.state.xhrFrom.responseText).map(place => {
          return {'text': place.display_name, 'data': {
              osm_id: place.osm_id,
              longitude: place.lon,
              latitude: place.lat
            }}
        });

        this.setState({
          dataSourceFrom: places
        });      
      }
    };

    this.state.xhrTo.onreadystatechange = () => {
      if (this.state.xhrTo.readyState === 4 && this.state.xhrTo.status === 200) {
        let places = JSON.parse(this.state.xhrTo.responseText).map(place => {
          return {'text': place.display_name, 'data': {
              osm_id: place.osm_id,
              longitude: place.lon,
              latitude: place.lat
            }}
        });

        this.setState({
          dataSourceTo: places
        });      
      }
    };
  }

  getVehicles = () => {
    return ["Fiat Fiorino",
            "Smart Roadster", 
            "Sam", 
            "Citysax", 
            "MUTE", 
            "Spyder-S", 
            "Think", 
            "Luis", 
            "STROMOS", 
            "Karabag Fiat 500E", 
            "Lupower Fiat 500E"
    ];
  }

  toggle = callback => {
    this.setState({open: !this.state.open}, callback);
  }

  vehicleChange = (event, index, value) => {
    this.setState({vehicle: value});
  }

  handleUpdateFromInput = address => {
    if(this.state.xhrFrom.readyState !== 0 || this.state.xhrFrom.readyState !== 4) {
      this.state.xhrFrom.abort();
    }
    this.state.xhrFrom.open('GET', 'http://nominatim.openstreetmap.org/search?format=json&q='+address, true);
    this.state.xhrFrom.send();
  }

  handleUpdateToInput = address => {
    if(this.state.xhrTo.readyState !== 0 || this.state.xhrTo.readyState !== 4) {
      this.state.xhrTo.abort();
    }
    this.state.xhrTo.open('GET', 'http://nominatim.openstreetmap.org/search?format=json&q='+address, true);
    this.state.xhrTo.send();
  }

  render() {
    const dataSourceConfig = {
      text: 'text',
      value: 'data',
    };

    return (
      <div style={this.state.open ? styles.container : {display: 'none'}}>
        <Tabs inkBarStyle={styles.active}>
          <Tab label="Route" style={styles.tab}>
            <div style={styles.menu}>
              <AutoComplete
                floatingLabelText="From"
                style={styles.textField}
                dataSource={this.state.dataSourceFrom}
                onUpdateInput={this.handleUpdateFromInput}
                floatingLabelStyle={styles.floatingLabelStyle} 
                underlineStyle={styles.underlineStyle}
                underlineFocusStyle={styles.underlineFocusStyle}
                dataSourceConfig={dataSourceConfig}
                fullWidth={true} />

              <AutoComplete
                floatingLabelText="To"
                style={styles.textField}
                dataSource={this.state.dataSourceTo}
                onUpdateInput={this.handleUpdateToInput}
                floatingLabelStyle={styles.floatingLabelStyle} 
                underlineStyle={styles.underlineStyle}
                underlineFocusStyle={styles.underlineFocusStyle}
                dataSourceConfig={dataSourceConfig}
                fullWidth={true} />

              <SelectField
                floatingLabelText="Vehicle"
                value={this.state.vehicle}
                onChange={this.vehicleChange}
              >
                {this.getVehicles().map((vehicle, index) => {
                  return <MenuItem key={index} value={index} primaryText={vehicle} />
                })}
              </SelectField>

              <p>Battery Level</p>
              <Slider style={styles.slider} defaultValue={1} />
              <RaisedButton label="Get Route" onClick={this.props.getRoute}
                          icon={<FontIcon className="material-icons" color={grey800}>near_me</FontIcon>}/>
            </div>
          </Tab>
          <Tab label="Reachability" style={styles.tab}>
            <div style={styles.menu}>
              <p>
                This feature is currently disabled
              </p>
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

Menu.propTypes = {
  open: PropTypes.bool,
  getRoute: PropTypes.func.isRequired
}

Menu.defaultProps = {
  open: true
};