/*
 * Specific Behaviors for maps and map features which are implemented as OpenStreetMaps using the OpenLayers 3 API.
 * See: http://openlayers.org
 * 
 * List of content:
 * 	MapBehaviors.OpenStreetMapsBehavior
 * 	MarkerBehaviors.OpenStreetMapsBehavior
 * 	PolylineBehaviors.OpenStreetMapsBehavior 
 * 	PolygonsBehaviors.OpenStreetMapsBehavior 
 * 
 * Namespaces and MapDefault variables are defined in "gn-map.js"
 */

MapBehaviors.OpenStreetMapsBehavior = { 
  // Specific attributes for this behavior
  properties : {
    // Attributes
    mapOptionsExtension : {
      type : Object,
      value : function () {
	return {
	  target: 'mapcontainer',
	  // Layers - visual representation
	  layers: [    
	  new ol.layer.Tile({
	    // Source - remote data source
	    source: new ol.source.OSM() // Open Street Map
	  })
	  ],
	  // View - longlat in the center, zoom level
	  view: new ol.View({
	    center: ol.proj.fromLonLat([MapDefaults.lon, MapDefaults.lat]),
	    zoom: MapDefaults.zoom
	  })
	};
      }
    }
  },
  
  setCenter : function (center) {
    if (this.map){
      this.map.getView().setCenter(ol.proj.fromLonLat([center.lon, center.lat]));
    }
  },
  setRotation : function (rotation) {
    if (this.map){
      this.map.getView().setCenter(rotation);
    }
  },
  refresh : function () {
    this.map.updateSize();
  },
  // TODO kürzen
  attached : function () {
    // Extend the default map options with this behaviors specific ones
    //$.extend(this.mapOptions, this.mapOptionsExtension);
    
    // Create a map object
    //TODO var m = new ol.Map(this.mapOptions);
    var m = new ol.Map(this.mapOptionsExtension);
    
    this.map = m;
    
    // Add nodes for elements like marker, polyline and polygon
    var add = function(node) {
      if (node.addToMap && typeof node.addToMap === 'function') {
	node.addToMap(m);
      }
    };
    var remove = function(node) {
      node.removeFromMap(m);
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

MapFeatureBehaviors.OpenStreetMapsBehavior = {
  // TODO layer instead of markerLayer, polylineLayer, polygonLayer
  /*properties : {
    layer : Object
  },*/
  
  toggle : function (visible) {
    this.layer.setVisible(visible);
  },
  addToMap : function (map) {
    this.up();
    map.addLayer(this.layer);
  },
  removeFromMap : function (map) {
    map.removeLayer(this.layer);
  }
};

MarkerBehaviors.OpenStreetMapsBehavior = { 
  properties : {
    layer : {
      type : Object,
      value : function() {
	/* 
	 * Change color format
	 * Google Maps has one option for colors as hex color and one for the opacity.
	 * Open Street Maps has one option, which is an array für rgba-values.
	 * a stands for alpha and therefore is the same as opacity.
	 */
	var strokeColorSlice = ol.color.asArray(MapDefaults.strokeColor).slice();
	var fillColorSlice = ol.color.asArray(MapDefaults.fillColor).slice();
	
	// Create a new Marker Feature
	var markerFeature = new ol.Feature(
	  new ol.geom.Point([]));
	
	return new ol.layer.Vector({
	  source: new ol.source.Vector({
	    features: [markerFeature]
	  }),
	  style : new ol.style.Style({
	    // Set default text
	    text: new ol.style.Text({
	      text: this.label
	    }),
	    // Draw Circle 
	    // TODO This could be replaced by a marker Image
	    image: new ol.style.Circle({
	      fill: new ol.style.Fill({
		color: [fillColorSlice[0], fillColorSlice[1], fillColorSlice[2],	// RGB
		  MapDefaults.fillOpacity]						// Opacity
	      }),
	      stroke: new ol.style.Stroke({
		color: [strokeColorSlice[0], strokeColorSlice[1], strokeColorSlice[2], 	// RGB
		  MapDefaults.strokeOpacity],						// Opacity
		width: MapDefaults.strokeWeight
	      }),
	      radius: 8
	    })
	  })
	});
      }
    }
  },
  up : function() {
    // Update position
    this.layer.getSource().getFeatures()[0].getGeometry().setCoordinates( 
      new ol.proj.fromLonLat([this.lon, this.lat]));
    // Set text
    this.layer.getStyle().getText().setText(this.label);
  }
};

PolylineBehaviors.OpenStreetMapsBehavior = { 
  properties : {
    layer : {
      type : Object,
      value : function() {
	/* 
	 * Change color format
	 * Google Maps has one option for colors as hex color and one for the opacity.
	 * Open Street Maps has one option, which is an array für rgba-values.
	 * a stands for alpha and therefore is the same as opacity.
	 */
	var strokeColorSlice = ol.color.asArray(MapDefaults.strokeColor).slice();
	
	// Create a new Polyline Feature
	var polylineFeature = new ol.Feature(
	  new ol.geom.LineString([]));
	
	return new ol.layer.Vector({
	  source : new ol.source.Vector({
	    features: [polylineFeature]
	  }),
	  style : new ol.style.Style({
	    stroke: new ol.style.Stroke({
	      color: [strokeColorSlice[0], strokeColorSlice[1], strokeColorSlice[2], 	// RGB				
		MapDefaults.strokeOpacity],						// Opacity
	      width: MapDefaults.strokeWeight
	    })
	  })
	});
      }
    }
  },
  changeColor : function () {
    this.layer.getStyle().getStroke().setColor(this.color);
  },
  up : function() {
    if (this.values) {
      var nodes = [];
      for (var i = 0; i < this.values.length; i++) {
	var lat = this.values[i].latitude;
	var lon = this.values[i].longitude;
	nodes[i] = new ol.proj.fromLonLat([lon, lat]);
      }
      this.layer.getSource().getFeatures()[0].getGeometry().setCoordinates(nodes);
    }
  }
};

PolygonBehaviors.OpenStreetMapsBehavior = { 
  properties : {
    layer : {
      type : Object,
      value : function() {
	/* 
	 * Change color format
	 * Google Maps has one option for colors as hex color and one for the opacity.
	 * Open Street Maps has one option, which is an array für rgba-values.
	 * a stands for alpha and therefore is the same as opacity.
	 */
	var strokeColorSlice = ol.color.asArray(MapDefaults.strokeColor).slice();
	var fillColorSlice = ol.color.asArray(MapDefaults.fillColor).slice();
	
	// Create a new Polygon Feature
	var polygonFeature = new ol.Feature(
	  new ol.geom.Polygon([[]]));
	
	return new ol.layer.Vector({
	  source: new ol.source.Vector({
	    features: [polygonFeature]
	  }),
	  style: new ol.style.Style({
	    stroke: new ol.style.Stroke({
	      color: [strokeColorSlice[0], strokeColorSlice[1], strokeColorSlice[2], 	// RGB
		MapDefaults.strokeOpacity],						// Opacity
	      width: MapDefaults.strokeWeight
	    }),
	    fill: new ol.style.Fill({
	      color: [fillColorSlice[0], fillColorSlice[1], fillColorSlice[2], 		// RGB
		MapDefaults.fillOpacity]						// Opacity
	    })
	  })
	});
      }
    }, 
    
    /*
     * TODO: This is for testing purposes on "Polygons with different colored sections"
     */
    layerYellow : {
      type : Object,
      value : function() {
	/* 
	 * Change color format
	 * Google Maps has one option for colors as hex color and one for the opacity.
	 * Open Street Maps has one option, which is an array für rgba-values.
	 * a stands for alpha and therefore is the same as opacity.
	 */
	var strokeColorSlice = ol.color.asArray(MapDefaults.strokeColorYellow).slice();
	var fillColorSlice = ol.color.asArray(MapDefaults.fillColorYellow).slice();
	
	// Create a new Polygon Feature
	var polygonFeature = new ol.Feature(
	  new ol.geom.Polygon([[]]));
	
	return new ol.layer.Vector({
	  source: new ol.source.Vector({
	    features: [polygonFeature]
	  }),
	  style: new ol.style.Style({
	    stroke: new ol.style.Stroke({
	      color: [strokeColorSlice[0], strokeColorSlice[1], strokeColorSlice[2],	// RGB
		MapDefaults.strokeOpacity],						// Opacity
	      width: MapDefaults.strokeWeight
	    }),
	    fill: new ol.style.Fill({
	      color: [fillColorSlice[0], fillColorSlice[1], fillColorSlice[2], 		// RGB
		MapDefaults.fillOpacity]						// Opacity
	    })
	  })
	});
      }
    },
    
    /*
     * TODO: This is for testing purposes on "Polygons with different colored sections"
     */
    layerGreen : {
      type : Object,
      value : function() {	
	/* 
	 * Change color format
	 * Google Maps has one option for colors as hex color and one for the opacity.
	 * Open Street Maps has one option, which is an array für rgba-values.
	 * a stands for alpha and therefore is the same as opacity.
	 */
	var strokeColorSlice = ol.color.asArray(MapDefaults.strokeColorGreen).slice();
	var fillColorSlice = ol.color.asArray(MapDefaults.fillColorGreen).slice();
	
	// Create a new Polygon Feature
	var polygonFeature = new ol.Feature(
	  new ol.geom.Polygon([[]]));
	
	return new ol.layer.Vector({
	  source: new ol.source.Vector({
	    features: [polygonFeature]
	  }),
	  style: new ol.style.Style({
	    stroke: new ol.style.Stroke({
	      color: [strokeColorSlice[0], strokeColorSlice[1], strokeColorSlice[2],	// RGB
		MapDefaults.strokeOpacity],						// Opacity
	      width: MapDefaults.strokeWeight
	    }),
	    fill: new ol.style.Fill({
	      color: [fillColorSlice[0], fillColorSlice[1], fillColorSlice[2], 		// RGB
		MapDefaults.fillOpacity]						// Opacity
	    })
	  })
	});
      }
    }
  },
  changeColor : function () {
    this.layer.getStyle().getStroke().setColor(this.color);
    // TODO 
    /*var col = this.color
    var fillColorSlice = ol.color.asArray(col).slice();
    this.layer.getStyle().getFill().setColor(
      [fillColorSlice[0], fillColorSlice[1], fillColorSlice[2], 			// RGB
      MapDefaults.fillOpacity]								// Opacity
    );*/
    
    
  },
  up : function() {
    if (this.values) {
      var nodes = [];
      for (var i = 0; i < this.values.length; i++) {
	var lat = this.values[i].latitude;
	var lon = this.values[i].longitude;
	nodes[i] = new ol.proj.fromLonLat([lon, lat]);
      }
      this.layer.getSource().getFeatures()[0].getGeometry().setCoordinates([nodes]);
      
      //this.layerYellow.getSource().getFeatures()[0].getGeometry().setCoordinates([nodes]);
      //this.layerGreen.getSource().getFeatures()[0].getGeometry().setCoordinates([nodes]);
    };
    /*
    //this.valuesYellow = this.values;
    if (this.valuesYellow) {
      var nodes = [];
      for (var i = 0; i < this.valuesYellow.length; i++) {
	var lat = this.valuesYellow[i].latitude-0.025;
	var lon = this.valuesYellow[i].longitude-0.025;
	nodes[i] = new ol.proj.fromLonLat([lon, lat]);
      }
      this.layerYellow.getSource().getFeatures()[0].getGeometry().setCoordinates([nodes]);
    };
    
    //this.valuesGreen = this.values;
    if (this.valuesGreen) {
      var nodes = [];
      for (var i = 0; i < this.valuesGreen.length; i++) {
	var lat = this.valuesGreen[i].latitude-0.05;
	var lon = this.valuesGreen[i].longitude-0.05;
	nodes[i] = new ol.proj.fromLonLat([lon, lat]);
      }
      this.layerGreen.getSource().getFeatures()[0].getGeometry().setCoordinates([nodes]);
    };
    
    if (this.values) {
      console.log("Length: " + this.values.length);
      console.log("First: lat " + this.values[0].latitude + "; long " + this.values[0].longitude);
      console.log("First: lat " + this.values[this.values.length - 1].latitude + "; long " + this.values[this.values.length - 1].longitude);
    };
    
    if (this.battery) {
      console.log("Battery: " + this.battery);
    };*/
    
    /*if (this.range) {
      console.log("Range: " + this.range[0]);
    };*/
  },
  /*
  toggle : function (visible) {
    this.layer.setVisible(visible);
    
    this.layerYellow.setVisible(visible);
    this.layerGreen.setVisible(visible);
  },
  addToMap : function (map) {
    this.up();
    map.addLayer(this.layer);
    
    map.addLayer(this.layerYellow);
    map.addLayer(this.layerGreen);
  },
  removeFromMap : function (map) {
    map.removeLayer(this.layer);
    
    map.removeLayer(this.layerYellow);
    map.removeLayer(this.layerGreen);
  }*/
}; 