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

describe("Environment creation", () => {
  it("should create an empty Environment using create()", () => {
    const environment = Environment.create();
    expect(environment).toBeInstanceOf(Environment);
    expect(environment.element).toBeInstanceOf(Element);
    expect(environment.scenarioTime).toBeUndefined();
    expect(environment.areaOfInterest).toBeUndefined();
  });

  it("should allow setting scenarioTime programmatically", () => {
    const environment = Environment.create();
    environment.scenarioTime = "2025-12-31T23:59:59Z";
    expect(environment.scenarioTime).toBe("2025-12-31T23:59:59Z");
    expect(environment.element.outerHTML).toContain(
      "<ScenarioTime>2025-12-31T23:59:59Z</ScenarioTime>",
    );
  });

  it("should allow setting areaOfInterest programmatically", () => {
    const environment = Environment.create();
    const upperRight = MsdlCoordinates.createGDCLocation([10, 20, 0]);
    const lowerLeft = MsdlCoordinates.createGDCLocation([5, 15, 0]);
    const rectangleArea = RectangleArea.create(upperRight, lowerLeft);
    rectangleArea.name = "Test Area";

    environment.areaOfInterest = rectangleArea;

    expect(environment.areaOfInterest).toBeInstanceOf(RectangleArea);
    expect(environment.areaOfInterest?.name).toBe("Test Area");
    expect(environment.element.outerHTML).toContain("<AreaOfInterest>");
  });

  it("should allow removing areaOfInterest", () => {
    const environment = new Environment(
      parseFromString(ENVIRONMENT_SAMPLE_MGRS),
    );
    expect(environment.areaOfInterest).toBeInstanceOf(RectangleArea);

    environment.areaOfInterest = undefined;
    expect(environment.areaOfInterest).toBeUndefined();
    expect(environment.element.outerHTML).not.toContain("<AreaOfInterest>");
  });
});

describe("RectangleArea creation", () => {
  it("should create a RectangleArea using create()", () => {
    const upperRight = MsdlCoordinates.createGDCLocation([10, 20, 0]);
    const lowerLeft = MsdlCoordinates.createGDCLocation([5, 15, 0]);
    const rectangleArea = RectangleArea.create(upperRight, lowerLeft);

    expect(rectangleArea).toBeInstanceOf(RectangleArea);
    expect(rectangleArea.upperRight).toBeInstanceOf(MsdlCoordinates);
    expect(rectangleArea.lowerLeft).toBeInstanceOf(MsdlCoordinates);
  });

  it("should allow setting name on created RectangleArea", () => {
    const upperRight = MsdlCoordinates.createGDCLocation([10, 20, 0]);
    const lowerLeft = MsdlCoordinates.createGDCLocation([5, 15, 0]);
    const rectangleArea = RectangleArea.create(upperRight, lowerLeft);

    rectangleArea.name = "My Area";
    expect(rectangleArea.name).toBe("My Area");
    expect(rectangleArea.element.outerHTML).toContain("<Name>My Area</Name>");
  });

  it("should compute correct bounding box for created RectangleArea", () => {
    const upperRight = MsdlCoordinates.createGDCLocation([10, 20, 0]);
    const lowerLeft = MsdlCoordinates.createGDCLocation([5, 15, 0]);
    const rectangleArea = RectangleArea.create(upperRight, lowerLeft);

    const bbox = rectangleArea.toBoundingBox();
    expect(bbox).toBeDefined();
    expect(bbox).toHaveLength(4);
    expect(bbox![0]).toBeCloseTo(5, 5);
    expect(bbox![1]).toBeCloseTo(15, 5);
    expect(bbox![2]).toBeCloseTo(10, 5);
    expect(bbox![3]).toBeCloseTo(20, 5);
  });
});

describe("RectangleArea.fromModel", () => {
  it("should create a RectangleArea from a valid model object", () => {
    const upperRight = MsdlCoordinates.createGDCLocation([10, 20, 0]);
    const lowerLeft = MsdlCoordinates.createGDCLocation([5, 15, 0]);
    const model = {
      name: "Test AOI",
      upperRight,
      lowerLeft,
    };
    const area = RectangleArea.fromModel(model);
    expect(area).toBeInstanceOf(RectangleArea);
    expect(area.name).toBe("Test AOI");
    expect(area.upperRight.location).toEqual([10, 20, 0]);
    expect(area.lowerLeft.location).toEqual([5, 15, 0]);
  });

  it("should throw if upperRight is missing", () => {
    const lowerLeft = MsdlCoordinates.createGDCLocation([5, 15, 0]);
    const model = {
      name: "Test AOI",
      lowerLeft,
    };
    expect(() => RectangleArea.fromModel(model as any)).toThrow();
  });

  it("should throw if lowerLeft is missing", () => {
    const upperRight = MsdlCoordinates.createGDCLocation([10, 20, 0]);
    const model = {
      name: "Test AOI",
      upperRight,
    };
    expect(() => RectangleArea.fromModel(model as any)).toThrow();
  });

  it("should set name to undefined if not provided", () => {
    const upperRight = MsdlCoordinates.createGDCLocation([10, 20, 0]);
    const lowerLeft = MsdlCoordinates.createGDCLocation([5, 15, 0]);
    const model = {
      upperRight,
      lowerLeft,
    };
    const area = RectangleArea.fromModel(model);
    expect(area.name).toBeUndefined();
  });
});
