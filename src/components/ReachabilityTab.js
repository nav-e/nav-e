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
  },

  rangeTextField: {
    display: 'inherit',
    position: 'relative',
    marginBottom: '25px'
  },

  buttonDiv: {
    display: 'flex',
  },

  showButton: {
    marginRight: '18'
  }
};

export default class ReachabilityTab extends Component {
  render() {
    return (
      <div style={styles.menu}>
        <TextField
          onClick={() => this.props.updateRangeFromSelected(true)}
          onChange={(e, val) => this.props.updateRangeFromField(val)}
          style={styles.textField}
          floatingLabelText="From"
          value={this.props.rangeFromField}
        />
        <TextField
          onClick={() => this.props.updateRangeToSelected(true)}
          onChange={(e, val) => this.props.updateRangeToField(val)}
          style={styles.textField}
          floatingLabelText="To"
          value={this.props.rangeToField}
        />
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
          onChange={this.props.updateBatterySlider}
          value={this.props.batteryLevel}
          sliderStyle={styles.reachabilitySlider}
        />
        <TextField
          onChange={this.props.updateRemainingRange}
          style={styles.rangeTextField}
          floatingLabelText="Remaining Range"
          value={Math.round(this.props.remainingRange) || ''}
        />
        <div
          style={styles.buttonDiv}
        >
          <RaisedButton
            label="Display"
            onClick={this.props.getRangeVisualisation}
            icon={<FontIcon className="material-icons">map</FontIcon>}
            style={styles.showButton}
          />
          {this.props.rangePolygonShowing ?
            <RaisedButton
              label="Hide"
              onClick={this.props.hideRangeVisualisation}
              icon={<FontIcon className="material-icons">map</FontIcon>}
            /> : null}
        </div>
      </div>
    );
  }
}

ReachabilityTab.propTypes = {
  vehicle: PropTypes.number.isRequired,
  batteryLevel: PropTypes.number.isRequired,
  batteryPecentage: PropTypes.number.isRequired,
  updateBatterySlider: PropTypes.func.isRequired,
  rangePolygonShowing: PropTypes.bool.isRequired,
  remainingRange: PropTypes.number.isRequired,
  updateRemainingRange: PropTypes.func.isRequired,
  getVehicles: PropTypes.func.isRequired,
  vehicleChange: PropTypes.func.isRequired,
  getRangeVisualisation: PropTypes.func.isRequired,
  hideRangeVisualisation: PropTypes.func.isRequired,
  rangeFromField: PropTypes.string.isRequired,
  updateRangeFromField: PropTypes.func.isRequired,
  updateRangeFromSelected: PropTypes.func.isRequired,
  rangeToField: PropTypes.string.isRequired,
  updateRangeToField: PropTypes.func.isRequired,
  updateRangeToSelected: PropTypes.func.isRequired,
};
