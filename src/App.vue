<template>
  <div id="app">
    <div class="header">
      <h1>GeoJSON Shape Generator</h1>
      <div class="button-group">
        <button @click="useFirstShape" :class="{ active: currentShape === 'first' }">First Shape</button>
        <button @click="useSquareShape" :class="{ active: currentShape === 'square' }">Square Shape</button>
      </div>
      <button class="copy-button" @click="copyGeoJsonOutput">Copy GeoJSON</button>
    </div>
    <div class="geojson-output">
      <GeoJSONGenerator ref="geoJsonGenerator" :calls="currentCalls" />
    </div>
  </div>
</template>

<script>
import GeoJSONGenerator from "@/components/GeoJSONGenerator.vue";

export default {
  name: "App",
  components: {
    GeoJSONGenerator,
  },
  data() {
    return {
      firstShapeCalls: [
        { direction: "N", degrees: 90, minutes: 0, seconds: 0, cardinal: "W", distance: 889.46, unit: "feet" },
        { direction: "S", degrees: 0, minutes: 0, seconds: 0, cardinal: "W", distance: 301.14, unit: "feet" },
        { direction: "N", degrees: 73, minutes: 54, seconds: 7, cardinal: "E", distance: 81.99, unit: "feet" },
        { direction: "N", degrees: 76, minutes: 0, seconds: 43, cardinal: "E", distance: 309.74, unit: "feet" },
        { direction: "N", degrees: 75, minutes: 39, seconds: 31, cardinal: "E", distance: 151.29, unit: "feet" },
        { direction: "N", degrees: 65, minutes: 27, seconds: 2, cardinal: "E", distance: 399.69, unit: "feet" },
      ],
      squareShapeCalls: [
        { direction: "N", degrees: 0, minutes: 0, seconds: 0, cardinal: "E", distance: 150, unit: "kilometers" },
        { direction: "N", degrees: 90, minutes: 0, seconds: 0, cardinal: "W", distance: 150, unit: "kilometers" },
        { direction: "S", degrees: 0, minutes: 0, seconds: 0, cardinal: "W", distance: 150, unit: "kilometers" },
        { direction: "S", degrees: 90, minutes: 0, seconds: 0, cardinal: "E", distance: 150, unit: "kilometers" },
      ],
      currentCalls: [],
      currentShape: 'first',
    };
  },
  mounted() {
    this.useFirstShape();
  },
  methods: {
    useFirstShape() {
      this.currentCalls = this.firstShapeCalls;
      this.currentShape = 'first';
    },
    useSquareShape() {
      this.currentCalls = this.squareShapeCalls;
      this.currentShape = 'square';
    },
    copyGeoJsonOutput() {
      const geoJsonOutput = this.$refs.geoJsonGenerator.geoJsonOutput;
      navigator.clipboard.writeText(JSON.stringify(geoJsonOutput, null, 2))
        .then(() => {
          alert("GeoJSON copied to clipboard!");
        })
        .catch(err => {
          console.error("Failed to copy text: ", err);
        });
    }
  }
};
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: linear-gradient(to right, #6a11cb, #2575fc);
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.header {
  margin-bottom: 20px;
}

h1 {
  color: #fff;
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  justify-content: center;
}

button {
  background-color: #fff;
  border: none;
  border-radius: 25px;
  padding: 15px 30px;
  margin: 0 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

button:hover {
  background-color: #e0e0e0;
  transform: translateY(-2px);
}

button.active {
  background-color: #2575fc;
  color: #fff;
}

button:focus {
  outline: none;
}

.copy-button {
  margin-top: 20px;
  background-color: #ff5722;
  color: #fff;
}

.geojson-output {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 800px;
  width: 100%;
  font-family: 'Courier New', Courier, monospace;
  color: #333;
}

@media (max-width: 600px) {
  button {
    padding: 10px 20px;
    margin: 0 5px;
    font-size: 14px;
  }
  .geojson-output {
    padding: 15px;
    font-size: 14px;
  }
}
</style>
