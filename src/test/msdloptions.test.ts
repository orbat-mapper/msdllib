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
        <AggregateBased>value</AggregateBased>
        <AggregateEchelon>FRONT</AggregateEchelon>
    </Options>`;

const MSDL_OPTIONS_TEMPLATE_MISSING = `<Options xmlns="urn:sisostds:scenario:military:data:draft:msdl:1"
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
        <AggregateBased>value</AggregateBased>
        <AggregateEchelon>FRONT</AggregateEchelon>
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
    expect(options.MSDLVersion).toBe("1.0.2");
    expect(options.AggregateBased).toBe("value");
    expect(options.AggregateEchelon).toBe("FRONT");
    expect(options.StandardName).toBe("MILSTD_2525B");
    expect(options.MajorVersion).toBe("2");
    expect(options.MinorVersion).toBe("3");
    expect(options.CoordinateSystemType).toBe("GDC");
    expect(options.CoordinateSystemDatum).toBe("WGS84");
  });

  describe("when writing data", () => {
    it("should set the MSDLVersion in the XML element", () => {
      const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_TEMPLATE));
      expect(getTagValue(options.element, "MSDLVersion")).toBe("1.0.2");
      options.MSDLVersion = "New Version";
      expect(getTagValue(options.element, "MSDLVersion")).toBe("New Version");
    });

    it("should set the AggregateBased in the XML element", () => {
      const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_TEMPLATE));
      expect(getTagValue(options.element, "AggregateBased")).toBe("value");
      options.AggregateBased = "New value";
      expect(getTagValue(options.element, "AggregateBased")).toBe("New value");
    });

    it("should set the AggregateEchelon in the XML element", () => {
      const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_TEMPLATE));
      expect(getTagValue(options.element, "AggregateEchelon")).toBe("FRONT");
      options.AggregateEchelon = "REGION";
      expect(getTagValue(options.element, "AggregateEchelon")).toBe("REGION");
    });

    it("should set the StandardName in the XML element", () => {
      const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_TEMPLATE));
      expect(getTagValue(options.element, "StandardName")).toBe("MILSTD_2525B");
      options.StandardName = "3.2.1";
      expect(getTagValue(options.element, "StandardName")).toBe("3.2.1");
    });

    it("should set the MajorVersion in the XML element", () => {
      const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_TEMPLATE));
      expect(getTagValue(options.element, "MajorVersion")).toBe("2");
      options.MajorVersion = "1.0";
      expect(getTagValue(options.element, "MajorVersion")).toBe("1.0");
    });

    it("should set the MinorVersion in the XML element", () => {
      const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_TEMPLATE));
      expect(getTagValue(options.element, "MinorVersion")).toBe("3");
      options.MinorVersion = "2.1";
      expect(getTagValue(options.element, "MinorVersion")).toBe("2.1");
    });

    it("should set the CoordinateSystemType in the XML element", () => {
      const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_TEMPLATE));
      expect(getTagValue(options.element, "CoordinateSystemType")).toBe("GDC");
      options.CoordinateSystemType = "MGRS";
      expect(getTagValue(options.element, "CoordinateSystemType")).toBe("MGRS");
    });

    it("should set the CoordinateSystemDatum in the XML element", () => {
      const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_TEMPLATE));
      expect(getTagValue(options.element, "CoordinateSystemDatum")).toBe(
        "WGS84",
      );
      options.CoordinateSystemDatum = "New Datum";
      expect(getTagValue(options.element, "CoordinateSystemDatum")).toBe(
        "New Datum",
      );
    });
  });
});

describe("MsdlOptions serialization", () => {
  describe("toObject", () => {
    it("should return an object with the correct properties", () => {
      const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_TEMPLATE));
      const obj = options.toObject();
      expect(obj.MSDLVersion).toBe("1.0.2");
      expect(obj.AggregateBased).toBe("value");
      expect(obj.AggregateEchelon).toBe("FRONT");
      expect(obj.StandardName).toBe("MILSTD_2525B");
      expect(obj.MajorVersion).toBe("2");
      expect(obj.MinorVersion).toBe("3");
      expect(obj.CoordinateSystemType).toBe("GDC");
      expect(obj.CoordinateSystemDatum).toBe("WGS84");
    });
  });

  describe("updateFromObject", () => {
    it("should update properties from an object", () => {
      const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_TEMPLATE));
      const updateData = {
        MSDLVersion: "2.1.1",
        AggregateBased: "true",
        AggregateEchelon: "GROUP",
        StandardName: "Standard",
        MajorVersion: "3",
        MinorVersion: "4",
        CoordinateSystemType: "UTM",
        CoordinateSystemDatum: "WGS",
      };
      options.updateFromObject(updateData);
      expect(options.MSDLVersion).toBe("2.1.1");
      expect(options.AggregateBased).toBe("true");
      expect(options.AggregateEchelon).toBe("GROUP");
      expect(options.StandardName).toBe("Standard");
      expect(options.MajorVersion).toBe("3");
      expect(options.MinorVersion).toBe("4");
      expect(options.CoordinateSystemType).toBe("UTM");
      expect(options.CoordinateSystemDatum).toBe("WGS");
    });

    it("should remove undefined properties", () => {
      const options = new MsdlOptions(parseFromString(MSDL_OPTIONS_TEMPLATE));
      const updateData = {
        StandardName: undefined,
        CoordinateSystemType: undefined,
      };
      options.updateFromObject(updateData);
      expect(options.MSDLVersion).toBe("1.0.2");
      expect(options.CoordinateSystemDatum).toBe("WGS84");

      expect(options.StandardName).toBe("");
      expect(options.CoordinateSystemType).toBe("");
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
      expect(options.MSDLVersion).toBe(MSDL_OPTIONS_TYPE.MSDLVersion);
      expect(options.AggregateBased).toBe(MSDL_OPTIONS_TYPE.AggregateBased);
      expect(options.AggregateEchelon).toBe(MSDL_OPTIONS_TYPE.AggregateEchelon);
      expect(options.StandardName).toBe(MSDL_OPTIONS_TYPE.StandardName);
      expect(options.MajorVersion).toBe(MSDL_OPTIONS_TYPE.MajorVersion);
      expect(options.MinorVersion).toBe(MSDL_OPTIONS_TYPE.MinorVersion);
      expect(options.CoordinateSystemType).toBe(
        MSDL_OPTIONS_TYPE.CoordinateSystemType,
      );
      expect(options.CoordinateSystemDatum).toBe(
        MSDL_OPTIONS_TYPE.CoordinateSystemDatum,
      );
    });
    it("should be the same after serializing to xml back and forth", () => {
      const optionsBefore = MsdlOptions.fromModel(MSDL_OPTIONS_TYPE);
      const xmlString = optionsBefore.toString();
      const optionsAfter = new MsdlOptions(parseFromString(xmlString));
      expect(optionsBefore.MSDLVersion).toBe(optionsAfter.MSDLVersion);
      expect(optionsBefore.AggregateBased).toBe(optionsAfter.AggregateBased);
      expect(optionsBefore.AggregateEchelon).toBe(
        optionsAfter.AggregateEchelon,
      );
      expect(optionsBefore.StandardName).toBe(optionsAfter.StandardName);
      expect(optionsBefore.MajorVersion).toBe(optionsAfter.MajorVersion);
      expect(optionsBefore.MinorVersion).toBe(optionsAfter.MinorVersion);
      expect(optionsBefore.CoordinateSystemType).toBe(
        optionsAfter.CoordinateSystemType,
      );
      expect(optionsBefore.CoordinateSystemDatum).toBe(
        optionsAfter.CoordinateSystemDatum,
      );
    });
  });
});
