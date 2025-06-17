import { describe, expect, it } from "vitest";
import {
  FORCESIDE_TEMPLATE_IS_SIDE,
  parseFromString,
  UNIT_ATTACHED,
  UNIT_MGRS,
  UNIT_NO_DISPOSITION,
  UNIT_ROOT_UNIT,
} from "./testdata.js";
import { Unit } from "../lib/units.js";
import { loadTestScenario } from "./testutils.js";
import {
  EnumCommandRelationshipType,
  ForceOwnerType,
  StandardIdentity,
} from "../lib/enums.js";
import { getTagValue } from "../lib/domutils.js";
import { ForceSide } from "../lib/forcesides.js";

describe("MSDL Unit", () => {
  it("should be defined", () => {
    expect(Unit).toBeDefined();
  });

  it("should be created from Element", () => {
    let element = parseFromString(UNIT_ATTACHED);
    let unit = new Unit(element);
    expect(unit).toBeInstanceOf(Unit);
  });

  it("should be able to read unit data", () => {
    let element = parseFromString(UNIT_ATTACHED);
    let unit = new Unit(element);
    expect(unit.objectHandle).toBe("f9e16593-2dcd-11e2-be2b-000c294c9df8");
    expect(unit.name).toBe("1/OPFOR-ARMOR");
    expect(unit.symbolIdentifier).toBe("S-G-----------G");
    expect(unit.location).toBeDefined();
    if (unit.location) {
      expect(unit.location.length).toBe(3);
      expect(unit.location[1]).toBe(58.54383);
      expect(unit.location[0]).toBe(15.038887);
      expect(unit.location[2]).toBe(141.03737);
    }
    expect(unit.speed).toBe(4);
    expect(unit.directionOfMovement).toBe(175.37999);
    expect(unit.isRoot).toBe(false);
    expect(unit.superiorHandle).toBe("f9c2b9f6-2dcd-11e2-be2b-000c294c9df8");
  });

  it("should have a disposition", () => {
    let element = parseFromString(UNIT_ATTACHED);
    let unit = new Unit(element);

    expect(unit.disposition).toBeDefined();
    if (unit.disposition && unit.disposition.location) {
      expect(unit.disposition.location.length).toBe(3);
      expect(unit.disposition.location[1]).toBe(58.54383);
      expect(unit.disposition.location[0]).toBe(15.038887);
      expect(unit.disposition.location[2]).toBe(141.03737);

      expect(unit.disposition.speed).toBe(4);
      expect(unit.disposition.directionOfMovement).toBe(175.37999);
    }
    if (unit.location) {
      expect(unit.location.length).toBe(3);
      expect(unit.location[1]).toBe(58.54383);
      expect(unit.location[0]).toBe(15.038887);
      expect(unit.location[2]).toBe(141.03737);
    }
    expect(unit.speed).toBe(4);
    expect(unit.directionOfMovement).toBe(175.37999);
  });

  it("should be able to create a GeoJson representation", () => {
    let element = parseFromString(UNIT_ATTACHED);
    let unit = new Unit(element);
    let gjson = unit.toGeoJson();
    expect(gjson.id).toBe("f9e16593-2dcd-11e2-be2b-000c294c9df8");
    expect(gjson.type).toBe("Feature");
    const geometry = gjson.geometry!;
    expect(geometry.type).toBe("Point");
    expect(geometry.coordinates[1]).toBe(58.54383);
    expect(geometry.coordinates[0]).toBe(15.038887);
    expect(geometry.coordinates[2]).toBe(141.03737);
    expect(gjson.properties.speed).toBe(4);
    expect(gjson.properties.direction).toBe(175.37999);
    expect(gjson.properties.sidc).toBe("SOG-----------G");
  });

  it("should handle a unit with no disposition", () => {
    let element = parseFromString(UNIT_NO_DISPOSITION);
    let unit = new Unit(element);
    expect(unit.location).toBeUndefined();
    expect(unit.speed).toBeUndefined();
    expect(unit.directionOfMovement).toBeUndefined();
    let gjson = unit.toGeoJson();
    expect(gjson.geometry).toBeNull();
    expect(gjson.properties.speed).toBeUndefined();
    expect(gjson.properties.direction).toBeUndefined();
  });
});

describe("Unit relations", () => {
  it("subordinates", () => {
    let scenario = loadTestScenario();
    expect(scenario.rootUnits.length).toBe(2);
    let hq = scenario.rootUnits[0]!;
    expect(hq.name).toBe("HQ");
    expect(hq.subordinates.length).toBe(2);
    expect(hq.subordinates[0]?.name).toBe("1th");
    expect(hq.subordinates[1]?.name).toBe("2nd");
  });

  describe("when parsing ForceRelation", () => {
    it("should be able read UNIT relation", () => {
      let unit = new Unit(parseFromString(UNIT_ATTACHED));
      expect(unit.superiorHandle).toBe("f9c2b9f6-2dcd-11e2-be2b-000c294c9df8");
      expect(unit.forceRelationChoice).toBe(ForceOwnerType.Unit);
      expect(unit.commandRelationshipType).toBe(
        EnumCommandRelationshipType.Attached,
      );
    });
    it("it should be able to read FORCE_SIDE relation", () => {
      let unit = new Unit(parseFromString(UNIT_ROOT_UNIT));
      expect(unit.superiorHandle).toBe("fbde006d-ffff-aaaa-cccc-892e67650eb9");
      expect(unit.forceRelationChoice).toBe(ForceOwnerType.ForceSide);
      expect(unit.commandRelationshipType).toBeUndefined();
    });
  });

  describe("when modifying ForceRelation", () => {
    it("should be able to set UNIT relation with setForceRelation", () => {
      let rootUnit = new Unit(parseFromString(UNIT_ROOT_UNIT));
      let unit = new Unit(parseFromString(UNIT_ATTACHED));
      expect(unit.setForceRelation).toBeDefined();
      unit.setForceRelation(rootUnit, EnumCommandRelationshipType.Tacon);
      expect(unit.superiorHandle).toBe(rootUnit.objectHandle);
      expect(unit.forceRelationChoice).toBe(ForceOwnerType.Unit);
      expect(unit.commandRelationshipType).toBe(
        EnumCommandRelationshipType.Tacon,
      );
      let serializedUnitString = unit.toString();
      let unitCopy = new Unit(parseFromString(serializedUnitString));
      expect(unitCopy.superiorHandle).toBe(rootUnit.objectHandle);
      expect(unitCopy.forceRelationChoice).toBe(ForceOwnerType.Unit);
      expect(unitCopy.commandRelationshipType).toBe(
        EnumCommandRelationshipType.Tacon,
      );
    });

    it("should be able to set FORCE_SIDE relation", () => {
      let forceSide = new ForceSide(
        parseFromString(FORCESIDE_TEMPLATE_IS_SIDE),
      );
      let unit = new Unit(parseFromString(UNIT_ATTACHED));
      unit.setForceRelation(forceSide);
      expect(unit.superiorHandle).toBe(forceSide.objectHandle);
      expect(unit.forceRelationChoice).toBe(ForceOwnerType.ForceSide);
      expect(unit.commandRelationshipType).toBeUndefined();
      let unitCopy = new Unit(parseFromString(unit.toString()));
      expect(unitCopy.superiorHandle).toBe(forceSide.objectHandle);
      expect(unitCopy.forceRelationChoice).toBe(ForceOwnerType.ForceSide);
      expect(unitCopy.commandRelationshipType).toBeUndefined();
    });
  });
});

describe("Unit class", () => {
  describe("when parsing a unit element with UnitSymbolModifiers", () => {
    const unit = new Unit(parseFromString(UNIT_MGRS));
    it("should have an objectHandle", () => {
      expect(unit.objectHandle).toBe("8747aebb-6b76-45d2-8bab-b78450453649");
    });
    it("should have a SymbolIdentifier", () => {
      expect(unit.symbolIdentifier).toBe("S-G-UH-----E---");
    });
    it("should have a UnitSymbolModifiers element", () => {
      expect(unit.symbolModifiers).toBeDefined();
    });
    it("should have a UniqueDesignation", () => {
      expect(unit.symbolModifiers?.uniqueDesignation).toBe("BN HQs-HHC");
    });
    it("should use uniqueDesignation as label if name is not set", () => {
      expect(unit.name).toBe("");
      expect(unit.symbolModifiers?.uniqueDesignation).toBe("BN HQs-HHC");
      expect(unit.label).toBe("BN HQs-HHC");
    });
  });

  describe("when manipulating unit affiliation", () => {
    it("should be NoneSpecified by default", () => {
      const unit = new Unit(parseFromString(UNIT_MGRS));
      expect(unit.getAffiliation()).toBe(StandardIdentity.NoneSpecified);
    });
  });

  describe("when calling toGeoJson", () => {
    const unit = new Unit(parseFromString(UNIT_ATTACHED));
    it("should be defined", () => {
      expect(unit.toGeoJson).toBeDefined();
    });
    it("should by default include the id", () => {
      expect(unit.toGeoJson().id).toBe("f9e16593-2dcd-11e2-be2b-000c294c9df8");
    });
    it("should by default not include the id in properties", () => {
      expect(unit.toGeoJson().properties.id).toBeUndefined();
    });
    it("should include the id in properties if requested", () => {
      expect(
        unit.toGeoJson({ includeIdInProperties: true }).properties.id,
      ).toBe("f9e16593-2dcd-11e2-be2b-000c294c9df8");
    });
    it("should not include the id if requested", () => {
      expect(unit.toGeoJson({ includeId: false }).id).toBeUndefined();
    });
  });

  describe("when calling toString", () => {
    const unit = new Unit(parseFromString(UNIT_ATTACHED));
    it("should be defined", () => {
      expect(unit.toString).toBeDefined();
    });
    it("should return a string", () => {
      expect(unit.toString()).toBeDefined();
      expect(typeof unit.toString()).toBe("string");
    });
    it("should return a valid XML string", () => {
      let str = unit.toString();
      let parser = new DOMParser();
      let doc = parser.parseFromString(str, "text/xml");
      expect(doc.documentElement.nodeName).toBe("Unit");
    });
    it("should match the original XML string if unmodified", () => {
      let str = unit.toString();
      let parser = new DOMParser();
      let doc = parser.parseFromString(str, "text/xml");
      expect(doc.documentElement).toEqual(unit.element);
      expect(unit.toString()).toBe(UNIT_ATTACHED.trim());
    });
  });

  describe("when writing a unit name", () => {
    it("should set the name", () => {
      const unit = new Unit(parseFromString(UNIT_ATTACHED));
      unit.name = "New Name";
      expect(unit.name).toBe("New Name");
    });
    it("should set the name in the XML element", () => {
      const unit = new Unit(parseFromString(UNIT_ATTACHED));
      expect(getTagValue(unit.element, "Name")).toBe("1/OPFOR-ARMOR");
      unit.name = "New Name";
      expect(unit.element.querySelector("Name")?.textContent).toBe("New Name");
    });
  });
});
