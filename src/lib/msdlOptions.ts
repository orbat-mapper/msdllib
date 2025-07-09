import {
  createEmptyXMLElementFromTagName,
  getTagValue,
  removeUndefinedValues,
  setOrCreateTagValue,
} from "./domutils.js";

export interface MsdlOptionsType {
  MSDLVersion: string;
  OrganizationDetails?: string;
  ScenarioDataStandards?: string;
  StandardName?: string;
  MajorVersion?: string;
  MinorVersion?:  string;
  CoordinateSystemType?: string;
  CoordinateSystemDatum?: string;
}


export class MsdlOptions implements MsdlOptionsType {
  static readonly TAG_NAME = "Options";
  #MSDLVersion = "";
  #OrganizationDetails = "";
  #ScenarioDataStandards = "";
  #StandardName = "";
  #MajorVersion = "";
  #MinorVersion = "" ;
  #CoordinateSystemType = "";
  #CoordinateSystemDatum = "";
  element: Element;

  constructor(element: Element) {
    this.element = element;
    this.#MSDLVersion = getTagValue(element, "MSDLVersion");
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

  get OrganizationDetails(): string {
    return this.#OrganizationDetails ?? getTagValue(this.element, "OrganizationDetails");
  }

  set OrganizationDetails(OrganizationDetails: string) {
    this.#OrganizationDetails = OrganizationDetails;
    setOrCreateTagValue(this.element, "OrganizationDetails", OrganizationDetails);
  }

  get ScenarioDataStandards(): string {
    return this.#ScenarioDataStandards ?? getTagValue(this.element, "ScenarioDataStandards");
  }

  set ScenarioDataStandards(ScenarioDataStandards: string) {
    this.#ScenarioDataStandards = ScenarioDataStandards;
    setOrCreateTagValue(this.element, "MSDLVersion", ScenarioDataStandards);
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

  get MinorVersion (): string {
    return this.#MinorVersion  ?? getTagValue(this.element, "MinorVersion");
  }

  set MinorVersion (MinorVersion : string) {
    this.#MinorVersion = MinorVersion ;
    setOrCreateTagValue(this.element, "MinorVersion", MinorVersion );
  }

  get CoordinateSystemType (): string {
    return this.#CoordinateSystemType ?? getTagValue(this.element, "CoordinateSystemType");
  }

  set CoordinateSystemType (CoordinateSystemType : string) {
    this.#CoordinateSystemType  = CoordinateSystemType ;
    setOrCreateTagValue(this.element, "CoordinateSystemType", CoordinateSystemType );
  }

  get CoordinateSystemDatum (): string {
    return this.#CoordinateSystemDatum ?? getTagValue(this.element, "CoordinateSystemDatum");
  }

  set CoordinateSystemDatum (CoordinateSystemDatum : string) {
    this.#CoordinateSystemDatum  = CoordinateSystemDatum ;
    setOrCreateTagValue(this.element, "CoordinateSystemDatum", CoordinateSystemDatum );
  }

  toObject(): MsdlOptionsType {
      return removeUndefinedValues({
        MSDLVersion: this.MSDLVersion,
        OrganizationDetails: this.OrganizationDetails,
        ScenarioDataStandards: this.ScenarioDataStandards,
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
}