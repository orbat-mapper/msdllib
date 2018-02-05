import {getTagElement, getTagElements, getTagValue, setCharAt} from "./utils";
import {Feature, Point} from "geojson";
import {LngLatElevationTuple, LngLatTuple, MsdlLocation} from "./geo";
import {ForceOwnerType, StandardIdentities} from "./enums";

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
    superiorHandle: string;
    sidc: string;
}

export class UnitEquipmentBase implements UnitEquipmentInterface {
    sidc: string;
    location: LngLatTuple | LngLatElevationTuple;
    speed: number;
    directionOfMovement: number;
    symbolIdentifier: string;
    name: string;
    objectHandle: string;
    superiorHandle: string;
    protected _msdlLocation: MsdlLocation;

    constructor(readonly element: Element) {
        this.objectHandle = getTagValue(element, "ObjectHandle");
        this.symbolIdentifier = getTagValue(this.element, "SymbolIdentifier");
        this.name = getTagValue(element, "Name");
        this.getDisposition();
        this.sidc = setCharAt(this.symbolIdentifier,1, StandardIdentities.NoneSpecified);

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
    equipment: EquipmentItem[] = [];
    subordinates: Unit[] = [];
    private forceRelationChoice: ForceOwnerType;

    constructor(readonly element: Element) {
        super(element);
        this.initializeRelations();
        this.initializeSymbol();
    }

    get isRoot(): boolean {
        return this.forceRelationChoice === ForceOwnerType.ForceSide;
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
        properties.sidc = this.sidc;

        feature = {
            id: this.objectHandle,
            type: "Feature",
            geometry: this.location ? {
                type: "Point",
                coordinates: this.location
            } : null,
            properties
        };
        return feature;
    }

    setAffilitation(s: StandardIdentities) {
        this.sidc = setCharAt(this.sidc, 1, s);
        for (let equipment of this.equipment) {
            equipment.setAffilitation(s);
        }
    }

    private initializeRelations() {
        let forceRelationChoice = getTagValue(this.element, "ForceRelationChoice");

        if (forceRelationChoice === ForceOwnerType.Unit) {
            this.forceRelationChoice = ForceOwnerType.Unit;
            this.superiorHandle = getTagValue(this.element, "CommandingSuperiorHandle");
        } else if (forceRelationChoice === ForceOwnerType.ForceSide) {
            this.forceRelationChoice = ForceOwnerType.ForceSide;
            this.superiorHandle = getTagValue(this.element, "ForceSideHandle");
        } else {
            console.error("Invalid ForceRelationChoice " + this.forceRelationChoice)
        }
        // Todo: Add support for support and organic relations

    }

    private initializeSymbol() {
        //
    }


}

export class EquipmentItem extends UnitEquipmentBase {
    constructor(readonly element: Element) {
        super(element);
        // Todo: OrganicSuperiorHandle not necessarily set.
        this.superiorHandle = getTagValue(element, "OrganicSuperiorHandle");
    }

    toGeoJson(): Feature<Point, TacticalJson> {
        let feature: Feature<Point>;
        let properties: TacticalJson = {};

        if (this.speed !== undefined) {
            properties.speed = this.speed;
        }
        if (this.directionOfMovement !== undefined) {
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

    public setAffilitation(s: string) {
        this.sidc = setCharAt(this.symbolIdentifier, 1, s);
    }
}
