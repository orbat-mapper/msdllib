import { getTagElement, getTagValue, setOrCreateTagValue } from "./domutils.js";
import { MsdlLocation } from "./geo.js";
import { StandardIdentity } from "./enums.js";
import type { LngLatElevationTuple, LngLatTuple } from "./types.js";
import { setCharAt } from "./symbology.js";

export type TacticalJson = {
  id?: string;
  sidc?: string;
  speed?: number;
  direction?: number;
  label?: string;
};

export type UnitEquipmentInterface = {
  objectHandle: string;
  symbolIdentifier: string;
  name?: string;
  location?: LngLatTuple | LngLatElevationTuple;
  /** The field speed in meters per second */
  speed?: number;
  /** The direction of movement, in compass degrees */
  directionOfMovement?: number;
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
  #name: string;
  objectHandle: string;
  element: Element;

  protected _msdlLocation?: MsdlLocation;

  constructor(element: Element) {
    this.element = element;
    this.objectHandle = getTagValue(element, "ObjectHandle");
    this.symbolIdentifier = getTagValue(this.element, "SymbolIdentifier");
    this.#name = getTagValue(element, "Name");
    this.getDisposition();
    this.sidc = setCharAt(
      this.symbolIdentifier,
      1,
      StandardIdentity.NoneSpecified,
    );
  }

  get name(): string {
    return this.#name ?? getTagValue(this.element, "Name");
  }

  set name(name: string) {
    this.#name = name;
    setOrCreateTagValue(this.element, "Name", name);
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
    if (dispositionElement) {
      this._msdlLocation = new MsdlLocation(dispositionElement);
      this.location = this._msdlLocation.location;
    }
  }
}

export type IdGeoJsonOptions = {
  includeId?: boolean;
  includeIdInProperties?: boolean;
};
