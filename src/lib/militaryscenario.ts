import {ScenarioId} from "./scenarioid";
import {getTagElement, getTagElements} from "./utils";
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

export class MilitaryScenario implements MilitaryScenarioType{
    scenarioId: ScenarioId;
    forceSides: any[] = [];
    equipment: any[] = [];
    units: any[] = [];

    constructor(public element?: Element) {
        if (element) {
            this.initializeMetaInfo();
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

    private initializeUnits() {
        let unitElements = getTagElements(this.element, "Unit");
        for (let unitElement of unitElements) {
            let unit = new Unit(unitElement);
            this.units.push(unit);
            // this.unitMap[unit.objectHandle] = unit;
        }
    }

    private initializeEquipment() {
        this.equipment = [];
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
