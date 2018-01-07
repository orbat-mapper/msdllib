import {getTagElements, getTagValue} from "./utils";

export interface UnitType {
    objectHandle : string;
    symbolIdentifier: string;
    name: string;
    location: Number[];
}

export class Unit implements UnitType{
    symbolIdentifier: string;
    name: string;
    location: Number[];
    objectHandle: string;
    constructor (readonly element: Element) {
        this.objectHandle = getTagValue(element, "ObjectHandle");
        this.symbolIdentifier = getTagValue(this.element, "SymbolIdentifier");
        this.name = getTagValue(element, "Name");


    }
}
