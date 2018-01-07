import {ScenarioId} from "./scenarioid";
import {getTagElement} from "./utils";

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

    constructor(public element: Element) {
        this.initializeMetaInfo()
    }

    static createFromString(xmlString: string) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(xmlString, "text/xml");
        return new MilitaryScenario(doc.documentElement);
    }

    private initializeMetaInfo() {
        this.scenarioId = new ScenarioId(getTagElement(this.element, 'ScenarioID'));
    }
}
