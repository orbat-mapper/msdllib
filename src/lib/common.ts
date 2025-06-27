import {
  getTagElement,
  getTagElements,
  getTagValue,
  removeTagValue,
  setOrCreateTagValue,
} from "./domutils.js";
import { StandardIdentity } from "./enums.js";
import type { LngLatElevationTuple, LngLatTuple } from "./types.js";
import { setCharAt } from "./symbology.js";
import { Holding } from "./holdings.js";
import { type EquipmentItemDisposition, type UnitDisposition } from "./geo.js";

export const HOLDINGS_ELEMENT_TAG = "Holdings";
export const HOLDING_ELEMENT_TAG = "Holding";

export type TacticalJson = {
  id?: string;
  sidc?: string;
  speed?: number;
  direction?: number;
  label?: string;
};

export type UnitOrEquipmentType = "unit" | "equipment";

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
  holdings: Holding[];
  disposition?: UnitDisposition | EquipmentItemDisposition;
  setAffiliation(s: StandardIdentity): void;
  getAffiliation(): StandardIdentity;
  toString(): string;
};

export class UnitEquipmentBase implements UnitEquipmentInterface {
  sidc: string;
  // location?: LngLatTuple | LngLatElevationTuple;
  // speed?: number;
  // directionOfMovement?: number;
  #symbolIdentifier: string;
  #name: string;
  #objectHandle: string;
  element: Element;
  #holdings: Holding[] = [];

  constructor(element: Element) {
    this.element = element;
    this.#objectHandle = getTagValue(element, "ObjectHandle");
    this.#symbolIdentifier = getTagValue(this.element, "SymbolIdentifier");
    this.#name = getTagValue(element, "Name");

    this.sidc = setCharAt(
      this.#symbolIdentifier,
      1,
      StandardIdentity.NoneSpecified,
    );
    this.initHoldings();
  }

  get name(): string {
    return this.#name ?? getTagValue(this.element, "Name");
  }

  set name(name: string) {
    this.#name = name;
    setOrCreateTagValue(this.element, "Name", name);
  }

  get objectHandle(): string {
    return this.#objectHandle ?? getTagValue(this.element, "ObjectHandle");
  }

  set objectHandle(objectHandle: string) {
    this.#objectHandle = objectHandle;
    setOrCreateTagValue(this.element, "ObjectHandle", objectHandle);
  }

  get symbolIdentifier(): string {
    return (
      this.#symbolIdentifier ?? getTagValue(this.element, "SymbolIdentifier")
    );
  }

  set symbolIdentifier(symbolIdentifier: string) {
    this.#symbolIdentifier = symbolIdentifier;
    setOrCreateTagValue(this.element, "SymbolIdentifier", symbolIdentifier);
  }

  get holdings(): Holding[] {
    return this.#holdings ?? getTagValue(this.element, HOLDINGS_ELEMENT_TAG);
  }

  set holdings(holdings: Holding[]) {
    this.#holdings.length = 0;
    holdings.length === 0
      ? removeTagValue(this.element, HOLDINGS_ELEMENT_TAG)
      : setOrCreateTagValue(this.element, HOLDINGS_ELEMENT_TAG, null, {
          deleteIfNull: false,
        }); // Create empty node if holdings exist, remove otherwise
    const holdingsElement = getTagElement(this.element, HOLDINGS_ELEMENT_TAG)!;
    for (const newHolding of holdings) {
      this.#holdings.push(newHolding);
      holdingsElement.appendChild(newHolding.element);
    }
  }

  setAffiliation(s: StandardIdentity) {
    this.sidc = setCharAt(this.sidc, 1, s);
  }

  getAffiliation(): StandardIdentity {
    return this.sidc[1] as StandardIdentity;
  }

  private initHoldings() {
    const holdingsElement = getTagElement(this.element, HOLDINGS_ELEMENT_TAG);
    if (holdingsElement) {
      const holdings = [] as Holding[];
      for (const holdingElement of getTagElements(
        holdingsElement,
        HOLDING_ELEMENT_TAG,
      )) {
        holdings.push(new Holding(holdingElement));
      }
      this.holdings = holdings;
    } else {
      this.holdings = [] as Holding[];
    }
  }

  toString() {
    if (!this.element) return "";
    const oSerializer = new XMLSerializer();
    return oSerializer.serializeToString(this.element);
  }

  updateFromObject(data: Partial<UnitEquipmentBase>) {
    Object.entries(data).forEach(([key, value]) => {
      if (key in this) {
        (this as any)[key] = value;
      } else {
        console.warn(`Property ${key} does not exist.`);
      }
    });
  }
}

export type IdGeoJsonOptions = {
  includeId?: boolean;
  includeIdInProperties?: boolean;
};
