import { getTagValue } from "./utils.js";

export interface ScenarioIdType {
  name: string;
  description: string;
  securityClassification: string;
}

export class ScenarioId implements ScenarioIdType {
  name = "";
  description = "";
  securityClassification = "";

  constructor(readonly element?: Element) {
    if (!element) return;
    this.name = getTagValue(element, "name");
    this.description = getTagValue(element, "description");
    this.securityClassification = getTagValue(
      element,
      "securityClassification",
    );
  }
}
