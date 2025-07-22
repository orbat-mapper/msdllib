import {
  createEmptyXMLElementFromTagName,
  getNumberValue,
  getTagElement,
  removeTagValue,
  removeUndefinedValues,
  setOrCreateTagValue,
  xmlToString,
} from "./domutils.js";
import type { LngLatElevationTuple, LngLatTuple } from "./types.js";
import { MsdlLocation } from "./geo.js";

export type DispositionType = {
  directionOfMovement?: number;
  location?: LngLatTuple | LngLatElevationTuple;
  speed?: number;
};

export class DispositionBase {
  static readonly TAG_NAME = "Disposition";
  element: Element;
  #directionOfMovement?: number;
  #speed?: number;
  #msdlLocation?: MsdlLocation;

  constructor(element: Element) {
    this.element = element;
    this.#directionOfMovement = getNumberValue(element, "DirectionOfMovement");
    this.#speed = getNumberValue(element, "Speed");
    let locationElement = getTagElement(element, MsdlLocation.TAG_NAME);
    if (locationElement) {
      this.#msdlLocation = new MsdlLocation(locationElement);
    }
    // this.location = this.#msdlLocation?.location;
  }

  get location(): LngLatTuple | LngLatElevationTuple | undefined {
    return this.#msdlLocation?.location;
  }

  set location(loc: LngLatTuple | LngLatElevationTuple | undefined) {
    if (!loc) {
      this.#msdlLocation = undefined;
      removeTagValue(this.element, MsdlLocation.TAG_NAME);
      return;
    }
    if (!this.#msdlLocation) {
      this.#msdlLocation = MsdlLocation.createGDCLocation(loc);
    }
    this.#msdlLocation.location = loc;
    this.element.appendChild(this.#msdlLocation.element);
  }

  get directionOfMovement(): number | undefined {
    return (
      this.#directionOfMovement ??
      getNumberValue(this.element, "DirectionOfMovement")
    );
  }

  set directionOfMovement(direction: number | undefined) {
    this.#directionOfMovement = direction;
    setOrCreateTagValue(
      this.element,
      "DirectionOfMovement",
      direction?.toString(),
    );
  }

  get speed(): number | undefined {
    return this.#speed ?? getNumberValue(this.element, "Speed");
  }

  set speed(speed: number | undefined) {
    this.#speed = speed;
    setOrCreateTagValue(this.element, "Speed", speed?.toString());
  }

  toObject(): DispositionType {
    return removeUndefinedValues({
      directionOfMovement: this.directionOfMovement,
      speed: this.speed,
      location: this.location,
    });
  }

  toString(): string {
    return xmlToString(this.element);
  }

  updateFromObject(data: Partial<DispositionType>) {
    Object.entries(data).forEach(([key, value]) => {
      if (key in this) {
        (this as any)[key] = value;
      } else {
        console.warn(`Property ${key} does not exist.`);
      }
    });
  }
}

export class UnitDisposition extends DispositionBase {
  constructor(element: Element) {
    super(element);
  }

  static fromModel(model: Partial<DispositionType>): UnitDisposition {
    const disposition = UnitDisposition.create();
    disposition.updateFromObject(model);
    return disposition;
  }

  static create(): UnitDisposition {
    return new UnitDisposition(
      createEmptyXMLElementFromTagName(UnitDisposition.TAG_NAME),
    );
  }
}

export class EquipmentItemDisposition extends DispositionBase {
  constructor(element: Element) {
    super(element);
  }

  static fromModel(model: Partial<DispositionType>): EquipmentItemDisposition {
    const disposition = EquipmentItemDisposition.create();
    disposition.updateFromObject(model);
    return disposition;
  }

  static create(): EquipmentItemDisposition {
    return new EquipmentItemDisposition(
      createEmptyXMLElementFromTagName(EquipmentItemDisposition.TAG_NAME),
    );
  }
}
