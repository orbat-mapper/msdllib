import {
  createEmptyXMLElementFromTagName,
  createXMLElement,
  getTagElement,
  getTagValue,
  setOrCreateTagValue,
} from "./domutils.js";
import type { Feature, Point } from "geojson";

import {
  type IdGeoJsonOptions,
  type TacticalJson,
  UnitEquipmentBase,
  type UnitEquipmentInterface,
} from "./common.js";
import { ForceOwnerType } from "./enums.js";
import { EquipmentModel, type EquipmentModelType } from "./modelType.js";
import type { LngLatElevationTuple, LngLatTuple } from "./types.js";
import { v4 as uuidv4 } from "uuid";
import { ForceSide } from "./forcesides.js";
import { Unit } from "./units.js";
import {
  type DispositionType,
  EquipmentItemDisposition,
} from "./disposition.js";
import { EquipmentSymbolModifiers } from "./symbolmodifiers.js";

export type EquipmentItemGeoJsonOptions = IdGeoJsonOptions;

export class EquipmentItem extends UnitEquipmentBase {
  static readonly TAG_NAME = "EquipmentItem";
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

    const dispositionElement = getTagElement(
      this.element,
      EquipmentItemDisposition.TAG_NAME,
    );
    if (dispositionElement) {
      this.#disposition = new EquipmentItemDisposition(dispositionElement);
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

  setHoldingOrganization(superior: Unit | ForceSide): void {
    if (!getTagElement(this.element, "Relations")) {
      this.element.appendChild(createEmptyXMLElementFromTagName("Relations"));
    }
    let forceRelationElement = getTagElement(this.element, "Relations")!;
    let holdingElement = getTagElement(
      forceRelationElement,
      "HoldingOrganization",
    );
    if (superior instanceof Unit) {
      let unitRelation = createUnitRelation(superior.objectHandle);
      holdingElement
        ? holdingElement.replaceWith(unitRelation)
        : forceRelationElement.appendChild(unitRelation);
      // TODO: organic superior
      this.relations = {
        ownerChoice: "UNIT",
        ownerHandle: superior.objectHandle,
      };
    } else if (superior instanceof ForceSide) {
      let forceRelation = createForceRelation(superior.objectHandle);
      holdingElement
        ? holdingElement.replaceWith(forceRelation)
        : forceRelationElement.appendChild(forceRelation);
      // TODO: organic superior
      this.relations = {
        ownerChoice: "FORCE_SIDE",
        ownerHandle: superior.objectHandle,
      };
    }
  }

  get disposition(): EquipmentItemDisposition | undefined {
    return this.#disposition;
  }

  set disposition(
    disposition: EquipmentItemDisposition | DispositionType | undefined,
  ) {
    const dispElm = getTagElement(
      this.element,
      EquipmentItemDisposition.TAG_NAME,
    );
    if (!disposition) {
      this.#disposition = undefined;
      if (dispElm) {
        this.element.removeChild(dispElm);
      }
      return;
    }

    let test =
      disposition instanceof EquipmentItemDisposition
        ? disposition
        : EquipmentItemDisposition.fromModel(disposition);
    this.#disposition = test;
    if (dispElm) {
      this.element.replaceChild(this.#disposition.element, dispElm);
    } else {
      this.element.appendChild(this.#disposition.element);
    }
  }

  get speed(): number | undefined {
    return this.#disposition?.speed;
  }

  get directionOfMovement(): number | undefined {
    return this.#disposition?.directionOfMovement;
  }

  get location(): LngLatTuple | LngLatElevationTuple | undefined {
    return this.#disposition?.location;
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

  static create(): EquipmentItem {
    const equipment: EquipmentItem = new EquipmentItem(
      createEmptyXMLElementFromTagName(EquipmentItem.TAG_NAME),
    );
    const baseProps: Partial<UnitEquipmentInterface> = {
      objectHandle: uuidv4(),
    };
    equipment.updateFromObject(baseProps);
    // TODO: getter and setter for relations
    setOrCreateTagValue(equipment.element, "Relations", null, {
      deleteIfNull: false,
    });
    return equipment;
  }
}

export type EquipmentRelationsType = {
  organicSuperiorHandle?: string;
  ownerChoice: ForceOwnerType;
  ownerHandle: string;
};

function createUnitRelation(superiorHandle: string) {
  return createXMLElement(
    `<HoldingOrganization>
  <OwnerChoice>UNIT</OwnerChoice>
  <OwnerData>
    <UnitOwnerHandle>${superiorHandle}</UnitOwnerHandle>
  </OwnerData>
</HoldingOrganization>`,
  );
}

function createForceRelation(forceSideHandle: string) {
  return createXMLElement(
    `<HoldingOrganization>
  <OwnerChoice>FORCE_SIDE</OwnerChoice>
  <OwnerData>
    <ForceOwnerHandle>${forceSideHandle}</ForceOwnerHandle>
  </OwnerData>
</HoldingOrganization>
`,
  );
}
