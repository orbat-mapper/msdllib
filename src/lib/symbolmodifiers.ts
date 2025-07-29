import type {
  EnumCombatEffectivenessType,
  EnumEchelon,
  EnumReinforcedReducedType,
} from "./enums.js";
import {
  getNumberValue,
  getTagValue,
  getValueOrUndefined,
} from "./domutils.js";

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
