<template>
  <div class="my-leaflet-map"></div>
</template>

<script>
import * as L from "leaflet";

export default {
  name: "leaflet-map",

  props: {
    zoom: { type: Number, default: 4 },
    center: { type: Array, default: () => [10, 10] },
    zoomControl: { default: true }
  },

  mounted() {
    let map = L.map(this.$el, { zoomControl: this.zoomControl });
    this.map = map;
    map.setView(this.center, this.zoom);

    let osm = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });

    // let satellite = L.tileLayer.provider('Esri.WorldImagery');
    osm.addTo(map);

    // let baseLayers = { "OpenStreetMap": osm, "Esri.WorldImagery": satellite };
    let baseLayers = { OpenStreetMap: osm };
    // const layerControl = L.control.layers(baseLayers).addTo(map);
    L.control.scale({ imperial: false }).addTo(map);
    // L.control.mousePosition({ prefix: "Lat Lon" }).addTo(map);

    this.$emit("map-initialized", Object.freeze({ map }));
  },

  beforeDestroyed() {
    if (this.map) {
      this.map.remove();
    }
  },

  methods: {
    resize() {
      this.map.invalidateSize();
    }
  },

  watch: {
    center: function(newCenter, oldCenter) {
      if (newCenter) this.map.panTo(newCenter);
    },
    zoom() {
      this.map.setZoom(this.zoom);
    }
  }
};
</script>

<style>
.my-leaflet-map {
  z-index: 0;
  width: 100%;
  height: 100%;
}
</style>
