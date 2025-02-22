import type { Feature, FeatureCollection, Point } from "geojson";
import { HostilityStatusCode, StandardIdentity } from "./enums.js";
import { Unit } from "./units.js";
import { getTagElements, getTagValue } from "./utils.js";
import type { TacticalJson } from "./common.js";

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

  toGeoJson({ includeEmptyLocations = false } = {}): FeatureCollection<
    Point | null,
    TacticalJson
  > {
    let features: Feature<Point | null, TacticalJson>[] = [];

    function addSubordinates(subordinates: Unit[]) {
      for (let unit of subordinates) {
        if (includeEmptyLocations || unit.location) {
          features.push(unit.toGeoJson());
        }
        if (unit.subordinates) {
          addSubordinates(unit.subordinates);
        }
      }
    }

    for (let rootUnit of this.rootUnits) {
      if (includeEmptyLocations || rootUnit.location) {
        features.push(rootUnit.toGeoJson());
      }
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
