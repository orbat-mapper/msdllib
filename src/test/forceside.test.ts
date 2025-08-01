import { describe, expect, it } from "vitest";
import {
  ASSOCIATION_TEMPLATE,
  FORCESIDE_TEMPLATE_IS_FORCE,
  FORCESIDE_TEMPLATE_IS_SIDE,
  FORCESIDE_TEMPLATE_IS_SIDE2,
  parseFromString,
} from "./testdata.js";
import { ForceSide } from "../index.js";
import { loadTestScenario } from "./testutils.js";
import { HostilityStatusCode, StandardIdentity } from "../lib/enums.js";
import {
  getTagElement,
  getTagElements,
  getTagValue,
  getValueOrUndefined,
} from "../lib/domutils.js";
import { Association } from "../lib/forcesides.js";

describe("ForceSide class", () => {
  it("is defined", () => {
    expect(ForceSide).toBeDefined();
  });

  it("create from Element", () => {
    let element = parseFromString(FORCESIDE_TEMPLATE_IS_SIDE);
    let forceSide = new ForceSide(element);
    expect(forceSide).toBeInstanceOf(ForceSide);
  });

  it("read attributes", () => {
    let element = parseFromString(FORCESIDE_TEMPLATE_IS_SIDE);
    let forceSide = new ForceSide(element);
    expect(forceSide.objectHandle).toBe("e7ad0e8d-2dcd-11e2-be2b-000c294c9df8");
    expect(forceSide.allegianceHandle).toBe(
      "e7ad0e8d-2dcd-11e2-be2b-000c294c9df8",
    );
    expect(forceSide.name).toBe("Friendly");
    expect(forceSide.isSide).toBe(true);
    expect(forceSide.associations).toBeDefined();
    expect(forceSide.associations.length).toBe(2);
    expect(forceSide.associations[0]?.affiliateHandle).toBe(
      "e7ae4710-2dcd-11e2-be2b-000c294c9df8",
    );
    expect(forceSide.associations[0]?.relationship).toBe(
      HostilityStatusCode.Hostile,
    );
    expect(forceSide.associations[1]?.relationship).toBe(
      HostilityStatusCode.Friend,
    );
    expect(forceSide.forces).toBeInstanceOf(Array);
    expect(forceSide.forces.length).toBe(0);
  });

  it("detect side if allegiance with itself", () => {
    let element = parseFromString(FORCESIDE_TEMPLATE_IS_SIDE);
    let forceSide = new ForceSide(element);
    expect(forceSide.objectHandle).toBe("e7ad0e8d-2dcd-11e2-be2b-000c294c9df8");
    expect(forceSide.allegianceHandle).toBe(
      "e7ad0e8d-2dcd-11e2-be2b-000c294c9df8",
    );
    expect(forceSide.isSide).toBe(true);
  });

  it("detect side if no allegiance", () => {
    let element = parseFromString(FORCESIDE_TEMPLATE_IS_SIDE2);
    let forceSide = new ForceSide(element);
    expect(forceSide.allegianceHandle).toBeUndefined();
    expect(forceSide.isSide).toBe(true);
  });

  it("detect force", () => {
    let element = parseFromString(FORCESIDE_TEMPLATE_IS_FORCE);
    let forceSide = new ForceSide(element);
    expect(forceSide.allegianceHandle).toBe(
      "e7ad0e8d-2dcd-11e2-be2b-000c294c9df8",
    );
    expect(forceSide.isSide).toBe(false);
    expect(forceSide.militaryService).toBe("ARMY");
  });

  it("has GeoJSON interface", () => {
    let scenario = loadTestScenario();
    let forceSide = scenario.forceSides[0]!;
    expect(forceSide.name).toBe("Friendly");
    expect(forceSide.toGeoJson).toBeDefined();
    let gjson = forceSide.toGeoJson({ includeEquipment: false });
    expect(gjson.type).toBe("FeatureCollection");
    expect(gjson.features.length).toBe(2);
    let geojsonWithEmpty = forceSide.toGeoJson({
      includeEmptyLocations: true,
      includeEquipment: false,
    });
    expect(geojsonWithEmpty.features.length).toBe(3);
  });

  it("has GeoJSON interface with includeUnits", () => {
    let scenario = loadTestScenario();
    let forceSide = scenario.forceSides[0]!;
    expect(forceSide.name).toBe("Friendly");
    expect(forceSide.toGeoJson).toBeDefined();
    let gjson = forceSide.toGeoJson({
      includeEquipment: false,
      includeUnits: false,
    });
    expect(gjson.type).toBe("FeatureCollection");
    expect(gjson.features.length).toBe(0);
  });

  it("has a superiorHandle getter", () => {
    let element = parseFromString(FORCESIDE_TEMPLATE_IS_FORCE);
    let forceSide = new ForceSide(element);
    expect(forceSide.superiorHandle).toBe(
      "e7ad0e8d-2dcd-11e2-be2b-000c294c9df8",
    );
  });

  it("should return superiorHandle as undefined if isSide", () => {
    let element = parseFromString(FORCESIDE_TEMPLATE_IS_SIDE);
    let forceSide = new ForceSide(element);
    expect(forceSide.superiorHandle).toBeUndefined();
  });
});

describe("Side relations", () => {
  it("root units", () => {
    let scenario = loadTestScenario();
    expect(scenario.forceSides).toBeInstanceOf(Array);
    expect(scenario.forceSides.length).toBe(3);
    let forceSide = scenario.forceSides[0]!;
    expect(forceSide.name).toBe("Friendly");
    expect(forceSide.rootUnits.length).toBe(1);
    expect(forceSide.rootUnits[0]!.name).toBe("HQ");
  });
});

describe("Force and side relations", () => {
  it("should have the correct number of ForceSides and Side", () => {
    let scenario = loadTestScenario("/data/ForceSideMinimal.xml");
    expect(scenario.forceSides.length).toBe(6);
    expect(scenario.sides.length).toBe(3);
  });

  it("should have sides with forces", () => {
    let scenario = loadTestScenario("/data/ForceSideMinimal.xml");
    expect(scenario.sides.length).toBe(3);
    expect(scenario.sides[0]?.forces.length).toBe(1);
    expect(scenario.sides[1]?.forces.length).toBe(1);
    expect(scenario.sides[2]?.forces.length).toBe(1);

    const blueForce = scenario.sides[0]?.forces[0];
    expect(blueForce?.isSide).toBe(false);
    expect(blueForce?.name).toBe("Blue Force");

    const opforForce = scenario.sides[1]?.forces[0];
    expect(opforForce?.isSide).toBe(false);
    expect(opforForce?.name).toBe("OPFOR Force");

    const neutralForce = scenario.sides[2]?.forces[0];
    expect(neutralForce?.isSide).toBe(false);
    expect(neutralForce?.name).toBe("Neutral Force");
  });
});

describe("ForceSide methods", () => {
  describe("when using getAffiliation", () => {
    let scenario = loadTestScenario("/data/SimpleScenario.xml");
    const side = scenario.sides[0]!;
    it("should have a getAffiliation method", () => {
      expect(side.getAffiliation).toBeDefined();
    });

    // it("should return NoneSpecified if not set", () => {
    //   expect(side.getAffiliation()).toBe(StandardIdentities.NoneSpecified);
    // });
    it("should return the affiliation of the first unit", () => {
      side.rootUnits[0]?.setAffiliation(StandardIdentity.Hostile);
      expect(side.getAffiliation()).toBe(StandardIdentity.Hostile);
    });
  });

  describe("when using setAffiliation", () => {
    let scenario = loadTestScenario("/data/SimpleScenario.xml");
    const side = scenario.sides[0]!;
    it("should should have a setAffiliation method", () => {
      expect(side.setAffiliation).toBeDefined();
    });

    it("should set the affiliation of all units", () => {
      side.setAffiliation(StandardIdentity.Joker);
      for (let unit of side.getAllUnits()) {
        expect(unit.getAffiliation()).toBe(StandardIdentity.Joker);
      }
    });

    it("should set the affiliation of root equipment", () => {
      let scenario = loadTestScenario("/data/SimpleScenario.xml");
      const side = scenario.sides[1]!;
      expect(side.equipment.length).toBeGreaterThan(0);
      expect(side.equipment[0]!.getAffiliation()).toBe(
        StandardIdentity.NoneSpecified,
      );
      side.setAffiliation(StandardIdentity.Hostile);
      expect(side.equipment[0]!.getAffiliation()).toBe(
        StandardIdentity.Hostile,
      );
    });
  });

  describe("when using toGeoJson", () => {
    const scenario = loadTestScenario("/data/SimpleScenario.xml");
    const side = scenario.sides[0]!;
    it("should have a toGeoJson method", () => {
      expect(side.toGeoJson).toBeDefined();
    });
    it("should not return equipment by default", () => {
      expect(side.toGeoJson().features.length).toBe(2);
    });
    it("should return equipment if requested", () => {
      expect(side.toGeoJson({ includeEquipment: true }).features.length).toBe(
        3,
      );
    });
    it("should pass through idGeoJsonOptions", () => {
      expect(
        side.toGeoJson({ includeId: false }).features[0]!.id,
      ).toBeUndefined();
      expect(side.toGeoJson().features[0]!.properties.id).toBeUndefined();
      expect(
        side.toGeoJson({ includeIdInProperties: true }).features[0]!.properties
          .id,
      ).toBeDefined();
      expect(
        side.toGeoJson({
          includeUnits: false,
          includeEquipment: true,
          includeIdInProperties: true,
        }).features[0]!.properties.id,
      ).toBeDefined();
    });
  });

  describe("when writing forceside data", () => {
    it("should modify the name", () => {
      const forceSide = new ForceSide(
        parseFromString(FORCESIDE_TEMPLATE_IS_SIDE),
      );
      expect(forceSide.name).toBe("Friendly");
      forceSide.name = "New Name";
      expect(forceSide.name).toBe("New Name");
      expect(getTagValue(forceSide.element, "ForceSideName")).toBe("New Name");
    });

    it("should modify militaryService", () => {
      const forceSide = new ForceSide(
        parseFromString(FORCESIDE_TEMPLATE_IS_FORCE),
      );
      expect(forceSide.militaryService).toBe("ARMY");
      forceSide.militaryService = "NAVY";
      expect(forceSide.militaryService).toBe("NAVY");
      expect(getTagValue(forceSide.element, "MilitaryService")).toBe("NAVY");
    });

    it("should modify country code", () => {
      const forceSide = new ForceSide(
        parseFromString(FORCESIDE_TEMPLATE_IS_FORCE),
      );
      expect(forceSide.countryCode).toBe("USA");
      forceSide.countryCode = "CAN";
      expect(forceSide.countryCode).toBe("CAN");
      expect(getTagValue(forceSide.element, "CountryCode")).toBe("CAN");
    });

    it("should modify allegianceHandle", () => {
      const forceSide = new ForceSide(
        parseFromString(FORCESIDE_TEMPLATE_IS_SIDE),
      );
      expect(forceSide.allegianceHandle).toBe(
        "e7ad0e8d-2dcd-11e2-be2b-000c294c9df8",
      );
      forceSide.allegianceHandle = "new-allegiance-handle";
      expect(forceSide.allegianceHandle).toBe("new-allegiance-handle");
      expect(getTagValue(forceSide.element, "AllegianceHandle")).toBe(
        "new-allegiance-handle",
      );
    });

    it("should create allegianceHandle if not set", () => {
      const forceSide = new ForceSide(
        parseFromString(FORCESIDE_TEMPLATE_IS_SIDE2),
      );
      expect(forceSide.allegianceHandle).toBeUndefined();
      forceSide.allegianceHandle = "new-allegiance-handle";
      expect(forceSide.allegianceHandle).toBe("new-allegiance-handle");
      expect(getTagValue(forceSide.element, "AllegianceHandle")).toBe(
        "new-allegiance-handle",
      );
    });

    it("should delete allegianceHandle if set to null", () => {
      const forceSide = new ForceSide(
        parseFromString(FORCESIDE_TEMPLATE_IS_SIDE),
      );
      expect(forceSide.allegianceHandle).toBe(
        "e7ad0e8d-2dcd-11e2-be2b-000c294c9df8",
      );
      forceSide.allegianceHandle = null;
      expect(forceSide.allegianceHandle).toBeUndefined();
      expect(
        getValueOrUndefined(forceSide.element, "AllegianceHandle"),
      ).toBeUndefined();
    });
  });
});

describe("ForceSide serialization", () => {
  describe("toObject", () => {
    it("should serialize to an object", () => {
      const forceSide = new ForceSide(
        parseFromString(FORCESIDE_TEMPLATE_IS_FORCE),
      );
      const obj = forceSide.toObject();
      expect(obj).toBeDefined();
      expect(obj.name).toBe("Army");
      expect(obj.militaryService).toBe("ARMY");
      expect(obj.countryCode).toBe("USA");
    });
  });

  describe("updateFromObject", () => {
    it("should update from an object", () => {
      const forceSide = new ForceSide(
        parseFromString(FORCESIDE_TEMPLATE_IS_FORCE),
      );
      expect(forceSide.name).toBe("Army");
      expect(forceSide.militaryService).toBe("ARMY");
      expect(forceSide.countryCode).toBe("USA");

      forceSide.updateFromObject({
        name: "New Army",
        militaryService: undefined,
        countryCode: "CAN",
      });

      expect(forceSide.name).toBe("New Army");
      expect(forceSide.militaryService).toBeUndefined();
      expect(forceSide.countryCode).toBe("CAN");
    });
  });
});
describe("New ForceSide", () => {
  const side = ForceSide.create();
  it("should be created from scratch", () => {
    expect(side).toBeInstanceOf(ForceSide);
    expect(side.objectHandle).toBeTypeOf("string");
    expect(side.objectHandle.length).toBe(36);
  });
  it("should only have required element tags", () => {
    expect(side).toBeInstanceOf(ForceSide);
    expect(getTagElement(side.element, "ObjectHandle")).toBeDefined();
    expect(getTagElement(side.element, "Name")).toBeUndefined();
  });
});

describe("New ForceSide from model", () => {
  const side = ForceSide.fromModel({ name: "Force1", countryCode: "NLD" });
  it("should have correct fields", () => {
    expect(side).toBeInstanceOf(ForceSide);
    expect(side.name).toBe("Force1");
    expect(side.countryCode).toBe("NLD");
  });
  it("should only have required element tags", () => {
    expect(side).toBeInstanceOf(ForceSide);
    expect(getTagElement(side.element, "ObjectHandle")).toBeDefined();
    expect(getTagElement(side.element, "Name")).toBeUndefined();
  });
});

describe("Association class", () => {
  it("is defined", () => {
    expect(Association).toBeDefined();
  });

  it("can be created from Element", () => {
    let element = parseFromString(ASSOCIATION_TEMPLATE);
    let association = new Association(element);
    expect(association).toBeInstanceOf(Association);
    expect(association.affiliateHandle).toBe(
      "e7ae4710-2dcd-11e2-be2b-000c294c9df8",
    );
    expect(association.relationship).toBe(HostilityStatusCode.Hostile);
  });

  it("can be modified", () => {
    let element = parseFromString(ASSOCIATION_TEMPLATE);
    let association = new Association(element);
    association.affiliateHandle = "new-affiliate-handle";
    association.relationship = HostilityStatusCode.Friend;
    expect(association.affiliateHandle).toBe("new-affiliate-handle");
    expect(association.relationship).toBe(HostilityStatusCode.Friend);
    // test serialization
    const xml = association.toString();
    const newAssociation = new Association(parseFromString(xml));
    expect(newAssociation.affiliateHandle).toBe("new-affiliate-handle");
    expect(newAssociation.relationship).toBe(HostilityStatusCode.Friend);
  });

  it("can be serialized to an object", () => {
    let element = parseFromString(ASSOCIATION_TEMPLATE);
    let association = new Association(element);
    const obj = association.toObject();
    expect(obj).toBeDefined();
    expect(obj.affiliateHandle).toBe("e7ae4710-2dcd-11e2-be2b-000c294c9df8");
    expect(obj.relationship).toBe(HostilityStatusCode.Hostile);
  });

  it("can be created from model", () => {
    const association = Association.fromModel({
      affiliateHandle: "e7ae4710-2dcd-11e2-be2b-000c294c9df8",
      relationship: HostilityStatusCode.Hostile,
    });
    expect(association).toBeInstanceOf(Association);
    expect(association.affiliateHandle).toBe(
      "e7ae4710-2dcd-11e2-be2b-000c294c9df8",
    );
    expect(association.relationship).toBe(HostilityStatusCode.Hostile);
    // test serialization
    const xml = association.toString();
    expect(xml.includes("<Association>")).toBe(true);
    expect(
      xml.includes(
        "<AffiliateHandle>e7ae4710-2dcd-11e2-be2b-000c294c9df8</AffiliateHandle>",
      ),
    ).toBe(true);
    expect(xml.includes("<Relationship>HO</Relationship>")).toBe(true);
  });
});

describe("ForceSide associations", () => {
  it("should have associations", () => {
    const forceSide = new ForceSide(
      parseFromString(FORCESIDE_TEMPLATE_IS_SIDE),
    );
    expect(forceSide.associations).toBeDefined();
  });

  it("should have associations instance of Association", () => {
    const forceSide = new ForceSide(
      parseFromString(FORCESIDE_TEMPLATE_IS_SIDE),
    );
    expect(forceSide.associations[0]).toBeInstanceOf(Association);
    expect(forceSide.associations[1]).toBeInstanceOf(Association);
  });

  it("should be part of ForceSide.toObject()", () => {
    const forceSide = new ForceSide(
      parseFromString(FORCESIDE_TEMPLATE_IS_SIDE),
    );
    const obj = forceSide.toObject();
    expect(obj.associations).toBeDefined();
  });

  it("should be editable", () => {
    const forceSide = new ForceSide(
      parseFromString(FORCESIDE_TEMPLATE_IS_SIDE),
    );
    const originalCount = forceSide.associations.length;
    const newAssociation = Association.fromModel({
      affiliateHandle: "new-affiliate-handle",
      relationship: HostilityStatusCode.Friend,
    });
    newAssociation.affiliateHandle = "new-affiliate-handle";
    newAssociation.relationship = HostilityStatusCode.Friend;
    forceSide.associations = [...forceSide.associations, newAssociation];
    expect(forceSide.associations.length).toBe(originalCount + 1);
    expect(forceSide.associations[originalCount]).toBe(newAssociation);
    // check after serialization
    const newForceSide = new ForceSide(parseFromString(forceSide.toString()));
    expect(newForceSide.associations.length).toBe(originalCount + 1);
    const lastAssociation =
      newForceSide.associations[newForceSide.associations.length - 1];
    expect(lastAssociation?.affiliateHandle).toBe("new-affiliate-handle");
    expect(lastAssociation?.relationship).toBe(HostilityStatusCode.Friend);
  });

  it("should create the Associations element if not present", () => {
    const forceSide = ForceSide.create();
    expect(forceSide.associations.length).toBe(0);
    expect(forceSide.toString().includes("<Associations>")).toBe(false);
    forceSide.associations = [
      {
        affiliateHandle: "new-affiliate-handle",
        relationship: HostilityStatusCode.Friend,
      },
    ];
    expect(forceSide.associations.length).toBe(1);
    expect(forceSide.toString().includes("<Associations>")).toBe(true);
    const newForceSide = new ForceSide(parseFromString(forceSide.toString()));
    expect(newForceSide.associations.length).toBe(1);
    expect(newForceSide.associations[0]?.affiliateHandle).toBe(
      "new-affiliate-handle",
    );
    expect(newForceSide.associations[0]?.relationship).toBe(
      HostilityStatusCode.Friend,
    );
  });

  it("should have an addAssociation method", () => {
    const forceSide = new ForceSide(
      parseFromString(FORCESIDE_TEMPLATE_IS_SIDE),
    );
    expect(forceSide.addAssociation).toBeDefined();
    const originalCount = forceSide.associations.length;
    forceSide.addAssociation({
      affiliateHandle: "new-affiliate-handle",
      relationship: HostilityStatusCode.Friend,
    });
    expect(forceSide.associations.length).toBe(originalCount + 1);
    const lastAssociation =
      forceSide.associations[forceSide.associations.length - 1];
    expect(lastAssociation?.affiliateHandle).toBe("new-affiliate-handle");
    expect(lastAssociation?.relationship).toBe(HostilityStatusCode.Friend);
  });

  it("should have an updateAssociation method", () => {
    const forceSide = new ForceSide(
      parseFromString(FORCESIDE_TEMPLATE_IS_SIDE),
    );
    expect(forceSide.updateAssociation).toBeDefined();
    const originalCount = forceSide.associations.length;
    const associationToUpdate = forceSide.associations[0]!;
    forceSide.updateAssociation({
      affiliateHandle: associationToUpdate.affiliateHandle,
      relationship: HostilityStatusCode.Joker,
    });
    expect(forceSide.associations.length).toBe(originalCount);
    expect(forceSide.associations[0]?.relationship).toBe(
      HostilityStatusCode.Joker,
    );
  });

  it("should have a removeAssociation method", () => {
    const forceSide = new ForceSide(
      parseFromString(FORCESIDE_TEMPLATE_IS_SIDE),
    );
    const affiliateHandle = "e7ae4710-2dcd-11e2-be2b-000c294c9df8";
    expect(forceSide.removeAssociation).toBeDefined();
    expect(
      forceSide.associations.find((a) => a.affiliateHandle === affiliateHandle),
    ).toBeDefined();
    forceSide.removeAssociation(affiliateHandle);
    expect(
      forceSide.associations.find((a) => a.affiliateHandle === affiliateHandle),
    ).toBeUndefined();
    // check after serialization
    const newForceSide = new ForceSide(parseFromString(forceSide.toString()));
    expect(
      newForceSide.associations.find(
        (a) => a.affiliateHandle === affiliateHandle,
      ),
    ).toBeUndefined();
  });
});
