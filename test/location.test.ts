import {} from 'jest'
import {parseFromString} from "./testdata";
import {MsdlLocation} from "../src/lib/geo";

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


describe("MSDL Location", () => {
    it("defined", () => {
        expect(MsdlLocation).toBeDefined();
    });

    it("create from Element", () => {
        let element = parseFromString(LOCATION_GDC_TEMPLATE);
        let loc = new MsdlLocation(element);
        expect(loc).toBeInstanceOf(MsdlLocation);
    });

    it("GDC", () => {
        let element = parseFromString(LOCATION_GDC_TEMPLATE);
        let loc = new MsdlLocation(element);
        expect(loc.location.length).toBe(3);
        expect(loc.location[0]).toBe(58.54383);
        expect(loc.location[1]).toBe(15.038887);
        expect(loc.location[2]).toBe(141.03737);
    });

    it("GDC no height", () => {
        let element = parseFromString(LOCATION_GDC_TEMPLATE2);
        let loc = new MsdlLocation(element);
        expect(loc.location.length).toBe(2);
        expect(loc.location[0]).toBe(58.54383);
        expect(loc.location[1]).toBe(15.038887);
    });


});

