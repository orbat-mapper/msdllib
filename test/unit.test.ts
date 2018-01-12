import {} from 'jest'
import {parseFromString} from "./testdata";
import {Unit} from "../src/lib/unitequipment";

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
        expect(unit.objectHandle).toBe("f9e16593-2dcd-11e2-be2b-000c294c9df8")
        expect(unit.name).toBe("1/OPFOR-ARMOR");
        expect(unit.symbolIdentifier).toBe("S-G-----------G");
        expect(unit.location.length).toBe(3);
        expect(unit.location[1]).toBe(58.54383);
        expect(unit.location[0]).toBe(15.038887);
        expect(unit.location[2]).toBe(141.03737);
        expect(unit.speed).toBe(4);
        expect(unit.directionOfMovement).toBe(175.37999);
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
    })

});

