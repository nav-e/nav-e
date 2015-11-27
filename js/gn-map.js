/*
 * MapDefaults
 */
window.MapDefaults = window.MapDefaults || {};

// "gn-map.html"
MapDefaults.lon = 10.7042;
MapDefaults.lat = 53.8344;
MapDefaults.zoom = 14;

// "gn-marker.html", "gn-polyline.html", "gn-polygon.html"
MapDefaults.strokeColor = '#FF0000';
MapDefaults.strokeOpacity = 1;
MapDefaults.strokeWeight = 2;
MapDefaults.fillColor = '#FF0000';
MapDefaults.fillOpacity = 0.33;

// "gn-marker.html"
MapDefaults.markerLabel = "Marker text";

// TODO: Polygon coloring test colors
MapDefaults.strokeColorYellow = '#FFFF00';
MapDefaults.strokeColorGreen = '#00FF00';
MapDefaults.fillColorYellow = '#FFFF00';
MapDefaults.fillColorGreen = '#00FF00';

/*
 * Namespaces
 */
// Map
window.MapBehaviors = window.MapBehaviors || {};

// Map Features
window.MapFeatureBehaviors = window.MapFeatureBehaviors || {};

window.MarkerBehaviors = window.MarkerBehaviors || {};
window.PolylineBehaviors = window.PolylineBehaviors || {};
window.PolygonBehaviors = window.PolygonBehaviors || {};

/*
 * MapFeatureBehaviors
 */
MapFeatureBehaviors.DefaultBehavior = { 
  up : function () {
    console.log("gn-map-feature.html: up() is not implemented");
  },
  toggle : function (visible) {
    console.log("gn-map-feature.html: toggle(visible) is not implemented");
  },
  addToMap : function (map) {
    console.log("gn-map-feature.html: addToMap(map) is not implemented");
  },
  removeFromMap : function () {
    console.log("gn-map-feature.html: removeFromMap() is not implemented");
  }
};

/*
 * Specific MapBehaviors and MapFeatureBehaviors
 * This variable decides which map will be used!
 */
//var mapBehavior = "GoogleMaps";
var mapBehavior = "OpenStreetMaps";

/*
 * Dynamic Script Loading
 */
// TODO: Dynamical usage of JavaScript-files like "gn-map-openstreetmaps.js" and "gn-map-googlemaps.js"
// TODO: Remove map specific script imports in "gn-map.js"
/*$.getScript("components/js/gn-map-openstreetmaps.js", function(){
   console.log("Script1 loaded but not necessarily executed.");
});
$.getScript("components/js/gn-map-googlemaps.js", function(){
   console.log("Script2 loaded but not necessarily executed.");
});*/