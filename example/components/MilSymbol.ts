import ms from "milsymbol";
import Vue from "vue";

export default Vue.extend({
  name: "MilSymbol",
  props: {
    sidc: { type: String, required: true },
    size: {
      type: Number,
      default: 15
    },
    modifiers: {
      type: Object
    }
  },
  render(h) {
    let symb = new ms.Symbol(
      this.sidc,
      {
        size: this.size,
        simpleStatusModifier: true
      },
      this.modifiers || {}
    );
    return h("span", {
      attrs: { class: "milsymbol" },
      domProps: { innerHTML: symb.asSVG() }
    });
  }
});
// This is how you can change the frame fill color:
// var cm = ms.getColorMode("Light");
// cm.Friend = cm.Neutral;
// var symb = new ms.Symbol(sidc, {colorMode:cm});
// symb.setOptions({fillColor: "rgb(255,0,0)"})
