import {
  createEmptyXMLElementFromTagName,
  getTagValue,
  removeUndefinedValues,
  setOrCreateTagValue,
} from "./domutils.js";

export interface ScenarioIdType {
  name: string;
  description: string;
  securityClassification: string;
  modificationDate: string;
  version: string;
  type: string;
}

export class ScenarioId implements ScenarioIdType {
  static readonly TAG_NAME = "ScenarioID";
  #name = "";
  #description = "";
  #securityClassification = "";
  #modificationDate: string = "";
  #version: string = "";
  #type: string = "";
  element: Element;

  constructor(element: Element) {
    this.element = element;
    this.#name = getTagValue(element, "name");
    this.#description = getTagValue(element, "description");
    this.#securityClassification = getTagValue(
      element,
      "securityClassification",
    );
    this.#modificationDate = getTagValue(element, "modificationDate");
    this.#version = getTagValue(element, "version");
    this.#type = getTagValue(element, "type");
  }

  get name(): string {
    return this.#name ?? getTagValue(this.element, "name");
  }

  set name(name: string) {
    this.#name = name;
    setOrCreateTagValue(this.element, "name", name);
  }

  get description(): string {
    return this.#description ?? getTagValue(this.element, "description");
  }
  set description(description: string) {
    this.#description = description;
    setOrCreateTagValue(this.element, "description", description);
  }
  get securityClassification(): string {
    return (
      this.#securityClassification ??
      getTagValue(this.element, "securityClassification")
    );
  }
  set securityClassification(securityClassification: string) {
    this.#securityClassification = securityClassification;
    setOrCreateTagValue(
      this.element,
      "securityClassification",
      securityClassification,
    );
  }

  get modificationDate(): string {
    return (
      this.#modificationDate ?? getTagValue(this.element, "modificationDate")
    );
  }
  set modificationDate(modificationDate: string) {
    this.#modificationDate = modificationDate;
    setOrCreateTagValue(this.element, "modificationDate", modificationDate);
  }

  get version(): string {
    return this.#version ?? getTagValue(this.element, "version");
  }
  set version(version: string) {
    this.#version = version;
    setOrCreateTagValue(this.element, "version", version);
  }

  get type(): string {
    return this.#type ?? getTagValue(this.element, "type");
  }

  set type(type: string) {
    this.#type = type;
    setOrCreateTagValue(this.element, "type", type);
  }

  toObject(): ScenarioIdType {
    return removeUndefinedValues({
      name: this.name,
      description: this.description,
      securityClassification: this.securityClassification,
      modificationDate: this.modificationDate,
      version: this.version,
      type: this.type,
    });
  }

  toString() {
    if (!this.element) return "";
    const oSerializer = new XMLSerializer();
    return oSerializer.serializeToString(this.element);
  }

  updateFromObject(data: Partial<ScenarioIdType>) {
    Object.entries(data).forEach(([key, value]) => {
      if (key in this) {
        (this as any)[key] = value;
      } else {
        console.warn(`Property ${key} does not exist.`);
      }
    });
  }

  static fromModel(model: ScenarioIdType): ScenarioId {
    const scenarioId = new ScenarioId(
      createEmptyXMLElementFromTagName(ScenarioId.TAG_NAME),
    );
    scenarioId.updateFromObject(model);
    return scenarioId;
  }
}
