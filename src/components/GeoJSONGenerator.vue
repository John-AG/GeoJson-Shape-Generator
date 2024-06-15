<template>
  <div>
    <pre>{{ geoJsonOutput }}</pre>
  </div>
</template>

<script>
export default {
  name: "GeoJSONGenerator",

  props: {
    calls: {
      type: Array,
      required: true
    }
  },

  computed: {
    geoJsonOutput() {
      const startLat = 32.71180328837194;
      const startLng = -94.121577724154;

      // Function to convert distance to kilometers based on the unit provided
      const convertDistance = (distance, unit) => {
        const conversionRates = {
          feet: 0.0003048,
          meters: 0.001,
          kilometers: 1
        };
        return distance * conversionRates[unit];
      };

      // Function to convert degrees, minutes, and seconds to decimal degrees
      const convertToDecimalDegrees = (degrees, minutes, seconds, cardinal) => {
        let decimal = degrees + minutes / 60 + seconds / 3600;
        if (cardinal === 'S' || cardinal === 'W') {
          decimal = -decimal;
        }
        return decimal;
      };

      // Function to calculate new coordinates given a starting point, bearing, and distance
      const computeNewCoordinates = (startLat, startLng, bearing, distance) => {
        const R = 6371; // Radius of the Earth in kilometers
        const lat1 = startLat * (Math.PI / 180);
        const lon1 = startLng * (Math.PI / 180);
        const bearingRad = bearing * (Math.PI / 180);

        const lat2 = Math.asin(
          Math.sin(lat1) * Math.cos(distance / R) +
          Math.cos(lat1) * Math.sin(distance / R) * Math.cos(bearingRad)
        );

        const lon2 = lon1 + Math.atan2(
          Math.sin(bearingRad) * Math.sin(distance / R) * Math.cos(lat1),
          Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2)
        );

        return [lon2 * (180 / Math.PI), lat2 * (180 / Math.PI)];
      };

      // Function to generate square coordinates
      const generateSquareCoordinates = (startLat, startLng, sideLength) => {
        const bearings = [0, 90, 180, 270];
        const squareCoordinates = [[startLng, startLat]];

        let currentLat = startLat;
        let currentLng = startLng;

        bearings.forEach(bearing => {
          const newCoords = computeNewCoordinates(currentLat, currentLng, bearing, sideLength);
          squareCoordinates.push(newCoords);
          currentLng = newCoords[0];
          currentLat = newCoords[1];
        });

        squareCoordinates.push([startLng, startLat]);
        return squareCoordinates;
      };

      // Determine the number of calls
      const numberOfCalls = this.calls.length;

      // Generate the square coordinates if there are 4 calls
      if (numberOfCalls === 4) {
        const sideLength = 150; // 150,000 km wasn't displaying well on https://geojson.io/
        const squareCoordinates = generateSquareCoordinates(startLat, startLng, sideLength);
        return {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [squareCoordinates]
          },
          properties: {}
        };
      }

      // Initialize the coordinates array with the starting point
      const coordinates = [[startLng, startLat]];

      // Variables to keep track of the current position
      let currentLat = startLat;
      let currentLng = startLng;

      // Process each call to compute the new coordinates
      this.calls.forEach(call => {
        const distance = convertDistance(call.distance, call.unit);
        const bearing = convertToDecimalDegrees(call.degrees, call.minutes, call.seconds, call.cardinal);

        // Compute the new coordinates
        const newCoords = computeNewCoordinates(currentLat, currentLng, bearing, distance);

        // Add the new coordinates to the array
        coordinates.push(newCoords);
        currentLng = newCoords[0];
        currentLat = newCoords[1];
      });

      // Add the starting point at the end to close the polygon
      coordinates.push([startLng, startLat]);

      // Return the GeoJSON object for the first shape
      return {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [coordinates]
        },
        properties: {}
      };
    }
  }
};
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
