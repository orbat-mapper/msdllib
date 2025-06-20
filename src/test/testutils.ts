import fs from "fs";
import { MilitaryScenario } from "../index.js";

export function loadTestScenario(
  fileName = "/data/SimpleScenario.xml",
): MilitaryScenario {
  let data = fs.readFileSync(__dirname + fileName, { encoding: "utf-8" });
  let scenario = MilitaryScenario.createFromString(data.toString());
  return scenario;
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
