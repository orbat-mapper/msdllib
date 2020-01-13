<template>
  <ul>
    <orbat-item v-for="rootUnit in units" :unit="rootUnit" :key="rootUnit.objectHandle"/>
  </ul>
</template>

<script>
import OrbatItem from "./OrbatItem.vue";

export default {
  components: { OrbatItem },
  name: "OrbatTree",
  props: {
    units: { type: Array, required: true }
  },
  methods: {
    expandAll() {
      for (let orbatItem of this.$children) {
        if (orbatItem.expandAll) orbatItem.expandAll();
      }
    },
    collapseAll() {
      for (let orbatItem of this.$children) {
        if (orbatItem.collapseAll) orbatItem.collapseAll();
      }
    }
  }
}
</script>

<style>
.milsymbol {
  vertical-align: top;
}
</style>
