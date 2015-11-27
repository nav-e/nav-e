/*
 * Specific Behaviors for maps and map features which are implemented as GoogleMaps using the Google Maps Javascript API.
 * See: https://developers.google.com/maps/documentation/javascript/
 * 
 * List of content:
 * 	MapBehaviors.GoogleMapsBehavior
 * 	MarkerBehaviors.GoogleMapsBehavior
 * 	PolylineBehaviors.GoogleMapsBehavior 
 * 	PolygonsBehaviors.GoogleMapsBehavior 
 * 
 * Namespaces and MapDefault variables are defined in "gn-map.js"
 */

MapBehaviors.GoogleMapsBehavior = {
  // Specific attributes for this behavior
  properties : {
    // Attributes
    mapOptionsExtension : {
      type : Object,
      value : function () {
	return {
	  center : new google.maps.LatLng(MapDefaults.lat, MapDefaults.lon),
	  mapTypeId : google.maps.MapTypeId.SATELLITE,
	};
      }
    }
  },
  
  setCenter : function (center) {
    if (this.map){
      this.map.setCenter(new google.maps.LatLng(center.lat, center.lon));
    }
  },
  setRotation : function (rotation) {
    if (this.map){
      // Google Maps has no proper way to implement this function.
      // The closest option is to adjust google.maps.MapOptions.heading which has the Type number.
      // this.map.setRotation(rotation);
    }
  },
  refresh : function () {
    google.maps.event.trigger(this.map, 'resize');
  },
  
  attached : function () {
    // Extend the default map options with this behaviors specific ones
    $.extend(this.mapOptions, this.mapOptionsExtension);
    
    // Create a map object
    var m = new google.maps.Map(mapcontainer, this.mapOptions);
    
    this.map = m;
    
    // Add nodes for elements like marker, polyline and polygon
    var add = function(node) {
      if (node.addToMap && typeof node.addToMap === 'function') {
	node.addToMap(m);
      }
    };
    var remove = function(node) {
      node.removeFromMap();
    };
    
    // Extract the slice function so that we can use forEach
    // on various object collections
    var s = Array.prototype.slice;
    
    // For each child in this element, try to add it
    s.call(Polymer.dom(this).node.children).forEach(add);
    
    // Listen to any changes in the tree
    new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
	// Try to add them
	s.call(mutation.addedNodes).forEach(add);
	// or try to remove them
	s.call(mutation.removedNodes).forEach(remove);
      });
    }).observe(this, {
      childList : true
    });
  }
};

MapFeatureBehaviors.GoogleMapsBehavior = {
  // TODO feature instead of marker, polyline, polygon
  /*properties : {
    feature : Object
  },*/
  toggle : function (visible) {
    this.feature.setVisible(visible);
  },
  addToMap : function (map) {
    this.up();
    this.feature.setMap(map);
  },
  removeFromMap : function () {
    this.feature.setMap(null);
  }
};

MarkerBehaviors.GoogleMapsBehavior = { 
  properties : {
    feature : {
      type : Object,
      value : function() {
	return new google.maps.Marker();
      }
    }
  },
  up : function() {
    // Update position
    this.feature.setPosition(
      new google.maps.LatLng(this.lat, this.lon));
    // Set text
    this.feature.setTitle(this.label);
  }
};

PolylineBehaviors.GoogleMapsBehavior = { 
  properties : {
    feature : {
      type : Object,
      value : function() {
	return new google.maps.Polyline({
	  strokeColor : MapDefaults.strokeColor,
	  strokeOpacity : MapDefaults.strokeOpacity,
	  strokeWeight : MapDefaults.strokeWeight
	});
      }
    }
  },
  changeColor : function () {
    this.feature.strokeColor = this.color;
  },
  up : function() {
    if (this.values) {
      var nodes = [];
      for (var i = 0; i < this.values.length; i++) {
	var lat = this.values[i].latitude;
	var lon = this.values[i].longitude;
	nodes[i] = new google.maps.LatLng(lat, lon);
      }
      this.feature.setPath(nodes);
    }
  }
};

PolygonBehaviors.GoogleMapsBehavior = { 
  properties : {
    feature : {
      type : Object,
      value : function() {
	return new google.maps.Polygon({
	  // google.maps.PolygonOptions
	  strokeColor : MapDefaults.strokeColor,
	  strokeOpacity : MapDefaults.strokeOpacity,
	  strokeWeight : MapDefaults.strokeWeight,
	  fillColor : MapDefaults.fillColor,
	  fillOpacity : MapDefaults.fillOpacity
	});
      }
    }
  },
  changeColor : function () {
    this.feature.strokeColor = this.color;
    this.feature.fillColor = this.color;
  },
  up : function() {
    if (this.values) {
      var nodes = [];
      for (var i = 0; i < this.values.length; i++) {
	var lat = this.values[i].latitude;
	var lon = this.values[i].longitude;
	nodes[i] = new google.maps.LatLng(lat, lon);
      }
      this.feature.setPaths(nodes);
    }
  }
};