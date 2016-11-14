# gn-gps-simulator

Emulates a moving gps signal according to waypoints and variable speed (and accuracy in future).

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

<h2>longitude="<span>[[lon]]</span>"</h2>
<h2>latitude="<span>[[lat]]</span>"</h2>
```
