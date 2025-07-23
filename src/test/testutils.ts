import fs from "fs";
import { MilitaryScenario, Unit } from "../index.js";

export function loadTestScenario(
  fileName = "/data/SimpleScenario.xml",
): MilitaryScenario {
  let data = fs.readFileSync(__dirname + fileName, { encoding: "utf-8" });
  let scenario = MilitaryScenario.createFromString(data.toString());
  return scenario;
}

export function loadTestScenario2() {
  return loadTestScenario("/data/TestScenario2.xml");
}

export function loadTestScenarioAsString(
  fileName = "/data/SimpleScenario.xml",
): string {
  let data = fs.readFileSync(__dirname + fileName, { encoding: "utf-8" });
  return data.toString();
}

export function loadNetnTestScenario(
  fileName = "/data/SimpleScenarioNETN.xml",
): MilitaryScenario {
  let data = fs.readFileSync(__dirname + fileName, { encoding: "utf-8" });
  let scenario = MilitaryScenario.createFromString(data.toString());
  return scenario;
}

export function loadNetnTestScenarioAsString(
  fileName = "/data/SimpleScenarioNETN.xml",
): string {
  let data = fs.readFileSync(__dirname + fileName, { encoding: "utf-8" });
  return data.toString();
}

export function countXmlTagOccurrences(xml: string, tagName: string): number {
  const regex = new RegExp(`<${tagName}(\\s[^>]*)?>`, "gi");
  return (xml.match(regex) || []).length;
}

export function getUnitByLabel(scenario: MilitaryScenario, label: string) {
  const unit = Object.values(scenario.unitMap).find((u) => u.label === label);

  if (!unit) {
    throw new Error(`Unit with label "${label}" not found in scenario.`);
  }
  return unit;
}

export function getEquipmentByLabel(scenario: MilitaryScenario, label: string) {
  const equipment = Object.values(scenario.equipmentMap).find(
    (e) => e.label === label,
  );

  if (!equipment) {
    throw new Error(`Equipment with label "${label}" not found in scenario.`);
  }
  return equipment;
}

export function getForceSideByName(scenario: MilitaryScenario, name: string) {
  const forceSide = Object.values(scenario.forceSides).find(
    (fs) => fs.name === name,
  );

  if (!forceSide) {
    throw new Error(`ForceSide with name "${name}" not found in scenario.`);
  }
  return forceSide;
}
