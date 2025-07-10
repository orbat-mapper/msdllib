// NETN Deployment element
import { v4 as uuidv4 } from "uuid";
import {
  createEmptyXMLElementFromTagName,
  getOrCreateTagElement,
  getTagElement,
  getTagElements,
  getTagValue,
  getValueOrUndefined,
  removeTagValues,
  setOrCreateTagValue,
} from "./domutils.js";

export interface DeploymentType {
  federates: FederateType[];
}

export class Deployment {
  static readonly TAG_NAME = "Deployment";
  element: Element;
  federates: Federate[] = [];

  constructor(element: Element) {
    this.element = element;
    const federateElements = getTagElements(element, "Federate");
    for (const federateElement of federateElements) {
      this.federates.push(new Federate(federateElement));
    }
  }

  updateFromObject(data: Partial<DeploymentType>) {
    Object.entries(data).forEach(([key, value]) => {
      if (key in this) {
        (this as any)[key] = value;
      } else {
        console.warn(`Property ${key} does not exist.`);
      }
    });
  }

  static fromModel(model: Partial<DeploymentType>): Deployment {
    const deployment = Deployment.create();
    deployment.updateFromObject(model);
    return deployment;
  }

  static create(): Deployment {
    const fed = new Deployment(
      createEmptyXMLElementFromTagName(Deployment.TAG_NAME),
    );
    return fed;
  }
}

export interface FederateType {
  objectHandle: string;
  name: string;
  units: string[];
  equipment: string[];
}

export class Federate {
  static readonly TAG_NAME = "Federate";
  element: Element;
  objectHandle: string;
  #name?: string;
  #units: string[] = [];
  #equipment: string[] = [];

  constructor(element: Element) {
    this.element = element;
    this.objectHandle = getTagValue(element, "ObjectHandle");
    this.#name = getValueOrUndefined(element, "Name");
    const unitsElements = getTagElement(element, "Units");
    for (const unitElement of getTagElements(unitsElements, "Unit")) {
      const objectHandle = getTagValue(unitElement, "ObjectHandle");
      objectHandle && this.#units.push(objectHandle);
    }
    const equipmentElements = getTagElement(element, "Equipment");
    for (const equipmentElement of getTagElements(
      equipmentElements,
      "EquipmentItem",
    )) {
      const objectHandle = getTagValue(equipmentElement, "ObjectHandle");
      objectHandle && this.equipment.push(objectHandle);
    }
  }

  get name() {
    return this.#name ?? getValueOrUndefined(this.element, "Name");
  }

  set name(name: string | undefined) {
    this.#name = name;
    setOrCreateTagValue(this.element, "Name", name);
  }

  get units(): string[] {
    return this.#units;
  }

  set units(units: string[]) {
    let unitsEl = getTagElement(this.element, "Units");
    if (unitsEl) {
      this.element.removeChild(unitsEl);
    }
    unitsEl = createEmptyXMLElementFromTagName("Units");
    this.#units = units;
    for (const unit of units) {
      setOrCreateTagValue(unitsEl, "Unit", unit);
    }
    this.element.appendChild(unitsEl);
  }

  get equipment(): string[] {
    return this.#equipment;
  }

  set equipment(equipment: string[]) {
    let equipmentEl = getTagElement(this.element, "Equipment");
    if (equipmentEl) {
      this.element.removeChild(equipmentEl);
    }
    equipmentEl = createEmptyXMLElementFromTagName("Equipment");
    this.#equipment = equipment;
    for (const eq of equipment) {
      setOrCreateTagValue(equipmentEl, "EquipmentItem", eq);
    }
    this.element.appendChild(equipmentEl);
  }

  updateFromObject(data: Partial<FederateType>) {
    Object.entries(data).forEach(([key, value]) => {
      if (key in this) {
        (this as any)[key] = value;
      } else {
        console.warn(`Property ${key} does not exist.`);
      }
    });
  }

  static fromModel(model: Partial<FederateType>): Federate {
    const federate = Federate.create();
    federate.updateFromObject(model);
    return federate;
  }

  static create(): Federate {
    const fed = new Federate(
      createEmptyXMLElementFromTagName(Federate.TAG_NAME),
    );
    fed.objectHandle = uuidv4();
    return fed;
  }
}
