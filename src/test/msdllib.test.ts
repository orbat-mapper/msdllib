import { describe, it, expect } from "vitest";
import { ForceSide, MilitaryScenario, ScenarioId } from "../index.js";
import { EMPTY_SCENARIO } from "./testdata.js";
import fs from "fs/promises";
import {
  loadNetnTestScenario,
  loadNetnTestScenarioAsString,
  loadTestScenario,
  loadTestScenarioAsString,
} from "./testutils.js";
import { Unit } from "../lib/units.js";

describe("MilitaryScenario class", () => {
  it("is defined", () => {
    expect(MilitaryScenario).toBeDefined();
  });

  it("create from Element", () => {
    let parser = new DOMParser();
    let doc = parser.parseFromString(EMPTY_SCENARIO, "text/xml");
    let element = doc.documentElement;
    let scenario = new MilitaryScenario(element);
    expect(scenario.element).toBeInstanceOf(Element);
    expect(scenario.element).toBe(element);
  });

  it("create from string", () => {
    let scenario = MilitaryScenario.createFromString(EMPTY_SCENARIO);
    expect(scenario).toBeInstanceOf(MilitaryScenario);
    expect(scenario.element).toBeInstanceOf(Element);
    expect(scenario.unitCount).toBe(0);
    expect(scenario.equipment).toBeInstanceOf(Array);
    expect(scenario.equipment.length).toBe(0);
  });

  it("create empty scenario", () => {
    let scenario = new MilitaryScenario();
    expect(scenario.unitCount).toBe(0);
    expect(scenario.equipment).toBeInstanceOf(Array);
    expect(scenario.equipment.length).toBe(0);
    expect(scenario.forceSides).toBeInstanceOf(Array);
    expect(scenario.forceSides.length).toBe(0);
  });

  it("load from file", async () => {
    let data = await fs.readFile(__dirname + "/data/minimal.xml", {
      encoding: "utf-8",
    });

    let scenario = MilitaryScenario.createFromString(data.toString());
    expect(scenario.unitCount).toBe(0);
    expect(scenario.equipmentCount).toBe(0);
    expect(scenario.forceSides).toBeInstanceOf(Array);
    expect(scenario.forceSides.length).toBe(0);
    expect(scenario.scenarioId).toBeInstanceOf(ScenarioId);
    expect(scenario.scenarioId.name).toBe("Empty scenario");
  });
});

describe("Simple scenario", () => {
  it("load from file", () => {
    let scenario = loadTestScenario();
    expect(scenario.unitCount).toBe(6);
    expect(scenario.equipmentCount).toBe(2);
    expect(scenario.forceSides).toBeInstanceOf(Array);
    expect(scenario.forceSides.length).toBe(3);
    expect(scenario.scenarioId).toBeInstanceOf(ScenarioId);
    expect(scenario.scenarioId.name).toBe("Simple scenario");
  });

  it("default primary force side ", () => {
    let scenario = loadTestScenario();
    expect(scenario.primarySide).toBe(scenario.forceSides[0]);
    expect(scenario.forceSides[0]?.rootUnits[0]?.sidc[1]).toBe("F");
    expect(scenario.forceSides[1]?.rootUnits[0]?.sidc[1]).toBe("H");
  });

  it("set primary force side ", () => {
    let scenario = loadTestScenario();
    scenario.primarySide = scenario.forceSides[1]!;
    expect(scenario.forceSides[0]?.rootUnits[0]?.sidc[1]).toBe("H");
    expect(scenario.forceSides[1]?.rootUnits[0]?.sidc[1]).toBe("F");
  });

  it("has sides property", () => {
    let scenario = loadTestScenario();
    expect(scenario.sides).toBeInstanceOf(Array);
    expect(scenario.sides.length).toBe(2);
  });

  it("get unit by object handle", () => {
    let scenario = loadTestScenario();
    const unit_id = "7a81590c-febb-11e7-8be5-0ed5f89f718b";
    let unit = scenario.getUnitById(unit_id) as Unit;
    expect(unit).toBeDefined();
    expect(unit.objectHandle).toBe(unit_id);
    expect(unit.name).toBe("HQ");
    let unit2 = scenario.getUnitById("invalid object handle");
    expect(unit2).toBeUndefined();
  });
});

describe("MilitaryScenario.createFromString", () => {
  describe("when parsing invalid XML", () => {
    it("should throw an error", () => {
      expect(() => MilitaryScenario.createFromString("invalid xml")).toThrow();
    });
    it("should throw a TypeException", () => {
      expect(() => MilitaryScenario.createFromString("invalid xml")).toThrow(
        TypeError,
      );
    });
  });
  describe("when parsing XML that is not MSDL", () => {
    it("should throw an error", () => {
      expect(() =>
        MilitaryScenario.createFromString("<html></html>"),
      ).toThrow();
    });
    it("should throw a TypeException", () => {
      expect(() => MilitaryScenario.createFromString("<html></html>")).toThrow(
        TypeError,
      );
    });
  });
});

describe("MilitaryScenario methods", () => {
  let scenario = loadTestScenario();
  describe("when querying items by id", () => {
    it("should have a getUnitById method", () => {
      expect(scenario.getUnitById).toBeDefined();
    });

    it("getUnitById should return a Unit", () => {
      const unitId = "7a81590c-febb-11e7-8be5-0ed5f89f718b";
      let unit = scenario.getUnitById(unitId) as Unit;
      expect(unit).toBeDefined();
      expect(unit.objectHandle).toBe(unitId);
    });

    it("should have a getForceSideById method", () => {
      expect(scenario.getForceSideById).toBeDefined();
    });

    it("getForceSideById should return a ForceSide", () => {
      const forceSideId = "e7ad0e8d-2dcd-11e2-be2b-000c294c9df8";
      let forceSide = scenario.getForceSideById(forceSideId)!;
      expect(forceSide).toBeDefined();
      expect(forceSide.objectHandle).toBe(forceSideId);
    });

    it("should have a getUnitOrForceSideById method", () => {
      expect(scenario.getUnitOrForceSideById).toBeDefined();
    });

    it("getUnitOrForceSideById should return a Unit for unit ids", () => {
      const unitId = "7a81590c-febb-11e7-8be5-0ed5f89f718b";
      let unit = scenario.getUnitOrForceSideById(unitId)!;
      expect(unit).toBeDefined();
      expect(unit).toBeInstanceOf(Unit);
      expect(unit.objectHandle).toBe(unitId);
    });

    it("getUnitOrForceSideById should return a ForceSide for force side ids", () => {
      const forceSideId = "e7ad0e8d-2dcd-11e2-be2b-000c294c9df8";
      let forceSide = scenario.getUnitOrForceSideById(forceSideId)!;
      expect(forceSide).toBeDefined();
      expect(forceSide).toBeInstanceOf(ForceSide);
      expect(forceSide.objectHandle).toBe(forceSideId);
    });
  });
});

describe("MilitaryScenario equipment", () => {
  let scenario = loadTestScenario();
  describe("when querying equipment by id", () => {
    it("should have a getEquipmentById method", () => {
      expect(scenario.getEquipmentById).toBeDefined();
    });

    it("getEquipmentById should return an EquipmentItem", () => {
      const equipmentId = "f811c987-eb6a-11df-8ea2-001d099dde6d";
      let equipment = scenario.getEquipmentById(equipmentId);
      expect(equipment).toBeDefined();
      expect(equipment?.objectHandle).toBe(equipmentId);
      expect(equipment?.name).toBe("2nd SQD IFV/3/1/1/A");
    });
  });
  describe("when a side has assigned equipment", () => {
    it("should have a getEquipmentById method", () => {
      let forceSide = scenario.getForceSideById(
        "e7ae4710-2dcd-11e2-be2b-000c294c9df8",
      )!;
      expect(forceSide).toBeDefined();
      expect(forceSide.equipment).toBeDefined();
      expect(forceSide.equipment.length).toBe(1);
      expect(forceSide.equipment[0]?.relations).toBeDefined();
      expect(forceSide.equipment[0]?.relations.ownerChoice).toBe("FORCE_SIDE");
    });
  });
  describe("when a unit has assigned equipment", () => {
    it("should have a getEquipmentById method", () => {
      let unit = scenario.getUnitById("f9e16593-2dcd-11e2-be2b-000c294c9df8")!;
      expect(unit).toBeDefined();
      expect(unit.equipment).toBeDefined();
      expect(unit.equipment.length).toBe(1);
      expect(unit.equipment[0]?.relations).toBeDefined();
      expect(unit.equipment[0]?.relations.ownerChoice).toBe("UNIT");
    });
  });
});

describe("MilitaryScenario serialization", () => {
  let scenario = loadTestScenario();
  it("should should have a toString method", () => {
    expect(scenario.toString).toBeDefined();
  });
  it("should return a string", () => {
    let str = scenario.toString();
    expect(str).toBeDefined();
    expect(typeof str).toBe("string");
  });

  it("should return a valid XML string", () => {
    let str = scenario.toString();
    let parser = new DOMParser();
    let doc = parser.parseFromString(str, "text/xml");
    expect(doc.documentElement.nodeName).toBe("MilitaryScenario");
  });

  it("should create the same output as input if unmodified", () => {
    const str = scenario.toString();
    const originalScenario = loadTestScenarioAsString();
    expect(str.replace(/\s+/g, "")).toBe(originalScenario.replace(/\s+/g, ""));
  });
});

describe("MilitaryScenario with NETN", () => {
  it("should not detect NETN for plain MSDL scenarios", () => {
    let scenario = loadTestScenario();
    expect(scenario.isNETN).toBe(false);
  });

  it("should detect NETN for plain MSDL scenarios", () => {
    let scenario = loadNetnTestScenario();
    expect(scenario.isNETN).toBe(true);
  });

  it("should create the same output as input if unmodified", () => {
    let scenario = loadNetnTestScenario();
    const str = scenario.toString();
    const originalScenario = loadNetnTestScenarioAsString();
    expect(str.replace(/\s+/g, "")).toBe(originalScenario.replace(/\s+/g, ""));
  });
});
