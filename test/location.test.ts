import {} from 'jest'
import {parseFromString} from "./testdata";
import {MsdlLocation} from "../src/lib/geo";

function precisionRound(num, precision) {
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
        expect(loc.location[1]).toBeCloseTo(58.5438);
        expect(loc.location[0]).toBe(15.038887);
        expect(loc.location[2]).toBe(141.03737);
    });

    it("GCC", () => {
        let element = parseFromString(LOCATION_GCC_TEMPLATE);
        let loc = new MsdlLocation(element);
        expect(loc.location.length).toBe(3);
        expect(loc.location[1]).toBeCloseTo(58.5438);
        expect(loc.location[0]).toBeCloseTo(15.038887);
        expect(loc.location[2]).toBeCloseTo(141.03737);
    });

    it("GDC no height", () => {
        let element = parseFromString(LOCATION_GDC_TEMPLATE2);
        let loc = new MsdlLocation(element);
        expect(loc.location.length).toBe(2);
        expect(loc.location[1]).toBe(58.54383);
        expect(loc.location[0]).toBe(15.038887);
    });

    it("MGRS", () => {
        let element = parseFromString(LOCATION_MGRS_TEMPLATE);
        let loc = new MsdlLocation(element);
        expect(loc.location.length).toBe(3);
        expect(loc.location[1]).toBeCloseTo(58.54383, 5);
        expect(loc.location[0]).toBeCloseTo(15.038887, 5);
        expect(loc.location[2]).toBe(10)
    });

    it("MGRS no height", () => {
        let element = parseFromString(LOCATION_MGRS_TEMPLATE2);
        let loc = new MsdlLocation(element);
        expect(loc.location.length).toBe(2);
        expect(loc.location[1]).toBeCloseTo(58.54383, 5);
        expect(loc.location[0]).toBeCloseTo(15.038887, 5);
    });

});

