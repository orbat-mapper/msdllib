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
  MSDLVersion: string;
  AggregateBased?: string;
  AggregateEchelon?: EnumEchelon | string;
  StandardName?: SymbologyStandard | string;
  MajorVersion?: string;
  MinorVersion?: string;
  CoordinateSystemType?: CoordinateSystem | string;
  CoordinateSystemDatum?: string;
}

export class MsdlOptions implements MsdlOptionsType {
  static readonly TAG_NAME = "Options";
  #MSDLVersion = "";
  #AggregateBased = "";
  #AggregateEchelon = "";
  #StandardName = "";
  #MajorVersion = "";
  #MinorVersion = "";
  #CoordinateSystemType = "";
  #CoordinateSystemDatum = "";
  element: Element;

  constructor(element: Element) {
    this.element = element;
    this.#MSDLVersion = getTagValue(element, "MSDLVersion");
    this.#AggregateBased = getTagValue(element, "AggregateBased");
    this.#AggregateEchelon = getTagValue(element, "AggregateEchelon");
    this.#StandardName = getTagValue(element, "StandardName");
    this.#MajorVersion = getTagValue(element, "MajorVersion");
    this.#MinorVersion = getTagValue(element, "MinorVersion");
    this.#CoordinateSystemType = getTagValue(element, "CoordinateSystemType");
    this.#CoordinateSystemDatum = getTagValue(element, "CoordinateSystemDatum");
  }

  get MSDLVersion(): string {
    return this.#MSDLVersion ?? getTagValue(this.element, "MSDLVersion");
  }

  set MSDLVersion(MSDLVersion: string) {
    this.#MSDLVersion = MSDLVersion;
    setOrCreateTagValue(this.element, "MSDLVersion", MSDLVersion);
  }

  get AggregateBased(): string {
    return this.#AggregateBased ?? getTagValue(this.element, "AggregateBased");
  }

  set AggregateBased(AggregateBased: string) {
    this.#AggregateBased = AggregateBased;
    setOrCreateTagValue(this.element, "AggregateBased", AggregateBased);
  }

  get AggregateEchelon(): string {
    return (
      this.#AggregateEchelon ?? getTagValue(this.element, "AggregateEchelon")
    );
  }

  set AggregateEchelon(AggregateEchelon: string) {
    this.#AggregateEchelon = AggregateEchelon;
    setOrCreateTagValue(this.element, "AggregateEchelon", AggregateEchelon);
  }

  get StandardName(): string {
    return this.#StandardName ?? getTagValue(this.element, "StandardName");
  }

  set StandardName(StandardName: string) {
    this.#StandardName = StandardName;
    setOrCreateTagValue(this.element, "StandardName", StandardName);
  }

  get MajorVersion(): string {
    return this.#MajorVersion ?? getTagValue(this.element, "MajorVersion");
  }

  set MajorVersion(MajorVersion: string) {
    this.#MajorVersion = MajorVersion;
    setOrCreateTagValue(this.element, "MajorVersion", MajorVersion);
  }

  get MinorVersion(): string {
    return this.#MinorVersion ?? getTagValue(this.element, "MinorVersion");
  }

  set MinorVersion(MinorVersion: string) {
    this.#MinorVersion = MinorVersion;
    setOrCreateTagValue(this.element, "MinorVersion", MinorVersion);
  }

  get CoordinateSystemType(): string {
    return (
      this.#CoordinateSystemType ??
      getTagValue(this.element, "CoordinateSystemType")
    );
  }

  set CoordinateSystemType(CoordinateSystemType: string) {
    this.#CoordinateSystemType = CoordinateSystemType;
    setOrCreateTagValue(
      this.element,
      "CoordinateSystemType",
      CoordinateSystemType,
    );
  }

  get CoordinateSystemDatum(): string {
    return (
      this.#CoordinateSystemDatum ??
      getTagValue(this.element, "CoordinateSystemDatum")
    );
  }

  set CoordinateSystemDatum(CoordinateSystemDatum: string) {
    this.#CoordinateSystemDatum = CoordinateSystemDatum;
    setOrCreateTagValue(
      this.element,
      "CoordinateSystemDatum",
      CoordinateSystemDatum,
    );
  }

  toObject(): MsdlOptionsType {
    return removeUndefinedValues({
      MSDLVersion: this.MSDLVersion,
      AggregateBased: this.AggregateBased,
      AggregateEchelon: this.AggregateEchelon,
      StandardName: this.StandardName,
      MajorVersion: this.MajorVersion,
      MinorVersion: this.MinorVersion,
      CoordinateSystemType: this.CoordinateSystemType,
      CoordinateSystemDatum: this.CoordinateSystemDatum,
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
}
