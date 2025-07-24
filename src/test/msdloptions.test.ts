import { describe, it, expect } from "vitest";
import { MilitaryScenario, MsdlOptions } from "../index.js";
import { parseFromString, MSDL_OPTIONS_TYPE } from "./testdata.js";
import { getTagValue } from "../lib/domutils.js";

const MSDL_OPTIONS_TEMPLATE = `<Options xmlns="urn:sisostds:scenario:military:data:draft:msdl:1"
                  xmlns:modelID="http://www.sisostds.org/schemas/modelID">
        <MSDLVersion>1.0.2</MSDLVersion>
        <ScenarioDataStandards>
            <SymbologyDataStandard>
              <StandardName>MILSTD_2525B</StandardName>
              <MajorVersion>2</MajorVersion>
              <MinorVersion>3</MinorVersion>
            </SymbologyDataStandard>
          <CoordinateDataStandard>
            <CoordinateSystemType>GDC</CoordinateSystemType>
            <CoordinateSystemDatum>WGS84</CoordinateSystemDatum>
          </CoordinateDataStandard>
        </ScenarioDataStandards>
        <OrganizationDetail>
          <AggregateBased>value</AggregateBased>
          <AggregateEchelon>FRONT</AggregateEchelon>
        </OrganizationDetail>
    </Options>`;

const MSDL_OPTIONS_EMPTY = `<Options xmlns="urn:sisostds:scenario:military:data:draft:msdl:1"
                  xmlns:modelID="http://www.sisostds.org/schemas/modelID">
    </Options>`;

describe("MSDLOptions", () => {
  it("defined", () => {
    expect(MilitaryScenario).toBeDefined();
  });

  it("create from Element", () => {
    let element = parseFromString(MSDL_OPTIONS_TEMPLATE);
    let options = new MsdlOptions(element);
    expect(options.element).toBeInstanceOf(Element);
    expect(options.element).toBe(element);
  });

  it("create from scratch", () => {
    let options = MsdlOptions.create();
    expect(options).toBeInstanceOf(MsdlOptions);
    expect(options.element).toBeInstanceOf(Element);
  });

  it("read data", () => {
    let element = parseFromString(MSDL_OPTIONS_TEMPLATE);
    let options = new MsdlOptions(element);
    expect(options.msdlVersion).toBe("1.0.2");
    expect(options.aggregateBased).toBe("value");
    expect(options.aggregateEchelon).toBe("FRONT");
    expect(options.standardName).toBe("MILSTD_2525B");
    expect(options.majorVersion).toBe("2");
    expect(options.minorVersion).toBe("3");
    expect(options.coordinateSystemType).toBe("GDC");
    expect(options.coordinateSystemDatum).toBe("WGS84");
  });

  describe("when writing data", () => {
    it("should set the MSDLVersion in the XML element", () => {
      const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_TEMPLATE));
      expect(getTagValue(options.element, "MSDLVersion")).toBe("1.0.2");
      options.msdlVersion = "New Version";
      expect(getTagValue(options.element, "MSDLVersion")).toBe("New Version");
    });

    it("should set the AggregateBased in the XML element", () => {
      const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_TEMPLATE));
      expect(getTagValue(options.element, "AggregateBased")).toBe("value");
      options.aggregateBased = "New value";
      expect(getTagValue(options.element, "AggregateBased")).toBe("New value");
    });

    it("should set the AggregateEchelon in the XML element", () => {
      const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_TEMPLATE));
      expect(getTagValue(options.element, "AggregateEchelon")).toBe("FRONT");
      options.aggregateEchelon = "REGION";
      expect(getTagValue(options.element, "AggregateEchelon")).toBe("REGION");
    });

    it("should set the StandardName in the XML element", () => {
      const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_TEMPLATE));
      expect(getTagValue(options.element, "StandardName")).toBe("MILSTD_2525B");
      options.standardName = "3.2.1";
      expect(getTagValue(options.element, "StandardName")).toBe("3.2.1");
    });

    it("should set the MajorVersion in the XML element", () => {
      const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_TEMPLATE));
      expect(getTagValue(options.element, "MajorVersion")).toBe("2");
      options.majorVersion = "1.0";
      expect(getTagValue(options.element, "MajorVersion")).toBe("1.0");
    });

    it("should set the MinorVersion in the XML element", () => {
      const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_TEMPLATE));
      expect(getTagValue(options.element, "MinorVersion")).toBe("3");
      options.minorVersion = "2.1";
      expect(getTagValue(options.element, "MinorVersion")).toBe("2.1");
    });

    it("should set the CoordinateSystemType in the XML element", () => {
      const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_TEMPLATE));
      expect(getTagValue(options.element, "CoordinateSystemType")).toBe("GDC");
      options.coordinateSystemType = "MGRS";
      expect(getTagValue(options.element, "CoordinateSystemType")).toBe("MGRS");
    });

    it("should set the CoordinateSystemDatum in the XML element", () => {
      const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_TEMPLATE));
      expect(getTagValue(options.element, "CoordinateSystemDatum")).toBe(
        "WGS84",
      );
      options.coordinateSystemDatum = "New Datum";
      expect(getTagValue(options.element, "CoordinateSystemDatum")).toBe(
        "New Datum",
      );
    });
  });
});

describe("MsdlOptions nesting", () => {
  it("should handle nesting correctly for the OrganizationDetail element", () => {
    const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_EMPTY));
    expect(options.element.querySelector("OrganizationDetail")).toBeNull();

    options.aggregateBased = "TestValue";
    expect(options.element.querySelector("OrganizationDetail")).not.toBeNull();

    const aggregateBased = options.element.querySelector("OrganizationDetail")?.querySelector("AggregateBased");
    expect(aggregateBased).not.toBeNull();
    expect(getTagValue(options.element, "AggregateBased")).toBe("TestValue")
  });

  it("should handle nesting correctly for the ScenarioDataStandards element", () => {
    const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_EMPTY));
    expect(options.element.querySelector("ScenarioDataStandards")).toBeNull();

    options.standardName = "New Standard";
    options.coordinateSystemDatum = "New Datum";
    expect(options.element.querySelector("ScenarioDataStandards")).not.toBeNull();

    const standardName = options.element.querySelector("ScenarioDataStandards")?.querySelector("SymbologyDataStandard")?.querySelector("StandardName");
    const coordinateSystemDatum = options.element.querySelector("ScenarioDataStandards")?.querySelector("CoordinateDataStandard")?.querySelector("CoordinateSystemDatum");
    expect(standardName).not.toBeNull();
    expect(coordinateSystemDatum).not.toBeNull();

    expect(getTagValue(options.element, "StandardName")).toBe("New Standard")
    expect(getTagValue(options.element, "CoordinateSystemDatum")).toBe("New Datum")
  });

  it("should handle nesting within the XML correctly", () => {
    const options_template = new MsdlOptions(parseFromString(MSDL_OPTIONS_TEMPLATE));
    const options_empty = new MsdlOptions(parseFromString(MSDL_OPTIONS_EMPTY));
    options_empty.msdlVersion = "1.0.2";      
    options_empty.standardName = "MILSTD_2525B";
    options_empty.majorVersion = "2";
    options_empty.minorVersion = "3";
    options_empty.coordinateSystemType = "GDC";
    options_empty.coordinateSystemDatum = "WGS84";
    options_empty.aggregateBased = "value";
    options_empty.aggregateEchelon = "FRONT";

    const flat_options_template = options_template.toString().replaceAll('  ', ' ').replace(/>\s+</g, '><')
    const flat_options_emtpy = options_empty.toString().replaceAll('  ', ' ').replace(/>\s+</g, '><').replaceAll(' xmlns=""', '')
    expect(flat_options_emtpy).toBe(flat_options_template)
  });
});

describe("MsdlOptions serialization", () => {
  describe("toObject", () => {
    it("should return an object with the correct properties", () => {
      const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_TEMPLATE));
      const obj = options.toObject();
      expect(obj.msdlVersion).toBe("1.0.2");
      expect(obj.organizationDetail?.aggregateBased).toBe("value");
      expect(obj.organizationDetail?.aggregateEchelon).toBe("FRONT");
      expect(
        obj.scenarioDataStandards?.symbologyDataStandard?.standardName,
      ).toBe("MILSTD_2525B");
      expect(
        obj.scenarioDataStandards?.symbologyDataStandard?.majorVersion,
      ).toBe("2");
      expect(
        obj.scenarioDataStandards?.symbologyDataStandard?.minorVersion,
      ).toBe("3");
      expect(
        obj.scenarioDataStandards?.coordinateDataStandard?.coordinateSystemType,
      ).toBe("GDC");
      expect(
        obj.scenarioDataStandards?.coordinateDataStandard
          ?.coordinateSystemDatum,
      ).toBe("WGS84");
    });
  });

  describe("updateFromObject", () => {
    it("should update properties from an object", () => {
      const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_TEMPLATE));
      const updateData = {
        msdlVersion: "2.1.1",
        organizationDetail: {
          aggregateBased: "true",
          aggregateEchelon: "GROUP",
        },
        scenarioDataStandards: {
          symbologyDataStandard: {
            standardName: "Standard",
            majorVersion: "3",
            minorVersion: "4",
          },
          coordinateDataStandard: {
            coordinateSystemType: "UTM",
            coordinateSystemDatum: "WGS",
          },
        },
      };
      options.updateFromObject(updateData);
      expect(options.msdlVersion).toBe("2.1.1");
      expect(options.aggregateBased).toBe("true");
      expect(options.aggregateEchelon).toBe("GROUP");
      expect(options.standardName).toBe("Standard");
      expect(options.majorVersion).toBe("3");
      expect(options.minorVersion).toBe("4");
      expect(options.coordinateSystemType).toBe("UTM");
      expect(options.coordinateSystemDatum).toBe("WGS");
    });

    it("should remove undefined properties", () => {
      const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_TEMPLATE));
      const updateData = {
        scenarioDataStandards: {
          symbologyDataStandard: { standardName: undefined },
        },
        coordinateSystemType: undefined,
      };
      options.updateFromObject(updateData);
      expect(options.msdlVersion).toBe("1.0.2");
      expect(options.coordinateSystemDatum).toBe("WGS84");

      expect(options.standardName).toBe("");
      expect(options.coordinateSystemType).toBe("");
      const standardNameElements = options.element.getElementsByTagNameNS(
        "*",
        "StandardName",
      );
      expect(standardNameElements.length).toBe(0);
      const coordinateSystemTypeElements =
        options.element.getElementsByTagNameNS("*", "CoordinateSystemType");
      expect(coordinateSystemTypeElements.length).toBe(0);
    });
  });

  describe("fromModel", () => {
    it("should create an instance from an object", () => {
      const options = MsdlOptions.fromModel(MSDL_OPTIONS_TYPE);
      expect(options.msdlVersion).toBe(MSDL_OPTIONS_TYPE.msdlVersion);
      expect(options.aggregateBased).toBe(
        MSDL_OPTIONS_TYPE.organizationDetail?.aggregateBased,
      );
      expect(options.aggregateEchelon).toBe(
        MSDL_OPTIONS_TYPE.organizationDetail?.aggregateEchelon,
      );
      expect(options.standardName).toBe(
        MSDL_OPTIONS_TYPE.scenarioDataStandards?.symbologyDataStandard
          ?.standardName,
      );
      expect(options.majorVersion).toBe(
        MSDL_OPTIONS_TYPE.scenarioDataStandards?.symbologyDataStandard
          ?.majorVersion,
      );
      expect(options.minorVersion).toBe(
        MSDL_OPTIONS_TYPE.scenarioDataStandards?.symbologyDataStandard
          ?.minorVersion,
      );
      expect(options.coordinateSystemType).toBe(
        MSDL_OPTIONS_TYPE.scenarioDataStandards?.coordinateDataStandard
          ?.coordinateSystemType,
      );
      expect(options.coordinateSystemDatum).toBe(
        MSDL_OPTIONS_TYPE.scenarioDataStandards?.coordinateDataStandard
          ?.coordinateSystemDatum,
      );
    });
    it("should be the same after serializing to xml back and forth", () => {
      const optionsBefore = MsdlOptions.fromModel(MSDL_OPTIONS_TYPE);
      const xmlString = optionsBefore.toString();
      const optionsAfter = new MsdlOptions(parseFromString(xmlString));
      expect(optionsBefore.msdlVersion).toBe(optionsAfter.msdlVersion);
      expect(optionsBefore.aggregateBased).toBe(optionsAfter.aggregateBased);
      expect(optionsBefore.aggregateEchelon).toBe(
        optionsAfter.aggregateEchelon,
      );
      expect(optionsBefore.standardName).toBe(optionsAfter.standardName);
      expect(optionsBefore.majorVersion).toBe(optionsAfter.majorVersion);
      expect(optionsBefore.minorVersion).toBe(optionsAfter.minorVersion);
      expect(optionsBefore.coordinateSystemType).toBe(
        optionsAfter.coordinateSystemType,
      );
      expect(optionsBefore.coordinateSystemDatum).toBe(
        optionsAfter.coordinateSystemDatum,
      );
    });
  });
});
