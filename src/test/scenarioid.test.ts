import { describe, it, expect } from "vitest";
import { MilitaryScenario, ScenarioId } from "../index.js";
import { parseFromString } from "./testdata.js";

const SCENARIO_ID_TEMPLATE = `<ScenarioID xmlns="urn:sisostds:scenario:military:data:draft:msdl:1"
                  xmlns:modelID="http://www.sisostds.org/schemas/modelID">
        <modelID:name>Empty scenario</modelID:name>
        <modelID:type></modelID:type>
        <modelID:version>0</modelID:version>
        <modelID:modificationDate>2012-11-13-05:00</modelID:modificationDate>
        <modelID:securityClassification>Unclassified</modelID:securityClassification>
        <modelID:description>Description</modelID:description>
        <modelID:poc>
            <modelID:pocType>e-mail</modelID:pocType>
            <modelID:pocEmail>helpdesk@ideorlando.org</modelID:pocEmail>
        </modelID:poc>
    </ScenarioID>`;

describe("ScenarioId", () => {
  it("defined", () => {
    expect(MilitaryScenario).toBeDefined();
  });

  it("create from Element", () => {
    let element = parseFromString(SCENARIO_ID_TEMPLATE);
    let sid = new ScenarioId(element);
    expect(sid.element).toBeInstanceOf(Element);
    expect(sid.element).toBe(element);
  });

  it("read data", () => {
    let element = parseFromString(SCENARIO_ID_TEMPLATE);
    let sid = new ScenarioId(element);
    expect(sid.name).toBe("Empty scenario");
    expect(sid.description).toBe("Description");
    expect(sid.securityClassification).toBe("Unclassified");
  });
});
