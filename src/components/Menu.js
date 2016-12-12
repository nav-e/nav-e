import React, { Component, PropTypes } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import AutoComplete from 'material-ui/AutoComplete';
import Slider from 'material-ui/Slider';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper'

const styles = {
  container: {
    display: 'flex',
    width: '400px',
    zIndex: 1,
  },

  tabs: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column'
  },

  tabsContainer: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto'
  },

  menu: {
    margin: '10px 25px'
  },

  slider: {
    width: '300px'
  },
}

export default class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      vehicle: 0,
      open: this.props.open,
      xhr: new XMLHttpRequest(),
      dataSource: [],
      route: [],
      stopovers: 0
    }
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

  handleUpdate = address => {
    if(this.state.xhr.readyState !== 0 || this.state.xhr.readyState !== 4) {
      this.state.xhr.abort();
    }

    this.state.xhr.onreadystatechange = () => {
      if (this.state.xhr.readyState === 4 && this.state.xhr.status === 200) {
        let places = JSON.parse(this.state.xhr.responseText).map(place => {
          return {'text': place.display_name, 'data': {
              osm_id: place.osm_id,
              longitude: place.lon,
              latitude: place.lat
            }}
        });
        this.setState({
          dataSource: places
        });
      }
    };

    this.state.xhr.open('GET', this.props.autoCompleteAddress+'search/'+address, true);
    this.state.xhr.send();
  }

  getRoute = () => {
    if(this.state.route.every(waypoint => waypoint !== '')) {
      this.props.getRoute(this.state.route);
    }
    else {
      //TODO: implement notifications (Thomas GSoC Project - see polymer reference branch)
      alert('Please select a start and destination from the suggestions');
    }
  }

  render() {
    const dataSourceConfig = {
      text: 'text',
      value: 'data',
    };

    return (
      <Paper style={this.state.open ? styles.container : {display: 'none'}} zDepth={5}>
        <Tabs contentContainerStyle={styles.tabsContainer} inkBarStyle={styles.active} style={styles.tabs}>
          <Tab label="Route" style={styles.tab}>
            <div style={styles.menu}>
              <AutoComplete
                floatingLabelText="From"
                onNewRequest={(req, index) => {
                  this.state.route[0] = index === -1 ? '' : this.state.dataSource[index].data.osm_id;
                }}
                dataSource={this.state.dataSource}
                onUpdateInput={this.handleUpdate}
                dataSourceConfig={dataSourceConfig}
                fullWidth={true} />

              {
                [...Array(this.state.stopovers)].map((stopover, i) => {
                  return <AutoComplete
                            key = {i}
                            floatingLabelText="Over"
                            onNewRequest={(req, index) => {
                              this.state.route[stopover + 1] = index === -1 ? '' : this.state.dataSource[index].data.osm_id;
                            }}
                            dataSource={this.state.dataSource}
                            onUpdateInput={this.handleUpdate}
                            dataSourceConfig={dataSourceConfig}
                            fullWidth={true} />
                })
              }

              <AutoComplete
                floatingLabelText="To"
                onNewRequest={(req, index) => {
                  this.state.route[this.state.stopovers + 1] = index === -1 ? '' : this.state.dataSource[index].data.osm_id
                }}
                dataSource={this.state.dataSource}
                onUpdateInput={this.handleUpdate}
                dataSourceConfig={dataSourceConfig}
                fullWidth={true} />

              <FlatButton
                label="Add Stopover"
                onClick={() => {this.setState({stopovers: this.state.stopovers + 1})}}
                labelStyle={{textTransform : 'none'}}
                icon={<FontIcon className="material-icons">add_circle</FontIcon>} />

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
              <RaisedButton label="Get Route" onClick={this.getRoute}
                          icon={<FontIcon className="material-icons">near_me</FontIcon>}/>
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
      </Paper>
    );
  }
}

Menu.propTypes = {
  open: PropTypes.bool,
  autoCompleteAddress: PropTypes.string.isRequired,
  getRoute: PropTypes.func.isRequired
}

Menu.defaultProps = {
  open: true
};
