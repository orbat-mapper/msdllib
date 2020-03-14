import * as fs from "fs";
import { MilitaryScenario } from "../src";

export function loadTestScenario(fileName = "/data/SimpleScenario.xml"): MilitaryScenario {
  let data = fs.readFileSync(__dirname + fileName, { encoding: "utf-8" });
  let scenario = MilitaryScenario.createFromString(data.toString());
  return scenario;
}
