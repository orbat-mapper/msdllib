import {
  getNumberValue,
  getTagElement,
  getTagValue,
  getValueOrUndefined,
} from "./domutils.js";
import type { Feature, Point } from "geojson";

import {
  type IdGeoJsonOptions,
  type TacticalJson,
  UnitEquipmentBase,
} from "./common.js";
import { ForceOwnerType } from "./enums.js";
import { EquipmentModel, type EquipmentModelType } from "./modelType.js";
import { EquipmentItemDisposition } from "./geo.js";

export type EquipmentItemGeoJsonOptions = IdGeoJsonOptions;

export class EquipmentItem extends UnitEquipmentBase {
  symbolModifiers?: EquipmentSymbolModifiers;
  relations: EquipmentRelationsType;
  #model?: EquipmentModel;
  #disposition?: EquipmentItemDisposition;

  constructor(element: Element) {
    super(element);
    const equipmentSymbolModifiersElement = getTagElement(
      element,
      "EquipmentSymbolModifiers",
    );
    if (equipmentSymbolModifiersElement) {
      this.symbolModifiers = new EquipmentSymbolModifiers(
        equipmentSymbolModifiersElement,
      );
    }

    const modelElement = getTagElement(this.element, "Model");
    if (modelElement) {
      this.#model = new EquipmentModel(modelElement);
    }

    const dispositionElement = getTagElement(this.element, "Disposition");
    if (dispositionElement) {
      this.#disposition = new EquipmentItemDisposition(dispositionElement);
      this.location = this.#disposition.location;
      this.speed = this.#disposition.speed;
      this.directionOfMovement = this.#disposition.directionOfMovement;
    }
    this.relations = this.initializeRelations();
  }

  private initializeRelations(): EquipmentRelationsType {
    let organicSuperiorHandle = getTagValue(
      this.element,
      "OrganicSuperiorHandle",
    );
    let ownerType = getTagValue(this.element, "OwnerChoice");
    let ownerHandle = "";
    if (ownerType === "UNIT") {
      ownerHandle = getTagValue(this.element, "UnitOwnerHandle");
    } else {
      ownerHandle = getTagValue(this.element, "ForceOwnerHandle");
    }
    return {
      organicSuperiorHandle,
      ownerChoice: ownerType as ForceOwnerType,
      ownerHandle,
    };
  }

  get disposition(): EquipmentItemDisposition | undefined {
    return this.#disposition;
  }

  get model(): EquipmentModel | undefined {
    return this.#model;
  }

  set model(model: EquipmentModel | EquipmentModelType | undefined | null) {
    if (!model) {
      this.#model = undefined;
      const modelElement = getTagElement(this.element, "Model");
      if (modelElement) {
        this.element.removeChild(modelElement);
      }
      return;
    }

    let test =
      model instanceof EquipmentModel ? model : EquipmentModel.fromModel(model);
    if (this.#model) {
      this.#model.element.replaceWith(test.element);
    } else {
      this.element.appendChild(test.element);
    }

    this.#model = test;
  }

  get label(): string {
    return (
      this.name || this.symbolModifiers?.uniqueDesignation || this.objectHandle
    );
  }

  get superiorHandle(): string {
    if (this.relations.organicSuperiorHandle) {
      return this.relations.organicSuperiorHandle;
    }
    return this.relations.ownerHandle;
  }

  toGeoJson(
    options: EquipmentItemGeoJsonOptions = {},
  ): Feature<Point | null, TacticalJson> {
    const { includeId = true, includeIdInProperties = false } = options;
    let feature: Feature<Point | null, TacticalJson>;
    let properties: TacticalJson = {};

    if (this.speed !== undefined) {
      properties.speed = this.speed;
    }
    if (this.directionOfMovement !== undefined) {
      properties.direction = this.directionOfMovement;
    }
    properties.sidc = this.sidc;
    properties.label = this.label;
    if (includeIdInProperties) {
      properties.id = this.objectHandle;
    }

    feature = {
      ...(includeId ? { id: this.objectHandle } : {}),
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

export type EquipmentRelationsType = {
  organicSuperiorHandle?: string;
  ownerChoice: ForceOwnerType;
  ownerHandle: string;
};

export type EquipmentSymbolModifiersType = {
  quantity?: number;
  staffComments?: string;
  additionalInfo?: string;
  combatEffectiveness?: string;
  iff?: string;
  uniqueDesignation: string;
  equipmentType?: string;
  towedSonarArray?: boolean;
};

export class EquipmentSymbolModifiers implements EquipmentSymbolModifiersType {
  quantity?: number;
  staffComments?: string;
  additionalInfo?: string;
  combatEffectiveness?: string;
  iff?: string;
  uniqueDesignation: string;
  equipmentType?: string;
  towedSonarArray?: boolean;

  constructor(element: Element) {
    this.quantity = getNumberValue(element, "Quantity");
    this.staffComments = getValueOrUndefined(element, "StaffComments");
    this.additionalInfo = getValueOrUndefined(element, "AdditionalInfo");
    this.combatEffectiveness = getValueOrUndefined(
      element,
      "CombatEffectiveness",
    );
    this.iff = getValueOrUndefined(element, "IFF");
    this.uniqueDesignation =
      getValueOrUndefined(element, "UniqueDesignation") ?? "";
    this.equipmentType = getValueOrUndefined(element, "EquipmentType");
    const towedSonarArray = getValueOrUndefined(element, "TowedSonarArray");
    this.towedSonarArray =
      towedSonarArray !== undefined ? towedSonarArray === "true" : undefined;
  }
}
