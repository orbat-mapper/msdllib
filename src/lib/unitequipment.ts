import {getTagElement, getTagElements, getTagValue} from "./utils";
import {Feature, Point} from "geojson";
import {LngLatElevationTuple, LngLatTuple, MsdlLocation} from "./geo";

export interface TacticalJson {
    sidc?: string;
    speed?: number;
    direction?: number;
}

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

export class UnitEquipmentBase implements UnitEquipmentInterface {
    location: LngLatTuple | LngLatElevationTuple;
    speed: number;
    directionOfMovement: number;
    symbolIdentifier: string;
    name: string;
    objectHandle: string;
    protected _msdlLocation: MsdlLocation;

    constructor(readonly element: Element) {
        this.objectHandle = getTagValue(element, "ObjectHandle");
        this.symbolIdentifier = getTagValue(this.element, "SymbolIdentifier");
        this.name = getTagValue(element, "Name");
        this.getDisposition();
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

export class Unit extends UnitEquipmentBase implements UnitEquipmentInterface {
    constructor(readonly element: Element) {
        super(element);
    }

    toGeoJson(): Feature<Point, TacticalJson> {
        let feature: Feature<Point>;
        let properties: TacticalJson = {};

        if (this.speed) {
            properties.speed = this.speed;
        }
        if (this.directionOfMovement) {
            properties.direction = this.directionOfMovement;
        }

        feature = {
            id: this.objectHandle,
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: this.location
            },
            properties
        };
        return feature;
    }
}

export class EquipmentItem extends UnitEquipmentBase {
    constructor(readonly element: Element) {
        super(element);
    }

}
