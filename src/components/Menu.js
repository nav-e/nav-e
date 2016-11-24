import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';

const styles = {
  container: {
    width: '400px'
  }
}

export default class Menu extends Component {

  render() {
    return (
      <div style={styles.container}>
        <Tabs>
          <Tab label="Route">
            <div>
              <p>
                This is an example tab.
              </p>
              <p>
                You can put any sort of HTML or react component in here. It even keeps the component state!
              </p>
            </div>
          </Tab>
          <Tab label="Reachability">
            <div>
              <p>
                This is another example tab.
              </p>
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
}