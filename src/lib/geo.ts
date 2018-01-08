import {getTagElement, getTagValue} from "./utils";

import * as mgrs from 'mgrs';
import * as projector from 'ecef-projector';

export class MsdlLocation {
    public location: number[];
    coordinateChoice: string;

    constructor(private element) {
        this.location = [0, 0, 0];
        this.coordinateChoice = getTagValue(this.element, "CoordinateChoice");
        this.parseLocation();
    }

    // setLocation(latlng: L.LatLng) {
    //     this.location = [latlng.lat, latlng.lng, latlng.alt];
    //     if (this.coordinateChoice === "GDC") {
    //         this.setGDCLocation(latlng);
    //     } else {
    //         console.warn(`Coordinate choice ${this.coordinateChoice} not implemented yet`);
    //     }
    // }

    private parseLocation() {
        if (this.coordinateChoice === "MGRS") {
            this.location = this.parseMgrsLocation();
        } else if (this.coordinateChoice === "GDC") {
            this.location = this.parseGDCLocation();
        } else if (this.coordinateChoice === "GCC") {
            this.location = this.parseGCCLocation();
        } else {
            console.warn(`Unhandled coordinate choice ${this.coordinateChoice}`);
            this.location = null;
        }
    }

    private parseMgrsLocation() {
        let mgrsElement = getTagElement(this.element, "MGRS");
        let gridZone = getTagValue(mgrsElement, "MGRSGridZone");
        let gridSquare = getTagValue(mgrsElement, "MGRSGridSquare");
        let easting = getTagValue(mgrsElement, "MGRSEasting");
        let northing = getTagValue(mgrsElement, "MGRSNorthing");
        let precision = getTagValue(mgrsElement, "MGRSPrecision");
        let mgrsString = gridZone + gridSquare + String('00000' + easting).slice(-5) + String('00000' + northing).slice(-5);
        return mgrs.toPoint(mgrsString).reverse();
    }

    private parseGDCLocation(): number[] {
        // Geodetic coordinates in fractional degress of latitude and longitude.
        let gdcElement = getTagElement(this.element, "GDC");
        let latitude = Number(getTagValue(gdcElement, 'Latitude'));
        let longitude = Number(getTagValue(gdcElement, 'Longitude'));
        let elevationValue = getTagValue(gdcElement, "ElevationAGL");
        if (elevationValue.length > 0) {
            let elevation = Number(getTagValue(gdcElement, "ElevationAGL"));
            return [latitude, longitude, elevation];
        } else {
            return [latitude, longitude];
        }
    }

// private setGDCLocation(latlng: L.LatLng) {
//     let gdcElement = getTagElement(this.element, "GDC");
//     setTagValue(gdcElement, 'Latitude', latlng.lat.toString());
//     setTagValue(gdcElement, 'Longitude', latlng.lng.toString());
//     setTagValue(gdcElement, "ElevationAGL", latlng.alt ? latlng.alt.toString() : "");
// }

    private parseGCCLocation() {
        let gccElement = getTagElement(this.element, "GCC");
        let X = Number(getTagValue(gccElement, 'X'));
        let Y = Number(getTagValue(gccElement, 'Y'));
        let Z = Number(getTagValue(gccElement, 'Z'));
        return projector.unproject(X, Y, Z);

    }
}
