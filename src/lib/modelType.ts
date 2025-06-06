import type { ModelResolutionType } from "./enums.js";
import {
  createXMLElement,
  getTagValue,
  getValueOrUndefined,
} from "./domutils.js";

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

  static fromEquipmentModel(model: UnitEquipmentModelType): UnitModelType {
    const modelType = new UnitModelType(createXMLElement(`<Model></Model>`));
    modelType.resolution = model.resolution;
    modelType.entityType = model.entityType;
    return modelType;
  }
}

export class EquipmentModelType extends UnitEquipmentModelTypeBase {
  constructor(element: Element) {
    super(element);
  }
}
