/**
 * Test cases for UnitRelations and EquipmentRelations
 */

import { describe, expect, it } from "vitest";
import { UnitRelations } from "../lib/relations.js";
import { createXMLElement } from "../lib/domutils.js";

const UNIT_COMMAND_RELATION_XML = `<Relations>
    <ForceRelation>
        <ForceRelationChoice>UNIT</ForceRelationChoice>
        <ForceRelationData>
            <CommandRelation>
                <CommandingSuperiorHandle>f9c2b9f6-2dcd-11e2-be2b-000c294c9df8</CommandingSuperiorHandle>
                <CommandRelationshipType>ATTACHED</CommandRelationshipType>
            </CommandRelation>
        </ForceRelationData>
    </ForceRelation>
</Relations>`;

const UNIT_FORCE_RELATION_XML = `<Relations>
    <ForceRelation>
        <ForceRelationChoice>FORCE_SIDE</ForceRelationChoice>
        <ForceRelationData>
            <ForceSideHandle>f9c2b9f6-2dcd-11e2-be2b-000c294c9df8</ForceSideHandle>
        </ForceRelationData>
    </ForceRelation>
</Relations>`;

describe("UnitRelations class ", () => {
  it("should be defined", () => {
    expect(UnitRelations).toBeDefined();
  });

  it("should be created from an Element", () => {
    const element = createXMLElement(UNIT_COMMAND_RELATION_XML);
    const relations = new UnitRelations(element);
    expect(relations).toBeInstanceOf(UnitRelations);
    expect(relations.forceRelationChoice).toBe("UNIT");
    expect(relations.isCommandRelation).toBe(true);
    expect(relations.isForceSideRelation).toBe(false);
    expect(relations.superiorHandle).toBe(
      "f9c2b9f6-2dcd-11e2-be2b-000c294c9df8",
    );
    expect(relations.commandRelationshipType).toBe("ATTACHED");
  });
});

describe("UnitRelation Command relations", () => {
  it("should parse command relations from XML", () => {
    const element = createXMLElement(UNIT_COMMAND_RELATION_XML);
    const relations = new UnitRelations(element);
    expect(relations.isCommandRelation).toBe(true);
    expect(relations.isForceSideRelation).toBe(false);
    expect(relations.superiorHandle).toBe(
      "f9c2b9f6-2dcd-11e2-be2b-000c294c9df8",
    );
    expect(relations.commandRelationshipType).toBe("ATTACHED");
  });

  it("should have a toObject method", () => {
    const element = createXMLElement(UNIT_COMMAND_RELATION_XML);
    const relations = new UnitRelations(element);
    const obj = relations.toObject();
    expect(obj).toEqual({
      forceRelationChoice: "UNIT",
      superiorHandle: "f9c2b9f6-2dcd-11e2-be2b-000c294c9df8",
      commandRelationshipType: "ATTACHED",
    });
  });
});

describe("UnitRelations ForceSide relations", () => {
  it("should handle ForceSide relations", () => {
    const element = createXMLElement(UNIT_FORCE_RELATION_XML);
    const relations = new UnitRelations(element);
    expect(relations).toBeInstanceOf(UnitRelations);
    expect(relations.forceRelationChoice).toBe("FORCE_SIDE");
    expect(relations.isCommandRelation).toBe(false);
    expect(relations.isForceSideRelation).toBe(true);
    expect(relations.superiorHandle).toBe(
      "f9c2b9f6-2dcd-11e2-be2b-000c294c9df8",
    );
    expect(relations.commandRelationshipType).toBeUndefined();
  });

  it("should have a toObject method for ForceSide relations", () => {
    const element = createXMLElement(UNIT_FORCE_RELATION_XML);
    const relations = new UnitRelations(element);
    const obj = relations.toObject();
    expect(obj).toEqual({
      forceRelationChoice: "FORCE_SIDE",
      superiorHandle: "f9c2b9f6-2dcd-11e2-be2b-000c294c9df8",
      commandRelationshipType: undefined,
    });
  });
});
