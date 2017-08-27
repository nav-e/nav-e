import ol from 'openlayers';
import convex from '@turf/convex';
import { featureCollection, point } from '@turf/helpers';

const overpassEndpoint = 'http://overpass-api.de/api/interpreter';
const rangeAnxietyServer = 'http://localhost:8111';


export const testCoordinatesValidity = (coord) => {
  const boundRange = 0.005;
  const nCoord = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');

  // Create bounding box for search
  const swBound = [nCoord[1] - boundRange, nCoord[0] - boundRange];
  const neBound = [nCoord[1] + boundRange, nCoord[0] + boundRange];

  const reqOptions = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: `[out:json][timeout:100];
     way["highway"~"primary|secondary|tertiary|trunk|service|residential|
     primary_link|secondary_link|tertiary_link|unclassified|living_street|
     road|motorway_link|trunk_link|motorway"]["access"!~"no|private"]
     (${swBound[0]},${swBound[1]},${neBound[0]},${neBound[1]}); out count;`
  };

  return fetch(overpassEndpoint, reqOptions)
          .then((response) => {
            if (response.status > 400) {
              throw new Error('Failed to load route data!');
            }
            return response.json();
          }).then((data) => {
            const wayCount = data.elements[0].tags.ways;
            // coord is valid if any road is present in bounding box
            if (wayCount > 0) {
              return true;
            }
            return false;
          }).catch(() => false);
};


export const getRangeAnxietyPolygonWithCoordinate = (coord, range) => {
  const nCoord = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');
  const apiEndpoint = `${rangeAnxietyServer}/greennav/polygon?startlat=${nCoord[1]}&startlng=${nCoord[0]}&range=${range}`;

  return fetch(apiEndpoint)
          .then((response) => {
            if (response.status > 400) {
              throw new Error('Failed to load polygon data!');
            }
            return response.json();
          }).then((data) => {
            const vertices = data.features[0].geometry.coordinates[0];
            const pointsArray = [];
            // convert vertices to turf.js points
            vertices.forEach(vertex => pointsArray.push(point(vertex)));
            // apply convex hull computation
            const hull = convex(featureCollection(pointsArray));
            return hull.geometry.coordinates[0];
          }).catch(() => false);
};
