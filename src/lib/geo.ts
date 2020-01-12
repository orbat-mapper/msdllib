// @ts-ignore
import * as mgrs from 'mgrs';
// @ts-ignore
import * as projector from 'ecef-projector';
import { toLatLon } from "utm";

import { getTagElement, getTagValue } from "./utils";

export type LngLatTuple = [number, number];
export type LngLatElevationTuple = [number, number, number];

export class MsdlLocation {
  location?: LngLatTuple | LngLatElevationTuple;
  coordinateChoice: string;

  constructor(private element?: Element) {
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
    } else if (this.coordinateChoice === "UTM") {
      this.location = this.parseUTMLocation();

    } else {
      // console.warn(`Unhandled coordinate choice ${this.coordinateChoice}`);
      this.location = undefined;
    }
  }

  private parseMgrsLocation(): LngLatTuple | LngLatElevationTuple {
    let mgrsElement = getTagElement(this.element, "MGRS");
    let gridZone = getTagValue(mgrsElement, "MGRSGridZone");
    let gridSquare = getTagValue(mgrsElement, "MGRSGridSquare");
    let easting = getTagValue(mgrsElement, "MGRSEasting");
    let northing = getTagValue(mgrsElement, "MGRSNorthing");
    let precision = getTagValue(mgrsElement, "MGRSPrecision");
    let mgrsString = gridZone + gridSquare + String('00000' + easting).slice(-5) + String('00000' + northing).slice(-5);
    let elevationValue = getTagValue(mgrsElement, "ElevationAGL");
    let point: LngLatTuple = mgrs.toPoint(mgrsString);
    if (elevationValue.length > 0) {
      let elevation = Number(elevationValue);
      return [point[0], point[1], elevation]
    } else {
      return point;
    }
  }

  private parseGDCLocation(): LngLatTuple | LngLatElevationTuple {
    // Geodetic coordinates in fractional degress of latitude and longitude.
    let gdcElement = getTagElement(this.element, "GDC");
    let latitude = Number(getTagValue(gdcElement, 'Latitude'));
    let longitude = Number(getTagValue(gdcElement, 'Longitude'));
    let elevationValue = getTagValue(gdcElement, "ElevationAGL");
    if (elevationValue.length > 0) {
      let elevation = Number(elevationValue);
      return [longitude, latitude, elevation];
    } else {
      return [longitude, latitude];
    }
  }

// private setGDCLocation(latlng: L.LatLng) {
//     let gdcElement = getTagElement(this.element, "GDC");
//     setTagValue(gdcElement, 'Latitude', latlng.lat.toString());
//     setTagValue(gdcElement, 'Longitude', latlng.lng.toString());
//     setTagValue(gdcElement, "ElevationAGL", latlng.alt ? latlng.alt.toString() : "");
// }

  private parseGCCLocation(): LngLatElevationTuple {
    let gccElement = getTagElement(this.element, "GCC");
    let X = Number(getTagValue(gccElement, 'X'));
    let Y = Number(getTagValue(gccElement, 'Y'));
    let Z = Number(getTagValue(gccElement, 'Z'));
    let latLonAlt = projector.unproject(X, Y, Z);
    return [latLonAlt[1], latLonAlt[0], latLonAlt[2]];
  }

  private parseUTMLocation(): LngLatTuple | LngLatElevationTuple {
    let utmElement = getTagElement(this.element, "UTM");
    let gridZone = getTagValue(utmElement, "UTMGridZone");
    const zoneLetter = gridZone[2];
    const zoneNum = Number(gridZone.substr(0, 2));
    let easting = Number(getTagValue(utmElement, "UTMEasting"));
    let northing = Number(getTagValue(utmElement, "UTMNorthing"));
    let elevationValue = getTagValue(utmElement, "ElevationAGL");
    const { latitude, longitude } = toLatLon(easting, northing, zoneNum, zoneLetter)

    if (elevationValue.length > 0) {
      let elevation = Number(elevationValue);
      return [longitude, latitude, elevation]
    } else {
      return [longitude, latitude];
    }
  }
}
