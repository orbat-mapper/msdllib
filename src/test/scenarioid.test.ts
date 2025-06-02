import { describe, it, expect } from "vitest";
import { MilitaryScenario, ScenarioId } from "../index.js";
import { parseFromString } from "./testdata.js";
import { getTagValue } from "../lib/domutils.js";

const SCENARIO_ID_TEMPLATE = `<ScenarioID xmlns="urn:sisostds:scenario:military:data:draft:msdl:1"
                  xmlns:modelID="http://www.sisostds.org/schemas/modelID">
        <modelID:name>Empty scenario</modelID:name>
        <modelID:type>BOM</modelID:type>
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

  describe("when writing data", () => {
    it("should set the name in the XML element", () => {
      const scenarioId = new ScenarioId(parseFromString(SCENARIO_ID_TEMPLATE));
      expect(getTagValue(scenarioId.element, "name")).toBe("Empty scenario");
      scenarioId.name = "New Name";
      expect(getTagValue(scenarioId.element, "name")).toBe("New Name");
    });

    it("should set the description in the XML element", () => {
      const scenarioId = new ScenarioId(parseFromString(SCENARIO_ID_TEMPLATE));
      expect(getTagValue(scenarioId.element, "description")).toBe(
        "Description",
      );
      scenarioId.description = "New Description";
      expect(getTagValue(scenarioId.element, "description")).toBe(
        "New Description",
      );
    });

    it("should set the security classification in the XML element", () => {
      const scenarioId = new ScenarioId(parseFromString(SCENARIO_ID_TEMPLATE));
      expect(getTagValue(scenarioId.element, "securityClassification")).toBe(
        "Unclassified",
      );
      scenarioId.securityClassification = "UNKNOWN";
      expect(getTagValue(scenarioId.element, "securityClassification")).toBe(
        "UNKNOWN",
      );
    });

    it("should set the modification date in the XML element", () => {
      const scenarioId = new ScenarioId(parseFromString(SCENARIO_ID_TEMPLATE));
      expect(getTagValue(scenarioId.element, "modificationDate")).toBe(
        "2012-11-13-05:00",
      );
      scenarioId.modificationDate = "2023-10-01T12:00:00Z";
      expect(getTagValue(scenarioId.element, "modificationDate")).toBe(
        "2023-10-01T12:00:00Z",
      );
    });

    it("should set the version in the XML element", () => {
      const scenarioId = new ScenarioId(parseFromString(SCENARIO_ID_TEMPLATE));
      expect(getTagValue(scenarioId.element, "version")).toBe("0");
      scenarioId.version = "1.0";
      expect(getTagValue(scenarioId.element, "version")).toBe("1.0");
    });

    it("should set the type in the XML element", () => {
      const scenarioId = new ScenarioId(parseFromString(SCENARIO_ID_TEMPLATE));
      expect(getTagValue(scenarioId.element, "type")).toBe("BOM");
      scenarioId.type = "FOM";
      expect(getTagValue(scenarioId.element, "type")).toBe("FOM");
    });
  });
});
