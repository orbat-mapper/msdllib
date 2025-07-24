import { beforeAll, describe, expect, it } from "vitest";
import {
  EnumCommandRelationshipType,
  EquipmentItem,
  ForceSide,
  MilitaryScenario,
  MsdlOptions,
  ScenarioId,
  MsdlOptions,
} from "../index.js";
import {
  EMPTY_SCENARIO,
  MSDL_OPTIONS_TYPE,
  SCENARIO_ID_TYPE,
  MSDL_OPTIONS_TYPE,
  UNIT_TEMPLATE,
} from "./testdata.js";
import fs from "fs/promises";
import {
  countXmlTagOccurrences,
  loadNetnTestScenario,
  loadNetnTestScenarioAsString,
  loadTestScenario,
  loadTestScenarioAsString,
} from "./testutils.js";
import { Unit } from "../lib/units.js";
import type { MilitaryScenarioInputType } from "../lib/militaryscenario.js";
import {
  createXMLElement,
  getTagElement,
  getTagValue,
} from "../lib/domutils.js";

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
    expect(scenario.msdlOptions).toBeInstanceOf(MsdlOptions);
    expect(scenario.msdlOptions.msdlVersion).toBe("MSDL Standard Nov 2008");
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
    expect(scenario.msdlOptions).toBeInstanceOf(MsdlOptions);
    expect(scenario.msdlOptions.msdlVersion).toBe("1.2.3-2025");
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

    it("should have a getUnitOrEquipmentById method", () => {
      expect(scenario.getUnitOrEquipmentById).toBeDefined();
    });

    it("getUnitOrEquipmentById should return a Unit for unit ids", () => {
      const unitId = "7a81590c-febb-11e7-8be5-0ed5f89f718b";
      let unit = scenario.getUnitOrEquipmentById(unitId)!;
      expect(unit).toBeDefined();
      expect(unit).toBeInstanceOf(Unit);
      expect(unit.objectHandle).toBe(unitId);
    });

    it("getUnitOrEquipmentById should return an Equipment for equipment ids", () => {
      const equipmentId = "f9ee8509-2dcd-11e2-be2b-000c294c9df8";
      let equipment = scenario.getUnitOrEquipmentById(equipmentId)!;
      expect(equipment).toBeDefined();
      expect(equipment).toBeInstanceOf(EquipmentItem);
      expect(equipment.objectHandle).toBe(equipmentId);
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

  describe("its deployment", () => {
    const unitHQ = "7a81590c-febb-11e7-8be5-0ed5f89f718b";
    const equipment111 = "f9ee8509-2dcd-11e2-be2b-000c294c9df8";
    const simB = "e3f1c2d4-5b6a-4c7d-8e9f-0a1b2c3d4e5f";
    const simC = "9b8c7d6e-5f4a-3b2c-1d0e-9f8e7d6c5b4a";
    let scenario: MilitaryScenario;
    beforeAll(() => {
      scenario = loadNetnTestScenario();
    });
    it("should list 3 federates", () => {
      expect(scenario.deployment?.federates).toHaveLength(3);
    });
    it("should have unit HQ at SIM B", () => {
      const federate = scenario.getFederateOfUnit(unitHQ);
      expect(federate).toBeDefined();
      expect(federate?.name).toBe("SIM B");
      const xml = federate?.toString();
      expect(xml?.includes(unitHQ)).toBeTruthy();
    });
    it("SIM B should have 2 units", () => {
      const federate = scenario.getFederateById(simB);
      expect(federate).toBeDefined();
      expect(federate?.units).toHaveLength(2);
      const xml = federate?.toString() || "";
      expect(countXmlTagOccurrences(xml, "Unit")).toBe(2);
    });
    it("SIM C should have 4 units", () => {
      const federate = scenario.getFederateById(simC);
      expect(federate).toBeDefined();
      expect(federate?.units).toHaveLength(4);
      const xml = federate?.toString() || "";
      expect(countXmlTagOccurrences(xml, "Unit")).toBe(4);
    });
    describe("when moving unit HQ to SIM C", () => {
      beforeAll(() => {
        scenario.assignUnitToFederate(unitHQ, simC);
      });
      it("SIM C should have unit HQ", () => {
        const federate = scenario.getFederateOfUnit(unitHQ);
        expect(federate).toBeDefined();
        expect(federate?.name).toBe("SIM C");
        const xml = federate?.toString();
        expect(xml?.includes(unitHQ)).toBeTruthy();
      });
      it("SIM B should not have unit HQ", () => {
        const federate = scenario.getFederateById(simB);
        expect(federate?.units).not.toContain(unitHQ);
        const xml = federate?.toString();
        expect(xml?.includes(unitHQ)).toBeFalsy();
      });
      it("SIM C should have 5 units", () => {
        const federate = scenario.getFederateById(simC);
        expect(federate).toBeDefined();
        expect(federate?.units).toHaveLength(5);
        const xml = federate?.toString() || "";
        expect(countXmlTagOccurrences(xml, "Unit")).toBe(5);
      });
      it("SIM B should have 1 unit", () => {
        const federate = scenario.getFederateById(simB);
        expect(federate).toBeDefined();
        expect(federate?.units).toHaveLength(1);
        const xml = federate?.toString() || "";
        expect(countXmlTagOccurrences(xml, "Unit")).toBe(1);
      });
    });
    describe("when moving all units to SIM C", () => {
      beforeAll(() => {
        scenario.assignAllUnitsToFederate(simB, simC);
      });
      it("SIM C should have unit HQ", () => {
        const federate = scenario.getFederateOfUnit(unitHQ);
        expect(federate).toBeDefined();
        expect(federate?.name).toBe("SIM C");
        const xml = federate?.toString();
        expect(xml?.includes(unitHQ)).toBeTruthy();
      });
      it("SIM B should not have unit HQ", () => {
        const federate = scenario.getFederateById(simB);
        expect(federate?.units).not.toContain(unitHQ);
        const xml = federate?.toString();
        expect(xml?.includes(unitHQ)).toBeFalsy();
      });
      it("SIM C should have 6 units", () => {
        const federate = scenario.getFederateById(simC);
        expect(federate).toBeDefined();
        expect(federate?.units).toHaveLength(6);
        const xml = federate?.toString() || "";
        expect(countXmlTagOccurrences(xml, "Unit")).toBe(6);
      });
      it("SIM B should have 0 units", () => {
        const federate = scenario.getFederateById(simB);
        expect(federate).toBeDefined();
        expect(federate?.units).toHaveLength(0);
        const xml = federate?.toString() || "";
        expect(countXmlTagOccurrences(xml, "Unit")).toBe(0);
      });
    });
    it("SIM C should have equipment 111 ", () => {
      const federate = scenario.getFederateOfEquipment(equipment111);
      expect(federate).toBeDefined();
      expect(federate?.name).toBe("SIM C");
      const xml = federate?.toString();
      expect(xml?.includes(equipment111)).toBeTruthy();
    });
    it("SIM C should have 2 equipment items", () => {
      const federate = scenario.getFederateById(simC);
      expect(federate).toBeDefined();
      expect(federate?.equipment).toHaveLength(2);
      const xml = federate?.toString() || "";
      expect(countXmlTagOccurrences(xml, "EquipmentItem")).toBe(2);
    });
    it("SIM B should have no equipment items", () => {
      const federate = scenario.getFederateById(simB);
      expect(federate).toBeDefined();
      expect(federate?.equipment).toHaveLength(0);
      const xml = federate?.toString() || "";
      expect(countXmlTagOccurrences(xml, "EquipmentItem")).toBe(0);
    });
    describe("when moving equipment 111 to SIM B", () => {
      beforeAll(() => {
        scenario.assignEquipmentItemToFederate(equipment111, simB);
      });
      it("SIM B should have equipment 111", () => {
        const federate = scenario.getFederateOfEquipment(equipment111);
        expect(federate).toBeDefined();
        expect(federate?.name).toBe("SIM B");
        const xml = federate?.toString();
        expect(xml?.includes(equipment111)).toBeTruthy();
      });
      it("SIM C should not have equipment 111", () => {
        const federate = scenario.getFederateById(simC);
        expect(federate?.equipment).not.toContain(equipment111);
        const xml = federate?.toString();
        expect(xml?.includes(equipment111)).toBeFalsy();
      });
      it("SIM B should have 1 equipment item", () => {
        const federate = scenario.getFederateById(simB);
        expect(federate).toBeDefined();
        expect(federate?.equipment).toHaveLength(1);
        const xml = federate?.toString() || "";
        expect(countXmlTagOccurrences(xml, "EquipmentItem")).toBe(1);
      });
      it("SIM C should have 1 equipment item", () => {
        const federate = scenario.getFederateById(simC);
        expect(federate).toBeDefined();
        expect(federate?.equipment).toHaveLength(1);
        const xml = federate?.toString() || "";
        expect(countXmlTagOccurrences(xml, "EquipmentItem")).toBe(1);
      });
    });
    describe("when moving all equipment from SIM C to SIM B", () => {
      beforeAll(() => {
        scenario.assignAllEquipmentToFederate(simC, simB);
      });
      it("SIM B should have equipment 111", () => {
        const federate = scenario.getFederateOfEquipment(equipment111);
        expect(federate).toBeDefined();
        expect(federate?.name).toBe("SIM B");
        const xml = federate?.toString();
        expect(xml?.includes(equipment111)).toBeTruthy();
      });
      it("SIM C should not have equipment 111", () => {
        const federate = scenario.getFederateById(simC);
        expect(federate?.equipment).not.toContain(equipment111);
        const xml = federate?.toString();
        expect(xml?.includes(equipment111)).toBeFalsy();
      });
      it("SIM B should have 2 equipment items", () => {
        const federate = scenario.getFederateById(simB);
        expect(federate).toBeDefined();
        expect(federate?.equipment).toHaveLength(2);
        const xml = federate?.toString() || "";
        expect(countXmlTagOccurrences(xml, "EquipmentItem")).toBe(2);
      });
      it("SIM C should have no equipment item", () => {
        const federate = scenario.getFederateById(simC);
        expect(federate).toBeDefined();
        expect(federate?.equipment).toHaveLength(0);
        const xml = federate?.toString() || "";
        expect(countXmlTagOccurrences(xml, "EquipmentItem")).toBe(0);
      });
    });
  });
});

describe("Create a MilitaryScenario", () => {
  const scenarioInput: MilitaryScenarioInputType = {
    isNETN: false,
    scenarioId: SCENARIO_ID_TYPE,
    msdlOptions: MSDL_OPTIONS_TYPE,
  };
  const scenarioInputNetn: MilitaryScenarioInputType = {
    isNETN: true,
    scenarioId: SCENARIO_ID_TYPE,
    msdlOptions: MSDL_OPTIONS_TYPE,
  };
  it("should create a plain MSDL scenario from input", () => {
    let scenario = MilitaryScenario.createFromModel(scenarioInput);
    expect(scenario.isNETN).toBe(false);
    expect(scenario.scenarioId.name).toBe(SCENARIO_ID_TYPE.name);
    expect(scenario.msdlOptions.msdlVersion).toBe(
      MSDL_OPTIONS_TYPE.msdlVersion,
    );
    expect(scenario.forceSides.length).toBe(0);
    expect(scenario.rootUnits.length).toBe(0);
    expect(scenario.equipment.length).toBe(0);
  });
  it("should create a NETN MSDL scenario from input", () => {
    let scenario = MilitaryScenario.createFromModel(scenarioInputNetn);
    expect(scenario.isNETN).toBe(true);
    expect(scenario.scenarioId.name).toBe(SCENARIO_ID_TYPE.name);
    expect(scenario.msdlOptions.msdlVersion).toBe(
      MSDL_OPTIONS_TYPE.msdlVersion,
    );
  });
  it("should throw an error on incomplete input", () => {
    expect(() =>
      MilitaryScenario.createFromModel({} as MilitaryScenarioInputType),
    ).toThrow(TypeError);
    expect(() =>
      MilitaryScenario.createFromModel({
        scenarioId: { modificationDate: "" },
        msdlOptions: {
          scenarioDataStandards: {
            symbologyDataStandard: { standardName: "Name" },
          },
        },
        isNETN: false,
      } as MilitaryScenarioInputType),
    ).toThrow(TypeError);
  });
  it("should output a minimal scenario file", () => {
    let scenario = MilitaryScenario.createFromModel(scenarioInputNetn);
    const xml = createXMLElement(scenario.toString());
    let scenarioId = getTagElement(xml, "ScenarioID");
    expect(scenarioId).toBeDefined();
    let msdlOptions = getTagElement(xml, "Options");
    expect(msdlOptions).toBeDefined();
    expect(getTagElement(scenarioId, "name")).toBeDefined();
    expect(getTagElement(msdlOptions, "MSDLVersion")).toBeDefined();
    expect(getTagElement(xml, "ForceSides")).toBeDefined();
  });
});

describe("MilitaryScenario.setForceRelation()", () => {
  describe("when changing unit superior to force side", () => {
    it("should set the unit superior and be a root unit", () => {
      const scenario = loadTestScenario();
      const unit = scenario.getUnitById(
        "f9e16593-2dcd-11e2-be2b-000c294c9df8",
      )!;
      const forceSide = scenario.getForceSideById(
        "e7ad0e8d-2dcd-11e2-be2b-000c294c9df8",
      )!;
      const originalUnitParent = scenario.getUnitById(unit.superiorHandle)!;
      expect(unit.superiorHandle).not.toBe(forceSide.objectHandle);
      scenario.setUnitForceRelation(unit, forceSide);
      expect(unit.superiorHandle).not.toBe(originalUnitParent.objectHandle);
      expect(unit.superiorHandle).toBe(forceSide.objectHandle);
      expect(unit.isRoot).toBe(true);

      // check internal state
      expect(originalUnitParent?.subordinates).not.toContain(unit);
      expect(forceSide.rootUnits).toContain(unit);
    });

    it("should work after serialization", () => {
      const scenario = loadTestScenario();
      const unit = scenario.getUnitById(
        "f9e16593-2dcd-11e2-be2b-000c294c9df8",
      )!;
      const forceSide = scenario.getForceSideById(
        "e7ad0e8d-2dcd-11e2-be2b-000c294c9df8",
      )!;
      const originalUnitParent = scenario.getUnitById(unit.superiorHandle)!;
      scenario.setUnitForceRelation(unit, forceSide);
      // check after serialization
      const str = scenario.toString();
      const newScenario = MilitaryScenario.createFromString(str);
      const newUnit = newScenario.getUnitById(
        "f9e16593-2dcd-11e2-be2b-000c294c9df8",
      )!;
      const newForceSide = newScenario.getForceSideById(
        "e7ad0e8d-2dcd-11e2-be2b-000c294c9df8",
      )!;
      const newOriginalUnitParent = newScenario.getUnitById(
        originalUnitParent.objectHandle,
      );
      scenario.setUnitForceRelation(unit, forceSide);

      expect(newUnit.superiorHandle).toBe(forceSide.objectHandle);
      expect(newUnit.isRoot).toBe(true);
      expect(newForceSide.rootUnits).toContain(newUnit);
      expect(newOriginalUnitParent?.subordinates).not.toContain(newUnit);
    });
  });

  describe("when changing unit superior to another unit", () => {
    it("should set the unit superior and be a subordinate", () => {
      const scenario = loadTestScenario();
      const unit = scenario.getUnitById(
        "f9e16593-2dcd-11e2-be2b-000c294c9df8",
      )!;
      const subordinate = scenario.getUnitById(
        "13a68150-febe-11e7-b297-fbee9593fdcc",
      )!;
      const originalUnitParent = scenario.getUnitById(unit.superiorHandle)!;
      expect(unit.superiorHandle).not.toBe(subordinate.objectHandle);
      scenario.setUnitForceRelation(unit, subordinate, {
        commandRelationshipType: EnumCommandRelationshipType.Adcon,
      });

      expect(unit.superiorHandle).not.toBe(originalUnitParent.objectHandle);
      expect(unit.superiorHandle).toBe(subordinate.objectHandle);
      expect(unit.commandRelationshipType).toBe(
        EnumCommandRelationshipType.Adcon,
      );
      expect(unit.isRoot).toBe(false);

      // check internal state
      expect(originalUnitParent?.subordinates).not.toContain(unit);
      expect(subordinate.subordinates).toContain(unit);
    });

    it("should work after serialization", () => {
      const scenario = loadTestScenario();
      const unit = scenario.getUnitById(
        "f9e16593-2dcd-11e2-be2b-000c294c9df8",
      )!;
      const subordinate = scenario.getUnitById(
        "13a68150-febe-11e7-b297-fbee9593fdcc",
      )!;
      const originalUnitParent = scenario.getUnitById(unit.superiorHandle)!;
      scenario.setUnitForceRelation(unit, subordinate, {
        commandRelationshipType: EnumCommandRelationshipType.Adcon,
      });

      // check after serialization
      const str = scenario.toString();
      const newScenario = MilitaryScenario.createFromString(str);
      const newUnit = newScenario.getUnitById(
        "f9e16593-2dcd-11e2-be2b-000c294c9df8",
      )!;
      const newSubordinate = newScenario.getUnitById(
        "13a68150-febe-11e7-b297-fbee9593fdcc",
      )!;
      const newOriginalUnitParent = newScenario.getUnitById(
        originalUnitParent.objectHandle,
      );
      expect(newUnit.superiorHandle).toBe(subordinate.objectHandle);
      expect(newUnit.commandRelationshipType).toBe(
        EnumCommandRelationshipType.Adcon,
      );
      expect(newUnit.isRoot).toBe(false);
      expect(newSubordinate.subordinates).toContain(newUnit);
      expect(newOriginalUnitParent?.subordinates).not.toContain(newUnit);
    });
  });
});

describe("Add/remove Unit", () => {
  let scenario: MilitaryScenario = loadTestScenario();
  let newUnit: Unit = Unit.create();
  newUnit.updateFromObject({ name: "New Unit" });
  let newEquipm: EquipmentItem = EquipmentItem.create();
  newEquipm.updateFromObject({ name: "New EQI" });
  let initialUnitCount: number = scenario.unitCount;

  describe("adding a unit", () => {
    beforeAll(() => {
      scenario.addUnit(newUnit);
    });
    it("should increase the unit count by 1", () => {
      expect(scenario.unitCount).toBe(initialUnitCount + 1);
    });
    it("should make the unit retrievable by ID", () => {
      expect(scenario.getUnitById(newUnit.objectHandle)).toBeDefined();
    });
    it("should add the unit to the primary ForceSide", () => {
      const forceSide = scenario.getForceSideById(
        scenario.primarySide?.objectHandle || "",
      );
      const unitInForceSide = forceSide
        ?.getAllUnits()
        .find((u) => u.objectHandle === newUnit.objectHandle);
      expect(unitInForceSide).toBeDefined();
    });
    it("should be in the generated MSDL xml file", () => {
      let xml = scenario.toString();
      expect(xml.includes(newUnit.objectHandle)).toBeTruthy();
    });
    describe("then adding an equipment item to the unit", () => {
      beforeAll(() => {
        scenario.addEquipmentItem(newEquipm, newUnit.objectHandle);
      });
      it("should add the equipment to the unit", () => {
        expect(newUnit.equipment.includes(newEquipm)).toBe(true);
      });
      describe("then removing the unit", () => {
        beforeAll(() => {
          scenario.removeUnit(newUnit.objectHandle);
        });
        it("should restore the original unit count", () => {
          expect(scenario.unitCount).toBe(initialUnitCount);
        });
        it("should make the unit no longer retrievable by ID", () => {
          expect(scenario.getUnitById(newUnit.objectHandle)).toBeUndefined();
        });
        it("should remove the unit from the ForceSide", () => {
          const forceSide = scenario.getForceSideById(
            scenario.primarySide?.objectHandle || "",
          );
          const unitInForceSide = forceSide
            ?.getAllUnits()
            .find((u) => u.objectHandle === newUnit.objectHandle);
          expect(unitInForceSide).toBeUndefined();
        });
        it("should remove the added equipment item", () => {
          expect(
            scenario.getEquipmentById(newEquipm.objectHandle),
          ).toBeUndefined();
        });
        it("unit & equipment should not be in the MSDL xml file", () => {
          let xml = scenario.toString();
          expect(xml.includes(newUnit.objectHandle)).toBeFalsy();
          expect(xml.includes(newEquipm.objectHandle)).toBeFalsy();
        });
      });
    });
  });
});

describe("Add/remove Equipment", () => {
  let scenario: MilitaryScenario = loadTestScenario();
  let newEquipm: EquipmentItem = EquipmentItem.create();
  newEquipm.updateFromObject({ name: "New EQI" });
  let initialEquipmentCount: number = scenario.equipmentCount;

  describe("adding an equipmentitem", () => {
    beforeAll(() => {
      scenario.addEquipmentItem(newEquipm);
    });
    it("should increase the equipmentitem count by 1", () => {
      expect(scenario.equipmentCount).toBe(initialEquipmentCount + 1);
    });
    it("should make the equipmentitem retrievable by ID", () => {
      expect(scenario.getEquipmentById(newEquipm.objectHandle)).toBeDefined();
    });
    it("should add the equipmentitem to the primary ForceSide", () => {
      const forceSide = scenario.getForceSideById(
        scenario.primarySide?.objectHandle || "",
      );
      const equipmentitemInForceSide = forceSide
        ?.getEquipmentItems()
        .find((u) => u.objectHandle === newEquipm.objectHandle);
      expect(equipmentitemInForceSide).toBeDefined();
      let relElm = getTagElement(newEquipm.element, "Relations");
      expect(relElm).toBeDefined();
      let holdingElm = getTagElement(relElm, "HoldingOrganization");
      expect(holdingElm).toBeDefined();
      expect(getTagValue(holdingElm, "OwnerChoice")).toBe("FORCE_SIDE");
    });
    it("should be in the generated MSDL xml file", () => {
      let xml = scenario.toString();
      expect(xml.includes(newEquipm.objectHandle)).toBeTruthy();
    });
    describe("then removing it", () => {
      beforeAll(() => {
        scenario.removeEquipmentItem(newEquipm.objectHandle);
      });
      it("should restore the original equipment count", () => {
        expect(scenario.equipmentCount).toBe(initialEquipmentCount);
      });
      it("should make it no longer retrievable by ID", () => {
        expect(
          scenario.getEquipmentById(newEquipm.objectHandle),
        ).toBeUndefined();
      });
      it("should remove it from the ForceSide", () => {
        const forceSide = scenario.getForceSideById(
          scenario.primarySide?.objectHandle || "",
        );
        expect(forceSide).toBeDefined();
        const equipmentitemInForceSide = forceSide!
          .getEquipmentItems()
          .find((u) => u.objectHandle === newEquipm.objectHandle);
        expect(equipmentitemInForceSide).toBeUndefined();
      });
      it("should not be in the generated MSDL xml file", () => {
        let xml = scenario.toString();
        expect(xml.includes(newEquipm.objectHandle)).toBeFalsy();
      });
    });
  });
});

describe("Add/remove ForceSide", () => {
  let scenario: MilitaryScenario = loadTestScenario();
  let newForceSide: ForceSide = ForceSide.create();
  newForceSide.updateFromObject({ name: "New ForceSide" });
  let initialSideCount: number = scenario.forceSideCount;
  let newUnit: Unit = Unit.create();

  describe("adding a ForceSide", () => {
    beforeAll(() => {
      scenario.addForceSide(newForceSide);
    });
    it("should increase the side count by 1", () => {
      expect(scenario.forceSideCount).toBe(initialSideCount + 1);
    });
    it("should make the side retrievable by ID", () => {
      expect(
        scenario.getForceSideById(newForceSide.objectHandle),
      ).toBeDefined();
    });
    it("should be in the generated MSDL xml file", () => {
      let xml = scenario.toString();
      expect(xml.includes(newForceSide.objectHandle)).toBeTruthy();
    });
    describe("then adding a unit to that side", () => {
      beforeAll(() => {
        scenario.addUnit(newUnit);
        scenario.setUnitForceRelation(newUnit, newForceSide, {
          commandRelationshipType: "ATTACHED",
        });
      });
      it("should add it to the side's root units", () => {
        expect(newForceSide.rootUnits.includes(newUnit)).toBe(true);
      });
    });
    describe("then removing the side", () => {
      beforeAll(() => {
        scenario.removeForceSide(newForceSide.objectHandle);
      });
      it("should restore the original side count", () => {
        expect(scenario.forceSideCount).toBe(initialSideCount);
      });
      it("should make the side no longer retrievable by ID", () => {
        expect(
          scenario.getForceSideById(newForceSide.objectHandle),
        ).toBeUndefined();
      });
      it("should remove the added unit as well", () => {
        expect(scenario.getUnitById(newUnit.objectHandle)).toBeUndefined();
      });
      it("should not be in the generated MSDL xml file", () => {
        let xml = scenario.toString();
        expect(xml.includes(newForceSide.objectHandle)).toBeFalsy();
      });
    });
  });

  describe("removing all ForceSides", () => {
    beforeAll(() => {
      for (const side of scenario.forceSides) {
        scenario.removeForceSide(side.objectHandle);
      }
    });
    it("should remove all sides from the scenario", () => {
      expect(scenario.forceSideCount).toBe(0);
      expect(scenario.forceSides.length).toBe(0);
    });
  });
});

describe("MilitaryScenario.getItemHierarchy", () => {
  it("should return a hierarchy of equipment, units and forcesides", () => {
    let scenario = loadTestScenario();
    let { hierarchy, forceSide } = scenario.getItemHierarchy(
      "f9ee8509-2dcd-11e2-be2b-000c294c9df8",
    );
    expect(hierarchy).toBeDefined();
    expect(hierarchy.length).toBe(2);
    expect(hierarchy[0]).toBeInstanceOf(Unit);
    expect(hierarchy[1]).toBeInstanceOf(Unit);
    const rootUnit = hierarchy[0] as Unit;
    expect(rootUnit.label).toBe("HQ");
    const parentUnit = hierarchy[1] as Unit;
    expect(parentUnit.label).toBe("1th");
    expect(forceSide).toBeInstanceOf(Array);
    expect(forceSide.length).toBe(1);
    const side = forceSide[0]!;
    expect(side).toBeInstanceOf(ForceSide);
    expect(side.name).toBe("Friendly");
  });

  it("should include itself if the includeItem option is true", () => {
    let scenario = loadTestScenario();
    let { hierarchy, forceSide } = scenario.getItemHierarchy(
      "f9ee8509-2dcd-11e2-be2b-000c294c9df8",
      { includeItem: true },
    );
    expect(hierarchy).toBeDefined();
    expect(hierarchy.length).toBe(3);
    expect(hierarchy[0]).toBeInstanceOf(Unit);
    expect(hierarchy[1]).toBeInstanceOf(Unit);
    expect(hierarchy[2]).toBeInstanceOf(EquipmentItem);
    const equipment = hierarchy[2] as EquipmentItem;
    expect(equipment.label).toBe("111");
  });

  it("should accept a Unit, EquipmentItem and ForceSide as input", () => {
    let scenario = loadTestScenario();
    const unit = scenario.getUnitById("7a81590c-febb-11e7-8be5-0ed5f89f718b")!;
    expect(unit.label).toBe("HQ");
    let { hierarchy, forceSide } = scenario.getItemHierarchy(unit, {
      includeItem: true,
    });

    expect(hierarchy).toBeDefined();
    expect(hierarchy.length).toBe(1);
    const equipment = scenario.getEquipmentById(
      "f9ee8509-2dcd-11e2-be2b-000c294c9df8",
    )!;
    expect(equipment.label).toBe("111");
    const res = scenario.getItemHierarchy(equipment, { includeItem: true });
    expect(res.hierarchy.length).toBe(3);
    const fs = scenario.getForceSideById(
      "e7aebc43-2dcd-11e2-be2b-000c294c9df8",
    )!;
    expect(fs.name).toBe("Army");
    const res2 = scenario.getItemHierarchy(fs, { includeItem: true });
    expect(res2.hierarchy.length).toBe(0);
    expect(res2.forceSide.length).toBe(2);
  });

  it("should return side and force if available", () => {
    const scenario = loadTestScenario();
    const rootUnit = scenario.getUnitById(
      "7a815ba0-febb-11e7-8be5-0ed5f89f718b",
    )!;
    expect(rootUnit?.label).toBe("HQ2");
    const { hierarchy, forceSide } = scenario.getItemHierarchy(rootUnit);
    expect(hierarchy.length).toBe(0);
    expect(forceSide).toBeInstanceOf(Array);
    expect(forceSide.length).toBe(2);
    expect(forceSide[0]?.name).toBe("Hostile");
    expect(forceSide[1]?.name).toBe("Army");
    expect(forceSide[0]?.isSide).toBe(true);
    expect(forceSide[1]?.isSide).toBe(false);
  });
});
