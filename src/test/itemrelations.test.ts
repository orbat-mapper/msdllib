/**
 * Test cases for MilitaryScenario.setItemRelation and getItemRelation methods
 */

import { describe, expect, it } from "vitest";
import { ForceSide, MilitaryScenario, Unit } from "../index.js";
import {
  getEquipmentByLabel,
  getForceSideByName,
  getUnitByLabel,
  loadTestScenario,
  loadTestScenario2,
} from "./testutils.js";

describe("MilitaryScenario.setItemRelation when source is EquipmentItem", () => {
  it("should be able to change the owner of an EquipmentItem to another unit", () => {
    let scenario = loadTestScenario2();
    const source = getEquipmentByLabel(scenario, "111");
    expect(source.superiorHandle).toBe("f9e16593-2dcd-11e2-be2b-000c294c9df8");
    const originalSuperior = scenario.getUnitById(source.superiorHandle)!;
    const target = getUnitByLabel(scenario, "2nd");
    expect(target.label).toBe("2nd");
    scenario.setItemRelation({ source, target });
    expect(source.superiorHandle).toBe(target.objectHandle);
    expect(target.equipment).toContain(source);
    expect(originalSuperior.equipment).not.toContain(source);

    const source2 = scenario.getEquipmentById(
      "f811c987-eb6a-11df-8ea2-001d099dde6d",
    )!;
    expect(source2.label).toBe("2nd SQD IFV/3/1/1/A");
    expect(source2.superiorHandle).not.toBe(target.objectHandle);
    scenario.setItemRelation({ source: source2, target });
    expect(source2.superiorHandle).toBe(target.objectHandle);
    expect(target.equipment).toContain(source2);
    expect(target.equipment.length).toBe(2);
    expect(target.equipment.indexOf(source2)).toBe(1);
  });

  it("should be able to change the owner of an EquipmentItem to a ForceSide", () => {
    let scenario = loadTestScenario2();
    const source = scenario.getEquipmentById(
      "f9ee8509-2dcd-11e2-be2b-000c294c9df8",
    )!;
    expect(source.label).toBe("111");
    expect(source.superiorHandle).toBe("f9e16593-2dcd-11e2-be2b-000c294c9df8");
    const targetId = "e7ad0e8d-2dcd-11e2-be2b-000c294c9df8"; // "Friendly"
    const target = scenario.getForceSideById(targetId)!;
    const originalSuperior = scenario.getUnitById(source.superiorHandle)!;
    expect(target.name).toBe("Friendly");
    scenario.setItemRelation({ source, target });
    expect(source.superiorHandle).toBe(target.objectHandle);
    expect(target.equipment).toContain(source);
    expect(originalSuperior.equipment).not.toContain(source);
  });

  it("should use the instruction 'make-child' as default", () => {
    let scenario = loadTestScenario2();
    const targetId = "f9e16593-2dcd-11e2-be2b-000c294c9df8"; // "1th"
    const target = scenario.getUnitById(targetId)!;
    expect(target.label).toBe("1th");
    const source = scenario.getEquipmentById(
      "f811c987-eb6a-11df-8ea2-001d099dde6d",
    )!;
    expect(source.label).toBe("2nd SQD IFV/3/1/1/A");
    scenario.setItemRelation({ source, target });
    expect(source.superiorHandle).toBe(target.objectHandle);
    expect(target.equipment).toContain(source);

    expect(target.equipment.length).toBe(4);
    expect(target.equipment.indexOf(source)).toBe(target.equipment.length - 1);
  });

  it("should support the 'reorder-above' instruction", () => {
    let scenario = loadTestScenario2();
    const targetId = "f9ee8509-2dcd-11e2-be2b-000c294c2222";
    const target = scenario.getEquipmentById(targetId)!;
    expect(target.label).toBe("112");
    const targetSuperior = scenario.getUnitById(target.superiorHandle)!;
    expect(targetSuperior.label).toBe("1th");
    const source = scenario.getEquipmentById(
      "f811c987-eb6a-11df-8ea2-001d099dde6d",
    )!;
    expect(source.label).toBe("2nd SQD IFV/3/1/1/A");
    scenario.setItemRelation({ source, target, instruction: "reorder-above" });
    expect(source.superiorHandle).toBe(target.superiorHandle);
    expect(targetSuperior.equipment).toContain(source);
    expect(targetSuperior.equipment.length).toBe(4);
    expect(targetSuperior.equipment.indexOf(source)).toBe(1);
    // check after serialization
    const newScenario = MilitaryScenario.createFromString(scenario.toString());
    const newSource = newScenario.getEquipmentById(source.objectHandle)!;
    const newTarget = newScenario.getEquipmentById(targetId)!;
    const newTargetSuperior = newScenario.getItemParent(newTarget);
    expect(newSource.superiorHandle).toBe(newTarget.superiorHandle);
    expect(newTargetSuperior?.equipment).toContain(newSource);
    expect(newTargetSuperior?.equipment.length).toBe(4);
    expect(newTargetSuperior?.equipment.indexOf(newSource)).toBe(1);
  });

  it("should support the 'reorder-below' instruction", () => {
    let scenario = loadTestScenario2();
    const targetId = "f9ee8509-2dcd-11e2-be2b-000c294c2222"; // "1th"
    const target = scenario.getEquipmentById(targetId)!;
    expect(target.label).toBe("112");
    const targetSuperior = scenario.getUnitById(target.superiorHandle)!;
    expect(targetSuperior.label).toBe("1th");
    const source = scenario.getEquipmentById(
      "f811c987-eb6a-11df-8ea2-001d099dde6d",
    )!;
    expect(source.label).toBe("2nd SQD IFV/3/1/1/A");
    scenario.setItemRelation({ source, target, instruction: "reorder-below" });
    expect(source.superiorHandle).toBe(target.superiorHandle);
    expect(targetSuperior.equipment).toContain(source);
    expect(targetSuperior.equipment.length).toBe(4);
    expect(targetSuperior.equipment.indexOf(source)).toBe(2);
    // check after serialization
    const newScenario = MilitaryScenario.createFromString(scenario.toString());
    const newSource = newScenario.getEquipmentById(source.objectHandle)!;
    const newTarget = newScenario.getEquipmentById(targetId)!;
    const newTargetSuperior = newScenario.getItemParent(newTarget);
    expect(newSource.superiorHandle).toBe(newTarget.superiorHandle);
    expect(newTargetSuperior?.equipment).toContain(newSource);
    expect(newTargetSuperior?.equipment.length).toBe(4);
    expect(newTargetSuperior?.equipment.indexOf(newSource)).toBe(2);
  });
});

describe("MilitaryScenario.setItemRelation when source is Unit", () => {
  it("should be able to change the superior of a Unit to another Unit", () => {
    const scenario = loadTestScenario2();
    const source = getUnitByLabel(scenario, "HQ2");
    const originalSuperior = scenario.getItemParent(source) as ForceSide;
    expect(originalSuperior).toBeInstanceOf(ForceSide);
    const target = getUnitByLabel(scenario, "HQ");
    scenario.setItemRelation({ source, target, instruction: "make-child" });
    expect(source.superiorHandle).toBe(target.objectHandle);
    expect(originalSuperior.rootUnits).not.toContain(source);
    expect(target.subordinates).toContain(source);
    expect(target.subordinates.length).toBe(4);
    expect(target.subordinates.indexOf(source)).toBe(3);
    // check after serialization
    const newScenario = MilitaryScenario.createFromString(scenario.toString());
    const newSource = getUnitByLabel(newScenario, "HQ2");
    const newTarget = getUnitByLabel(newScenario, "HQ");

    expect(newSource.superiorHandle).toBe(newTarget.objectHandle);
    expect(newTarget.subordinates).toContain(newSource);
    expect(newTarget.subordinates.length).toBe(4);
    expect(newTarget.subordinates.indexOf(newSource)).toBe(3);
  });

  it("should use the instruction 'make-child' as default", () => {
    const scenario = loadTestScenario2();
    const source = getUnitByLabel(scenario, "HQ2");
    const originalSuperior = scenario.getItemParent(source) as ForceSide;
    expect(originalSuperior).toBeInstanceOf(ForceSide);
    const target = getUnitByLabel(scenario, "HQ");
    scenario.setItemRelation({ source, target });
    expect(source.superiorHandle).toBe(target.objectHandle);
    expect(originalSuperior.rootUnits).not.toContain(source);
    expect(target.subordinates).toContain(source);
    expect(target.subordinates.length).toBe(4);
    expect(target.subordinates.indexOf(source)).toBe(3);
    // check after serialization
    const newScenario = MilitaryScenario.createFromString(scenario.toString());
    const newSource = getUnitByLabel(newScenario, "HQ2");
    const newTarget = getUnitByLabel(newScenario, "HQ");

    expect(newSource.superiorHandle).toBe(newTarget.objectHandle);
    expect(newTarget.subordinates).toContain(newSource);
    expect(newTarget.subordinates.length).toBe(4);
    expect(newTarget.subordinates.indexOf(newSource)).toBe(3);
  });

  it("should become a root unit when target is a ForceSide", () => {
    const scenario = loadTestScenario2();
    const source = getUnitByLabel(scenario, "1th");
    const target = getForceSideByName(scenario, "Friendly");
    const originalSuperior = scenario.getItemParent(source)! as Unit;
    expect(originalSuperior).toBeInstanceOf(Unit);
    expect(source.isRoot).toBe(false);
    scenario.setItemRelation({ source, target });
    expect(source.superiorHandle).toBe(target.objectHandle);
    expect(source.isRoot).toBe(true);
    expect(originalSuperior.subordinates).not.toContain(source);
    expect(target.rootUnits).toContain(source);
    expect(target.rootUnits.length).toBe(2);
    expect(target.rootUnits.indexOf(source)).toBe(1);

    // check after serialization
    const newScenario = MilitaryScenario.createFromString(scenario.toString());
    const newSource = getUnitByLabel(newScenario, "1th");
    const newTarget = getForceSideByName(newScenario, "Friendly");
    expect(newSource.superiorHandle).toBe(newTarget.objectHandle);
    expect(newTarget.rootUnits).toContain(newSource);
    expect(newTarget.rootUnits.length).toBe(2);
    expect(newTarget.rootUnits.indexOf(newSource)).toBe(1);
  });

  it("should support the 'reorder-above' instruction when target is a unit and sibling", () => {
    const scenario = loadTestScenario2();
    const target = getUnitByLabel(scenario, "2nd");
    const targetSuperior = scenario.getItemParent(target)! as Unit;
    const source = getUnitByLabel(scenario, "3th");
    expect(targetSuperior).toBeInstanceOf(Unit);
    scenario.setItemRelation({ source, target, instruction: "reorder-above" });
    expect(source.superiorHandle).toBe(target.superiorHandle);
    expect(targetSuperior.subordinates).toContain(source);
    expect(targetSuperior.subordinates.length).toBe(3);
    expect(targetSuperior.subordinates.indexOf(source)).toBe(1);

    // check after serialization
    const newScenario = MilitaryScenario.createFromString(scenario.toString());
    const newSource = getUnitByLabel(newScenario, "3th");
    const newTarget = getUnitByLabel(newScenario, "2nd");
    const newTargetSuperior = newScenario.getItemParent(newTarget)! as Unit;
    expect(newSource.superiorHandle).toBe(newTarget.superiorHandle);
    expect(newTargetSuperior.subordinates).toContain(newSource);
    expect(newTargetSuperior.subordinates.length).toBe(3);
    expect(newTargetSuperior.subordinates.indexOf(newSource)).toBe(1);
  });

  it("should support the 'reorder-below' instruction when target is a unit and sibling", () => {
    const scenario = loadTestScenario2();
    const target = getUnitByLabel(scenario, "2nd");
    const targetSuperior = scenario.getItemParent(target)! as Unit;
    const source = getUnitByLabel(scenario, "3th");

    scenario.setItemRelation({ source, target, instruction: "reorder-below" });
    expect(source.superiorHandle).toBe(target.superiorHandle);
    expect(targetSuperior.subordinates).toContain(source);
    expect(targetSuperior.subordinates.length).toBe(3);
    expect(targetSuperior.subordinates.indexOf(source)).toBe(2);
    // check after serialization
    const newScenario = MilitaryScenario.createFromString(scenario.toString());
    const newSource = getUnitByLabel(newScenario, "3th");
    const newTarget = getUnitByLabel(newScenario, "2nd");
    const newTargetSuperior = newScenario.getItemParent(newTarget)! as Unit;
    expect(newSource.superiorHandle).toBe(newTarget.superiorHandle);
    expect(newTargetSuperior.subordinates).toContain(newSource);
    expect(newTargetSuperior.subordinates.length).toBe(3);
    expect(newTargetSuperior.subordinates.indexOf(newSource)).toBe(2);
  });

  it("should support the 'reorder-above' instruction when target is a root unit", () => {
    const scenario = loadTestScenario2();
    const target = getUnitByLabel(scenario, "HQ");
    const source = getUnitByLabel(scenario, "HQ2");
    const originalSuperior = scenario.getItemParent(source)! as ForceSide;
    const targetSuperior = scenario.getItemParent(target)! as ForceSide;
    expect(targetSuperior).toBeInstanceOf(ForceSide);
    expect(originalSuperior).toBeInstanceOf(ForceSide);
    expect(originalSuperior.name).toBe("Army");
    expect(target.isRoot).toBe(true);
    scenario.setItemRelation({ source, target, instruction: "reorder-above" });
    expect(source.superiorHandle).toBe(target.superiorHandle);
    expect(targetSuperior.rootUnits).toContain(source);
    expect(targetSuperior.rootUnits.length).toBe(2);
    expect(targetSuperior.rootUnits.indexOf(source)).toBe(0);
    expect(originalSuperior.rootUnits).not.toContain(source);

    // check after serialization
    const newScenario = MilitaryScenario.createFromString(scenario.toString());
    const newSource = getUnitByLabel(newScenario, "HQ2");
    const newTarget = getUnitByLabel(newScenario, "HQ");
    const newOriginalSuperior = getForceSideByName(newScenario, "Army");
    const newTargetSuperior = newScenario.getItemParent(
      newTarget,
    )! as ForceSide;
    expect(newSource.superiorHandle).toBe(newTarget.superiorHandle);
    expect(newTargetSuperior.rootUnits).toContain(newSource);
    expect(newTargetSuperior.rootUnits.length).toBe(2);
    expect(newTargetSuperior.rootUnits.indexOf(newSource)).toBe(0);
    expect(newOriginalSuperior.rootUnits).not.toContain(newSource);
  });
});

describe("MilitaryScenario.setItemRelation error handling", () => {
  it("should throw an error if source is not a Unit or EquipmentItem", () => {
    let scenario = loadTestScenario2();
    const target = getUnitByLabel(scenario, "HQ2");
    expect(() =>
      scenario.setItemRelation({
        source: "invalid",
        target,
      }),
    ).toThrow("Source or target item not found");
  });

  it("should throw an error if target is not a Unit or EquipmentItem", () => {
    let scenario = loadTestScenario2();
    const source = getUnitByLabel(scenario, "HQ2");
    expect(() =>
      scenario.setItemRelation({
        source,
        target: "invalid",
      }),
    ).toThrow("Source or target item not found");
  });

  it("should throw an error if source and target are the same", () => {
    let scenario = loadTestScenario2();
    const source = getUnitByLabel(scenario, "HQ2");
    expect(() =>
      scenario.setItemRelation({
        source,
        target: source,
      }),
    ).toThrow("Source and target items cannot be the same");
  });

  it("should throw an error if source and target are equipment and instruction is 'make-child'", () => {
    let scenario = loadTestScenario2();
    const source = getEquipmentByLabel(scenario, "111");
    const target = getEquipmentByLabel(scenario, "112");
    expect(() =>
      scenario.setItemRelation({
        source,
        target,
        instruction: "make-child",
      }),
    ).toThrow("Cannot make EquipmentItem a child of another EquipmentItem");

    expect(() =>
      scenario.setItemRelation({
        source,
        target,
      }),
    ).toThrow("Cannot make EquipmentItem a child of another EquipmentItem");
  });

  it("should throw an error if source is a Unit and target is an EquipmentItem", () => {
    let scenario = loadTestScenario2();
    const source = getUnitByLabel(scenario, "HQ2");
    const target = getEquipmentByLabel(scenario, "111");
    expect(() =>
      scenario.setItemRelation({
        source,
        target,
      }),
    ).toThrow("Cannot make a Unit a child of EquipmentItem");
  });

  // it("should throw an error if source is a ForceSide and target is EquipmentItem", () => {
  //   let scenario = loadTestScenario2();
  //   const source = getForceSideByName(scenario, "Friendly");
  //   const target = getEquipmentByLabel(scenario, "111");
  //   expect(() =>
  //     scenario.setItemRelation({
  //       source,
  //       target,
  //     }),
  //   ).toThrow("Cannot make a ForceSide a child of EquipmentItem");
  // });
});
/*
describe("MilitaryScenario.setItemRelation when source is ForceSide", () => {});*/

// describe("MilitaryScenario.getItemRelation", () => {
//   it("should be defined", () => {
//     let scenario = loadTestScenario();
//     expect(scenario.getItemRelation).toBeDefined();
//   });
// });
