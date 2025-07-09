import { describe, expect, it } from "vitest";
import { parseFromString } from "./testdata.js";
import { MsdlCoordinates } from "../lib/geo.js";
import { createXMLElement, xmlToString } from "../lib/domutils.js";

const LOCATION_GDC_TEMPLATE = `
    <Location>
        <CoordinateChoice>GDC</CoordinateChoice>
        <CoordinateData>
            <GDC>
                <Latitude>58.54383</Latitude>
                <Longitude>15.038887</Longitude>
                <ElevationAGL>141.03737</ElevationAGL>
            </GDC>
        </CoordinateData>
    </Location>`;

const LOCATION_GCC_TEMPLATE = `
    <Location>
        <CoordinateChoice>GCC</CoordinateChoice>
        <CoordinateData>
            <GCC>
                <X>3222337.24</X>
                <Y>865767.13</Y>
                <Z>5417712.62</Z>
            </GCC>
        </CoordinateData>
    </Location>`;

const LOCATION_GDC_TEMPLATE2 = `
    <Location>
        <CoordinateChoice>GDC</CoordinateChoice>
        <CoordinateData>
            <GDC>
                <Latitude>58.54383</Latitude>
                <Longitude>15.038887</Longitude>
            </GDC>
        </CoordinateData>
    </Location>`;

const LOCATION_MGRS_TEMPLATE = `<Location>
    <CoordinateChoice>MGRS</CoordinateChoice>
    <CoordinateData>
        <MGRS>
            <MGRSGridZone>33V</MGRSGridZone>
            <MGRSGridSquare>WE</MGRSGridSquare>
            <MGRSPrecision>5</MGRSPrecision>
            <MGRSEasting>02263</MGRSEasting>
            <MGRSNorthing>89259</MGRSNorthing>
            <ElevationAGL>10</ElevationAGL>
        </MGRS>
    </CoordinateData>
</Location>`;

const LOCATION_MGRS_TEMPLATE2 = `<Location>
    <CoordinateChoice>MGRS</CoordinateChoice>
    <CoordinateData>
        <MGRS>
            <MGRSGridZone>33V</MGRSGridZone>
            <MGRSGridSquare>WE</MGRSGridSquare>
            <MGRSPrecision>5</MGRSPrecision>
            <MGRSEasting>02263</MGRSEasting>
            <MGRSNorthing>89259</MGRSNorthing>
        </MGRS>
    </CoordinateData>
</Location>`;

// http://www.earthpoint.us/Convert.aspx
// Calculated Values - based on Degrees Lat Long to seven decimal places.
// Position Type	Lat Lon
// Degrees Lat Long 	58.5438300°, 015.0388870°
// Degrees Minutes	58°32.62980', 015°02.33322'
// Degrees Minutes Seconds 	58°32'37.7880", 015°02'19.9932"
// UTM	33V 502263mE 6489259mN
// UTM centimeter	33V 502263.62mE 6489259.69mN
// MGRS	33VWE0226389259
// Grid North	0.0°
// GARS	391NK37
// Maidenhead	JO78MN40PM94
// GEOREF	PKAP02333262
const LOCATION_UTM = `<Location>
    <CoordinateChoice>UTM</CoordinateChoice>
    <CoordinateData>
        <UTM>
            <UTMGridZone>33V</UTMGridZone>
            <UTMEasting>502263</UTMEasting>
            <UTMNorthing>6489259</UTMNorthing>
            <ElevationAGL>10</ElevationAGL>
        </UTM>
    </CoordinateData>
</Location>`;

const UNKNOWN_TEMPLATE = `
    <Location>
        <CoordinateChoice>XXX</CoordinateChoice>
        <CoordinateData>
            <XXX>
                <X>3222337.24</X>
                <Y>865767.13</Y>
                <Z>5417712.62</Z>
            </XXX>
        </CoordinateData>
    </Location>`;

describe("MsdlCoordinates class", () => {
  it("should be defined", () => {
    expect(MsdlCoordinates).toBeDefined();
  });

  it("should create an instance from an XML element", () => {
    let element = parseFromString(LOCATION_GDC_TEMPLATE);
    let loc = new MsdlCoordinates(element);
    expect(loc).toBeInstanceOf(MsdlCoordinates);
    expect(loc.element).toBeInstanceOf(Element);
  });

  it("should have a toObject method", () => {
    let element = parseFromString(LOCATION_GDC_TEMPLATE);
    let loc = new MsdlCoordinates(element);
    let locObj = loc.toObject();
    expect(locObj).toBeDefined();
    expect(locObj.coordinateChoice).toBe("GDC");
    expect(loc.location?.length).toBe(3);
    expect(loc.location?.[1]).toBeCloseTo(58.5438);
    expect(loc.location?.[0]).toBe(15.038887);
    expect(loc.location?.[2]).toBe(141.03737);
  });

  it("should have a toGeoJson method", () => {
    let element = parseFromString(LOCATION_GDC_TEMPLATE);
    let loc = new MsdlCoordinates(element);
    let geoJson = loc.toGeoJson();
    expect(geoJson).toBeDefined();
    expect(geoJson.type).toBe("Feature");
    expect(geoJson.geometry.type).toBe("Point");
    expect(geoJson.geometry.coordinates.length).toBe(3);
    expect(geoJson.geometry.coordinates[0]).toBeCloseTo(15.038887, 5);
    expect(geoJson.geometry.coordinates[1]).toBeCloseTo(58.54383, 5);
    expect(geoJson.geometry.coordinates[2]).toBe(141.03737);
  });

  it("create from scratch", () => {
    let loc = MsdlCoordinates.createGDCLocation([5.0, 54.0]);
    expect(loc).toBeInstanceOf(MsdlCoordinates);
    expect(loc.element.tagName).toBe("Location");
    expect(loc.coordinateChoice).toEqual("GDC");
    expect(loc.location).toEqual([5.0, 54.0]);

    loc = MsdlCoordinates.createGDCLocation([5.0, 54.0], {
      tagName: "UpperLeft",
    });
    expect(loc).toBeInstanceOf(MsdlCoordinates);
    expect(loc.element.tagName).toBe("UpperLeft");
  });
});

describe("MsdlCoordinates parsing", () => {
  it("GDC", () => {
    let element = parseFromString(LOCATION_GDC_TEMPLATE);
    let loc = new MsdlCoordinates(element);
    expect(loc.location).toBeDefined();
    if (loc.location) {
      expect(loc.location.length).toBe(3);
      expect(loc.location[1]).toBeCloseTo(58.5438);
      expect(loc.location[0]).toBe(15.038887);
      expect(loc.location[2]).toBe(141.03737);
    }
  });

  it("GCC", () => {
    let element = parseFromString(LOCATION_GCC_TEMPLATE);
    let loc = new MsdlCoordinates(element);
    expect(loc.location).toBeDefined();
    if (loc.location) {
      expect(loc.location.length).toBe(3);
      expect(loc.location[1]).toBeCloseTo(58.5438);
      expect(loc.location[0]).toBeCloseTo(15.038887);
      expect(loc.location[2]).toBeCloseTo(141.03737);
    }
  });

  it("GDC no height", () => {
    let element = parseFromString(LOCATION_GDC_TEMPLATE2);
    let loc = new MsdlCoordinates(element);
    expect(loc.location).toBeDefined();
    if (loc.location) {
      expect(loc.location.length).toBe(2);
      expect(loc.location[1]).toBe(58.54383);
      expect(loc.location[0]).toBe(15.038887);
    }
  });

  it("MGRS", () => {
    let element = parseFromString(LOCATION_MGRS_TEMPLATE);
    let loc = new MsdlCoordinates(element);
    expect(loc.location).toBeDefined();
    if (loc.location) {
      expect(loc.location.length).toBe(3);
      expect(loc.location[1]).toBeCloseTo(58.54383, 5);
      expect(loc.location[0]).toBeCloseTo(15.038887, 5);
      expect(loc.location[2]).toBe(10);
    }
  });

  it("MGRS no height", () => {
    let element = parseFromString(LOCATION_MGRS_TEMPLATE2);
    let loc = new MsdlCoordinates(element);
    expect(loc.location).toBeDefined();
    if (loc.location) {
      expect(loc.location.length).toBe(2);
      expect(loc.location[1]).toBeCloseTo(58.54383, 5);
      expect(loc.location[0]).toBeCloseTo(15.038887, 5);
    }
  });

  it("UTM", () => {
    let element = parseFromString(LOCATION_UTM);
    let loc = new MsdlCoordinates(element);
    expect(loc.location).toBeDefined();
    if (loc.location) {
      expect(loc.location.length).toBe(3);
      expect(loc.location[1]).toBeCloseTo(58.54383, 4);
      expect(loc.location[0]).toBeCloseTo(15.038887, 4);
      expect(loc.location[2]).toBe(10);
    }
  });

  it("Unknown coordinate choice", () => {
    let element = parseFromString(UNKNOWN_TEMPLATE);
    let loc = new MsdlCoordinates(element);
    expect(loc.location).toBeUndefined();
  });
});

describe("MSDL Coordinates write", () => {
  describe("GDC", () => {
    it("should write GDC location", () => {
      let element = parseFromString(LOCATION_GDC_TEMPLATE);
      let loc = new MsdlCoordinates(element);
      expect(loc.location).toBeDefined();
      if (loc.location) {
        expect(loc.location.length).toBe(3);
        expect(loc.location[0]).toBeCloseTo(15.038887, 5);
        expect(loc.location[1]).toBeCloseTo(58.54383, 5);
        expect(loc.location[2]).toBe(141.03737);
      }
      loc.location = [5.0, 8.0, 100];
      let newElement = createXMLElement(xmlToString(loc.element));
      let newLoc = new MsdlCoordinates(newElement);
      expect(newLoc.location).toBeDefined();
      if (newLoc.location) {
        expect(newLoc.location.length).toBe(3);
        expect(newLoc.location[0]).toBeCloseTo(5.0, 5);
        expect(newLoc.location[1]).toBeCloseTo(8.0, 5);
        expect(newLoc.location[2]).toBe(100);
      }
    });
  });

  //   describe("MGRS", () => {
  //     it("should write MGRS location", () => {
  //       let element = parseFromString(LOCATION_MGRS_TEMPLATE);
  //       let loc = new MsdlCoordinates(element);
  //       expect(loc.location).toBeDefined();
  //       if (loc.location) {
  //         expect(loc.location.length).toBe(3);
  //         expect(loc.location[0]).toBeCloseTo(15.038887, 5);
  //         expect(loc.location[1]).toBeCloseTo(58.54383, 5);
  //         expect(loc.location[2]).toBe(10);
  //       }
  //       loc.location = [5.0, 8.0, 100];
  //       let newElement = createXMLElement(xmlToString(loc.element));
  //       let newLoc = new MsdlCoordinates(newElement);
  //       expect(newLoc.location).toBeDefined();
  //       if (newLoc.location) {
  //         expect(newLoc.location.length).toBe(3);
  //         expect(newLoc.location[0]).toBeCloseTo(5.0, 5);
  //         expect(newLoc.location[1]).toBeCloseTo(8.0, 5);
  //         expect(newLoc.location[2]).toBe(100);
  //       }
  //     });
  //   });
});
