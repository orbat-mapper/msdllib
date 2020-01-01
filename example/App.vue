<template>
  <div id="app">
    <LeafletMap style="width:100%;height:100vh" @map-initialized="onMapInitialized"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import LeafletMap from "./components/LeafletMap.vue";
import { MilitaryScenario } from "msdllib";
import * as L from "leaflet";
import * as ms from 'milsymbol';
import { Icon } from "leaflet";

function createMilsymbolIcon(feature, size = 25): Icon {
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

function onEachFeature(feature, layer) {
  if (feature.properties) {
    let properties = feature.properties;
    layer.bindPopup(`<b>SIDC</b> ${properties.sidc}`);
  }
}

export default Vue.extend({
  name: 'app',
  components: {
    LeafletMap,
  },
  data() {
    return {
      mapRef: null
    }
  },

  methods: {
    async loadScenario(): Promise<MilitaryScenario> {
      const response = await fetch("SimpleScenario.xml");
      const text = await response.text();
      return MilitaryScenario.createFromString(text);
    },

    async onMapInitialized({ map }) {
      let scenario = await this.loadScenario();
      let g = L.featureGroup();

      for (let forceSide of scenario.forceSides) {
        let mlayer = L.geoJSON(forceSide.toGeoJson(), {
          pointToLayer: createUnitMarker,
          onEachFeature
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

body {
  margin: 0;
  padding: 0;
}
</style>
