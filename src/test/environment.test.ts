import { describe, expect, it } from "vitest";
import { Environment, RectangleArea } from "../lib/environment.js";
import { parseFromString } from "./testdata.js";
import { MsdlCoordinates } from "../lib/geo.js";
import { getTagElement } from "../lib/domutils.js";
import { loadTestScenario } from "./testutils.js";

const ENVIRONMENT_SAMPLE_MGRS = `<Environment>
    <ScenarioTime>2025-07-09T11:11:00Z</ScenarioTime>
    <AreaOfInterest>
        <Name>Test AOI</Name>
        <UpperRight>
            <CoordinateChoice>MGRS</CoordinateChoice>
            <CoordinateData>
                <MGRS>
                    <MGRSGridZone>13V</MGRSGridZone>
                    <MGRSGridSquare>NV</MGRSGridSquare>
                    <MGRSPrecision>5</MGRSPrecision>
                    <MGRSEasting>57006</MGRSEasting>
                    <MGRSNorthing>22932</MGRSNorthing>
                    <ElevationAGL>0</ElevationAGL>
                </MGRS>
            </CoordinateData>
        </UpperRight>
        <LowerLeft>
            <CoordinateChoice>MGRS</CoordinateChoice>
            <CoordinateData>
                <MGRS>
                    <MGRSGridZone>13V</MGRSGridZone>
                    <MGRSGridSquare>NV</MGRSGridSquare>
                    <MGRSPrecision>5</MGRSPrecision>
                    <MGRSEasting>21011</MGRSEasting>
                    <MGRSNorthing>4015</MGRSNorthing>
                    <ElevationAGL>0</ElevationAGL>
                </MGRS>
            </CoordinateData>
        </LowerLeft>
    </AreaOfInterest>
</Environment>`;

describe("Environment element parsing", () => {
  it("should create an Environment instance from XML", () => {
    const environment = new Environment(
      parseFromString(ENVIRONMENT_SAMPLE_MGRS),
    );

    expect(environment).toBeInstanceOf(Environment);
    expect(environment.element).toBeInstanceOf(Element);
    expect(environment.scenarioTime).toBe("2025-07-09T11:11:00Z");
    expect(environment.areaOfInterest).toBeInstanceOf(RectangleArea);
    expect(environment.areaOfInterest?.name).toBe("Test AOI");
    expect(environment.areaOfInterest?.upperRight).toBeInstanceOf(
      MsdlCoordinates,
    );
    expect(environment.areaOfInterest?.lowerLeft).toBeInstanceOf(
      MsdlCoordinates,
    );
  });
});

describe("Environment serialization", () => {
  it("should serialize Environment to XML", () => {
    const environment = new Environment(
      parseFromString(ENVIRONMENT_SAMPLE_MGRS),
    );

    const xmlString = environment.element.outerHTML;
    expect(xmlString).toContain("<Environment>");
    expect(xmlString).toContain(
      "<ScenarioTime>2025-07-09T11:11:00Z</ScenarioTime>",
    );
    expect(xmlString).toContain("<AreaOfInterest>");
    expect(xmlString).toContain("<Name>Test AOI</Name>");
    expect(xmlString).toContain("<UpperRight>");
    expect(xmlString).toContain("<LowerLeft>");
  });

  it("should have a toObject method", () => {
    const environment = new Environment(
      parseFromString(ENVIRONMENT_SAMPLE_MGRS),
    );
    const envObj = environment.toObject();
    expect(envObj).toBeDefined();
    expect(envObj.scenarioTime).toBe("2025-07-09T11:11:00Z");
    expect(envObj.areaOfInterest).toBeDefined();
    expect(envObj.areaOfInterest?.name).toBe("Test AOI");
    expect(envObj.areaOfInterest?.upperRight).toBeDefined();
    expect(envObj.areaOfInterest?.lowerLeft).toBeDefined();
  });

  it("should handle missing AreaOfInterest gracefully", () => {
    const emptyEnvironment = new Environment(
      parseFromString("<Environment></Environment>"),
    );
    expect(emptyEnvironment.areaOfInterest).toBeUndefined();
  });
});

describe("RectangleArea class", () => {
  it("should create a RectangleArea instance from XML", () => {
    const areaElement = getTagElement(
      parseFromString(ENVIRONMENT_SAMPLE_MGRS),
      "AreaOfInterest",
    )!;
    const rectangleArea = new RectangleArea(areaElement);
    expect(rectangleArea).toBeInstanceOf(RectangleArea);
    expect(rectangleArea.upperRight).toBeInstanceOf(MsdlCoordinates);
    expect(rectangleArea.lowerLeft).toBeInstanceOf(MsdlCoordinates);
  });

  it("should have a toGeoJson method", () => {
    const areaElement = getTagElement(
      parseFromString(ENVIRONMENT_SAMPLE_MGRS),
      "AreaOfInterest",
    )!;
    const rectangleArea = new RectangleArea(areaElement);

    let geojson = rectangleArea.toGeoJson()!;
    expect(geojson).toBeDefined();
    expect(geojson.type).toBe("Feature");
    expect(geojson.geometry.type).toBe("Polygon");
    expect(geojson.properties?.name).toBe("Test AOI");
  });

  it("should have a toObject method", () => {
    const areaElement = getTagElement(
      parseFromString(ENVIRONMENT_SAMPLE_MGRS),
      "AreaOfInterest",
    )!;
    const rectangleArea = new RectangleArea(areaElement);
    const areaObj = rectangleArea.toObject();
    expect(areaObj).toBeDefined();
    expect(areaObj.name).toBe("Test AOI");
    expect(areaObj.upperRight).toBeDefined();
    expect(areaObj.lowerLeft).toBeDefined();
  });

  it("should have a toBBox method", () => {
    const areaElement = getTagElement(
      parseFromString(ENVIRONMENT_SAMPLE_MGRS),
      "AreaOfInterest",
    )!;
    const rectangleArea = new RectangleArea(areaElement);
    const bbox = rectangleArea.toBoundingBox()!;
    expect(bbox).toBeDefined();
    expect(bbox.length).toBe(4);
  });
});

describe("MilitaryScenario Environment", () => {
  it("should parse an Environment element if present", () => {
    let scenario = loadTestScenario("/data/SimpleScenarioNETN.xml");
    expect(scenario.environment).toBeInstanceOf(Environment);
    expect(scenario.environment?.scenarioTime).toBe("2025-07-09T11:11:00Z");
  });
});
