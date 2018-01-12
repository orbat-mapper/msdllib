import {getTagElement, getTagElements, getTagValue} from "./utils";
import {Feature, Point} from "geojson";
import {LngLatElevationTuple, LngLatTuple, MsdlLocation} from "./geo";

export interface UnitEquipmentInterface {
    objectHandle: string;
    symbolIdentifier: string;
    name: string;
    location: LngLatTuple | LngLatElevationTuple;
    /** The field speed in meters per second */
    speed: number;
    /** The direction of movement, in compass degrees */
    directionOfMovement: number;
}

export class Unit implements UnitEquipmentInterface {
    location: LngLatTuple | LngLatElevationTuple;
    speed: number;
    directionOfMovement: number;
    symbolIdentifier: string;
    name: string;
    objectHandle: string;
    private _msdlLocation: MsdlLocation;

    constructor(readonly element: Element) {
        this.objectHandle = getTagValue(element, "ObjectHandle");
        this.symbolIdentifier = getTagValue(this.element, "SymbolIdentifier");
        this.name = getTagValue(element, "Name");
        this.getDisposition();
    }

    toGeoJson(): Feature<Point> {
        let feature: Feature<Point>;
        feature = {
            id: this.objectHandle,
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: this.location
            },
            properties: null
        };
        return feature;
    }

    private getDisposition() {
        let dispositionElement = getTagElement(this.element, "Disposition");
        let speed = getTagValue(dispositionElement, "Speed");
        let directionOfMovement = getTagValue(dispositionElement, "DirectionOfMovement");
        this.speed = speed ? +speed : undefined;
        this.directionOfMovement = directionOfMovement ? +directionOfMovement : undefined;
        this._msdlLocation = new MsdlLocation(dispositionElement);
        this.location = this._msdlLocation.location;
    }
}
