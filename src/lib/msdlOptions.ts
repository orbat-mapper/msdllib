import {
  createEmptyXMLElementFromTagName,
  getTagValue,
  removeUndefinedValues,
  setOrCreateTagValue,
} from "./domutils.js";

import {
  type EnumEchelon,
  type SymbologyStandard,
  type CoordinateSystem,
} from "./enums.js";

export interface MsdlOptionsType {
  msdlVersion: string;
  organizationDetail?: {
    aggregateBased?: string;
    aggregateEchelon?: EnumEchelon | string;
  };
  scenarioDataStandards?: {
    symbologyDataStandard?: {
      standardName?: SymbologyStandard | string;
      majorVersion?: string;
      minorVersion?: string;
    };
    coordinateDataStandard?: {
      coordinateSystemType?: CoordinateSystem | string;
      coordinateSystemDatum?: string;
    };
  };
}

export class MsdlOptions implements MsdlOptionsType {
  static readonly TAG_NAME = "Options";
  #msdlVersion = "";
  #aggregateBased = "";
  #aggregateEchelon = "";
  #standardName = "";
  #majorVersion = "";
  #minorVersion = "";
  #coordinateSystemType = "";
  #coordinateSystemDatum = "";
  element: Element;

  constructor(element: Element) {
    this.element = element;
    this.#msdlVersion = getTagValue(element, "MSDLVersion");
    this.#aggregateBased = getTagValue(element, "AggregateBased");
    this.#aggregateEchelon = getTagValue(element, "AggregateEchelon");
    this.#standardName = getTagValue(element, "StandardName");
    this.#majorVersion = getTagValue(element, "MajorVersion");
    this.#minorVersion = getTagValue(element, "MinorVersion");
    this.#coordinateSystemType = getTagValue(element, "CoordinateSystemType");
    this.#coordinateSystemDatum = getTagValue(element, "CoordinateSystemDatum");
  }

  get msdlVersion(): string {
    return this.#msdlVersion ?? getTagValue(this.element, "MSDLVersion");
  }

  set msdlVersion(msdlVersion: string) {
    this.#msdlVersion = msdlVersion;
    setOrCreateTagValue(this.element, "MSDLVersion", msdlVersion);
  }

  get aggregateBased(): string {
    return this.#aggregateBased ?? getTagValue(this.element, "AggregateBased");
  }

  set aggregateBased(aggregateBased: string) {
    this.#aggregateBased = aggregateBased;

    let organizationDetailEl = this.ensureChild(
      this.element,
      "OrganizationDetail",
    );
    setOrCreateTagValue(organizationDetailEl, "AggregateBased", aggregateBased);
  }

  get aggregateEchelon(): string {
    return (
      this.#aggregateEchelon ?? getTagValue(this.element, "AggregateEchelon")
    );
  }

  set aggregateEchelon(aggregateEchelon: string) {
    this.#aggregateEchelon = aggregateEchelon;

    let organizationDetailEl = this.ensureChild(
      this.element,
      "OrganizationDetail",
    );
    setOrCreateTagValue(
      organizationDetailEl,
      "AggregateEchelon",
      aggregateEchelon,
    );
  }

  get standardName(): string {
    return this.#standardName ?? getTagValue(this.element, "StandardName");
  }

  set standardName(standardName: string) {
    this.#standardName = standardName;

    let scenarioDataStandardsEl = this.ensureChild(
      this.element,
      "ScenarioDataStandards",
    );
    let symbologyDataStandardEl = this.ensureChild(
      scenarioDataStandardsEl,
      "SymbologyDataStandard",
    );
    setOrCreateTagValue(symbologyDataStandardEl, "StandardName", standardName);
  }

  get majorVersion(): string {
    return this.#majorVersion ?? getTagValue(this.element, "MajorVersion");
  }

  set majorVersion(majorVersion: string) {
    this.#majorVersion = majorVersion;

    let scenarioDataStandardsEl = this.ensureChild(
      this.element,
      "ScenarioDataStandards",
    );
    let symbologyDataStandardEl = this.ensureChild(
      scenarioDataStandardsEl,
      "SymbologyDataStandard",
    );
    setOrCreateTagValue(symbologyDataStandardEl, "MajorVersion", majorVersion);
  }

  get minorVersion(): string {
    return this.#minorVersion ?? getTagValue(this.element, "MinorVersion");
  }

  set minorVersion(minorVersion: string) {
    this.#minorVersion = minorVersion;

    let scenarioDataStandardsEl = this.ensureChild(
      this.element,
      "ScenarioDataStandards",
    );
    let symbologyDataStandardEl = this.ensureChild(
      scenarioDataStandardsEl,
      "SymbologyDataStandard",
    );
    setOrCreateTagValue(symbologyDataStandardEl, "MinorVersion", minorVersion);
  }

  get coordinateSystemType(): string {
    return (
      this.#coordinateSystemType ??
      getTagValue(this.element, "CoordinateSystemType")
    );
  }

  set coordinateSystemType(coordinateSystemType: string) {
    this.#coordinateSystemType = coordinateSystemType;

    let scenarioDataStandardsEl = this.ensureChild(
      this.element,
      "ScenarioDataStandards",
    );
    let CoordinateDataStandardEl = this.ensureChild(
      scenarioDataStandardsEl,
      "CoordinateDataStandard",
    );
    setOrCreateTagValue(
      CoordinateDataStandardEl,
      "CoordinateSystemType",
      coordinateSystemType,
    );
  }

  get coordinateSystemDatum(): string {
    return (
      this.#coordinateSystemDatum ??
      getTagValue(this.element, "CoordinateSystemDatum")
    );
  }

  set coordinateSystemDatum(coordinateSystemDatum: string) {
    this.#coordinateSystemDatum = coordinateSystemDatum;

    let scenarioDataStandardsEl = this.ensureChild(
      this.element,
      "ScenarioDataStandards",
    );
    let CoordinateDataStandardEl = this.ensureChild(
      scenarioDataStandardsEl,
      "CoordinateDataStandard",
    );
    setOrCreateTagValue(
      CoordinateDataStandardEl,
      "CoordinateSystemDatum",
      coordinateSystemDatum,
    );
  }

  toObject(): MsdlOptionsType {
    return removeUndefinedValues({
      msdlVersion: this.msdlVersion,
      organizationDetail: removeUndefinedValues({
        aggregateBased: this.aggregateBased,
        aggregateEchelon: this.aggregateEchelon,
      }),
      scenarioDataStandards: removeUndefinedValues({
        symbologyDataStandard: removeUndefinedValues({
          standardName: this.standardName,
          majorVersion: this.majorVersion,
          minorVersion: this.minorVersion,
        }),
        coordinateDataStandard: removeUndefinedValues({
          coordinateSystemType: this.coordinateSystemType,
          coordinateSystemDatum: this.coordinateSystemDatum,
        }),
      }),
    });
  }

  toString() {
    if (!this.element) return "";
    const oSerializer = new XMLSerializer();
    return oSerializer.serializeToString(this.element);
  }

  updateFromObject(data: Partial<MsdlOptionsType>) {
    Object.entries(data).forEach(([key, value]) => {
      if (key in this) {
        (this as any)[key] = value;
      } else if (value !== null && typeof value === "object") {
        this.updateFromObject(value as any);
      } else {
        console.warn(`Property ${key} does not exist.`);
      }
    });
  }

  static fromModel(model: MsdlOptionsType): MsdlOptions {
    const msdlOptions = new MsdlOptions(
      createEmptyXMLElementFromTagName(MsdlOptions.TAG_NAME),
    );
    msdlOptions.updateFromObject(model);
    return msdlOptions;
  }

  static create(): MsdlOptions {
    return new MsdlOptions(
      createEmptyXMLElementFromTagName(MsdlOptions.TAG_NAME),
    );
  }

  private ensureChild(element: Element, childName: string): Element {
    let child = element.querySelector(childName);
    if (!child) {
      child = createEmptyXMLElementFromTagName(childName);
      element.appendChild(child);
    }
    return child;
  }
}
