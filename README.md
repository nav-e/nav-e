# gn-gps-simulator

Emulates a moving gps signal.

## Setup Instructions

Clone the project (or download and extract zip).

```
git clone https://github.com/Greennav/gn-gps-simulator
```

### Dependencies

Element dependencies are managed via [Bower](http://bower.io/). You can install that (globally) via:

```
npm install -g bower
```

Move in the project folder and download the element's dependencies:

```
bower install
```

Note: This element uses [`gn-api`](https://github.com/Greennav/gn-api) to get its routing informations and will installed automatically via bower. In addition `gn-api` needs data via its `url` attribute. To get a mockup response you can install [`routing service`](https://github.com/Greennav/service-routing).

### Documentation and Demo

Use [Polyserve](https://github.com/PolymerLabs/polyserve) to play with gn-gps-simulator, read the documentation and watch the demo. You can install it via:

```
npm install -g polyserve
```

And you can run it via:

```
polyserve
```

Once running, you can preview your element at `http://localhost:8080/components/gn-gps-simulator/`, where `gn-gps-simulator` is the name of the directory containing it.

### Short example

Call the `startSimulation()` method and the position will move according to the next coordinates obtaining from server data (see [`gn-api`](https://github.com/Greennav/gn-api) and [`routing service`](https://github.com/Greennav/service-routing)). Also you can stop and reset the simulation with the appropriate methods.

```html
<paper-button id="sim.startSimulation()">start</paper-button>
<paper-button id="sim.stopSimulation()">stop</paper-button>
<paper-button id="sim.restartSimulation()">reset</paper-button>

<gn-gps-simulator id="sim"
                  longitude="{{lon}}"
                  latitude="{{lat}}"></gn-gps-simulator>

<h2>longitude="<span>[[lon]]</span>"</h2>
<h2>latitude="<span>[[lat]]</span>"</h2>
```
