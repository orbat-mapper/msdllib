// NETN Deployment element
import { v4 as uuidv4 } from "uuid";
import {
  addChildElementWithValue,
  createEmptyXMLElementFromTagName,
  createXMLElementWithValue,
  getTagElement,
  getTagElements,
  getTagValue,
  getValueOrUndefined,
  removeTagValue,
  removeTagValues,
  setOrCreateTagValue,
  xmlToString,
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
    const federateElements = getTagElements(element, Federate.TAG_NAME);
    for (const federateElement of federateElements) {
      this.#federates.push(new Federate(federateElement));
    }
  }

  get federates(): Federate[] {
    return this.#federates;
  }

  set federates(federates: (FederateType | Federate)[]) {
    this.#federates.length = 0;
    removeTagValues(this.element, Federate.TAG_NAME);
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

  assignUnitToFederate(federateHandle: string, unitHandle: string) {
    const federate = this.getFederateById(federateHandle);
    if (!federate) return;
    const oldFed = this.getFederateOfUnit(unitHandle);
    if (oldFed) this.removeUnitFromFederate(oldFed.objectHandle, unitHandle);
    federate.addUnit(unitHandle);
  }

  removeUnitFromFederate(federateHandle: string, unitHandle: string) {
    const federate = this.getFederateById(federateHandle);
    if (!federate) return;
    federate.removeUnit(unitHandle);
  }

  assignEquipmentToFederate(federateHandle: string, equipmentHandle: string) {
    const federate = this.getFederateById(federateHandle);
    if (!federate) return;
    const oldFed = this.getFederateOfEquipment(equipmentHandle);
    if (oldFed)
      this.removeEquipmentFromFederate(oldFed.objectHandle, equipmentHandle);
    federate.addEquipmentItem(equipmentHandle);
  }

  removeEquipmentFromFederate(federateHandle: string, equipmentHandle: string) {
    const federate = this.getFederateById(federateHandle);
    if (!federate) return;
    federate.addEquipmentItem(equipmentHandle);
  }

  getFederateById(objectHandle: string): Federate | undefined {
    return this.federates.find((f) => f.objectHandle === objectHandle);
  }

  getFederateOfUnit(objectHandle: string): Federate | undefined {
    return this.federates.find((f) => f.units.includes(objectHandle));
  }

  getFederateOfEquipment(objectHandle: string): Federate | undefined {
    return this.federates.find((f) => f.equipment.includes(objectHandle));
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

  toString() {
    if (!this.element) return "";
    const oSerializer = new XMLSerializer();
    return oSerializer.serializeToString(this.element);
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
      const handle = createXMLElementWithValue("ObjectHandle", unit);
      const unitEl = createEmptyXMLElementFromTagName("Unit");
      unitEl.appendChild(handle);
      unitsEl.appendChild(unitEl);
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
      const handle = createXMLElementWithValue("ObjectHandle", eq);
      const eqEl = createEmptyXMLElementFromTagName("EquipmentItem");
      eqEl.appendChild(handle);
      equipmentEl.appendChild(eqEl);
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
      this.units = [...this.#units, unitHandle];
    }
  }

  removeUnit(unitHandle: string) {
    if (!this.units.includes(unitHandle)) {
      return console.warn(
        `Federate ${this.name} does not contain ${unitHandle}`,
      );
    }
    this.units = this.#units.filter((u) => u !== unitHandle);
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
      this.equipment = [...this.#equipment, equipmentItemHandle];
    }
  }

  removeEquipmentItem(equipmentHandle: string) {
    if (!this.equipment.includes(equipmentHandle)) {
      return console.warn(
        `Federate ${this.name} does not contain ${equipmentHandle}`,
      );
    }
    this.equipment = this.#equipment.filter((u) => u !== equipmentHandle);
  }

  addAllUnits(units: string[]) {
    this.units = [...new Set([...this.#units, ...units])];
  }

  addAllEquipment(equipment: string[]) {
    this.equipment = [...new Set([...this.#equipment, ...equipment])];
  }

  removeAllUnits() {
    const removed = this.#units.splice(0);
    this.units = [];
    return removed;
  }

  removeAllEquipment() {
    const removed = this.#equipment.splice(0);
    this.equipment = [];
    return removed;
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
