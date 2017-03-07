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
import { green700 } from 'material-ui/styles/colors';

const styles = {
  container: {
    display: 'flex',
    zIndex: 1,
    minWidth: '300px'
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
    marginBottom: '25px'
  },

  autoCompleteWrapper: {
    position: 'relative',
    display: 'flex'
  },

  stopoversInput: {
    paddingRight: '45px',
  },

  removeStopoverBtn: {
    position: 'absolute',
    right: 0,
    bottom: '5px'
  },

  addStopoverBtn: {
    margin: '10px 0'
  },

  batteryLevel: {
    display: 'flex',
    justifyContent: 'space-between'
  },

  batteryLevelValue: {
    fontWeight: 'bold',
    color: green700,
    fontSize: '14px'
  }
};

export default class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      vehicle: 0,
      open: this.props.open,
      dataSource: [],
      autoCompletes: [{ id: 1, label: 'From', route: '' }, { id: 2, label: 'To', route: '' }]
    };
    this.autoCompleteId = 3;
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

  getAllAutoCompletes = () => {
    const dataSourceConfig = {
      text: 'text',
      value: 'data',
    };
    const allAutoCompletes =
      this.state.autoCompletes.map(autoComplete => (
        <div style={styles.autoCompleteWrapper} key={`wrapper-${autoComplete.id}`}>
          <AutoComplete
            inputStyle={
              this.isStopover(autoComplete.id) ? styles.stopoversInput : {}
            }
            key={autoComplete.id}
            floatingLabelText={autoComplete.label}
            onNewRequest={(req, index) => {
              const route = index === -1 ? '' : this.state.dataSource[index].data.osm_id;
              const updatedStopovers =
                this.state.autoCompletes.map((autoCompleteElem) => {
                  if (autoCompleteElem.id === autoComplete.id) {
                    return Object.assign({}, autoCompleteElem, { route });
                  }
                  return autoCompleteElem;
                });
              this.setState({ stopovers: updatedStopovers });
            }}
            dataSource={this.state.dataSource}
            onUpdateInput={this.handleUpdate}
            dataSourceConfig={dataSourceConfig}
            fullWidth
          />
          {this.isStopover(autoComplete.id) ?
            <IconButton
              style={styles.removeStopoverBtn}
              onClick={() => {
                setTimeout(() => {
                  this.setState(
                    {
                      autoCompletes:
                        this.state.autoCompletes.filter(elem => elem.id !== autoComplete.id)
                    }
                  );
                }, 200);
              }}
            >
              <FontIcon className="material-icons">remove_circle</FontIcon>
            </IconButton>
            : ''
          }
        </div>
      ));
    return allAutoCompletes;
  }

  isStopover = id => (id !== 1 && id !== 2)

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
    return (
      <Paper style={this.state.open ? styles.container : { display: 'none' }} zDepth={5} rounded={false}>
        <Tabs
          contentContainerStyle={styles.tabsContainer}
          inkBarStyle={styles.active}
          style={styles.tabs}
        >
          <Tab label="Route" style={styles.tab}>
            <div style={styles.menu}>
              {this.getAllAutoCompletes()}
              <div>
                <FlatButton
                  style={styles.addStopoverBtn}
                  label="Add Stopover"
                  onClick={() => {
                    const soLength = this.state.autoCompletes.length;
                    this.setState(
                      {
                        autoCompletes: [
                          ...this.state.autoCompletes.slice(0, soLength - 1),
                          { id: this.autoCompleteId, label: 'Over', route: '' },
                          this.state.autoCompletes[soLength - 1]
                        ]
                      },
                      () => {
                        this.autoCompleteId += 1;
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

              <p style={styles.batteryLevel}>
                <span>Battery Level</span>
                <span
                  style={styles.batteryLevelValue}
                  ref={node => (this.batteryLevel = node)}
                >
                  100%
                </span>
              </p>
              <Slider
                onChange={(e, val) => {
                  this.batteryLevel.innerText = `${parseInt(val * 100, 10)}%`;
                }}
                sliderStyle={styles.slider}
                defaultValue={1}
              />
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
