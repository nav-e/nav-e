import ol from 'openlayers';
import GeographicLib from 'geographiclib'; // For geodesic calculations

// const calculateRangePolygonEPSG4326 = (range, lat, long) => {
//   const geod = GeographicLib.Geodesic.WGS84;
//
//   const vertices = [];
//   let angle = 0; // in degrees
//   console.log(lat, long);
//
//   for (let i = 0; i < 14; i += 1) {
//     const r = geod.Direct(lat, long, angle, range * 1000);
//     angle += 25;
//     const coords = [r.lon2, r.lat2]; // in long lat
//     vertices.push(coords);
//   }
//
//   return vertices;
// };

const calculateRangePolygonEPSG3857 = (range, coord) => {
  const nCoord = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326')
  const geod = GeographicLib.Geodesic.WGS84;

  const vertices = [];
  let angle = 0; // in degrees
  for (let i = 0; i < 14; i += 1) {
    const r = geod.Direct(nCoord[1], nCoord[0], angle, range * 1000);
    angle += 25;
    const coords = [r.lon2, r.lat2]; // in long lat
    vertices.push(coords);
  }

  return vertices;
};

// const calculateRangePolygonWithDestination = (range, clat, clong,
//                                               dlat, dlong) => {
//   const geod = GeographicLib.Geodesic.WGS84;
//   const vertices = [];
//   let angle = 0; // in degrees
//   // TODO: to be completed
// }

export default calculateRangePolygonEPSG3857;
