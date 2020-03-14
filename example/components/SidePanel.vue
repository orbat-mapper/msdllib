<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">{{ side.name }}</p>
    </header>
    <div class="card-content">
      <!--      <ul>-->
      <!--        <li v-for="unit in side.rootUnits"><MilSymbol class="inline-symbol" :sidc="unit.sidc"/>{{unit.name || unit.sidc}}</li>-->
      <!--      </ul>-->
      <OrbatTree :units="side.rootUnits" />
    </div>
  </div>
</template>

<script lang="ts">
import { ForceSide } from "msdllib";
import MilSymbol from "./MilSymbol";
import OrbatTree from "./OrbatTree.vue";

export default {
  name: "SidePanel",
  components: { OrbatTree, MilSymbol },
  props: {
    side: { type: ForceSide }
  }
};
</script>

<style>
.inline-symbol {
  vertical-align: text-top;
  margin-right: 0.5rem;
}
</style>
