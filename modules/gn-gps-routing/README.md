# gn-gps-routing

GreenNav Polymer element for obtaining the GPS coordinates of the device.

## Example

To use the element, simply declare it in your Polymer app. 

```html
<gn-gps-routing></gn-gps-routing>
```

It will automatically obtain the GPS coordinates and fire a `gn-gps-coordinates` event,
passing the `latitude` and `longitude` parameters with it. These can also be accessed
directly as properties of the element.
