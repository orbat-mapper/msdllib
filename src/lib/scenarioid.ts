import { getTagValue, setOrCreateTagValue } from "./domutils.js";

export interface ScenarioIdType {
  name: string;
  description: string;
  securityClassification: string;
}

export class ScenarioId implements ScenarioIdType {
  #name = "";
  #description = "";
  #securityClassification = "";
  element: Element;

  constructor(element: Element) {
    this.element = element;
    this.#name = getTagValue(element, "name");
    this.#description = getTagValue(element, "description");
    this.#securityClassification = getTagValue(
      element,
      "securityClassification",
    );
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
}
