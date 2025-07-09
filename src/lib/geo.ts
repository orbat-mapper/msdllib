import * as mgrs from "mgrs";
// @ts-ignore
import * as projector from "ecef-projector";
import { toLatLon } from "utm";

import {
  createEmptyXMLElementFromTagName,
  getNumberValue,
  getTagElement,
  getTagValue,
  removeTagValue,
  removeUndefinedValues,
  setOrCreateTagValue,
} from "./domutils.js";
import type {
  CoordinateChoice,
  LngLatElevationTuple,
  LngLatTuple,
} from "./types.js";
import type { Feature, Point, Position } from "geojson";

export interface MsdlCoordinatesType {
  coordinateChoice?: CoordinateChoice;
  location?: LngLatTuple | LngLatElevationTuple;
}

export class MsdlCoordinates implements MsdlCoordinatesType {
  #location?: LngLatTuple | LngLatElevationTuple;
  #coordinateChoice?: CoordinateChoice;
  element: Element;

  constructor(element: Element) {
    this.element = element;
    this.coordinateChoice = getTagValue(
      this.element,
      "CoordinateChoice",
    ) as CoordinateChoice;

    this.parseLocation();
  }

  get coordinateChoice(): CoordinateChoice | undefined {
    return (
      this.#coordinateChoice ??
      (getTagValue(this.element, "CoordinateChoice") as CoordinateChoice)
    );
  }

  set coordinateChoice(coordinateChoice: CoordinateChoice) {
    this.#coordinateChoice = coordinateChoice;
    setOrCreateTagValue(this.element, "CoordinateChoice", coordinateChoice);
    if (this.#location) this.writeLocation(this.#location);
  }

  get location(): LngLatTuple | LngLatElevationTuple | undefined {
    return this.#location;
  }

  set location(loc: LngLatTuple | LngLatElevationTuple) {
    this.#location = loc;
    if (!loc) return;
    this.writeLocation(loc);
  }

  private writeLocation(loc: LngLatTuple | LngLatElevationTuple) {
    if (this.coordinateChoice === "GDC") {
      this.writeGDCLocation(loc);
    } else if (this.coordinateChoice === "MGRS") {
      this.writeMGRSLocation(loc);
      // } else if (this.coordinateChoice === "GCC") {
      //   this.#location = this.writeGCCLocation();
      // } else if (this.coordinateChoice === "UTM") {
      //   this.#location = this.writeUTMLocation();
    } else {
      console.warn(`Unhandled coordinate choice ${this.coordinateChoice}`);
    }
  }

  private writeGDCLocation(loc: LngLatTuple | LngLatElevationTuple) {
    setOrCreateTagValue(this.element, "CoordinateChoice", "GDC");
    removeTagValue(this.element, "CoordinateData");
    const dataElement = createEmptyXMLElementFromTagName("CoordinateData");
    const gdcElement = createEmptyXMLElementFromTagName("GDC");
    if (loc.length >= 2) {
      // LngLatTuple
      setOrCreateTagValue(gdcElement, "Latitude", loc[1].toString());
      setOrCreateTagValue(gdcElement, "Longitude", loc[0].toString());
    }
    if (loc.length === 2) {
      removeTagValue(gdcElement, "ElevationAGL");
    } else if (loc.length === 3) {
      // LngLatElevationTuple
      setOrCreateTagValue(gdcElement, "ElevationAGL", loc[2].toString());
    }
    dataElement.appendChild(gdcElement);
    this.element.appendChild(dataElement);
  }

  private writeMGRSLocation(loc: LngLatTuple | LngLatElevationTuple) {
    if (loc.length >= 2) {
      // LngLatTuple
      setOrCreateTagValue(this.element, "CoordinateChoice", "MGRS");
      let mgrsString = mgrs.forward([loc[0], loc[1]], 5);
      let gridZone = mgrsString.slice(0, 3);
      let gridSquare = mgrsString.slice(3, 5);
      let easting = mgrsString.slice(5, 10);
      let northing = mgrsString.slice(10, 15);
      setOrCreateTagValue(this.element, "MGRSGridZone", gridZone);
      setOrCreateTagValue(this.element, "MGRSGridSquare", gridSquare);
      setOrCreateTagValue(this.element, "MGRSEasting", easting);
      setOrCreateTagValue(this.element, "MGRSNorthing", northing);
    }
    if (loc.length === 2) {
      removeTagValue(this.element, "ElevationAGL");
    }
    if (loc.length === 3) {
      // LngLatElevationTuple
      setOrCreateTagValue(this.element, "ElevationAGL", loc[2].toString());
    }
  }

  private parseLocation() {
    if (this.coordinateChoice === "MGRS") {
      this.#location = this.parseMgrsLocation();
    } else if (this.coordinateChoice === "GDC") {
      this.#location = this.parseGDCLocation();
    } else if (this.coordinateChoice === "GCC") {
      this.#location = this.parseGCCLocation();
    } else if (this.coordinateChoice === "UTM") {
      this.#location = this.parseUTMLocation();
    } else {
      // console.warn(`Unhandled coordinate choice ${this.coordinateChoice}`);
      this.#location = undefined;
    }
  }

  private parseMgrsLocation(): LngLatTuple | LngLatElevationTuple {
    let mgrsElement = getTagElement(this.element, "MGRS");
    let gridZone = getTagValue(mgrsElement, "MGRSGridZone");
    let gridSquare = getTagValue(mgrsElement, "MGRSGridSquare");
    let easting = getTagValue(mgrsElement, "MGRSEasting");
    let northing = getTagValue(mgrsElement, "MGRSNorthing");
    let precision = getTagValue(mgrsElement, "MGRSPrecision");
    let mgrsString =
      gridZone +
      gridSquare +
      String("00000" + easting).slice(-5) +
      String("00000" + northing).slice(-5);
    let elevationValue = getTagValue(mgrsElement, "ElevationAGL");
    let point: LngLatTuple = mgrs.toPoint(mgrsString);
    if (elevationValue.length > 0) {
      let elevation = Number(elevationValue);
      return [point[0], point[1], elevation];
    } else {
      return point;
    }
  }

  private parseGDCLocation(): LngLatTuple | LngLatElevationTuple {
    // Geodetic coordinates in fractional degrees of latitude and longitude.
    let gdcElement = getTagElement(this.element, "GDC");
    let latitude = Number(getTagValue(gdcElement, "Latitude"));
    let longitude = Number(getTagValue(gdcElement, "Longitude"));
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
    let X = Number(getTagValue(gccElement, "X"));
    let Y = Number(getTagValue(gccElement, "Y"));
    let Z = Number(getTagValue(gccElement, "Z"));
    let latLonAlt = projector.unproject(X, Y, Z);
    return [latLonAlt[1], latLonAlt[0], latLonAlt[2]];
  }

  private parseUTMLocation(): LngLatTuple | LngLatElevationTuple {
    let utmElement = getTagElement(this.element, "UTM");
    let gridZone = getTagValue(utmElement, "UTMGridZone");
    const zoneLetter = gridZone[2] ?? "";
    const zoneNum = Number(gridZone.slice(0, 2));
    let easting = Number(getTagValue(utmElement, "UTMEasting"));
    let northing = Number(getTagValue(utmElement, "UTMNorthing"));
    let elevationValue = getTagValue(utmElement, "ElevationAGL");
    const { latitude, longitude } = toLatLon(
      easting,
      northing,
      zoneNum,
      zoneLetter,
    );

    if (elevationValue.length > 0) {
      let elevation = Number(elevationValue);
      return [longitude, latitude, elevation];
    } else {
      return [longitude, latitude];
    }
  }

  static createGDCLocation(
    lngLat: LngLatTuple | LngLatElevationTuple,
    options: { tagName?: string } = {},
  ): MsdlLocation {
    const tagName = options.tagName ?? "Location";
    const msdlLoc = MsdlCoordinates.createEmtpy("GDC", tagName);
    msdlLoc.location = lngLat;
    return msdlLoc;
  }

  static createEmtpy(
    coordinateChoice: CoordinateChoice,
    tagName: string,
  ): MsdlLocation {
    const msdlLocation = new MsdlLocation(
      createEmptyXMLElementFromTagName(tagName),
    );
    msdlLocation.coordinateChoice = coordinateChoice;
    return msdlLocation;
  }

  toObject(): MsdlCoordinatesType {
    return removeUndefinedValues({
      coordinateChoice: this.coordinateChoice,
      location: this.location,
    });
  }

  toGeoJson(): Feature<Point> {
    if (!this.location) {
      throw new Error("Location is not set");
    }
    const [lng, lat, elevation] = this.location;
    const coordinates: Position =
      elevation !== undefined ? [lng, lat, elevation] : [lng, lat];
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates,
      },
      properties: {},
    };
  }
}

export class MsdlLocation extends MsdlCoordinates {
  static readonly TAG_NAME = "Location";

  static create(coordinateChoice: CoordinateChoice) {
    return MsdlCoordinates.createEmtpy(coordinateChoice, MsdlLocation.TAG_NAME);
  }
}

export type DispositionType = {
  directionOfMovement?: number;
  location?: LngLatTuple | LngLatElevationTuple;
  speed?: number;
};

export class DispositionBase {
  static readonly TAG_NAME = "Disposition";
  element: Element;
  #directionOfMovement?: number;
  #speed?: number;
  #msdlLocation?: MsdlLocation;

  constructor(element: Element) {
    this.element = element;
    this.#directionOfMovement = getNumberValue(element, "DirectionOfMovement");
    this.#speed = getNumberValue(element, "Speed");
    let locationElement = getTagElement(element, MsdlLocation.TAG_NAME);
    if (locationElement) {
      this.#msdlLocation = new MsdlLocation(locationElement);
    }
    // this.location = this.#msdlLocation?.location;
  }

  get location(): LngLatTuple | LngLatElevationTuple | undefined {
    return this.#msdlLocation?.location;
  }

  set location(loc: LngLatTuple | LngLatElevationTuple | undefined) {
    if (!loc) {
      this.#msdlLocation = undefined;
      removeTagValue(this.element, MsdlLocation.TAG_NAME);
      return;
    }
    if (!this.#msdlLocation) {
      console.warn("MsdlLocation is not initialized");
      this.#msdlLocation = MsdlLocation.createGDCLocation(loc);
    }
    this.#msdlLocation.location = loc;
    this.element.appendChild(this.#msdlLocation.element);
  }

  get directionOfMovement(): number | undefined {
    return (
      this.#directionOfMovement ??
      getNumberValue(this.element, "DirectionOfMovement")
    );
  }

  set directionOfMovement(direction: number | undefined) {
    this.#directionOfMovement = direction;
    setOrCreateTagValue(
      this.element,
      "DirectionOfMovement",
      direction?.toString(),
    );
  }

  get speed(): number | undefined {
    return this.#speed ?? getNumberValue(this.element, "Speed");
  }

  set speed(speed: number | undefined) {
    this.#speed = speed;
    setOrCreateTagValue(this.element, "Speed", speed?.toString());
  }

  toObject(): DispositionType {
    return removeUndefinedValues({
      directionOfMovement: this.directionOfMovement,
      speed: this.speed,
      location: this.location,
    });
  }

  updateFromObject(data: Partial<DispositionType>) {
    Object.entries(data).forEach(([key, value]) => {
      if (key in this) {
        (this as any)[key] = value;
      } else {
        console.warn(`Property ${key} does not exist.`);
      }
    });
  }
}

export class UnitDisposition extends DispositionBase {
  constructor(element: Element) {
    super(element);
  }

  static fromModel(model: Partial<DispositionType>): UnitDisposition {
    const disposition = UnitDisposition.create();
    disposition.updateFromObject(model);
    return disposition;
  }

  static create(): UnitDisposition {
    return new UnitDisposition(
      createEmptyXMLElementFromTagName(UnitDisposition.TAG_NAME),
    );
  }
}

export class EquipmentItemDisposition extends DispositionBase {
  constructor(element: Element) {
    super(element);
  }

  static fromModel(model: Partial<DispositionType>): EquipmentItemDisposition {
    const disposition = EquipmentItemDisposition.create();
    disposition.updateFromObject(model);
    return disposition;
  }

  static create(): EquipmentItemDisposition {
    return new EquipmentItemDisposition(
      createEmptyXMLElementFromTagName(EquipmentItemDisposition.TAG_NAME),
    );
  }
}
