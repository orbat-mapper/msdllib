import { describe, it, expect } from "vitest";
import { MilitaryScenario, ScenarioId } from "../index.js";
import { parseFromString, SCENARIO_ID_TYPE } from "./testdata.js";
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

const SCENARIO_ID_TEMPLATE_MISSING = `<ScenarioID xmlns="urn:sisostds:scenario:military:data:draft:msdl:1"
                  xmlns:modelID="http://www.sisostds.org/schemas/modelID">
        <modelID:name>Empty scenario</modelID:name>
        <modelID:type>BOM</modelID:type>
        <modelID:version>0</modelID:version>
        <modelID:modificationDate>2012-11-13-05:00</modelID:modificationDate>
        <modelID:securityClassification>Unclassified</modelID:securityClassification>
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
    expect(sid.modificationDate).toBe("2012-11-13-05:00");
    expect(sid.type).toBe("BOM");
    expect(sid.version).toBe("0");
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

describe("ScenarioId serialization", () => {
  describe("toObject", () => {
    it("should return an object with the correct properties", () => {
      const scenarioId = new ScenarioId(parseFromString(SCENARIO_ID_TEMPLATE));
      const obj = scenarioId.toObject();
      expect(obj.name).toBe("Empty scenario");
      expect(obj.description).toBe("Description");
      expect(obj.securityClassification).toBe("Unclassified");
      expect(obj.modificationDate).toBe("2012-11-13-05:00");
      expect(obj.version).toBe("0");
      expect(obj.type).toBe("BOM");
    });
  });

  describe("updateFromObject", () => {
    it("should update properties from an object", () => {
      const scenarioId = new ScenarioId(parseFromString(SCENARIO_ID_TEMPLATE));
      const updateData = {
        name: "Updated Scenario",
        description: "Updated Description",
        securityClassification: "Confidential",
        modificationDate: "2023-10-01T12:00:00Z",
      };
      scenarioId.updateFromObject(updateData);
      expect(scenarioId.name).toBe("Updated Scenario");
      expect(scenarioId.description).toBe("Updated Description");
      expect(scenarioId.securityClassification).toBe("Confidential");
      expect(scenarioId.modificationDate).toBe("2023-10-01T12:00:00Z");

      expect(scenarioId.version).toBe("0");
      expect(scenarioId.type).toBe("BOM");
    });

    it("should remove undefined properties", () => {
      const scenarioId = new ScenarioId(parseFromString(SCENARIO_ID_TEMPLATE));
      const updateData = {
        description: undefined,
        version: undefined,
      };
      scenarioId.updateFromObject(updateData);
      expect(scenarioId.name).toBe("Empty scenario");

      expect(scenarioId.description).toBe("");
      expect(scenarioId.version).toBe("");
      const descriptionElements = scenarioId.element.getElementsByTagNameNS(
        "*",
        "description",
      );
      expect(descriptionElements.length).toBe(0);
      const versionElements = scenarioId.element.getElementsByTagNameNS(
        "*",
        "version",
      );
      expect(versionElements.length).toBe(0);
    });
  });

  describe("fromModel", () => {
    it("should create an instance from an object", () => {
      const scenarioId = ScenarioId.fromModel(SCENARIO_ID_TYPE);
      expect(scenarioId.name).toBe(SCENARIO_ID_TYPE.name);
      expect(scenarioId.description).toBe(SCENARIO_ID_TYPE.description);
      expect(scenarioId.version).toBe(SCENARIO_ID_TYPE.version);
      expect(scenarioId.securityClassification).toBe(
        SCENARIO_ID_TYPE.securityClassification,
      );
      expect(scenarioId.type).toBe(SCENARIO_ID_TYPE.type);
      expect(scenarioId.modificationDate).toBe(
        SCENARIO_ID_TYPE.modificationDate,
      );
    });
    it("should be the same after serializing to xml back and forth", () => {
      const scenarioIdBefore = ScenarioId.fromModel(SCENARIO_ID_TYPE);
      const xmlString = scenarioIdBefore.toString();
      const scenarioIdAfter = new ScenarioId(parseFromString(xmlString));
      expect(scenarioIdBefore.name).toBe(scenarioIdAfter.name);
      expect(scenarioIdBefore.description).toBe(scenarioIdAfter.description);
      expect(scenarioIdBefore.version).toBe(scenarioIdAfter.version);
    });
  });
});
