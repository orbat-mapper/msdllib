/**
 * MilitaryScenarioType
 *
 */


export interface MilitaryScenarioType {
    forceSides: any[];
    units: any[];
    equipment: any[];
}

export class MilitaryScenario implements MilitaryScenarioType{
    forceSides: any[] = [];
    equipment: any[] = [];
    units: any[] = [];

    constructor(public element: Element) {

    }

    static createFromString(xmlString: string) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(xmlString, "text/xml");
        return new MilitaryScenario(doc.documentElement);
    }
}
