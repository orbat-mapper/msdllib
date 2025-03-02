import { describe, it, expect } from "vitest";
import { parseFromString } from "./testdata.js";
import { ForceSide } from "../index.js";
import { loadTestScenario } from "./testutils.js";
import { HostilityStatusCode, StandardIdentity } from "../lib/enums.js";

const FORCESIDE_TEMPLATE_IS_SIDE = `<ForceSide>
    <ObjectHandle>e7ad0e8d-2dcd-11e2-be2b-000c294c9df8</ObjectHandle>
    <ForceSideName>Friendly</ForceSideName>
    <AllegianceHandle>e7ad0e8d-2dcd-11e2-be2b-000c294c9df8</AllegianceHandle>
    <Associations>
        <Association>
            <AffiliateHandle>e7ae4710-2dcd-11e2-be2b-000c294c9df8</AffiliateHandle>
            <Relationship>HO</Relationship>
        </Association>
        <Association>
            <AffiliateHandle>e7ae4710-2ccc-11e2-be2b-000c294c9df8</AffiliateHandle>
            <Relationship>FR</Relationship>
        </Association>
    </Associations>
</ForceSide>`;

const FORCESIDE_TEMPLATE_IS_SIDE2 = `<ForceSide>
    <ObjectHandle>e7ad0e8d-2dcd-11e2-be2b-000c294c9df8</ObjectHandle>
    <ForceSideName>Friendly</ForceSideName>
    <Associations>
        <Association>
            <AffiliateHandle>e7ae4710-2dcd-11e2-be2b-000c294c9df8</AffiliateHandle>
            <Relationship>HO</Relationship>
        </Association>
        <Association>
            <AffiliateHandle>e7ae4710-2ccc-11e2-be2b-000c294c9df8</AffiliateHandle>
            <Relationship>FR</Relationship>
        </Association>
    </Associations>
</ForceSide>`;

const FORCESIDE_TEMPLATE_IS_FORCE = `<ForceSide>
    <ObjectHandle>e7ae4710-2ccc-11e2-be2b-000c294c9df8</ObjectHandle>
    <ForceSideName>Army</ForceSideName>
    <AllegianceHandle>e7ad0e8d-2dcd-11e2-be2b-000c294c9df8</AllegianceHandle>
</ForceSide>`;

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
    expect(forceSide.allegianceHandle).toBe("");
    expect(forceSide.isSide).toBe(true);
  });

  it("detect force", () => {
    let element = parseFromString(FORCESIDE_TEMPLATE_IS_FORCE);
    let forceSide = new ForceSide(element);
    expect(forceSide.allegianceHandle).toBe(
      "e7ad0e8d-2dcd-11e2-be2b-000c294c9df8",
    );
    expect(forceSide.isSide).toBe(false);
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
  it("has correct number of ForceSides and Side", () => {
    let scenario = loadTestScenario("/data/ForceSideMinimal.xml");
    expect(scenario.forceSides.length).toBe(6);
    expect(scenario.sides.length).toBe(3);
  });

  it("the sides have forces", () => {
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
    });
  });
});
