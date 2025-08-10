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
    // expect(relations.commandRelationshipType).toBe("ATTACHED");
  });
});
