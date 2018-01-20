import {} from 'jest'
import {parseFromString} from "./testdata";
import {EquipmentItem} from "../src/lib/unitequipment";

const EQUIPMENT_TEMPLATE = `<EquipmentItem>
    <ObjectHandle>f9ee8509-2dcd-11e2-be2b-000c294c9df8</ObjectHandle>
    <SymbolIdentifier>S-G-EVAT------G</SymbolIdentifier>
    <Name>111</Name>
    <EquipmentSymbolModifiers>
        <Quantity>1</Quantity>
        <CombatEffectiveness>GREEN</CombatEffectiveness>
        <UniqueDesignation>111</UniqueDesignation>
        <EquipmentType>T-80B</EquipmentType>
    </EquipmentSymbolModifiers>
    <Disposition>
        <Location>
            <CoordinateChoice>GDC</CoordinateChoice>
            <CoordinateData>
                <GDC>
                    <Latitude>58.538208</Latitude>
                    <Longitude>15.040084</Longitude>
                    <ElevationAGL>137.71353</ElevationAGL>
                </GDC>
            </CoordinateData>
        </Location>
        <DirectionOfMovement>176.17091</DirectionOfMovement>
        <Speed>0.0</Speed>
        <FormationPosition>
            <FormationOrder>1</FormationOrder>
        </FormationPosition>
    </Disposition>
    <Relations>
        <OrganicSuperiorHandle>f9e2ec3e-2dcd-11e2-be2b-000c294c9df8</OrganicSuperiorHandle>
        <HoldingOrganization>
            <OwnerChoice>UNIT</OwnerChoice>
            <OwnerData>
                <UnitOwnerHandle>f9e2ec3e-2dcd-11e2-be2b-000c294c9df8</UnitOwnerHandle>
            </OwnerData>
        </HoldingOrganization>
    </Relations>
    <Model>
        <Resolution>HIGH</Resolution>
    </Model>
</EquipmentItem>`;

const EQUIPMENT_NO_SPEED_DIRECTION = `<EquipmentItem>
    <ObjectHandle>f9ee8509-2dcd-11e2-be2b-000c294c9df8</ObjectHandle>
    <SymbolIdentifier>S-G-EVAT------G</SymbolIdentifier>
    <Name>111</Name>
    <EquipmentSymbolModifiers>
        <Quantity>1</Quantity>
        <CombatEffectiveness>GREEN</CombatEffectiveness>
        <UniqueDesignation>111</UniqueDesignation>
        <EquipmentType>T-80B</EquipmentType>
    </EquipmentSymbolModifiers>
    <Disposition>
        <Location>
            <CoordinateChoice>GDC</CoordinateChoice>
            <CoordinateData>
                <GDC>
                    <Latitude>58.538208</Latitude>
                    <Longitude>15.040084</Longitude>
                    <ElevationAGL>137.71353</ElevationAGL>
                </GDC>
            </CoordinateData>
        </Location>
        <FormationPosition>
            <FormationOrder>1</FormationOrder>
        </FormationPosition>
    </Disposition>
    <Relations>
        <OrganicSuperiorHandle>f9e2ec3e-2dcd-11e2-be2b-000c294c9df8</OrganicSuperiorHandle>
        <HoldingOrganization>
            <OwnerChoice>UNIT</OwnerChoice>
            <OwnerData>
                <UnitOwnerHandle>f9e2ec3e-2dcd-11e2-be2b-000c294c9df8</UnitOwnerHandle>
            </OwnerData>
        </HoldingOrganization>
    </Relations>
    <Model>
        <Resolution>HIGH</Resolution>
    </Model>
</EquipmentItem>`;


describe("MSDL Equipment", () => {
    it("defined", () => {
        expect(EquipmentItem).toBeDefined();
    });

    it("create from Element", () => {
        let element = parseFromString(EQUIPMENT_TEMPLATE);
        let equipmentItem = new EquipmentItem(element);
        expect(equipmentItem).toBeInstanceOf(EquipmentItem);
    });

    it("read data", () => {
        let element = parseFromString(EQUIPMENT_TEMPLATE);
        let equipmentItem = new EquipmentItem(element);
        expect(equipmentItem.objectHandle).toBe("f9ee8509-2dcd-11e2-be2b-000c294c9df8");
        expect(equipmentItem.name).toBe("111");
        expect(equipmentItem.symbolIdentifier).toBe("S-G-EVAT------G");
        expect(equipmentItem.location.length).toBe(3);
        expect(equipmentItem.location[1]).toBe(58.538208);
        expect(equipmentItem.location[0]).toBe(15.040084);
        expect(equipmentItem.location[2]).toBe(137.71353);
        expect(equipmentItem.speed).toBe(0);
        expect(equipmentItem.directionOfMovement).toBe(176.17091);
        expect(equipmentItem.superiorHandle).toBe("f9e2ec3e-2dcd-11e2-be2b-000c294c9df8");
    });

    it("GeoJson interface", () => {
        let element = parseFromString(EQUIPMENT_TEMPLATE);
        let equipmentItem = new EquipmentItem(element);
        let gjson = equipmentItem.toGeoJson();
        expect(gjson.id).toBe("f9ee8509-2dcd-11e2-be2b-000c294c9df8");
        expect(gjson.type).toBe("Feature");
        expect(gjson.geometry.coordinates[1]).toBe(58.538208);
        expect(gjson.geometry.coordinates[0]).toBe(15.040084);
        expect(gjson.geometry.coordinates[2]).toBe(137.71353);
        expect(gjson.properties.speed).toBe(0);
        expect(gjson.properties.direction).toBe(176.17091);
    });

    it("undefined speed and direction", () => {
        let element = parseFromString(EQUIPMENT_NO_SPEED_DIRECTION);
        let equipmentItem = new EquipmentItem(element);
        expect(equipmentItem.speed).toBeUndefined();
        expect(equipmentItem.directionOfMovement).toBeUndefined();
        let gjson = equipmentItem.toGeoJson();
        expect(gjson.properties.speed).toBeUndefined();
        expect(gjson.properties.direction).toBeUndefined();
    });
});

