import { getTagElement, getTagValue, setCharAt } from "./utils.js";
import {
  type LngLatElevationTuple,
  type LngLatTuple,
  MsdlLocation,
} from "./geo.js";
import { StandardIdentity } from "./enums.js";

export type TacticalJson = {
  sidc?: string;
  speed?: number;
  direction?: number;
  label?: string;
};
export type UnitEquipmentInterface = {
  objectHandle: string;
  symbolIdentifier: string;
  name: string;
  location?: LngLatTuple | LngLatElevationTuple;
  /** The field speed in meters per second */
  speed?: number;
  /** The direction of movement, in compass degrees */
  directionOfMovement?: number;
  superiorHandle: string;
  sidc: string;
  setAffiliation(s: StandardIdentity): void;
  getAffiliation(): StandardIdentity;
};

export class UnitEquipmentBase implements UnitEquipmentInterface {
  sidc: string;
  location?: LngLatTuple | LngLatElevationTuple;
  speed?: number;
  directionOfMovement?: number;
  symbolIdentifier: string;
  name: string;
  objectHandle: string;
  superiorHandle = "";
  symbolModifiers?: UnitSymbolModifiers;
  protected _msdlLocation?: MsdlLocation;

  constructor(readonly element: Element) {
    this.objectHandle = getTagValue(element, "ObjectHandle");
    this.symbolIdentifier = getTagValue(this.element, "SymbolIdentifier");
    this.name = getTagValue(element, "Name");
    this.getDisposition();
    this.sidc = setCharAt(
      this.symbolIdentifier,
      1,
      StandardIdentity.NoneSpecified,
    );
    const unitSymbolModifiersElement = getTagElement(
      this.element,
      "UnitSymbolModifiers",
    );
    if (unitSymbolModifiersElement) {
      this.symbolModifiers = new UnitSymbolModifiers(
        unitSymbolModifiersElement,
      );
    }
  }

  setAffiliation(s: StandardIdentity) {
    this.sidc = setCharAt(this.sidc, 1, s);
  }

  getAffiliation(): StandardIdentity {
    return this.sidc[1] as StandardIdentity;
  }

  private getDisposition() {
    let dispositionElement = getTagElement(this.element, "Disposition");
    let speed = getTagValue(dispositionElement, "Speed");
    let directionOfMovement = getTagValue(
      dispositionElement,
      "DirectionOfMovement",
    );
    this.speed = speed ? +speed : undefined;
    this.directionOfMovement = directionOfMovement
      ? +directionOfMovement
      : undefined;
    this._msdlLocation = new MsdlLocation(dispositionElement);
    this.location = this._msdlLocation.location;
  }
}

export class UnitSymbolModifiers {
  echelon?: string;
  reinforcedReduced?: string;
  staffComments?: string;
  additionalInfo?: string;
  combatEffectiveness?: string;
  higherFormation?: string;
  iff?: string;
  uniqueDesignation: string;
  specialC2HQ?: string;

  constructor(element: Element) {
    this.echelon = getTagValue(element, "Echelon");
    this.reinforcedReduced = getTagValue(element, "ReinforcedReduced");
    this.staffComments = getTagValue(element, "StaffComments");
    this.additionalInfo = getTagValue(element, "AdditionalInfo");
    this.combatEffectiveness = getTagValue(element, "CombatEffectiveness");
    this.higherFormation = getTagValue(element, "HigherFormation");
    this.iff = getTagValue(element, "IFF");
    this.uniqueDesignation = getTagValue(element, "UniqueDesignation") || "";
    this.specialC2HQ = getTagValue(element, "SpecialC2HQ");
  }
}
