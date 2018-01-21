import {} from 'jest'
import {parseFromString} from "./testdata";
import {EquipmentItem} from "../src/lib/unitequipment";
import {ForceSide, MilitaryScenario, ScenarioId} from "../src";
import * as fs from "fs";

const FORCESIDE_TEMPLATE = `<ForceSide>
    <ObjectHandle>e7ad0e8d-2dcd-11e2-be2b-000c294c9df8</ObjectHandle>
    <ForceSideName>Friendly</ForceSideName>
    <AllegianceHandle>e7ad0e8d-2dcd-11e2-be2b-000c294c9df8</AllegianceHandle>
    <Associations>
        <Association>
            <AffiliateHandle>e7ae4710-2dcd-11e2-be2b-000c294c9df8</AffiliateHandle>
            <Relationship>HO</Relationship>
        </Association>
    </Associations>
</ForceSide>`;


describe("ForceSide class", () => {
    it("is defined", () => {
        expect(ForceSide).toBeDefined();
    });

    it("create from Element", () => {
        let element = parseFromString(FORCESIDE_TEMPLATE);
        let forceSide = new ForceSide(element);
        expect(forceSide).toBeInstanceOf(ForceSide);
    });

    it("read attributes", () => {
        let element = parseFromString(FORCESIDE_TEMPLATE);
        let forceSide = new ForceSide(element);
        expect(forceSide.objectHandle).toBe("e7ad0e8d-2dcd-11e2-be2b-000c294c9df8");
        expect(forceSide.allegianceHandle).toBe("e7ad0e8d-2dcd-11e2-be2b-000c294c9df8");
        expect(forceSide.name).toBe("Friendly");
        expect(forceSide.isSide).toBe(true);
    });
});

describe("Side relations", () => {
    it("root units", () => {
        let data = fs.readFileSync(__dirname + '/data/SimpleScenario.xml', { encoding: "utf-8" });
        let scenario = MilitaryScenario.createFromString(data.toString());
        expect(scenario.forceSides).toBeInstanceOf(Array);
        expect(scenario.forceSides.length).toBe(3);
        let forceSide = scenario.forceSides[0];
        expect(forceSide.name).toBe("Friendly");
        expect(forceSide.rootUnits.length).toBe(1);
        expect(forceSide.rootUnits[0].name).toBe("HQ");
    });
});

