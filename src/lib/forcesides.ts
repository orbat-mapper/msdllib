import type { Feature, FeatureCollection, Point } from "geojson";
import { HostilityStatusCode } from "./enums.js";
import { type TacticalJson, Unit } from "./unitequipment.js";
import { getTagElements, getTagValue } from "./utils.js";

export interface ForceSideType {
  objectHandle: string;
  name: string;
  allegianceHandle?: string;
  rootUnits: Unit[];
}

export interface AssociationType {
  affiliateHandle: string;
  relationship: HostilityStatusCode;
}

export class ForceSide implements ForceSideType {
  objectHandle: string;
  name: string;
  allegianceHandle: string;
  rootUnits: Unit[] = [];
  associations: AssociationType[] = [];
  forces: ForceSide[] = [];

  constructor(public element: Element) {
    this.name = getTagValue(element, "ForceSideName");
    this.objectHandle = getTagValue(element, "ObjectHandle");
    this.allegianceHandle = getTagValue(element, "AllegianceHandle");
    this.initAssociations();
  }

  get isSide(): boolean {
    return (
      !this.allegianceHandle || this.objectHandle === this.allegianceHandle
    );
  }

  toGeoJson(): FeatureCollection<Point | null, TacticalJson> {
    let features: Feature<Point | null, TacticalJson>[] = [];

    function addSubordinates(subordinates: Unit[]) {
      for (let unit of subordinates) {
        features.push(unit.toGeoJson());
        if (unit.subordinates) {
          addSubordinates(unit.subordinates);
        }
      }
    }

    for (let rootUnit of this.rootUnits) {
      features.push(rootUnit.toGeoJson());
      if (rootUnit.subordinates) {
        addSubordinates(rootUnit.subordinates);
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
}
