import { getTagValue } from "./utils.js";

export interface ScenarioIdType {
  name: string;
  description: string;
  securityClassification: string;
}

export class ScenarioId implements ScenarioIdType {
  name: string = "";
  description: string = "";
  securityClassification: string = "";

  constructor(readonly element?: Element) {
    if (!element) return;
    this.name = getTagValue(element, "name");
    // this.type = getTagValue(element, "type");
    // this.version = getTagValue(element, "version");
    this.description = getTagValue(element, "description");
    this.securityClassification = getTagValue(
      element,
      "securityClassification",
    );
    // this.modificationDate = getTagValue(element, "modificationDate");
  }
}
