import type { ModelResolutionType } from "./enums.js";
import { getTagValue, getValueOrUndefined } from "./domutils.js";

export type UnitEquipmentModelType = {
  resolution?: ModelResolutionType;
  entityType?: string;
};

export class UnitEquipmentModelTypeBase implements UnitEquipmentModelType {
  resolution?: ModelResolutionType;
  entityType?: string;
  element: Element;

  constructor(element: Element) {
    this.element = element;
    this.resolution = getValueOrUndefined(
      element,
      "Resolution",
    ) as ModelResolutionType;
    this.entityType = getValueOrUndefined(element, "EntityType") || undefined;
  }
}

export class UnitModelType extends UnitEquipmentModelTypeBase {
  constructor(element: Element) {
    super(element);
  }
}

export class EquipmentModelType extends UnitEquipmentModelTypeBase {
  constructor(element: Element) {
    super(element);
  }
}
