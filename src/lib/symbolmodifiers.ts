import type {
  EnumCombatEffectivenessType,
  EnumEchelon,
  EnumReinforcedReducedType,
} from "./enums.js";
import {
  createEmptyXMLElementFromTagName,
  getBooleanValue,
  getNumberValue,
  getTagValue,
  getValueOrUndefined,
  removeUndefinedValues,
  setOrCreateBooleanValue,
  setOrCreateTagValue,
} from "./domutils.js";
import type { AssociationType } from "./forcesides.js";

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
  static readonly TAG_NAME = "UnitSymbolModifiers";
  element: Element;
  #echelon?: EnumEchelon | string;
  #reinforcedReduced?: EnumReinforcedReducedType | string;
  #staffComments?: string;
  #additionalInfo?: string;
  #combatEffectiveness?: EnumCombatEffectivenessType | string;
  #higherFormation?: string;
  #iff?: string;
  #uniqueDesignation: string;
  #specialC2HQ?: string;

  constructor(element: Element) {
    this.element = element;
    this.#echelon = getValueOrUndefined(element, "Echelon");
    this.#reinforcedReduced = getValueOrUndefined(element, "ReinforcedReduced");
    this.#staffComments = getValueOrUndefined(element, "StaffComments");
    this.#additionalInfo = getValueOrUndefined(element, "AdditionalInfo");
    this.#combatEffectiveness = getValueOrUndefined(
      element,
      "CombatEffectiveness",
    );
    this.#higherFormation = getValueOrUndefined(element, "HigherFormation");
    this.#iff = getValueOrUndefined(element, "Iff");
    this.#uniqueDesignation = getTagValue(element, "UniqueDesignation") ?? "";
    this.#specialC2HQ = getValueOrUndefined(element, "SpecialC2HQ");
  }

  get echelon(): EnumEchelon | string | undefined {
    return this.#echelon ?? getValueOrUndefined(this.element, "Echelon");
  }

  set echelon(value: EnumEchelon | string | undefined) {
    this.#echelon = value;
    setOrCreateTagValue(this.element, "Echelon", value);
  }

  get reinforcedReduced(): EnumReinforcedReducedType | string | undefined {
    return (
      this.#reinforcedReduced ??
      getValueOrUndefined(this.element, "ReinforcedReduced")
    );
  }
  set reinforcedReduced(value: EnumReinforcedReducedType | string | undefined) {
    this.#reinforcedReduced = value;
    setOrCreateTagValue(this.element, "ReinforcedReduced", value);
  }

  get staffComments(): string | undefined {
    return (
      this.#staffComments ?? getValueOrUndefined(this.element, "StaffComments")
    );
  }
  set staffComments(value: string | undefined) {
    this.#staffComments = value;
    setOrCreateTagValue(this.element, "StaffComments", value);
  }
  get additionalInfo(): string | undefined {
    return (
      this.#additionalInfo ??
      getValueOrUndefined(this.element, "AdditionalInfo")
    );
  }
  set additionalInfo(value: string | undefined) {
    this.#additionalInfo = value;
    setOrCreateTagValue(this.element, "AdditionalInfo", value);
  }

  get combatEffectiveness(): EnumCombatEffectivenessType | string | undefined {
    return (
      this.#combatEffectiveness ??
      getValueOrUndefined(this.element, "CombatEffectiveness")
    );
  }

  set combatEffectiveness(
    value: EnumCombatEffectivenessType | string | undefined,
  ) {
    this.#combatEffectiveness = value;
    setOrCreateTagValue(this.element, "CombatEffectiveness", value);
  }

  get higherFormation(): string | undefined {
    return (
      this.#higherFormation ??
      getValueOrUndefined(this.element, "HigherFormation")
    );
  }

  set higherFormation(value: string | undefined) {
    this.#higherFormation = value;
    setOrCreateTagValue(this.element, "HigherFormation", value);
  }

  get iff(): string | undefined {
    return this.#iff ?? getValueOrUndefined(this.element, "IFF");
  }

  set iff(value: string | undefined) {
    this.#iff = value;
    setOrCreateTagValue(this.element, "IFF", value);
  }

  get uniqueDesignation(): string {
    return (
      this.#uniqueDesignation ??
      getValueOrUndefined(this.element, "UniqueDesignation") ??
      ""
    );
  }

  set uniqueDesignation(value: string) {
    this.#uniqueDesignation = value;
    setOrCreateTagValue(this.element, "UniqueDesignation", value);
  }

  get specialC2HQ(): string | undefined {
    return (
      this.#specialC2HQ ?? getValueOrUndefined(this.element, "SpecialC2HQ")
    );
  }

  set specialC2HQ(value: string | undefined) {
    this.#specialC2HQ = value;
    setOrCreateTagValue(this.element, "SpecialC2HQ", value);
  }

  toString() {
    if (!this.element) return "";
    const oSerializer = new XMLSerializer();
    return oSerializer.serializeToString(this.element);
  }

  toObject(): UnitSymbolModifiersType {
    return removeUndefinedValues({
      echelon: this.echelon,
      reinforcedReduced: this.reinforcedReduced,
      staffComments: this.staffComments,
      additionalInfo: this.additionalInfo,
      combatEffectiveness: this.combatEffectiveness,
      higherFormation: this.higherFormation,
      iff: this.iff,
      uniqueDesignation: this.uniqueDesignation,
      specialC2HQ: this.specialC2HQ,
    });
  }

  updateFromObject(data: Partial<UnitSymbolModifiersType>): void {
    Object.entries(data).forEach(([key, value]) => {
      if (key in this) {
        (this as any)[key] = value;
      } else {
        console.warn(`Property ${key} does not exist.`);
      }
    });
  }

  static fromModel(model: UnitSymbolModifiersType) {
    const symbolModifiers = UnitSymbolModifiers.create();
    symbolModifiers.updateFromObject(model);
    return symbolModifiers;
  }

  static create() {
    const element = createEmptyXMLElementFromTagName(
      UnitSymbolModifiers.TAG_NAME,
    );
    return new UnitSymbolModifiers(element);
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
  static readonly TAG_NAME = "EquipmentSymbolModifiers";
  #quantity?: number;
  #staffComments?: string;
  #additionalInfo?: string;
  #combatEffectiveness?: string;
  #iff?: string;
  #uniqueDesignation: string;
  #equipmentType?: string;
  #towedSonarArray?: boolean;
  element: Element;

  constructor(element: Element) {
    this.element = element;
    this.#quantity = getNumberValue(element, "Quantity");
    this.#staffComments = getValueOrUndefined(element, "StaffComments");
    this.#additionalInfo = getValueOrUndefined(element, "AdditionalInfo");
    this.#combatEffectiveness = getValueOrUndefined(
      element,
      "CombatEffectiveness",
    );
    this.#iff = getValueOrUndefined(element, "IFF");
    this.#uniqueDesignation =
      getValueOrUndefined(element, "UniqueDesignation") ?? "";
    this.#equipmentType = getValueOrUndefined(element, "EquipmentType");
    this.#towedSonarArray = getBooleanValue(element, "TowedSonarArray");
  }

  get quantity(): number | undefined {
    return this.#quantity ?? getNumberValue(this.element, "Quantity");
  }

  set quantity(value: number | undefined) {
    this.#quantity = value;
    setOrCreateTagValue(
      this.element,
      "Quantity",
      value !== undefined ? value.toString() : undefined,
    );
  }

  get staffComments(): string | undefined {
    return (
      this.#staffComments ?? getValueOrUndefined(this.element, "StaffComments")
    );
  }
  set staffComments(value: string | undefined) {
    this.#staffComments = value;
    setOrCreateTagValue(this.element, "StaffComments", value);
  }

  get additionalInfo(): string | undefined {
    return (
      this.#additionalInfo ??
      getValueOrUndefined(this.element, "AdditionalInfo")
    );
  }
  set additionalInfo(value: string | undefined) {
    this.#additionalInfo = value;
    setOrCreateTagValue(this.element, "AdditionalInfo", value);
  }

  get combatEffectiveness(): string | undefined {
    return (
      this.#combatEffectiveness ??
      getValueOrUndefined(this.element, "CombatEffectiveness")
    );
  }
  set combatEffectiveness(value: string | undefined) {
    this.#combatEffectiveness = value;
    setOrCreateTagValue(this.element, "CombatEffectiveness", value);
  }

  get iff(): string | undefined {
    return this.#iff ?? getValueOrUndefined(this.element, "IFF");
  }
  set iff(value: string | undefined) {
    this.#iff = value;
    setOrCreateTagValue(this.element, "IFF", value);
  }

  get uniqueDesignation(): string {
    return (
      this.#uniqueDesignation ??
      getValueOrUndefined(this.element, "UniqueDesignation") ??
      ""
    );
  }
  set uniqueDesignation(value: string) {
    this.#uniqueDesignation = value;
    setOrCreateTagValue(this.element, "UniqueDesignation", value);
  }

  get equipmentType(): string | undefined {
    return (
      this.#equipmentType ?? getValueOrUndefined(this.element, "EquipmentType")
    );
  }
  set equipmentType(value: string | undefined) {
    this.#equipmentType = value;
    setOrCreateTagValue(this.element, "EquipmentType", value);
  }

  get towedSonarArray(): boolean | undefined {
    return (
      this.#towedSonarArray ?? getBooleanValue(this.element, "TowedSonarArray")
    );
  }
  set towedSonarArray(value: boolean | undefined) {
    this.#towedSonarArray = value;
    setOrCreateBooleanValue(this.element, "TowedSonarArray", value);
  }

  toString() {
    if (!this.element) return "";
    const oSerializer = new XMLSerializer();
    return oSerializer.serializeToString(this.element);
  }

  toObject(): EquipmentSymbolModifiersType {
    return removeUndefinedValues({
      quantity: this.quantity,
      staffComments: this.staffComments,
      additionalInfo: this.additionalInfo,
      combatEffectiveness: this.combatEffectiveness,
      iff: this.iff,
      uniqueDesignation: this.uniqueDesignation,
      equipmentType: this.equipmentType,
      towedSonarArray: this.towedSonarArray,
    });
  }

  static fromModel(model: EquipmentSymbolModifiersType) {
    const symbolModifiers = EquipmentSymbolModifiers.create();
    symbolModifiers.updateFromObject(model);
    return symbolModifiers;
  }

  updateFromObject(data: Partial<EquipmentSymbolModifiers>): void {
    Object.entries(data).forEach(([key, value]) => {
      if (key in this) {
        (this as any)[key] = value;
      } else {
        console.warn(`Property ${key} does not exist.`);
      }
    });
  }

  static create() {
    const element = createEmptyXMLElementFromTagName(
      EquipmentSymbolModifiers.TAG_NAME,
    );
    return new EquipmentSymbolModifiers(element);
  }
}
