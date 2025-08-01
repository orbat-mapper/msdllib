import { describe, expect, it } from "vitest";
import { EQUIPMENT_TEMPLATE, parseFromString } from "./testdata.js";

import { EquipmentItem } from "../lib/equipment.js";
import { getTagElement, getTagValue } from "../lib/domutils.js";

import { EquipmentItemDisposition } from "../lib/disposition.js";
import { EquipmentSymbolModifiers } from "../lib/symbolmodifiers.js";

const EQUIPMENT_NO_NAME_TEMPLATE = `<EquipmentItem>
    <ObjectHandle>f9ee8509-2dcd-11e2-be2b-000c294c9df8</ObjectHandle>
    <SymbolIdentifier>S-G-EVAT------G</SymbolIdentifier>
    <EquipmentSymbolModifiers>
        <Quantity>10</Quantity>
        <CombatEffectiveness>GREEN</CombatEffectiveness>
        <UniqueDesignation>1-1-1</UniqueDesignation>
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
    expect(equipmentItem.objectHandle).toBe(
      "f9ee8509-2dcd-11e2-be2b-000c294c9df8",
    );
    expect(equipmentItem.name).toBe("111");
    expect(equipmentItem.label).toBe("111");
    expect(equipmentItem.symbolIdentifier).toBe("S-G-EVAT------G");
    expect(equipmentItem.superiorHandle).toBe(
      "f9e2ec3e-2dcd-11e2-be2b-000c294c9df8",
    );
  });

  it("should have a disposition", () => {
    let element = parseFromString(EQUIPMENT_TEMPLATE);
    let equipmentItem = new EquipmentItem(element);

    expect(equipmentItem.disposition).toBeDefined();
    if (equipmentItem.disposition && equipmentItem.disposition.location) {
      expect(equipmentItem.disposition.location.length).toBe(3);
      expect(equipmentItem.disposition.location[1]).toBe(58.538208);
      expect(equipmentItem.disposition.location[0]).toBe(15.040084);
      expect(equipmentItem.disposition.location[2]).toBe(137.71353);

      expect(equipmentItem.disposition.speed).toBe(0);
      expect(equipmentItem.disposition.directionOfMovement).toBe(176.17091);
    }
    if (equipmentItem.location) {
      expect(equipmentItem.location.length).toBe(3);
      expect(equipmentItem.location[1]).toBe(58.538208);
      expect(equipmentItem.location[0]).toBe(15.040084);
      expect(equipmentItem.location[2]).toBe(137.71353);
    }
    expect(equipmentItem.speed).toBe(0);
    expect(equipmentItem.directionOfMovement).toBe(176.17091);
  });

  it("GeoJson interface", () => {
    let element = parseFromString(EQUIPMENT_TEMPLATE);
    let equipmentItem = new EquipmentItem(element);
    let gjson = equipmentItem.toGeoJson();
    expect(gjson.id).toBe("f9ee8509-2dcd-11e2-be2b-000c294c9df8");
    expect(gjson.type).toBe("Feature");
    expect(gjson.geometry).toBeDefined();
    if (gjson.geometry) {
      expect(gjson.geometry.coordinates[1]).toBe(58.538208);
      expect(gjson.geometry.coordinates[0]).toBe(15.040084);
      expect(gjson.geometry.coordinates[2]).toBe(137.71353);
    }
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

  it("reads relations", () => {
    let element = parseFromString(EQUIPMENT_TEMPLATE);
    let equipmentItem = new EquipmentItem(element);

    expect(equipmentItem.relations).toBeDefined();
    expect(equipmentItem.relations.organicSuperiorHandle).toBe(
      "f9e2ec3e-2dcd-11e2-be2b-000c294c9df8",
    );
    expect(equipmentItem.relations.ownerChoice).toBe("UNIT");
    expect(equipmentItem.relations.ownerHandle).toBe(
      "f9e2ec3e-2dcd-11e2-be2b-000c294c9df8",
    );
    expect(equipmentItem.superiorHandle).toBe(
      "f9e2ec3e-2dcd-11e2-be2b-000c294c9df8",
    );
  });
});

describe("EquipmentItem class", () => {
  describe("when parsing an equipment element with EquipmentSymbolModifiers", () => {
    const equipment = new EquipmentItem(
      parseFromString(EQUIPMENT_NO_NAME_TEMPLATE),
    );
    it("should have a symbolModifiers attribute", () => {
      expect(equipment.symbolModifiers).toBeDefined();
      expect(equipment.symbolModifiers).toBeInstanceOf(
        EquipmentSymbolModifiers,
      );
    });
    it("should have a quantity attribute", () => {
      expect(equipment.symbolModifiers?.quantity).toBe(10);
    });
    it("should have a combatEffectiveness attribute", () => {
      expect(equipment.symbolModifiers?.combatEffectiveness).toBe("GREEN");
    });
    it("should have a uniqueDesignation attribute", () => {
      expect(equipment.symbolModifiers?.uniqueDesignation).toBe("1-1-1");
    });
    it("should use uniqueDesignation for label if name is not defined", () => {
      expect(equipment.name).toBe("");
      expect(equipment.label).toBe("1-1-1");
    });
  });

  describe("when calling toGeoJson", () => {
    const equipment = new EquipmentItem(parseFromString(EQUIPMENT_TEMPLATE));
    it("should be defined", () => {
      expect(equipment.toGeoJson).toBeDefined();
    });
    it("should by default include the id", () => {
      expect(equipment.toGeoJson().id).toBe(
        "f9ee8509-2dcd-11e2-be2b-000c294c9df8",
      );
    });
    it("should by default not include the id in properties", () => {
      expect(equipment.toGeoJson().properties.id).toBeUndefined();
    });
    it("should include the id in properties if requested", () => {
      expect(
        equipment.toGeoJson({ includeIdInProperties: true }).properties.id,
      ).toBe("f9ee8509-2dcd-11e2-be2b-000c294c9df8");
    });
    it("should not include the id if requested", () => {
      expect(equipment.toGeoJson({ includeId: false }).id).toBeUndefined();
    });
  });

  describe("when calling toString", () => {
    const equipment = new EquipmentItem(parseFromString(EQUIPMENT_TEMPLATE));
    it("should be defined", () => {
      expect(equipment.toString).toBeDefined();
    });
    it("should return a string", () => {
      let str = equipment.toString();
      expect(str).toBeDefined();
      expect(typeof str).toBe("string");
    });
    it("should return a valid XML string", () => {
      let str = equipment.toString();
      let parser = new DOMParser();
      let doc = parser.parseFromString(str, "text/xml");
      expect(doc.documentElement.nodeName).toBe("EquipmentItem");
    });
    it("should match the original XML string if unmodified", () => {
      let str = equipment.toString();
      let parser = new DOMParser();
      let doc = parser.parseFromString(str, "text/xml");
      expect(doc.documentElement).toEqual(equipment.element);
      expect(str).toBe(EQUIPMENT_TEMPLATE);
    });
  });

  describe("when setting the name", () => {
    it("should set the name", () => {
      const equipment = new EquipmentItem(parseFromString(EQUIPMENT_TEMPLATE));
      equipment.name = "New Name";
      expect(equipment.name).toBe("New Name");
    });
    it("should set the name in the XML element", () => {
      const equipment = new EquipmentItem(parseFromString(EQUIPMENT_TEMPLATE));
      expect(getTagValue(equipment.element, "Name")).toBe("111");
      equipment.name = "New Name";
      expect(equipment.element.querySelector("Name")?.textContent).toBe(
        "New Name",
      );
    });
  });
});

describe("New EquipmentItem", () => {
  const equipment = EquipmentItem.create();
  it("should be created from scratch", () => {
    expect(equipment).toBeInstanceOf(EquipmentItem);
    expect(equipment.objectHandle).toBeTypeOf("string");
    expect(equipment.objectHandle.length).toBe(36);
  });
  it("should have a minimal element tags", () => {
    expect(equipment).toBeInstanceOf(EquipmentItem);
    expect(getTagElement(equipment.element, "Relations", true)).toBeDefined();
  });
  it("should have writeable and clearable properties", () => {
    expect(equipment.name).toBe("");
    expect(equipment.disposition).toBeUndefined();
    equipment.name = "Another name";
    equipment.disposition = EquipmentItemDisposition.fromModel({
      speed: 42,
      directionOfMovement: 1,
      location: [5.0, 54.0],
    });
    expect(equipment.name).toBe("Another name");
    expect(equipment.disposition?.speed).toBe(42);
    expect(equipment.disposition?.directionOfMovement).toBe(1);
    expect(equipment.disposition?.location).toEqual([5.0, 54.0]);
    equipment.disposition = EquipmentItemDisposition.fromModel({
      speed: 9,
      directionOfMovement: 99,
      location: [5.0, 54.0],
    });
    expect(equipment.disposition?.speed).toBe(9);
    expect(equipment.disposition?.directionOfMovement).toBe(99);
    expect(equipment.disposition?.location).toEqual([5.0, 54.0]);
    equipment.disposition = undefined;
    expect(equipment.disposition).toBeUndefined();
  });
  it("should match the original when going to XML string and back", () => {
    let unitOriginal = EquipmentItem.create();
    unitOriginal.name = "MyName";
    unitOriginal.disposition = EquipmentItemDisposition.fromModel({
      speed: 42,
      directionOfMovement: 1,
      location: [5.0, 54.0],
    });
    let strOriginal = unitOriginal.toString();
    let geojOrignal = unitOriginal.toGeoJson();
    let parser = new DOMParser();
    let doc = parser.parseFromString(strOriginal, "text/xml");
    expect(doc.documentElement).toEqual(unitOriginal.element);
    let unitAgain = new EquipmentItem(doc.documentElement);
    expect(unitAgain.toString()).toBe(strOriginal);
    expect(unitAgain.toGeoJson()).toEqual(geojOrignal);
  });
  it("should have a location property directly accessible", () => {
    equipment.disposition = EquipmentItemDisposition.fromModel({
      speed: 42,
      directionOfMovement: 1,
      location: [5.0, 54.0],
    });
    expect(equipment.location).toEqual([5.0, 54.0]);
  });
  it("should update from a model", () => {
    equipment.updateFromObject({
      name: "Battery",
      sidc: "SH-------------",
    });
    expect(equipment.name, "Relations").toBe("Battery");
  });
});

const EQUIPMENT_FORCE_OWNER_TEMPLATE = `<EquipmentItem>
    <ObjectHandle>f9ee8509-2dcd-11e2-be2b-000c294c9df8</ObjectHandle>
    <SymbolIdentifier>S-G-EVAT------G</SymbolIdentifier>
    <Name>111</Name>

    <Relations>
        <OrganicSuperiorHandle>f9e2ec3e-2dcd-11e2-be2b-xxxxxxxxxxxx</OrganicSuperiorHandle>
   
        <HoldingOrganization>
            <OwnerChoice>FORCE_SIDE</OwnerChoice>
            <OwnerData>
                <ForceOwnerHandle>f9e2ec3e-2dcd-11e2-be2b-000c294c9df8</ForceOwnerHandle>
            </OwnerData>
        </HoldingOrganization>
    </Relations>
    <Model>
        <Resolution>HIGH</Resolution>
    </Model>
</EquipmentItem>`;

const EQUIPMENT_NO_DIFFERENT_ORGANIC_TEMPLATE = `<EquipmentItem>
    <ObjectHandle>f9ee8509-2dcd-11e2-be2b-000c294c9df8</ObjectHandle>
    <SymbolIdentifier>S-G-EVAT------G</SymbolIdentifier>
    <Name>111</Name>
 
    <Relations>
        <OrganicSuperiorHandle>f9e2ec3e-2dcd-11e2-be2b-000c294ccccc</OrganicSuperiorHandle>
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

describe("EquipmentItem relations", () => {
  it("should have a relations property", () => {
    const equipment = new EquipmentItem(parseFromString(EQUIPMENT_TEMPLATE));
    expect(equipment.relations).toBeDefined();
    expect(equipment.relations.organicSuperiorHandle).toBe(
      "f9e2ec3e-2dcd-11e2-be2b-000c294c9df8",
    );
    expect(equipment.relations.ownerChoice).toBe("UNIT");
    expect(equipment.relations.ownerHandle).toBe(
      "f9e2ec3e-2dcd-11e2-be2b-000c294c9df8",
    );
    expect(equipment.superiorHandle).toBe(
      "f9e2ec3e-2dcd-11e2-be2b-000c294c9df8",
    );
  });

  it("should support FORCE_OWNER relations", () => {
    const equipment = new EquipmentItem(
      parseFromString(EQUIPMENT_FORCE_OWNER_TEMPLATE),
    );
    expect(equipment.relations).toBeDefined();
    expect(equipment.relations.ownerChoice).toBe("FORCE_SIDE");
    expect(equipment.relations.ownerHandle).toBe(
      "f9e2ec3e-2dcd-11e2-be2b-000c294c9df8",
    );
    expect(equipment.superiorHandle).toBe(
      "f9e2ec3e-2dcd-11e2-be2b-000c294c9df8",
    );
  });

  it("should prefer UNIT relations over organic relations", () => {
    const equipment = new EquipmentItem(
      parseFromString(EQUIPMENT_NO_DIFFERENT_ORGANIC_TEMPLATE),
    );
    expect(equipment.relations).toBeDefined();
    expect(equipment.relations.organicSuperiorHandle).toBe(
      "f9e2ec3e-2dcd-11e2-be2b-000c294ccccc",
    );
    expect(equipment.relations.ownerChoice).toBe("UNIT");
    expect(equipment.relations.ownerHandle).toBe(
      "f9e2ec3e-2dcd-11e2-be2b-000c294c9df8",
    );
    expect(equipment.superiorHandle).toBe(
      "f9e2ec3e-2dcd-11e2-be2b-000c294c9df8",
    );
  });
});
