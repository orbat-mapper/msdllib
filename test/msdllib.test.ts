import {MilitaryScenario} from "../src/index";
import {} from 'jest'
import {EMPTY_SCENARIO} from "./testdata";

describe("MilitaryScenario", () => {
    it("defined", () => {
        expect(MilitaryScenario).toBeDefined();
    });

    it("create from Element", () => {
        let parser = new DOMParser();
        let doc = parser.parseFromString(EMPTY_SCENARIO, "text/xml");
        let element = doc.documentElement;
        let scenario = new MilitaryScenario(element);
        expect(scenario.element).toBeInstanceOf(Element);
        expect(scenario.element).toBe(element);

    });

    it("create from string", () => {
        let scenario = MilitaryScenario.createFromString(EMPTY_SCENARIO);
        expect(scenario).toBeInstanceOf(MilitaryScenario);
        expect(scenario.element).toBeInstanceOf(Element);
        expect(scenario.units).toBeInstanceOf(Array);
        expect(scenario.units.length).toBe(0);
        expect(scenario.equipment).toBeInstanceOf(Array);
        expect(scenario.equipment.length).toBe(0);
    });

    it("empty", () => {
        let scenario = MilitaryScenario.createFromString(EMPTY_SCENARIO);
        expect(scenario.units).toBeInstanceOf(Array);
        expect(scenario.units.length).toBe(0);
        expect(scenario.equipment).toBeInstanceOf(Array);
        expect(scenario.equipment.length).toBe(0);
        expect(scenario.forceSides).toBeInstanceOf(Array);
        expect(scenario.forceSides.length).toBe(0);
    });

});

