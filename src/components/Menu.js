import React, { Component, PropTypes } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import { grey800, green900, green700, lime600 } from 'material-ui/styles/colors';

const styles = {
  container: {
    width: '400px',
    transition: 'width 0.1s ease-out-in'
  },

  containerHidden: {
    width: '0px',
    transition: 'width 0.1s ease-in-out'
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

  render() {
    return (
      <div style={this.props.open ? styles.container : styles.containerHidden}>
        <Tabs inkBarStyle={styles.active}>
          <Tab label="Route" style={styles.tab}>
            <div style={styles.menu}>
              <TextField  floatingLabelText="From" 
                          style={styles.textField}
                          floatingLabelStyle={styles.floatingLabelStyle} 
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle} />
              <TextField  floatingLabelText="To"
                          style={styles.textField}
                          floatingLabelStyle={styles.floatingLabelStyle} 
                          underlineStyle={styles.underlineStyle}
                          underlineFocusStyle={styles.underlineFocusStyle} />
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