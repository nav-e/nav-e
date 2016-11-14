# gn-path-follower

Navigation path follower for mobile phones, cars or gn-gps-simulator. Below is a little screencast:

![Loading gif](https://cloud.githubusercontent.com/assets/9342018/16989167/6c613fba-4e93-11e6-82c8-3f796b378206.gif)

### Short example

Call the `startSimulation()` method and the position will move according to the next coordinates obtaining from server data (see [`gn-api`](https://github.com/Greennav/gn-api) and [`routing service`](https://github.com/Greennav/service-routing)). Also you can stop and reset the simulation with the appropriate methods.

```html
<!-- To get mockup data use gn-api and service-routing. -->
<gn-api id="gnapi" route="{{route}}"></gn-api>

<!-- Don't forget to get the route. -->
<paper-button on-tap="gnapi.getRoute()">get route</paper-button>

<!-- Change speed in waypoint per second easily, even live. -->
<paper-slider id="speed" pin snaps
              max="5" min="0.5" step="0.5" value="1"></paper-slider>

<paper-button on-tap="sim.startSimulation()">start</paper-button>
<paper-button on-tap="sim.stopSimulation()">stop</paper-button>
<paper-button on-tap="sim.restartSimulation()">reset</paper-button>

<gn-gps-simulator id="sim"
                  route="{{route}}"
                  longitude="{{lon}}"
                  latitude="{{lat}}"></gn-gps-simulator>

<gn-path-follower latitude="[[lat]]"
                  longitude="[[lon]]"></gn-path-follower>
```

## TODO

### In Progress

- Caching of map data to avoid "flickering" (doesn't apply for Google maps because of license restrictions)