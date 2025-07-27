import type { Feature, FeatureCollection, Point } from "geojson";
import {
  HostilityStatusCode,
  type MilitaryService,
  StandardIdentity,
} from "./enums.js";
import { Unit } from "./units.js";
import {
  createEmptyXMLElementFromTagName,
  getTagElements,
  getTagValue,
  getValueOrUndefined,
  removeUndefinedValues,
  setOrCreateTagValue,
} from "./domutils.js";
import type { IdGeoJsonOptions, TacticalJson } from "./common.js";
import type { EquipmentItem } from "./equipment.js";
import { v4 as uuidv4 } from "uuid";

export interface ForceSideType {
  objectHandle: string;
  name: string;
  allegianceHandle?: string;
  militaryService?: MilitaryService;
  countryCode?: string;
  rootUnits: Unit[];
  equipment: EquipmentItem[];
}

export type ForceSideTypeUpdate = Omit<
  ForceSideType,
  "allegianceHandle" | "rootUnits" | "equipment"
>;

export type ForceSideTypeInput = Omit<ForceSideTypeUpdate, "objectHandle">;

export interface AssociationType {
  affiliateHandle: string;
  relationship: HostilityStatusCode;
}

type SideGeoJsonOptions = {
  includeEmptyLocations?: boolean;
  includeEquipment?: boolean;
  includeUnits?: boolean;
};

export class ForceSide implements ForceSideType {
  static readonly TAG_NAME = "ForceSide";
  #objectHandle: string;
  #name: string;
  #militaryService?: MilitaryService;
  #countryCode?: string;
  #allegianceHandle?: string;
  rootUnits: Unit[] = [];
  associations: AssociationType[] = [];
  forces: ForceSide[] = [];
  equipment: EquipmentItem[] = [];
  element: Element;

  constructor(element: Element) {
    this.element = element;
    this.#name = getTagValue(element, "ForceSideName");
    this.#militaryService = getValueOrUndefined(
      element,
      "MilitaryService",
    ) as MilitaryService;
    this.#countryCode = getValueOrUndefined(element, "CountryCode");
    this.#objectHandle = getTagValue(element, "ObjectHandle");
    this.#allegianceHandle = getValueOrUndefined(element, "AllegianceHandle");
    this.initAssociations();
  }

  get objectHandle(): string {
    return this.#objectHandle ?? getTagValue(this.element, "ObjectHandle");
  }

  set objectHandle(objectHandle: string) {
    this.#objectHandle = objectHandle;
    setOrCreateTagValue(this.element, "ObjectHandle", objectHandle);
  }

  get allegianceHandle(): string | undefined {
    return (
      this.#allegianceHandle ??
      getValueOrUndefined(this.element, "AllegianceHandle")
    );
  }

  set allegianceHandle(allegianceHandle: string | null | undefined) {
    this.#allegianceHandle = allegianceHandle ?? undefined;
    setOrCreateTagValue(this.element, "AllegianceHandle", allegianceHandle);
  }

  get isSide(): boolean {
    return (
      !this.allegianceHandle || this.objectHandle === this.allegianceHandle
    );
  }

  get name(): string {
    return this.#name ?? getTagValue(this.element, "ForceSideName");
  }

  set name(name: string) {
    this.#name = name;
    setOrCreateTagValue(this.element, "ForceSideName", name);
  }

  get militaryService(): MilitaryService | undefined {
    return (
      this.#militaryService ??
      (getValueOrUndefined(this.element, "MilitaryService") as MilitaryService)
    );
  }

  set militaryService(militaryService: MilitaryService | null) {
    this.#militaryService =
      militaryService !== null ? militaryService : undefined;
    setOrCreateTagValue(this.element, "MilitaryService", militaryService);
  }

  get countryCode(): string | undefined {
    return (
      this.#countryCode ?? getValueOrUndefined(this.element, "CountryCode")
    );
  }

  set countryCode(countryCode: string | null) {
    this.#countryCode = countryCode ?? undefined;
    setOrCreateTagValue(this.element, "CountryCode", countryCode);
  }

  get superiorHandle() {
    if (!this.isSide) {
      return this.allegianceHandle;
    }
  }

  setAffiliation(s: StandardIdentity) {
    function helper(unit: Unit) {
      unit.setAffiliation(s);
      for (let subordinate of unit.subordinates) {
        helper(subordinate);
      }
    }
    for (let rootUnit of this.rootUnits) {
      helper(rootUnit);
    }
  }

  getAffiliation(): StandardIdentity {
    const firstUnit = this.rootUnits[0];
    if (!firstUnit) {
      return StandardIdentity.NoneSpecified;
    }
    return firstUnit.getAffiliation();
  }

  getEquipmentItems(): EquipmentItem[] {
    return this.equipment;
  }

  getAllUnits(): Unit[] {
    let units: Unit[] = [];
    function addSubordinates(subordinates: Unit[]) {
      for (let unit of subordinates) {
        units.push(unit);
        if (unit.subordinates) {
          addSubordinates(unit.subordinates);
        }
      }
    }
    for (let rootUnit of this.rootUnits) {
      units.push(rootUnit);
      if (rootUnit.subordinates) {
        addSubordinates(rootUnit.subordinates);
      }
    }
    return units;
  }

  toGeoJson(
    options: SideGeoJsonOptions & IdGeoJsonOptions = {},
  ): FeatureCollection<Point | null, TacticalJson> {
    const {
      includeEmptyLocations = false,
      includeEquipment = false,
      includeUnits = true,
    } = options;
    let features: Feature<Point | null, TacticalJson>[] = [];

    function addSubordinates(subordinates: Unit[]) {
      for (let unit of subordinates) {
        if (includeUnits && (includeEmptyLocations || unit.location)) {
          features.push(unit.toGeoJson(options));
        }
        if (includeEquipment) {
          for (let equipment of unit.equipment) {
            if (includeEmptyLocations || equipment.location) {
              features.push(equipment.toGeoJson(options));
            }
          }
        }
        if (unit.subordinates) {
          addSubordinates(unit.subordinates);
        }
      }
    }

    for (let rootUnit of this.rootUnits) {
      if (includeUnits && (includeEmptyLocations || rootUnit.location)) {
        features.push(rootUnit.toGeoJson(options));
      }
      if (includeEquipment) {
        for (let equipment of rootUnit.equipment) {
          if (includeEmptyLocations || equipment.location) {
            features.push(equipment.toGeoJson(options));
          }
        }
      }
      if (rootUnit.subordinates) {
        addSubordinates(rootUnit.subordinates);
      }
    }

    if (includeEquipment) {
      for (let equipment of this.equipment) {
        if (includeEmptyLocations || equipment.location) {
          features.push(equipment.toGeoJson(options));
        }
      }
    }
    return { type: "FeatureCollection", features };
  }

  private initAssociations() {
    for (let e of getTagElements(this.element, "Association")) {
      let association = {
        affiliateHandle: getTagValue(e, "AffiliateHandle"),
        relationship: getTagValue(e, "Relationship") as HostilityStatusCode,
      };
      this.associations.push(association);
    }
  }

  toObject(): ForceSideTypeUpdate {
    return removeUndefinedValues({
      objectHandle: this.objectHandle,
      name: this.name,
      militaryService: this.militaryService,
      countryCode: this.countryCode,
    });
  }

  updateFromObject(data: Partial<ForceSideTypeUpdate>): void {
    Object.entries(data).forEach(([key, value]) => {
      if (key in this) {
        (this as any)[key] = value;
      } else {
        console.warn(`Property ${key} does not exist.`);
      }
    });
  }

  static fromModel(model: ForceSideTypeInput): ForceSide {
    const forceSide = ForceSide.create();
    forceSide.updateFromObject(model);
    return forceSide;
  }

  static create(): ForceSide {
    const side: ForceSide = new ForceSide(
      createEmptyXMLElementFromTagName(ForceSide.TAG_NAME),
    );
    side.objectHandle = uuidv4();
    return side;
  }
}

export class Association implements AssociationType {
  static readonly TAG_NAME = "Association";
  element: Element;
  #affiliateHandle: string;
  #relationship: HostilityStatusCode;

  constructor(element: Element) {
    this.element = element;
    this.#affiliateHandle = getTagValue(element, "AffiliateHandle");
    this.#relationship = getTagValue(
      element,
      "Relationship",
    ) as HostilityStatusCode;
  }

  get affiliateHandle(): string {
    return (
      this.#affiliateHandle ?? getTagValue(this.element, "AffiliateHandle")
    );
  }

  set affiliateHandle(affiliateHandle: string) {
    this.#affiliateHandle = affiliateHandle;
    setOrCreateTagValue(this.element, "AffiliateHandle", affiliateHandle);
  }

  get relationship(): HostilityStatusCode {
    return (
      this.#relationship ??
      (getTagValue(this.element, "Relationship") as HostilityStatusCode)
    );
  }
  set relationship(relationship: HostilityStatusCode) {
    this.#relationship = relationship;
    setOrCreateTagValue(this.element, "Relationship", relationship);
  }

  toString() {
    if (!this.element) return "";
    const oSerializer = new XMLSerializer();
    return oSerializer.serializeToString(this.element);
  }

  updateFromObject(data: Partial<AssociationType>): void {
    Object.entries(data).forEach(([key, value]) => {
      if (key in this) {
        (this as any)[key] = value;
      } else {
        console.warn(`Property ${key} does not exist.`);
      }
    });
  }

  toObject(): AssociationType {
    return removeUndefinedValues({
      affiliateHandle: this.affiliateHandle,
      relationship: this.relationship,
    });
  }

  static fromModel(model: AssociationType): Association {
    const association = Association.create();
    association.updateFromObject(model);
    return association;
  }

  static create(): Association {
    const association = new Association(
      createEmptyXMLElementFromTagName(Association.TAG_NAME),
    );
    association.affiliateHandle = uuidv4();
    return association;
  }
}
