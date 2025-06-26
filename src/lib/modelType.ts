import type { ModelResolutionType } from "./enums.js";
import {
  createEmptyXMLElementFromTagName,
  getBooleanValue,
  getValueOrUndefined,
  setOrCreateBooleanValue,
  setOrCreateTagValue,
} from "./domutils.js";

export type UnitEquipmentModelBaseType = {
  resolution?: ModelResolutionType;
  entityType?: string;
};

export interface UnitModelType extends UnitEquipmentModelBaseType {
  aggregateBased?: boolean;
}

export interface EquipmentModelType extends UnitEquipmentModelBaseType {}

export class UnitEquipmentModelBase implements UnitEquipmentModelBaseType {
  static readonly TAG_NAME = "Model";
  #resolution?: ModelResolutionType;
  #entityType?: string;
  element: Element;

  constructor(element: Element) {
    this.element = element;
    this.#resolution = getValueOrUndefined(
      element,
      "Resolution",
    ) as ModelResolutionType;
    this.#entityType = getValueOrUndefined(element, "EntityType") || undefined;
  }

  get resolution(): ModelResolutionType | undefined {
    return (
      this.#resolution ??
      (getValueOrUndefined(this.element, "Resolution") as ModelResolutionType)
    );
  }

  set resolution(resolution: ModelResolutionType | undefined) {
    this.#resolution = resolution;
    setOrCreateTagValue(this.element, "Resolution", resolution);
  }

  get entityType(): string | undefined {
    return this.#entityType ?? getValueOrUndefined(this.element, "EntityType");
  }

  set entityType(entityType: string | undefined) {
    this.#entityType = entityType;
    setOrCreateTagValue(this.element, "EntityType", entityType);
  }
}

export class UnitModel extends UnitEquipmentModelBase {
  #aggregateBased?: boolean;
  constructor(element: Element) {
    super(element);
    this.#aggregateBased = getBooleanValue(element, "AggregateBased");
  }
  get aggregateBased(): boolean | undefined {
    return (
      this.#aggregateBased ?? getBooleanValue(this.element, "AggregateBased")
    );
  }

  set aggregateBased(aggregateBased: boolean | undefined) {
    this.#aggregateBased = aggregateBased;
    setOrCreateBooleanValue(this.element, "AggregateBased", aggregateBased);
  }

  static fromModel(model: UnitModelType): UnitModel {
    const modelType = new UnitModel(
      createEmptyXMLElementFromTagName(UnitEquipmentModelBase.TAG_NAME),
    );
    modelType.resolution = model.resolution;
    modelType.entityType = model.entityType;
    modelType.aggregateBased = model.aggregateBased;
    return modelType;
  }
}

export class EquipmentModel extends UnitEquipmentModelBase {
  constructor(element: Element) {
    super(element);
  }

  static fromModel(model: UnitEquipmentModelBaseType): EquipmentModel {
    const modelType = new EquipmentModel(
      createEmptyXMLElementFromTagName(UnitEquipmentModelBase.TAG_NAME),
    );
    modelType.resolution = model.resolution;
    modelType.entityType = model.entityType;
    return modelType;
  }
}
