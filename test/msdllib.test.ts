import {MilitaryScenario, ScenarioId} from "../src/index";
import {} from 'jest'
import {EMPTY_SCENARIO} from "./testdata";
import * as fs from "fs";

describe("MilitaryScenario class", () => {
    it("is defined", () => {
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

    it("create empty scenario", () => {
        let scenario = new MilitaryScenario();
        expect(scenario.units).toBeInstanceOf(Array);
        expect(scenario.units.length).toBe(0);
        expect(scenario.equipment).toBeInstanceOf(Array);
        expect(scenario.equipment.length).toBe(0);
        expect(scenario.forceSides).toBeInstanceOf(Array);
        expect(scenario.forceSides.length).toBe(0);
    });

    it("load from file", () => {
        let data = fs.readFileSync(__dirname + '/data/minimal.xml', { encoding: "utf-8" });


        let scenario = MilitaryScenario.createFromString(data.toString());
        expect(scenario.units).toBeInstanceOf(Array);
        expect(scenario.units.length).toBe(0);
        expect(scenario.equipment).toBeInstanceOf(Array);
        expect(scenario.equipment.length).toBe(0);
        expect(scenario.forceSides).toBeInstanceOf(Array);
        expect(scenario.forceSides.length).toBe(0);
        expect(scenario.scenarioId).toBeInstanceOf(ScenarioId);
        expect(scenario.scenarioId.name).toBe("Empty scenario");
    });
});


describe("Simple scenario", () => {
    it("load from file", () => {
        let data = fs.readFileSync(__dirname + '/data/SimpleScenario.xml', { encoding: "utf-8" });
        let scenario = MilitaryScenario.createFromString(data.toString());
        expect(scenario.units).toBeInstanceOf(Array);
        expect(scenario.units.length).toBe(1);
        expect(scenario.equipment).toBeInstanceOf(Array);
        expect(scenario.equipment.length).toBe(1);
        expect(scenario.forceSides).toBeInstanceOf(Array);
        expect(scenario.forceSides.length).toBe(3);
        expect(scenario.scenarioId).toBeInstanceOf(ScenarioId);
        expect(scenario.scenarioId.name).toBe("Simple scenario");
    });
});

