# gn-path-follower

Navigation path follower for mobile phones, cars or gn-path-follower

## Setup Instructions

Clone the project (or download and extract zip).

```
git clone https://github.com/Greennav/gn-path-follower
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

Use [Polyserve](https://github.com/PolymerLabs/polyserve) to play with gn-path-follower, read the documentation and watch the demo. You can install it via:

```
npm install -g polyserve
```

And you can run it via:

```
polyserve
```

Once running, you can preview your element at `http://localhost:8080/components/gn-path-follower/`, where `gn-path-follower` is the name of the directory containing it.

### Short example

```html
<gn-gps-simulator id="sim"
                  latitude="{{lat}}"
                  longitude="{{lon}}"></gn-gps-simulator>

<gn-path-follower latitude="[[lat]]"
                  longitude="[[lon]]"></gn-path-follower>
```
