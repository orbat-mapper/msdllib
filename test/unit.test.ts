import {} from 'jest'
import {parseFromString} from "./testdata";
import {Unit} from "../src/lib/unitequipment";
import * as fs from "fs";
import {MilitaryScenario, ScenarioId} from "../src";
import {loadTestScenario} from "./testutils";

const UNIT_TEMPLATE = ` <Unit>
                <ObjectHandle>f9e16593-2dcd-11e2-be2b-000c294c9df8</ObjectHandle>
                <SymbolIdentifier>S-G-----------G</SymbolIdentifier>
                <Name>1/OPFOR-ARMOR</Name>
                <UnitSymbolModifiers>
                    <Echelon>COMPANY</Echelon>
                    <CombatEffectiveness>GREEN</CombatEffectiveness>
                    <HigherFormation>OPFOR-ARMOR</HigherFormation>
                    <UniqueDesignation>1</UniqueDesignation>
                </UnitSymbolModifiers>
                <Disposition>
                    <Location>
                        <CoordinateChoice>GDC</CoordinateChoice>
                        <CoordinateData>
                            <GDC>
                                <Latitude>58.54383</Latitude>
                                <Longitude>15.038887</Longitude>
                                <ElevationAGL>141.03737</ElevationAGL>
                            </GDC>
                        </CoordinateData>
                    </Location>
                    <DirectionOfMovement>175.37999</DirectionOfMovement>
                    <Speed>4</Speed>
                    <FormationPosition>
                        <OutOfFormation>false</OutOfFormation>
                        <FormationOrder>2</FormationOrder>
                        <SensorOrientation>0.0</SensorOrientation>
                    </FormationPosition>
                    <OwnFormation>
                        <FormationLocationType>LEAD_ELEMENT</FormationLocationType>
                        <FormationSpacing>250.0</FormationSpacing>
                        <FormationOrientation>175.37999</FormationOrientation>
                        <FormationChoice>GROUND</FormationChoice>
                        <FormationData>
                            <GroundFormationType>WEDGE</GroundFormationType>
                        </FormationData>
                    </OwnFormation>
                </Disposition>
                <Relations>
                    <ForceRelation>
                        <ForceRelationChoice>UNIT</ForceRelationChoice>
                        <ForceRelationData>
                            <CommandRelation>
                                <CommandingSuperiorHandle>f9c2b9f6-2dcd-11e2-be2b-000c294c9df8</CommandingSuperiorHandle>
                                <CommandRelationshipType>ATTACHED</CommandRelationshipType>
                            </CommandRelation>
                        </ForceRelationData>
                    </ForceRelation>
                </Relations>
                <Model>
                    <Resolution>HIGH</Resolution>
                    <AggregateBased>false</AggregateBased>
                </Model>
            </Unit>`;

const UNIT_NO_DISPOSITION = `<Unit>
    <ObjectHandle>f9e16593-2dcd-11e2-be2b-000c294c9df8</ObjectHandle>
    <SymbolIdentifier>S-G-----------G</SymbolIdentifier>
    <Name>1/OPFOR-ARMOR</Name>
    <UnitSymbolModifiers>
        <Echelon>COMPANY</Echelon>
        <CombatEffectiveness>GREEN</CombatEffectiveness>
        <HigherFormation>OPFOR-ARMOR</HigherFormation>
        <UniqueDesignation>1</UniqueDesignation>
    </UnitSymbolModifiers>
    <Relations>
        <ForceRelation>
            <ForceRelationChoice>UNIT</ForceRelationChoice>
            <ForceRelationData>
                <CommandRelation>
                    <CommandingSuperiorHandle>f9c2b9f6-2dcd-11e2-be2b-000c294c9df8</CommandingSuperiorHandle>
                    <CommandRelationshipType>ATTACHED</CommandRelationshipType>
                </CommandRelation>
            </ForceRelationData>
        </ForceRelation>
    </Relations>
    <Model>
        <Resolution>HIGH</Resolution>
        <AggregateBased>false</AggregateBased>
    </Model>
</Unit>`;


describe("MSDL Unit", () => {
    it("defined", () => {
        expect(Unit).toBeDefined();
    });

    it("create from Element", () => {
        let element = parseFromString(UNIT_TEMPLATE);
        let unit = new Unit(element);
        expect(unit).toBeInstanceOf(Unit);
    });

    it("read data", () => {
        let element = parseFromString(UNIT_TEMPLATE);
        let unit = new Unit(element);
        expect(unit.objectHandle).toBe("f9e16593-2dcd-11e2-be2b-000c294c9df8");
        expect(unit.name).toBe("1/OPFOR-ARMOR");
        expect(unit.symbolIdentifier).toBe("S-G-----------G");
        expect(unit.location.length).toBe(3);
        expect(unit.location[1]).toBe(58.54383);
        expect(unit.location[0]).toBe(15.038887);
        expect(unit.location[2]).toBe(141.03737);
        expect(unit.speed).toBe(4);
        expect(unit.directionOfMovement).toBe(175.37999);
        expect(unit.isRoot).toBe(false);
        expect(unit.superiorHandle).toBe("f9c2b9f6-2dcd-11e2-be2b-000c294c9df8");
    });

    it("GeoJson interface", () => {
        let element = parseFromString(UNIT_TEMPLATE);
        let unit = new Unit(element);
        let gjson = unit.toGeoJson();
        expect(gjson.id).toBe("f9e16593-2dcd-11e2-be2b-000c294c9df8");
        expect(gjson.type).toBe("Feature");
        expect(gjson.geometry.type).toBe("Point");
        expect(gjson.geometry.coordinates[1]).toBe(58.54383);
        expect(gjson.geometry.coordinates[0]).toBe(15.038887);
        expect(gjson.geometry.coordinates[2]).toBe(141.03737);
        expect(gjson.properties.speed).toBe(4);
        expect(gjson.properties.direction).toBe(175.37999);
        expect(gjson.properties.sidc).toBe("S-G-----------G")

    });

    it("no disposition", () => {
        let element = parseFromString(UNIT_NO_DISPOSITION);
        let unit = new Unit(element);
        expect(unit.location).toBeUndefined();
        expect(unit.speed).toBeUndefined();
        expect(unit.directionOfMovement).toBeUndefined();
        let gjson = unit.toGeoJson();
        expect(gjson.geometry).toBeNull();
        expect(gjson.properties.speed).toBeUndefined();
        expect(gjson.properties.direction).toBeUndefined();
    });
});

describe("Unit relations", () => {
    it("subordinates", () => {
        let scenario = loadTestScenario();
        expect(scenario.rootUnits.length).toBe(2);
        let hq = scenario.rootUnits[0];
        expect(hq.name).toBe("HQ");
        expect(hq.subordinates.length).toBe(2);
        expect(hq.subordinates[0].name).toBe("1th");
        expect(hq.subordinates[1].name).toBe("2nd");
    });
});


