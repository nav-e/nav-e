import GeographicLib from 'geographiclib'; // For geodesic calculations

const calculateRangePolygon = (range, lat, long) => {
  const geod = GeographicLib.Geodesic.WGS84;

  const vertices = [];
  let angle = 0; // in degrees

  for (let i = 0; i < 14; i += 1) {
    const r = geod.Direct(lat, long, angle, range * 1000);
    angle += 25;
    const coords = [r.lon2, r.lat2]; // in long lat
    vertices.push(coords);
  }

  return vertices;
};

export default calculateRangePolygon;
