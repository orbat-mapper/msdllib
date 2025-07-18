// NETN Deployment element
import { v4 as uuidv4 } from "uuid";
import {
  addChildElementWithValue,
  createEmptyXMLElementFromTagName,
  getTagElement,
  getTagElements,
  getTagValue,
  getValueOrUndefined,
  setOrCreateTagValue,
} from "./domutils.js";

export interface DeploymentType {
  federates: FederateType[];
}

export class Deployment {
  static readonly TAG_NAME = "Deployment";
  element: Element;
  #federates: Federate[] = [];

  constructor(element: Element) {
    this.element = element;
    const federateElements = getTagElements(element, "Federate");
    for (const federateElement of federateElements) {
      this.#federates.push(new Federate(federateElement));
    }
  }

  get federates(): Federate[] {
    return this.#federates;
  }

  set federates(federates: (FederateType | Federate)[]) {
    this.#federates.length = 0;
    for (const fed of federates) {
      let federateInstance =
        fed instanceof Federate ? fed : Federate.fromModel(fed);
      this.#federates.push(federateInstance);
      this.element.appendChild(federateInstance.element);
    }
  }

  addFederate(fed: Federate | FederateType) {
    this.federates = [...this.#federates, fed];
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

export type FederateTypeInput = Omit<
  FederateType,
  "units" | "equipment" | "objectHandle"
>;

export interface FederateType {
  objectHandle: string;
  name: string;
  units: string[];
  equipment: string[];
}

export class Federate {
  static readonly TAG_NAME = "Federate";
  element: Element;
  #objectHandle: string;
  #name?: string;
  #units: string[] = [];
  #equipment: string[] = [];

  constructor(element: Element) {
    this.element = element;
    this.#objectHandle = getTagValue(element, "ObjectHandle");
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

  get objectHandle(): string {
    return this.#objectHandle ?? getTagValue(this.element, "ObjectHandle");
  }

  set objectHandle(objectHandle: string) {
    this.#objectHandle = objectHandle;
    setOrCreateTagValue(this.element, "ObjectHandle", objectHandle);
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

  addUnit(unitHandle: string) {
    if (this.units.includes(unitHandle)) {
      return console.warn(
        `Federate ${this.name} already contains ${unitHandle}`,
      );
    }
    if (!this.units || this.units.length === 0) {
      this.units = [unitHandle];
    } else {
      this.units.push(unitHandle);
      let unitsEl = getTagElement(this.element, "Units");
      if (!unitsEl)
        throw new Error(`Units element is undefined in federate ${this.name}`);
      addChildElementWithValue(unitsEl, "Unit", unitHandle);
    }
  }

  removeUnit(unitHandle: string) {
    if (!this.units.includes(unitHandle)) {
      return console.warn(
        `Federate ${this.name} does not contain ${unitHandle}`,
      );
    }
    const unitIdx = this.units.findIndex((u) => u === unitHandle);
    this.units.splice(unitIdx, 1);
    const unitsEl = getTagElement(this.element, "Units");
    if (!unitsEl)
      throw new Error(`Units element is undefined in federate ${this.name}`);
    const unitElements = getTagElements(unitsEl, "Unit");
    const unitToRemove = unitElements.find((el) =>
      el.textContent?.includes(unitHandle),
    );
    if (unitToRemove) {
      unitsEl.removeChild(unitToRemove);
    } else {
      console.warn(`Could not remove unit ${unitHandle} from xml`);
    }
  }

    addEquipmentItem(equipmentItemHandle: string) {
    if (this.equipment.includes(equipmentItemHandle)) {
      return console.warn(
        `Federate ${this.name} already contains ${equipmentItemHandle}`,
      );
    }
    if (!this.equipment || this.equipment.length === 0) {
      this.equipment = [equipmentItemHandle];
    } else {
      this.equipment.push(equipmentItemHandle);
      let equipmentEl = getTagElement(this.element, "Equipment");
      if (!equipmentEl)
        throw new Error(`Equipment element is undefined in federate ${this.name}`);
      addChildElementWithValue(equipmentEl, "EquipmentItem", equipmentItemHandle);
    }
  }

  removeEquipmentItem(equipmentItemHandle: string) {
    if (!this.equipment.includes(equipmentItemHandle)) {
      return console.warn(
        `Federate ${this.name} does not contain ${equipmentItemHandle}`,
      );
    }
    const equipmentItemIdx = this.equipment.findIndex((u) => u === equipmentItemHandle);
    this.equipment.splice(equipmentItemIdx, 1);
    const equipmentEl = getTagElement(this.element, "Equipment");
    if (!equipmentEl)
      throw new Error(`Equipment element is undefined in federate ${this.name}`);
    const equipmentItemElements = getTagElements(equipmentEl, "EquipmentItem");
    const equipmentItemToRemove = equipmentItemElements.find((el) =>
      el.textContent?.includes(equipmentItemHandle),
    );
    if (equipmentItemToRemove) {
      equipmentEl.removeChild(equipmentItemToRemove);
    } else {
      console.warn(`Could not remove EquipmentItem ${equipmentItemHandle} from xml`);
    }
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

  toString() {
    if (!this.element) return "";
    const oSerializer = new XMLSerializer();
    return oSerializer.serializeToString(this.element);
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
