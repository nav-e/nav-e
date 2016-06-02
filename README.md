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

You can get coordinates from an array and push this one to `positions` in `gn-gps-simulator`. Then call the `startSimulation()` method and the position will move according to the next coordinates in the array.

```javascript
//example.json

[
  {
    "lon":10.680888891220093,
    "lat":53.8662953069172
  },
  {
    "lon":10.680717229843138,
    "lat":53.86692795108485
  },
  // and more and more and...
]
```

```html
<paper-button id="sim.startSimulation()">start</paper-button>

<iron-ajax url="example.json" last-response="{{positions}}" auto></iron-ajax>

<gn-gps-simulator id="sim"
                  positions="[[positions]]"
                  longitude="{{lon}}"
                  latitude="{{lat}}"></gn-gps-simulator>

<h2>longitude="<span>[[lon]]</span>"</h2>
<h2>latitude="<span>[[lat]]</span>"</h2>
```
