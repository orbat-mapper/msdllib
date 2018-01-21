import {ScenarioId} from "./scenarioid";
import {getTagElement, getTagElements, getTagValue} from "./utils";
import {EquipmentItem, Unit} from "./unitequipment";

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
}

export class ForceSide implements ForceSideType {
    objectHandle: string;
    name: string;
    allegianceHandle: string;


    constructor(public element: Element) {
        this.name = getTagValue(element, "ForceSideName");
        this.objectHandle = getTagValue(element, "ObjectHandle");
        this.allegianceHandle = getTagValue(element, "AllegianceHandle");
    }

    get isSide(): boolean {
        return !this.allegianceHandle || this.objectHandle === this.allegianceHandle;
    }
}

export class MilitaryScenario implements MilitaryScenarioType {
    scenarioId: ScenarioId;
    forceSides: ForceSideType[] = [];
    equipment: EquipmentItem[] = [];
    units: Unit[] = [];
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
            // this.unitMap[unit.objectHandle] = unit;
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
