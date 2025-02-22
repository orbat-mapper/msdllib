import { getTagValue } from "./utils.js";
import type { Feature, Point } from "geojson";

import { type TacticalJson, UnitEquipmentBase } from "./common.js";

export class EquipmentItem extends UnitEquipmentBase {
  constructor(override readonly element: Element) {
    super(element);
    // Todo: OrganicSuperiorHandle not necessarily set.
    this.superiorHandle = getTagValue(element, "OrganicSuperiorHandle");
  }

  toGeoJson(): Feature<Point | null, TacticalJson> {
    let feature: Feature<Point | null, TacticalJson>;
    let properties: TacticalJson = {};

    if (this.speed !== undefined) {
      properties.speed = this.speed;
    }
    if (this.directionOfMovement !== undefined) {
      properties.direction = this.directionOfMovement;
    }

    feature = {
      id: this.objectHandle,
      type: "Feature",
      geometry: this.location
        ? {
            type: "Point",
            coordinates: this.location,
          }
        : null,
      properties,
    };
    return feature;
  }
}
