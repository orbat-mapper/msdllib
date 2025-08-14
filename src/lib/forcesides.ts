import type { Feature, FeatureCollection, Point } from "geojson";
import {
  HostilityStatusCode,
  type MilitaryService,
  StandardIdentity,
} from "./enums.js";
import { Unit } from "./units.js";
import {
  createEmptyXMLElementFromTagName,
  getTagElement,
  getTagElements,
  getTagValue,
  getValueOrUndefined,
  removeTagValues,
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
  subordinates: Unit[];
  equipment: EquipmentItem[];
  associations?: AssociationType[];
}

export type ForceSideTypeUpdate = Omit<
  ForceSideType,
  "allegianceHandle" | "subordinates" | "equipment"
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
  subordinates: Unit[] = [];
  #associations: Association[] = [];
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

  get associations(): Association[] {
    return this.#associations;
  }

  set associations(associations: (Association | AssociationType)[]) {
    this.#associations = [];
    let associationsEl = getTagElement(this.element, "Associations");
    if (!associationsEl) {
      associationsEl = createEmptyXMLElementFromTagName("Associations");
      this.element.appendChild(associationsEl);
    }
    removeTagValues(associationsEl, Association.TAG_NAME);

    for (const association of associations) {
      let associationInstance: Association;
      if (association instanceof Association) {
        associationInstance = association;
      } else {
        associationInstance = Association.fromModel(association);
      }
      this.#associations.push(associationInstance);
      associationsEl.appendChild(associationInstance.element);
    }
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

  /** @deprecated Use `subordinates` directly instead. */
  get rootUnits(): Unit[] {
    return this.subordinates;
  }

  /** @deprecated Use `subordinates` directly instead. */
  set rootUnits(units: Unit[]) {
    this.subordinates = units;
  }
  setAffiliation(s: StandardIdentity) {
    function helper(unit: Unit) {
      unit.setAffiliation(s);
      for (let subordinate of unit.subordinates) {
        helper(subordinate);
      }
    }
    for (let rootUnit of this.subordinates) {
      helper(rootUnit);
    }

    for (let equipmentItem of this.equipment) {
      equipmentItem.setAffiliation(s);
    }
  }

  getAffiliation(): StandardIdentity {
    const firstUnitOrEquipment = this.subordinates[0] ?? this.equipment[0];
    if (!firstUnitOrEquipment) {
      return StandardIdentity.NoneSpecified;
    }
    return firstUnitOrEquipment.getAffiliation();
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
    for (let rootUnit of this.subordinates) {
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

    for (let rootUnit of this.subordinates) {
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
    const associationsEl = getTagElement(this.element, "Associations");
    for (let e of getTagElements(associationsEl, Association.TAG_NAME)) {
      this.#associations.push(new Association(e));
    }
  }

  addAssociation(association: Association | AssociationType): void {
    this.associations = [...this.#associations, association];
  }

  updateAssociation({ affiliateHandle, relationship }: AssociationType): void {
    const existingAssociation = this.#associations.find(
      (a) => a.affiliateHandle === affiliateHandle,
    );
    if (existingAssociation) {
      existingAssociation.relationship = relationship;
    } else {
      this.addAssociation({ affiliateHandle, relationship });
    }
  }

  removeAssociation(affiliateHandle: string): void {
    this.associations = this.#associations.filter(
      (a) => a.affiliateHandle !== affiliateHandle,
    );
  }

  toObject(): ForceSideTypeUpdate {
    return removeUndefinedValues({
      objectHandle: this.objectHandle,
      name: this.name,
      militaryService: this.militaryService,
      countryCode: this.countryCode,
      associations: this.associations.map((a) => a.toObject()),
    });
  }

  toString() {
    if (!this.element) return "";
    const oSerializer = new XMLSerializer();
    return oSerializer.serializeToString(this.element);
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
