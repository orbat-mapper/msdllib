import {
  getTagElement,
  getValueOrUndefined,
  removeUndefinedValues,
  setOrCreateTagValue,
} from "./domutils.js";
import { MsdlCoordinates } from "./geo.js";
import type { BBox, Feature, Polygon } from "geojson";
import { bboxPolygon } from "@turf/bbox-polygon";
import { truncate as truncateFeature } from "@turf/truncate";
import { round } from "@turf/helpers";

/**
 * MSDL Environment element
 */

export interface EnvironmentType {
  scenarioTime?: string;
  areaOfInterest?: RectangleAreaType;
  // ScenarioWeather and METOC elements are not supported
}

export interface RectangleAreaType {
  name?: string;
  upperRight: MsdlCoordinates;
  lowerLeft: MsdlCoordinates;
}

export class Environment implements EnvironmentType {
  static readonly TAG_NAME = "Environment";
  element: Element;
  areaOfInterest?: RectangleArea;
  #scenarioTime?: string;
  constructor(element: Element) {
    this.element = element;
    this.#scenarioTime = getValueOrUndefined(element, "ScenarioTime");
    const areaOfInterestElement = getTagElement(element, "AreaOfInterest");
    if (areaOfInterestElement) {
      this.areaOfInterest = new RectangleArea(areaOfInterestElement);
    } else {
      this.areaOfInterest = undefined;
    }
  }

  get scenarioTime(): string | undefined {
    return (
      this.#scenarioTime ?? getValueOrUndefined(this.element, "ScenarioTime")
    );
  }

  set scenarioTime(value: string | undefined) {
    this.#scenarioTime = value;
    setOrCreateTagValue(this.element, "ScenarioTime", value);
  }

  toObject(): EnvironmentType {
    return removeUndefinedValues({
      scenarioTime: this.scenarioTime,
      areaOfInterest: this.areaOfInterest?.toObject(),
    }) as EnvironmentType;
  }
}

export class RectangleArea {
  element: Element;
  #name?: string;
  upperRight: MsdlCoordinates;
  lowerLeft: MsdlCoordinates;

  constructor(element: Element) {
    this.element = element;
    this.#name = getValueOrUndefined(element, "Name");
    const upperRightElement = getTagElement(element, "UpperRight");
    if (upperRightElement) {
      this.upperRight = new MsdlCoordinates(upperRightElement);
    } else {
      throw new Error("UpperRight coordinates are required for RectangleArea");
    }
    const lowerLeftElement = getTagElement(element, "LowerLeft");
    if (!lowerLeftElement) {
      throw new Error("LowerLeft coordinates are required for RectangleArea");
    }
    this.lowerLeft = new MsdlCoordinates(lowerLeftElement);
  }

  get name(): string | undefined {
    return this.#name ?? getValueOrUndefined(this.element, "Name");
  }

  set name(value: string | undefined) {
    this.#name = value;
    setOrCreateTagValue(this.element, "Name", value);
  }

  toObject(): RectangleAreaType {
    return removeUndefinedValues({
      name: this.name,
      upperRight: this.upperRight.toObject(),
      lowerLeft: this.lowerLeft.toObject(),
    }) as RectangleAreaType;
  }

  toBoundingBox(): BBox | null {
    if (!this.upperRight || !this.lowerLeft) {
      return null;
    }
    const lowerLeftCoords = this.lowerLeft.location!;
    const upperRightCoords = this.upperRight.location!;
    return [
      lowerLeftCoords[0],
      lowerLeftCoords[1],
      upperRightCoords[0],
      upperRightCoords[1],
    ].map((coord) => round(coord, 6)) as BBox;
  }

  toGeoJson(): Feature<Polygon> | null {
    const bbox = this.toBoundingBox();
    if (!bbox) {
      return null;
    }

    return truncateFeature(
      bboxPolygon(bbox, { properties: { name: this.name } }),
    );
  }
}
