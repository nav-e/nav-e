# gn-map element

The gn-map element provides a wrapper for different map types. If the `map-type` attribute changes, this change will apply to all child elements. At this time gn-map supports google-map and osm-map, and all children like polygons, points and markers.


## Dependencies

Element dependencies are managed via [Bower](http://bower.io/). You can
install that via:

    npm install -g bower

Then, go ahead and download the element's dependencies:

    bower install


## Playing With Your Element

If you wish to work on your element in isolation, we recommend that you use
[Polyserve](https://github.com/PolymerLabs/polyserve) to keep your element's
bower dependencies in line. You can install it via:

    npm install -g polyserve

And you can run it via:

    polyserve

Once running, you can preview your element at
`http://localhost:8080/components/seed-element/`, where `seed-element` is the name of the directory containing it.


## Properties

- latitude : latitude to center the map on
- longitude : longitude to center the map on
- zoom : The zoom level to be applied to the map
- mapType : The dom-if template decides which type of map is to be included - eg "GoogleMap" or "OpenStreetMap"
- map : Holds the map object and allows to modify values during runtime
- polygons : Array of Polygon objects
- markers : Array of Marker objects
- _userPolygons : Array of user created Polygons
- _userMarkers : Array of user created Markers

## Usage Example

```HTML
<gn-map id="map" class="content fit" 
        latitude="53.694089" 
        longitude="10.608718" 
        zoom="17" 
        map-type="GoogleMap">
  <gn-poly fill-color="red" stroke-color="red" closed>
    <gn-point latitude="53.699089" longitude="10.603718"></gn-point>
    <gn-point latitude="53.694089" longitude="10.608718"></gn-point>
  </gn-poly>
  <gn-marker></gn-marker>
</gn-map>
```

## Testing Your Element

Simply navigate to the `/test` directory of your element to run its tests. If
you are using Polyserve: `http://localhost:8080/components/seed-element/test/`

### web-component-tester

The tests are compatible with [web-component-tester](https://github.com/Polymer/web-component-tester).
Install it via:

    npm install -g web-component-tester

Then, you can run your tests on _all_ of your local browsers via:

    wct

#### WCT Tips

`wct -l chrome` will only run tests in chrome.

`wct -p` will keep the browsers alive after test runs (refresh to re-run).

`wct test/some-file.html` will test only the files you specify.
