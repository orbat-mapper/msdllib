import { describe, it, expect } from "vitest";
import { parseFromString } from "./testdata.js";
import { DispositionBase, MsdlLocation } from "../lib/geo.js";
import type { Point } from "geojson";
import { createXMLElement, xmlToString } from "../lib/domutils.js";
import type { CoordinateChoice } from "../lib/types.js";

function precisionRound(num: number, precision: number) {
  let factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
}

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

const DISPOSITION_TEMPLATE = `<Disposition>
    <Location>
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
    </Location>
    <DirectionOfMovement>88</DirectionOfMovement>
    <Speed>10</Speed>
</Disposition>
`;

const DISPOSITION_TEMPLATE_GDC = `<Disposition>
    <Location>
        <CoordinateChoice>GDC</CoordinateChoice>
        <CoordinateData>
            <GDC>
                <Latitude>58.54383</Latitude>
                <Longitude>15.038887</Longitude>
                 <ElevationAGL>10</ElevationAGL>
            </GDC>
        </CoordinateData>
    </Location>
    <DirectionOfMovement>88</DirectionOfMovement>
    <Speed>10</Speed>
</Disposition>
`;

describe("MSDL Location", () => {
  it("defined", () => {
    expect(MsdlLocation).toBeDefined();
  });

  it("create from scratch", () => {
    let loc = MsdlLocation.createGDCLocation([5.0, 54.0]);
    expect(loc).toBeInstanceOf(MsdlLocation);
    expect(loc.coordinateChoice).toEqual("GDC" as CoordinateChoice);
    expect(loc.location).toEqual([5.0, 54.0]);
  });

  it("create from Element", () => {
    let element = parseFromString(LOCATION_GDC_TEMPLATE);
    let loc = new MsdlLocation(element);
    expect(loc).toBeInstanceOf(MsdlLocation);
  });

  it("GDC", () => {
    let element = parseFromString(LOCATION_GDC_TEMPLATE);
    let loc = new MsdlLocation(element);
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
    let loc = new MsdlLocation(element);
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
    let loc = new MsdlLocation(element);
    expect(loc.location).toBeDefined();
    if (loc.location) {
      expect(loc.location.length).toBe(2);
      expect(loc.location[1]).toBe(58.54383);
      expect(loc.location[0]).toBe(15.038887);
    }
  });

  it("MGRS", () => {
    let element = parseFromString(LOCATION_MGRS_TEMPLATE);
    let loc = new MsdlLocation(element);
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
    let loc = new MsdlLocation(element);
    expect(loc.location).toBeDefined();
    if (loc.location) {
      expect(loc.location.length).toBe(2);
      expect(loc.location[1]).toBeCloseTo(58.54383, 5);
      expect(loc.location[0]).toBeCloseTo(15.038887, 5);
    }
  });

  it("UTM", () => {
    let element = parseFromString(LOCATION_UTM);
    let loc = new MsdlLocation(element);
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
    let loc = new MsdlLocation(element);
    expect(loc.location).toBeUndefined();
  });
});

describe("MSDL Location write", () => {
  describe("GDC", () => {
    it("should write GDC location", () => {
      let element = parseFromString(LOCATION_GDC_TEMPLATE);
      let loc = new MsdlLocation(element);
      expect(loc.location).toBeDefined();
      if (loc.location) {
        expect(loc.location.length).toBe(3);
        expect(loc.location[0]).toBeCloseTo(15.038887, 5);
        expect(loc.location[1]).toBeCloseTo(58.54383, 5);
        expect(loc.location[2]).toBe(141.03737);
      }
      loc.location = [5.0, 8.0, 100];
      let newElement = createXMLElement(xmlToString(loc.element));
      let newLoc = new MsdlLocation(newElement);
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
  //       let loc = new MsdlLocation(element);
  //       expect(loc.location).toBeDefined();
  //       if (loc.location) {
  //         expect(loc.location.length).toBe(3);
  //         expect(loc.location[0]).toBeCloseTo(15.038887, 5);
  //         expect(loc.location[1]).toBeCloseTo(58.54383, 5);
  //         expect(loc.location[2]).toBe(10);
  //       }
  //       loc.location = [5.0, 8.0, 100];
  //       let newElement = createXMLElement(xmlToString(loc.element));
  //       let newLoc = new MsdlLocation(newElement);
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

describe("DispositionBase class", () => {
  describe("Parsing Disposition", () => {
    it("MGRS Disposition", () => {
      let element = parseFromString(DISPOSITION_TEMPLATE);
      let disp = new DispositionBase(element);
      expect(disp.location).toBeDefined();
      if (disp.location) {
        expect(disp.location.length).toBe(3);
        expect(disp.location[1]).toBeCloseTo(58.54383, 5);
        expect(disp.location[0]).toBeCloseTo(15.038887, 5);
        expect(disp.location[2]).toBe(10);
      }
      expect(disp.directionOfMovement).toBe(88);
      expect(disp.speed).toBe(10);
    });
  });

  describe("Modifying Disposition", () => {
    it("Set direction of movement", () => {
      let element = parseFromString(DISPOSITION_TEMPLATE);
      let loc = new DispositionBase(element);
      expect(loc.directionOfMovement).toBe(88);
      loc.directionOfMovement = 45;
      expect(loc.directionOfMovement).toBe(45);
      let loc2 = new DispositionBase(
        createXMLElement(xmlToString(loc.element)),
      );
      expect(loc2.directionOfMovement).toBe(45);
    });

    it("Set speed", () => {
      let element = parseFromString(DISPOSITION_TEMPLATE);
      let loc = new DispositionBase(element);
      loc.speed = 20;
      expect(loc.speed).toBe(20);
      let loc2 = new DispositionBase(
        createXMLElement(xmlToString(loc.element)),
      );
      expect(loc2.speed).toBe(20);
    });
    it("Set location", () => {
      let element = parseFromString(DISPOSITION_TEMPLATE_GDC);
      let loc = new DispositionBase(element);
      expect(loc.location).toBeDefined();
      if (loc.location) {
        expect(loc.location.length).toBe(3);
        expect(loc.location[1]).toBeCloseTo(58.54383, 5);
        expect(loc.location[0]).toBeCloseTo(15.038887, 5);
        expect(loc.location[2]).toBe(10);
      }
      loc.location = [5.0, 8.0, 100];
      let newElement = createXMLElement(xmlToString(loc.element));
      let newLoc = new DispositionBase(newElement);
      expect(newLoc.location).toBeDefined();
      if (newLoc.location) {
        expect(newLoc.location.length).toBe(3);
        expect(newLoc.location[1]).toBeCloseTo(8.0, 5);
        expect(newLoc.location[0]).toBeCloseTo(5.0, 5);
        expect(newLoc.location[2]).toBe(100);
      }
    });
  });

  describe("Serialization", () => {
    it("should serialize to Object", () => {
      let element = parseFromString(DISPOSITION_TEMPLATE);
      let disp = new DispositionBase(element);
      const obj = disp.toObject();
      expect(obj.directionOfMovement).toBe(88);
      expect(obj.speed).toBe(10);
      expect(obj.location?.[1]).toBeCloseTo(58.54383, 5);
      expect(obj.location?.[0]).toBeCloseTo(15.038887, 5);
      expect(obj.location?.[2]).toBe(10);
    });

    it("should update its properties from Object", () => {
      let element = parseFromString(DISPOSITION_TEMPLATE);
      let disp = new DispositionBase(element);
      disp.updateFromObject({
        directionOfMovement: 180,
        speed: 5,
        location: [5.0, 54.0],
      });
      expect(disp.directionOfMovement).toBe(180);
      expect(disp.speed).toBe(5);
      expect(disp.location).toEqual([5.0, 54.0]);
    });

    it("should update its element from Object (MGRS)", () => {
      let element = parseFromString(DISPOSITION_TEMPLATE);
      let disp1 = new DispositionBase(element);
      disp1.updateFromObject({
        directionOfMovement: 142,
        speed: 33,
        location: [5.0, 54.0],
      });
      let disp2 = new DispositionBase(disp1.element);
      expect(disp2.directionOfMovement).toBe(142);
      expect(disp2.speed).toBe(33);
      expect(disp2.location![0]).toBeCloseTo(5.0, 3);
      expect(disp2.location![1]).toBeCloseTo(54.0, 3);
    });

    it("should update its element from Object (GDC)", () => {
      let element = parseFromString(DISPOSITION_TEMPLATE_GDC);
      let disp1 = new DispositionBase(element);
      disp1.updateFromObject({
        directionOfMovement: 142,
        speed: 33,
        location: [5.0, 54.0],
      });
      let disp2 = new DispositionBase(disp1.element);
      expect(disp2.directionOfMovement).toBe(142);
      expect(disp2.speed).toBe(33);
      expect(disp2.location).toEqual([5.0, 54.0]);
    });
  });
});
