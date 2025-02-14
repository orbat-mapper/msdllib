import { getTagElement, getTagValue, setCharAt } from "./utils.js";
import type { Feature, Point } from "geojson";
import {
  type LngLatElevationTuple,
  type LngLatTuple,
  MsdlLocation,
} from "./geo.js";
import { ForceOwnerType, StandardIdentities } from "./enums.js";

export type TacticalJson = {
  sidc?: string;
  speed?: number;
  direction?: number;
};

export type UnitEquipmentInterface = {
  objectHandle: string;
  symbolIdentifier: string;
  name: string;
  location?: LngLatTuple | LngLatElevationTuple;
  /** The field speed in meters per second */
  speed?: number;
  /** The direction of movement, in compass degrees */
  directionOfMovement?: number;
  superiorHandle: string;
  sidc: string;
};

export class UnitEquipmentBase implements UnitEquipmentInterface {
  sidc: string;
  location?: LngLatTuple | LngLatElevationTuple;
  speed?: number;
  directionOfMovement?: number;
  symbolIdentifier: string;
  name: string;
  objectHandle: string;
  superiorHandle = "";
  symbolModifiers?: UnitSymbolModifiers;
  protected _msdlLocation?: MsdlLocation;

  constructor(readonly element: Element) {
    this.objectHandle = getTagValue(element, "ObjectHandle");
    this.symbolIdentifier = getTagValue(this.element, "SymbolIdentifier");
    this.name = getTagValue(element, "Name");
    this.getDisposition();
    this.sidc = setCharAt(
      this.symbolIdentifier,
      1,
      StandardIdentities.NoneSpecified,
    );
    const unitSymbolModifiersElement = getTagElement(
      this.element,
      "UnitSymbolModifiers",
    );
    if (unitSymbolModifiersElement) {
      this.symbolModifiers = new UnitSymbolModifiers(
        unitSymbolModifiersElement,
      );
    }
  }

  private getDisposition() {
    let dispositionElement = getTagElement(this.element, "Disposition");
    let speed = getTagValue(dispositionElement, "Speed");
    let directionOfMovement = getTagValue(
      dispositionElement,
      "DirectionOfMovement",
    );
    this.speed = speed ? +speed : undefined;
    this.directionOfMovement = directionOfMovement
      ? +directionOfMovement
      : undefined;
    this._msdlLocation = new MsdlLocation(dispositionElement);
    this.location = this._msdlLocation.location;
  }
}

export class Unit extends UnitEquipmentBase implements UnitEquipmentInterface {
  equipment: EquipmentItem[] = [];
  subordinates: Unit[] = [];
  private forceRelationChoice: ForceOwnerType | undefined;

  constructor(override readonly element: Element) {
    super(element);
    this.initializeRelations();
    this.initializeSymbol();
  }

  get isRoot(): boolean {
    return this.forceRelationChoice === ForceOwnerType.ForceSide;
  }

  get label(): string {
    return (
      this.name || this.symbolModifiers?.uniqueDesignation || this.objectHandle
    );
  }

  toGeoJson(): Feature<Point | null, TacticalJson> {
    let feature: Feature<Point | null, TacticalJson>;
    let properties: TacticalJson = {};

    if (this.speed) {
      properties.speed = this.speed;
    }
    if (this.directionOfMovement) {
      properties.direction = this.directionOfMovement;
    }
    properties.sidc = this.sidc;

    feature = {
      id: this.objectHandle,
      type: "Feature",
      geometry: this.location
        ? {
            type: "Point",
            coordinates: this.location,
          }
        : null,
      properties,
    };
    return feature;
  }

  setAffiliation(s: StandardIdentities) {
    this.sidc = setCharAt(this.sidc, 1, s);
    for (let equipment of this.equipment) {
      equipment.setAffiliation(s);
    }
  }

  private initializeRelations() {
    let forceRelationChoice = getTagValue(this.element, "ForceRelationChoice");

    if (forceRelationChoice === ForceOwnerType.Unit) {
      this.forceRelationChoice = ForceOwnerType.Unit;
      this.superiorHandle = getTagValue(
        this.element,
        "CommandingSuperiorHandle",
      );
    } else if (forceRelationChoice === ForceOwnerType.ForceSide) {
      this.forceRelationChoice = ForceOwnerType.ForceSide;
      this.superiorHandle = getTagValue(this.element, "ForceSideHandle");
    } else {
      console.error("Invalid ForceRelationChoice " + this.forceRelationChoice);
    }
    // Todo: Add support for support and organic relations
  }

  private initializeSymbol() {
    //
  }
}

export class EquipmentItem extends UnitEquipmentBase {
  constructor(override readonly element: Element) {
    super(element);
    // Todo: OrganicSuperiorHandle not necessarily set.
    this.superiorHandle = getTagValue(element, "OrganicSuperiorHandle");
  }

  toGeoJson(): Feature<Point | null, TacticalJson> {
    let feature: Feature<Point | null, TacticalJson>;
    let properties: TacticalJson = {};

    if (this.speed !== undefined) {
      properties.speed = this.speed;
    }
    if (this.directionOfMovement !== undefined) {
      properties.direction = this.directionOfMovement;
    }

    feature = {
      id: this.objectHandle,
      type: "Feature",
      geometry: this.location
        ? {
            type: "Point",
            coordinates: this.location,
          }
        : null,
      properties,
    };
    return feature;
  }

  public setAffiliation(s: string) {
    this.sidc = setCharAt(this.symbolIdentifier, 1, s);
  }
}

export class UnitSymbolModifiers {
  echelon?: string;
  reinforcedReduced?: string;
  staffComments?: string;
  additionalInfo?: string;
  combatEffectiveness?: string;
  higherFormation?: string;
  iff?: string;
  uniqueDesignation: string;
  specialC2HQ?: string;

  constructor(element: Element) {
    this.echelon = getTagValue(element, "Echelon");
    this.reinforcedReduced = getTagValue(element, "ReinforcedReduced");
    this.staffComments = getTagValue(element, "StaffComments");
    this.additionalInfo = getTagValue(element, "AdditionalInfo");
    this.combatEffectiveness = getTagValue(element, "CombatEffectiveness");
    this.higherFormation = getTagValue(element, "HigherFormation");
    this.iff = getTagValue(element, "IFF");
    this.uniqueDesignation = getTagValue(element, "UniqueDesignation") || "";
    this.specialC2HQ = getTagValue(element, "SpecialC2HQ");
  }
}
