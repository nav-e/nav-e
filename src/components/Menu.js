import React, { Component, PropTypes } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import AutoComplete from 'material-ui/AutoComplete';
import Slider from 'material-ui/Slider';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';

const styles = {
  container: {
    display: 'flex',
    zIndex: 1,
    minWidth: 350
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
    margin: '10px 25px 30px'
  },

  slider: {
    marginBottom: '30px'
  },

  stopoverWrapper: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative'
  },

  stopoverInput: {
    flex: '0 1 250px'
  },

  removeStopoverBtn: {
    position: 'absolute',
    right: 0
  },

  addStopoverBtn: {
    margin: '10px 0'
  }
};

export default class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      vehicle: 0,
      open: this.props.open,
      dataSource: [],
      stopovers: [{ id: 1, label: 'From', route: '' }, { id: 2, label: 'To', route: '' }]
    };
    this.stopoversId = 2;
    this.xhr = new XMLHttpRequest();
  }

  getVehicles = () => [
    'Fiat Fiorino',
    'Smart Roadster',
    'Sam',
    'Citysax',
    'MUTE',
    'Spyder-S',
    'Think',
    'Luis',
    'STROMOS',
    'Karabag Fiat 500E',
    'Lupower Fiat 500E'
  ]

  getRoute = () => {
    if (this.state.route.every(waypoint => waypoint !== '')) {
      this.props.getRoute(this.state.route);
    }
    else {
      // TODO: implement notifications (Thomas GSoC Project - see polymer reference branch)
      alert('Please select a start and destination from the suggestions');
    }
  }

  handleUpdate = (address) => {
    if (this.xhr.readyState !== 0 || this.xhr.readyState !== 4) {
      this.xhr.abort();
    }

    this.xhr.onreadystatechange = () => {
      if (this.xhr.readyState === 4 && this.xhr.status === 200) {
        const places = JSON.parse(this.xhr.responseText).map(place => (
          {
            text: place.display_name,
            data: {
              osm_id: place.osm_id,
              longitude: place.lon,
              latitude: place.lat
            }
          }
        ));
        this.setState({
          dataSource: places
        });
      }
    };

    this.xhr.open('GET', `${this.props.autoCompleteAddress}search/${address}`, true);
    this.xhr.send();
  }

  toggle = (callback) => {
    this.setState({ open: !this.state.open }, callback);
  }

  vehicleChange = (event, index, value) => {
    this.setState({ vehicle: value });
  }

  render() {
    const dataSourceConfig = {
      text: 'text',
      value: 'data',
    };

    const allStopovers =
      this.state.stopovers.map(stopover => (
        <div style={styles.stopoverWrapper} key={`wrapper-${stopover.id}`}>
          <AutoComplete
            key={stopover.id}
            floatingLabelText={stopover.label}
            onNewRequest={(req, index) => {
              const route = index === -1 ? '' : this.state.dataSource[index].data.osm_id;
              const updatedStopovers =
                this.state.stopovers.map((stopoverElem) => {
                  if (stopoverElem.id === stopover.id) {
                    return Object.assign({}, stopoverElem, { route });
                  }
                  return stopoverElem;
                });
              this.setState({ stopovers: updatedStopovers });
            }}
            dataSource={this.state.dataSource}
            onUpdateInput={this.handleUpdate}
            dataSourceConfig={dataSourceConfig}
            fullWidth
          />
          {(stopover.id !== 2 && stopover.id !== 1) ?
            <IconButton
              style={styles.removeStopoverBtn}
              onClick={() => {
                this.setState(
                  {
                    stopovers: this.state.stopovers.filter(elem => elem.id !== stopover.id)
                  }
                );
              }}
            >
              <FontIcon className="material-icons">remove_circle</FontIcon>
            </IconButton>
            : ''
          }
        </div>
      ));

    return (
      <Paper style={this.state.open ? styles.container : { display: 'none' }} zDepth={5} rounded={false}>
        <Tabs
          contentContainerStyle={styles.tabsContainer}
          inkBarStyle={styles.active}
          style={styles.tabs}
        >
          <Tab label="Route" style={styles.tab}>
            <div style={styles.menu}>
              {allStopovers}

              <div>
                <FlatButton
                  style={styles.addStopoverBtn}
                  label="Add Stopover"
                  onClick={() => {
                    this.stopoversId += 1;
                    const soLength = this.state.stopovers.length;
                    this.setState(
                      {
                        stopovers: [
                          ...this.state.stopovers.slice(0, soLength - 1),
                          { id: this.stopoversId, label: 'To', route: '' },
                          this.state.stopovers[soLength - 1]
                        ]
                      }
                    );
                  }}
                  labelStyle={{ textTransform: 'none' }}
                  icon={<FontIcon className="material-icons">add_circle</FontIcon>}
                />
              </div>

              <SelectField
                floatingLabelText="Vehicle"
                value={this.state.vehicle}
                onChange={this.vehicleChange}
                maxHeight={210}
                fullWidth
              >
                {this.getVehicles().map((vehicle, index) => (
                  <MenuItem key={index} value={index} primaryText={vehicle} />
                ))}
              </SelectField>

              <p>Battery Level</p>
              <Slider sliderStyle={styles.slider} defaultValue={1} />
              <RaisedButton
                label="Get Route"
                onClick={this.getRoute}
                icon={<FontIcon className="material-icons">near_me</FontIcon>}
              />
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
};

Menu.defaultProps = {
  open: true
};
