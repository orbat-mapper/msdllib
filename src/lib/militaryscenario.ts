import {ScenarioId} from "./scenarioid";
import {getTagElement, getTagElements, getTagValue} from "./utils";
import {EquipmentItem, TacticalJson, Unit} from "./unitequipment";
import {Feature, FeatureCollection, Point} from "geojson";
import {HostilityStatusCode} from "./enums";

/**
 * MilitaryScenarioType
 *
 */
export interface MilitaryScenarioType {
    scenarioId: ScenarioId;
    forceSides: any[];
    units: any[];
    equipment: any[];
}

export interface ForceSideType {
    objectHandle: string;
    name: string;
    allegianceHandle?: string;
    rootUnits: Unit[];
}

export interface AssociationType {
    affiliateHandle: string;
    relationship: HostilityStatusCode;
}

export class ForceSide implements ForceSideType {
    objectHandle: string;
    name: string;
    allegianceHandle: string;
    rootUnits: Unit[] = [];
    associations: AssociationType[] = [];

    constructor(public element: Element) {
        this.name = getTagValue(element, "ForceSideName");
        this.objectHandle = getTagValue(element, "ObjectHandle");
        this.allegianceHandle = getTagValue(element, "AllegianceHandle");
        this.initAssociations();
    }

    get isSide(): boolean {
        return !this.allegianceHandle || this.objectHandle === this.allegianceHandle;
    }

    toGeoJson(): FeatureCollection<Point, TacticalJson> {
        let features: Feature<Point>[] = [];

        function addSubordinates(subordinates: Unit[]) {
            for (let unit of subordinates) {
                features.push(unit.toGeoJson());
                if (unit.subordinates) {
                    addSubordinates(unit.subordinates);
                }
            }
        }

        for (let rootUnit of this.rootUnits) {
            features.push(rootUnit.toGeoJson());
            if (rootUnit.subordinates) {
                addSubordinates(rootUnit.subordinates);
            }
        }
        return { type: "FeatureCollection", features };
    }

    private initAssociations() {
        for (let e of getTagElements(this.element, "Association")) {
            let association = {
                affiliateHandle: getTagValue(e, "AffiliateHandle"),
                relationship: getTagValue(e, "Relationship") as HostilityStatusCode
            };
            this.associations.push(association);
        }
    }
}

export class MilitaryScenario implements MilitaryScenarioType {
    scenarioId: ScenarioId;
    forceSides: ForceSide[] = [];
    equipment: EquipmentItem[] = [];
    units: Unit[] = [];
    rootUnits: Unit[] = [];
    private unitMap: { [id: string]: Unit } = {};
    private forceSideMap: { [id: string]: ForceSide } = {};

    constructor(public element?: Element) {
        if (element) {
            this.initializeMetaInfo();
            this.initializeForceSides();
            this.initializeUnits();
            this.initializeEquipment();
        }
    }

    static createFromString(xmlString: string) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(xmlString, "text/xml");
        return new MilitaryScenario(doc.documentElement);
    }

    private initializeMetaInfo() {
        this.scenarioId = new ScenarioId(getTagElement(this.element, 'ScenarioID'));
    }

    private initializeForceSides() {
        let forceSideElements = getTagElements(this.element, "ForceSide");
        this.forceSides = [];
        for (let e of forceSideElements) {
            let forceSide = new ForceSide(e);
            this.forceSides.push(forceSide);
            this.forceSideMap[forceSide.objectHandle] = forceSide;
        }
    }

    private initializeUnits() {
        let unitElements = getTagElements(this.element, "Unit");
        for (let unitElement of unitElements) {
            let unit = new Unit(unitElement);
            this.units.push(unit);
            this.unitMap[unit.objectHandle] = unit;
        }
        this.buildHierarchy(this.units);
    }

    private buildHierarchy(units: Unit[]) {
        for (let unit of units) {
            if (!unit.superiorHandle) continue;
            if (unit.isRoot) {
                this.rootUnits.push(unit);
                let forceSide = this.forceSideMap[unit.superiorHandle];
                if (forceSide) {
                    forceSide.rootUnits.push(unit);
                }
            }
            else {
                let parentUnit = this.unitMap[unit.superiorHandle];
                if (parentUnit) {
                    parentUnit.subordinates.push(unit);
                }
            }
        }

    }

    private initializeEquipment() {
        let equipmentItemElements = getTagElements(this.element, "EquipmentItem");
        for (let equipmentItemElement of equipmentItemElements) {
            this.equipment.push(new EquipmentItem(equipmentItemElement));
        }

        // for (let equip of this.equipment) {
        //     if (!equip.organicSuperiorHandle) continue;
        //     let unit = this.unitMap[equip.organicSuperiorHandle];
        //     if (unit) {
        //         unit.equipment.push(equip);
        //     }
        // }
    }
}
