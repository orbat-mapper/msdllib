import {getTagElement, getTagElements, getTagValue} from "./utils";
import {Feature, Point} from "geojson";
import {MsdlLocation} from "./geo";

export interface UnitEquipmentInterface {
    objectHandle: string;
    symbolIdentifier: string;
    name: string;
    location: number[];
}

export class Unit implements UnitEquipmentInterface {
    symbolIdentifier: string;
    name: string;
    location: number[];
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
        this._msdlLocation = new MsdlLocation(dispositionElement);
        this.location = this._msdlLocation.location;
    }
}
