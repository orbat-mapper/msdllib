<template>
  <div>
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">Units</p>
      </header>
      <div class="card-content">
        <SidePanel v-for="side in sides" :key="side.objectHandle" :side="side" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { scenario } from "../scenario";
import SidePanel from "./SidePanel.vue";

export default {
  name: "OrbatPanel",
  components: { SidePanel },
  props: {
    id: { type: String }
  },

  computed: {
    sides() {
      if (scenario) {
        return scenario.sides;
      }
    }
  }
};
</script>

<style scoped>
.card-content {
  overflow: auto;
  max-height: 90vh;
  max-width: 50vw;
}
</style>
