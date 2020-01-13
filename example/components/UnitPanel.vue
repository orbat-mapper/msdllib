<template>
  <div v-if="unit" class="unit-panel">
    <b-collapse class="card">
      <header class="card-header" slot="trigger" slot-scope="props">
        <p class="card-header-title">Unit info: {{unit.name}}</p>
        <a class="card-header-icon">
          <b-icon
            :icon="props.open ? 'menu-down' : 'menu-up'">
          </b-icon>
        </a>
      </header>
      <div class="card-content">
        <b-tabs size="is-small">
          <b-tab-item label="JSON">
            <pre>{{unit}}</pre>
          </b-tab-item>
          <b-tab-item label="XML">
            <pre>{{xmlStr}}</pre>
          </b-tab-item>
        </b-tabs>

      </div>
    </b-collapse>
  </div>
</template>
<script>
import { scenario } from "../scenario";

function formatXml(xml) {
  // adapted from https://gist.github.com/sente/1083506
  xml = xml.replace(/(\r\n|\n|\r)/gm, " ").replace(/>\s+</g, '><');
  const PADDING = ' '.repeat(2); // set desired indent size here
  const reg = /(>)(<)(\/*)/g;
  let pad = 0;

  xml = xml.replace(reg, '$1\n$2$3');

  return xml.split('\n').map((node, index) => {
    let indent = 0;
    if (node.match(/.+<\/\w[^>]*>$/)) {
      indent = 0;
    } else if (node.match(/^<\/\w/) && pad > 0) {
      pad -= 1;
    } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
      indent = 1;
    } else {
      indent = 0;
    }

    pad += indent;

    return PADDING.repeat(pad - indent) + node;
  }).join('\r\n');
}

export default {
  name: 'UnitPanel',
  props: {
    id: { type: String }
  },

  computed: {
    unit() {
      return this.id ? scenario.getUnitByObjectHandle(this.id) : null
    },

    xmlStr() {
      let s = new XMLSerializer();
      return formatXml(s.serializeToString(this.unit.element));
    }
  }
}
</script>

<style scoped>

.unit-panel {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.card-content {
  overflow: auto;
  max-height: 90vh;
  max-width: 50vw;
}
</style>
