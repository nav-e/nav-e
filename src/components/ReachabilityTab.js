import React, { Component, PropTypes } from 'react';
import Slider from 'material-ui/Slider';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import { green700 } from 'material-ui/styles/colors';

const styles = {
  menu: {
    margin: '10px 20px 30px'
  },

  reachabilitySlider: {
    marginBottom: '0px'
  },

  batteryLevel: {
    display: 'flex',
    justifyContent: 'space-between'
  },

  batteryLevelValue: {
    fontWeight: 'bold',
    color: green700,
    fontSize: '14px'
  },

  textField: {
    display: 'inherit',
    position: 'relative',
    marginBottom: '25px'
  }
};

export default class ReachabilityTab extends Component {
  render() {
    return (
      <div style={styles.menu}>
        <SelectField
          floatingLabelText="Vehicle"
          value={this.props.vehicle}
          onChange={this.props.vehicleChange}
          maxHeight={210}
          fullWidth
        >
          {this.props.getVehicles().map((vehicle, index) => (
            <MenuItem key={vehicle} value={index} primaryText={vehicle} />
          ))}
        </SelectField>
        <p style={styles.batteryLevel}>
          <span>Battery Level</span>
          <span
            style={styles.batteryLevelValue}
            ref={node => (this.batteryLevel = node)}
          >
            {`${this.props.batteryPecentage}%`}
          </span>
        </p>
        <Slider
          onChange={this.props.updateRange}
          value={this.props.batteryLevel}
          sliderStyle={styles.reachabilitySlider}
        />
        <TextField
          onChange={(e, val) => {
            this.setState({ remainingRange: val });
          }}
          style={styles.textField}
          floatingLabelText="Remaining Range"
          value={this.props.remainingRange}
        />
        <RaisedButton
          label="Visualise Range"
          onClick={this.props.getRangeVisualisation}
          icon={<FontIcon className="material-icons">map</FontIcon>}
        />
      </div>
    );
  }
}

ReachabilityTab.propTypes = {
  vehicle: PropTypes.number.isRequired,
  batteryLevel: PropTypes.number.isRequired,
  batteryPecentage: PropTypes.number.isRequired,
  remainingRange: PropTypes.number,
  getVehicles: PropTypes.func.isRequired,
  vehicleChange: PropTypes.func.isRequired,
  updateRange: PropTypes.func.isRequired,
  getRangeVisualisation: PropTypes.func.isRequired
};

ReachabilityTab.defaultProps = {
  remainingRange: undefined
};
