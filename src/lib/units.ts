import { getTagElement, getTagValue, getValueOrUndefined } from "./domutils.js";
import type { Feature, Point } from "geojson";
import {
  type EnumCombatEffectivenessType,
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

type UnitGeoJsonOptions = IdGeoJsonOptions;

export class Unit extends UnitEquipmentBase implements UnitEquipmentInterface {
  symbolModifiers?: UnitSymbolModifiers;
  equipment: EquipmentItem[] = [];
  subordinates: Unit[] = [];
  superiorHandle = "";
  private forceRelationChoice: ForceOwnerType | undefined;

  constructor(element: Element) {
    super(element);
    const unitSymbolModifiersElement = getTagElement(
      this.element,
      "UnitSymbolModifiers",
    );
    if (unitSymbolModifiersElement) {
      this.symbolModifiers = new UnitSymbolModifiers(
        unitSymbolModifiersElement,
      );
    }
    this.initializeRelations();
  }

  get isRoot(): boolean {
    return this.forceRelationChoice === ForceOwnerType.ForceSide;
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

  private initializeRelations() {
    let forceRelationChoice = getTagValue(this.element, "ForceRelationChoice");

    if (forceRelationChoice === ForceOwnerType.Unit) {
      this.forceRelationChoice = ForceOwnerType.Unit;
      this.superiorHandle = getTagValue(
        this.element,
        "CommandingSuperiorHandle",
      );
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
