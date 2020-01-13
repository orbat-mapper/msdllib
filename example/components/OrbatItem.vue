<template>
  <li>
    <span @dblclick="toggle" @click="select" class="unit-name"
          :class="{current: isCurrent, hasPosition}">
      <span v-if="isParent" @click="toggle"><b-icon size="is-small" :icon="isOpen? 'minus-box-outline' : 'plus-box-outline'"/></span>
      &nbsp;
      <span draggable="true" @dragstart="dragStart" @dragend="dragEnd"><MilSymbol
        :sidc="sidc"/></span>
      {{unit.name}}
    </span>
    <ul v-show="isOpen">
      <orbat-item :unit="subUnit" v-for="subUnit in unit.subordinates" :key="subUnit.objectHandle"/>
    </ul>
  </li>
</template>

<script>
import MilSymbol from "./MilSymbol";

export default {
  components: { MilSymbol },
  name: "OrbatItem",
  props: {
    unit: {
      type: Object,
      required: true,
    }
  },
  data: function () {
    return {
      isOpen: false,
    }
  },
  computed: {
    isParent() {
      return this.unit.subordinates && this.unit.subordinates.length;
    },
    isCurrent() {
      // return (this.unit == this.$store.state.currentUnit);
    },
    hasPosition() {
      if (this.unit.location) {
        return true;
      }
      return false;
    },
    sidc() {
      const us = this.unit._state || {};
      return us.sidc || this.unit.sidc;
    }
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    },
    select() {
    },

    dragStart(ev) {
    },

    dragEnd(ev) {
    },

    expandAll() {
      this.isOpen = true;
      for (let orbatItem of this.$children.filter(el => el.expandAll)) {
        orbatItem.isOpen = true;
        orbatItem.expandAll();
      }
    },

    collapseAll() {
      this.isOpen = false;
      for (let orbatItem of this.$children.filter(el => el.collapseAll)) {
        orbatItem.isOpen = false;
        orbatItem.collapseAll();
      }
    }
  }
}
</script>

<style scoped>
ul {
  padding-left: 2em;
}
</style>

<style>
.unit-name {
  /*vertical-align: text-top;*/
}

.current {
  font-weight: bold;
}

.hasPosition::after {
  content: "\00d7";
}
</style>
