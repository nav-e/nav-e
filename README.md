# gn-gps-routing

GreenNav Polymer element for obtaining the GPS coordinates of the device.


## Dependencies

Element dependencies are managed via [Bower](http://bower.io/). You can
install that via:

    npm install -g bower

Then, go ahead and download the element's dependencies:

    bower install


## Documentation and demo

Use [Polyserve](https://github.com/PolymerLabs/polyserve) to keep your element's
bower dependencies in line. You can install it via:

    npm install -g polyserve

And you can run it via:

    polyserve

Once running, you can preview your element at
`http://localhost:8080/components/gn-gps-routing/`.


## Example

To use the element, simply declare it in your Polymer app. 

```html
<gn-gps-routing></gn-gps-routing>
```

It will automatically obtain the GPS coordinates and fire a `gn-gps-coordinates` event,
passing the `latitude` and `longitude` parameters with it. These can also be accessed
directly as properties of the element.