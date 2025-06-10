// NETN Deployment element

import {
  getTagElement,
  getTagElements,
  getTagValue,
  getValueOrUndefined,
  setOrCreateTagValue,
} from "./domutils.js";

export class Deployment {
  element: Element;
  federates: Federate[] = [];
  constructor(element: Element) {
    this.element = element;
    const federateElements = getTagElements(element, "Federate");
    for (const federateElement of federateElements) {
      this.federates.push(new Federate(federateElement));
    }
  }
}

export class Federate {
  element: Element;
  objectHandle: string;
  #name?: string;
  units: string[] = [];
  equipment: string[] = [];

  constructor(element: Element) {
    this.element = element;
    this.objectHandle = getTagValue(element, "ObjectHandle");
    this.#name = getValueOrUndefined(element, "Name");
    const unitsElements = getTagElement(element, "Units");
    for (const unitElement of getTagElements(unitsElements, "Unit")) {
      const objectHandle = getTagValue(unitElement, "ObjectHandle");
      objectHandle && this.units.push(objectHandle);
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
}

export class FederateItem {
  element: Element;
  objectHandle: string;

  constructor(element: Element) {
    this.element = element;
    this.objectHandle = getTagValue(element, "ObjectHandle");
  }
}
