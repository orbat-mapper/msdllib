import { describe, expect, it } from "vitest";
import { parseFromString } from "./testdata.js";
import type { CoordinateChoice } from "../lib/types.js";
import { MsdlLocation } from "../lib/geo.js";

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

describe("MSDL Location", () => {
  it("defined", () => {
    expect(MsdlLocation).toBeDefined();
  });

  it("create from scratch", () => {
    let loc = MsdlLocation.createGDCLocation([5.0, 54.0]);
    expect(loc).toBeInstanceOf(MsdlLocation);
    expect(loc.element.tagName).toBe("Location");
    expect(loc.coordinateChoice).toEqual("GDC" as CoordinateChoice);
    expect(loc.location).toEqual([5.0, 54.0]);
  });

  it("create from Element", () => {
    let element = parseFromString(LOCATION_GDC_TEMPLATE);
    let loc = new MsdlLocation(element);
    expect(loc).toBeInstanceOf(MsdlLocation);
  });
});
