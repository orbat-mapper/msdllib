import { getTagValue, setCharAt } from "./utils.js";
import type { Feature, Point } from "geojson";
import { ForceOwnerType, StandardIdentity } from "./enums.js";
import { EquipmentItem } from "./equipment.js";
import {
  type TacticalJson,
  UnitEquipmentBase,
  type UnitEquipmentInterface,
} from "./common.js";

export class Unit extends UnitEquipmentBase implements UnitEquipmentInterface {
  equipment: EquipmentItem[] = [];
  subordinates: Unit[] = [];
  superiorHandle = "";
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
    properties.label = this.label;

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

  override setAffiliation(s: StandardIdentity) {
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
