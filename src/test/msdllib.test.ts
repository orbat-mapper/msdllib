import { describe, it, expect } from "vitest";
import { MilitaryScenario, ScenarioId } from "../index.js";
import { EMPTY_SCENARIO } from "./testdata.js";
import fs from "fs/promises";
import { loadTestScenario } from "./testutils.js";
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
    expect(scenario.rootElement).toBeInstanceOf(Element);
    expect(scenario.rootElement).toBe(element);
  });

  it("create from string", () => {
    let scenario = MilitaryScenario.createFromString(EMPTY_SCENARIO);
    expect(scenario).toBeInstanceOf(MilitaryScenario);
    expect(scenario.rootElement).toBeInstanceOf(Element);
    expect(scenario.unitCount).toBe(0);
    expect(scenario._equipment).toBeInstanceOf(Array);
    expect(scenario._equipment.length).toBe(0);
  });

  it("create empty scenario", () => {
    let scenario = new MilitaryScenario();
    expect(scenario.unitCount).toBe(0);
    expect(scenario._equipment).toBeInstanceOf(Array);
    expect(scenario._equipment.length).toBe(0);
    expect(scenario.forceSides).toBeInstanceOf(Array);
    expect(scenario.forceSides.length).toBe(0);
  });

  it("load from file", async () => {
    let data = await fs.readFile(__dirname + "/data/minimal.xml", {
      encoding: "utf-8",
    });

    let scenario = MilitaryScenario.createFromString(data.toString());
    expect(scenario.unitCount).toBe(0);
    expect(scenario._equipment).toBeInstanceOf(Array);
    expect(scenario._equipment.length).toBe(0);
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
    expect(scenario._equipment).toBeInstanceOf(Array);
    expect(scenario._equipment.length).toBe(1);
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
