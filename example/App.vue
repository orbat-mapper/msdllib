<template>
  <div id="app">
    <LeafletMap @map-initialized="onMapInitialized"/>
    <UnitPanel :id="currentUnitId"/>
    <OrbatPanel v-if="isLoaded" class="orbat-panel"/>
  </div>
</template>

<script>
import Vue from 'vue';
import LeafletMap from "./components/LeafletMap.vue";
import { MilitaryScenario } from "msdllib";
import * as L from "leaflet";
import * as ms from 'milsymbol';
import { Icon } from "leaflet";
import UnitPanel from "./components/UnitPanel.vue";
import { parseScenario, scenario } from "./scenario";
import OrbatPanel from "./components/OrbatPanel.vue";

function createMilsymbolIcon(feature, size = 25) {
  // https://www.spatialillusions.com/milsymbol/docs/index.html
  let mysymbol = new ms.Symbol(
    feature.properties.sidc, {});
  mysymbol = mysymbol.setOptions({ size });

  return L.icon({
    iconUrl: mysymbol.toDataURL(),
    iconAnchor: [mysymbol.getAnchor().x, mysymbol.getAnchor().y],
  });
}

function createUnitMarker(feature, latlng) {
  let myicon = createMilsymbolIcon(feature);
  return L.marker(latlng, { icon: myicon, draggable: false });
}

export default Vue.extend({
  name: 'app',
  components: {
    OrbatPanel,
    UnitPanel,
    LeafletMap,
  },
  data() {
    return {
      mapRef: null,
      currentUnitId: null,
      isLoaded: false
    }
  },

  methods: {
    async loadScenario() {
      // const response = await fetch("SimpleScenario.xml");
      // const response = await fetch("MSDL.xml");
      // const text = await fetch("SampleMSDL.xml").then(res => res.text());
      const text = await fetch("SimpleScenario.xml").then(res => res.text());
      parseScenario(text);
      this.isLoaded = true;
      return scenario;
    },

    async onMapInitialized({ map }) {
      let scenario = await this.loadScenario();
      let g = L.featureGroup();

      for (let forceSide of scenario.forceSides) {
        let mlayer = L.geoJSON(forceSide.toGeoJson(), {
          pointToLayer: createUnitMarker,
          onEachFeature: (feature, layer) => {
            if (feature.properties) {
              layer.on("click", (e) => {
                this.currentUnitId = feature.id;
              });
            }
          }
        });
        map.addLayer(mlayer);
        g.addLayer(mlayer);
      }
      map.fitBounds(g.getBounds());
    }
  }
});
</script>

<style>
#app {
  width: 100%;
  height: 100vh;

}

body {
  margin: 0;
  padding: 0;
}

.orbat-panel {
  position: absolute;
  top: 5.5rem;
  left: 0.5rem;
}

</style>
