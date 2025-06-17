import {
  createXMLElement,
  getTagElement,
  getTagValue,
  getValueOrUndefined,
} from "./domutils.js";
import type { Feature, Point } from "geojson";
import {
  type EnumCombatEffectivenessType,
  EnumCommandRelationshipType,
  type EnumEchelon,
  type EnumReinforcedReducedType,
  ForceOwnerType,
  StandardIdentity,
} from "./enums.js";
import { EquipmentItem } from "./equipment.js";
import {
  type IdGeoJsonOptions,
  type TacticalJson,
  UnitEquipmentBase,
  type UnitEquipmentInterface,
} from "./common.js";
import { setCharAt } from "./symbology.js";
import { ForceSide } from "./forcesides.js";
import { UnitModel, type UnitModelType } from "./modelType.js";
import { UnitDisposition } from "./geo.js";

type UnitGeoJsonOptions = IdGeoJsonOptions;

export class Unit extends UnitEquipmentBase implements UnitEquipmentInterface {
  symbolModifiers?: UnitSymbolModifiers;
  equipment: EquipmentItem[] = [];
  subordinates: Unit[] = [];
  superiorHandle = "";
  forceRelationChoice: ForceOwnerType | undefined;
  commandRelationshipType: EnumCommandRelationshipType | undefined;
  #model?: UnitModel;
  #disposition?: UnitDisposition;

  constructor(element: Element) {
    super(element);
    const unitSymbolModifiersElement = getTagElement(
      element,
      "UnitSymbolModifiers",
    );
    if (unitSymbolModifiersElement) {
      this.symbolModifiers = new UnitSymbolModifiers(
        unitSymbolModifiersElement,
      );
    }

    const modelElement = getTagElement(this.element, "Model");
    if (modelElement) {
      this.#model = new UnitModel(modelElement);
    }
    const dispositionElement = getTagElement(this.element, "Disposition");
    if (dispositionElement) {
      this.#disposition = new UnitDisposition(dispositionElement);
      this.location = this.#disposition.location;
      this.speed = this.#disposition.speed;
      this.directionOfMovement = this.#disposition.directionOfMovement;
    }
    this.initializeRelations();
  }

  get isRoot(): boolean {
    return this.forceRelationChoice === ForceOwnerType.ForceSide;
  }

  get disposition(): UnitDisposition | undefined {
    return this.#disposition;
  }

  get model(): UnitModel | undefined {
    return this.#model;
  }

  set model(model: UnitModel | UnitModelType | undefined | null) {
    if (!model) {
      this.#model = undefined;
      const modelElement = getTagElement(this.element, "Model");
      if (modelElement) {
        this.element.removeChild(modelElement);
      }
      return;
    }

    let test = model instanceof UnitModel ? model : UnitModel.fromModel(model);
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

  toGeoJson(
    options: UnitGeoJsonOptions = {},
  ): Feature<Point | null, TacticalJson> {
    const { includeId = true, includeIdInProperties = false } = options;
    let feature: Feature<Point | null, TacticalJson>;
    let properties: TacticalJson = {};

    if (this.speed) {
      properties.speed = this.speed;
    }
    if (this.directionOfMovement) {
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

  override setAffiliation(s: StandardIdentity) {
    this.sidc = setCharAt(this.sidc, 1, s);
    for (let equipment of this.equipment) {
      equipment.setAffiliation(s);
    }
  }

  setForceRelation(
    superior: Unit,
    commandRelationshipType?: EnumCommandRelationshipType,
  ): void;
  setForceRelation(superior: ForceSide): void;
  setForceRelation(
    superior: Unit | ForceSide,
    commandRelationshipType?: EnumCommandRelationshipType,
  ) {
    let forceRelationElement = getTagElement(this.element, "ForceRelation");

    if (superior instanceof Unit) {
      let unitRelation = createUnitRelation(
        superior.objectHandle,
        commandRelationshipType ?? EnumCommandRelationshipType.None,
      );
      forceRelationElement
        ? forceRelationElement.replaceWith(unitRelation)
        : this.element.appendChild(unitRelation);

      this.superiorHandle = superior.objectHandle;
      this.forceRelationChoice = ForceOwnerType.Unit;
      this.commandRelationshipType =
        commandRelationshipType ?? EnumCommandRelationshipType.None;
    } else if (superior instanceof ForceSide) {
      this.superiorHandle = superior.objectHandle;
      this.forceRelationChoice = ForceOwnerType.ForceSide;
      this.commandRelationshipType = undefined;
      let forceRelation = createForceRelation(superior.objectHandle);
      forceRelationElement
        ? forceRelationElement.replaceWith(forceRelation)
        : this.element.appendChild(forceRelation);
    }
  }

  private initializeRelations() {
    let forceRelationChoice = getTagValue(this.element, "ForceRelationChoice");

    if (forceRelationChoice === ForceOwnerType.Unit) {
      this.forceRelationChoice = ForceOwnerType.Unit;
      this.superiorHandle = getTagValue(
        this.element,
        "CommandingSuperiorHandle",
      );
      this.commandRelationshipType =
        getTagValue(this.element, "CommandRelationshipType") ||
        EnumCommandRelationshipType.None;
    } else if (forceRelationChoice === ForceOwnerType.ForceSide) {
      this.forceRelationChoice = ForceOwnerType.ForceSide;
      this.superiorHandle = getTagValue(this.element, "ForceSideHandle");
    } else {
      console.error("Invalid ForceRelationChoice " + this.forceRelationChoice);
    }
    // Todo: Add support for support and organic relations
  }
}

export type UnitSymbolModifiersType = {
  echelon?: EnumEchelon | string;
  reinforcedReduced?: EnumReinforcedReducedType | string;
  staffComments?: string;
  additionalInfo?: string;
  combatEffectiveness?: EnumCombatEffectivenessType | string;
  higherFormation?: string;
  iff?: string;
  uniqueDesignation: string;
  specialC2HQ?: string;
};

export class UnitSymbolModifiers implements UnitSymbolModifiersType {
  echelon?: EnumEchelon | string;
  reinforcedReduced?: EnumReinforcedReducedType | string;
  staffComments?: string;
  additionalInfo?: string;
  combatEffectiveness?: EnumCombatEffectivenessType | string;
  higherFormation?: string;
  iff?: string;
  uniqueDesignation: string;
  specialC2HQ?: string;
  element: Element;

  constructor(element: Element) {
    this.element = element;
    this.echelon = getValueOrUndefined(element, "Echelon");
    this.reinforcedReduced = getValueOrUndefined(element, "ReinforcedReduced");
    this.staffComments = getValueOrUndefined(element, "StaffComments");
    this.additionalInfo = getValueOrUndefined(element, "AdditionalInfo");
    this.combatEffectiveness = getValueOrUndefined(
      element,
      "CombatEffectiveness",
    );
    this.higherFormation = getValueOrUndefined(element, "HigherFormation");
    this.iff = getValueOrUndefined(element, "Iff");
    this.uniqueDesignation =
      getValueOrUndefined(element, "UniqueDesignation") ?? "";
    this.specialC2HQ = getTagValue(element, "SpecialC2HQ");
  }
}

function createUnitRelation(
  commandingSuperiorHandle: string,
  commandRelationshipType: EnumCommandRelationshipType,
) {
  return createXMLElement(
    `<ForceRelation>
    <ForceRelationChoice>UNIT</ForceRelationChoice>
    <ForceRelationData>
        <CommandRelation>
            <CommandingSuperiorHandle>${commandingSuperiorHandle}</CommandingSuperiorHandle>
            <CommandRelationshipType>${commandRelationshipType}</CommandRelationshipType>
        </CommandRelation>
    </ForceRelationData>
</ForceRelation>`,
  );
}

function createForceRelation(forceSideHandle: string) {
  return createXMLElement(
    `<ForceRelation>
    <ForceRelationChoice>FORCE_SIDE</ForceRelationChoice>
    <ForceRelationData>
        <ForceSideHandle>${forceSideHandle}</ForceSideHandle>
    </ForceRelationData>
</ForceRelation>`,
  );
}
