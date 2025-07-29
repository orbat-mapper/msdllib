import { describe, expect, it } from "vitest";
import { UnitSymbolModifiers } from "../lib/symbolmodifiers.js";
import { parseFromString, UNIT_ATTACHED, UNIT_TEMPLATE } from "./testdata.js";
import { Unit } from "../lib/units.js";

const UNIT_SYMBOL_MODIFIERS_TEMPLATE = `<UnitSymbolModifiers>
    <UniqueDesignation>4</UniqueDesignation>
    <HigherFormation>2-33 AR</HigherFormation>
    <Echelon>BATTALION</Echelon>
    <CombatEffectiveness>GREEN</CombatEffectiveness>
</UnitSymbolModifiers>`;

describe("UnitSymbolModifiers class", () => {
  it("should be defined", () => {
    expect(UnitSymbolModifiers).toBeDefined();
  });

  it("should create an instance from XML element", () => {
    const element = parseFromString(UNIT_SYMBOL_MODIFIERS_TEMPLATE);
    const modifiers = new UnitSymbolModifiers(element);
    expect(modifiers).toBeInstanceOf(UnitSymbolModifiers);
    expect(modifiers.uniqueDesignation).toBe("4");
    expect(modifiers.higherFormation).toBe("2-33 AR");
    expect(modifiers.echelon).toBe("BATTALION");
    expect(modifiers.combatEffectiveness).toBe("GREEN");
    expect(modifiers.iff).toBeUndefined();
  });

  it("should have a toString method that returns XML", () => {
    const element = parseFromString(UNIT_SYMBOL_MODIFIERS_TEMPLATE);
    const modifiers = new UnitSymbolModifiers(element);
    const xmlString = modifiers.toString();
    expect(xmlString).toContain("<UnitSymbolModifiers>");
    expect(xmlString).toContain("<UniqueDesignation>4</UniqueDesignation>");
    expect(xmlString).toContain("<HigherFormation>2-33 AR</HigherFormation>");
    expect(xmlString).toContain("<Echelon>BATTALION</Echelon>");
    expect(xmlString).toContain(
      "<CombatEffectiveness>GREEN</CombatEffectiveness>",
    );
  });

  it("should have a toObject method that returns an object representation", () => {
    const element = parseFromString(UNIT_SYMBOL_MODIFIERS_TEMPLATE);
    const modifiers = new UnitSymbolModifiers(element);
    const obj = modifiers.toObject();
    expect(obj).toEqual({
      uniqueDesignation: "4",
      higherFormation: "2-33 AR",
      echelon: "BATTALION",
      combatEffectiveness: "GREEN",
    });
  });

  it("can be created from model", () => {
    const modifiers = UnitSymbolModifiers.fromModel({
      uniqueDesignation: "4",
      higherFormation: "2-33 AR",
      echelon: "BATTALION",
      combatEffectiveness: "GREEN",
      iff: "IFF123",
      reinforcedReduced: "REINFORCED",
      staffComments: "Test comment",
      additionalInfo: "Additional info",
      specialC2HQ: "C2 HQ",
    });
    expect(modifiers).toBeInstanceOf(UnitSymbolModifiers);
    expect(modifiers.uniqueDesignation).toBe("4");
    expect(modifiers.higherFormation).toBe("2-33 AR");
    expect(modifiers.echelon).toBe("BATTALION");
    expect(modifiers.combatEffectiveness).toBe("GREEN");
    // test serialization
    const xmlString = modifiers.toString();
    const element = parseFromString(xmlString);
    expect(element.tagName).toBe("UnitSymbolModifiers");
  });

  it("can be modified", () => {
    const element = parseFromString(UNIT_SYMBOL_MODIFIERS_TEMPLATE);
    const modifiers = new UnitSymbolModifiers(element);

    // Modify properties
    modifiers.echelon = "COMPANY";
    modifiers.reinforcedReduced = "REINFORCED";
    modifiers.staffComments = "Test comment";
    modifiers.additionalInfo = "Additional info";
    modifiers.combatEffectiveness = "YELLOW";
    modifiers.higherFormation = "1-23 IN";
    modifiers.iff = "IFF123";

    // Check modifications
    expect(modifiers.echelon).toBe("COMPANY");
    expect(modifiers.reinforcedReduced).toBe("REINFORCED");
    expect(modifiers.staffComments).toBe("Test comment");
    expect(modifiers.additionalInfo).toBe("Additional info");
    expect(modifiers.combatEffectiveness).toBe("YELLOW");
    expect(modifiers.higherFormation).toBe("1-23 IN");
    expect(modifiers.iff).toBe("IFF123");

    // Check after converting back to XML
    const xmlString = modifiers.toString();
    const newSymbolModifiers = new UnitSymbolModifiers(
      parseFromString(xmlString),
    );
    expect(newSymbolModifiers.echelon).toBe("COMPANY");
    expect(newSymbolModifiers.reinforcedReduced).toBe("REINFORCED");
    expect(newSymbolModifiers.staffComments).toBe("Test comment");
    expect(newSymbolModifiers.additionalInfo).toBe("Additional info");
    expect(newSymbolModifiers.combatEffectiveness).toBe("YELLOW");
    expect(newSymbolModifiers.higherFormation).toBe("1-23 IN");
    expect(newSymbolModifiers.iff).toBe("IFF123");
  });

  it("should have a method to update from an object", () => {
    const element = parseFromString(UNIT_SYMBOL_MODIFIERS_TEMPLATE);
    const modifiers = new UnitSymbolModifiers(element);

    // Update with new data
    modifiers.updateFromObject({
      uniqueDesignation: "5",
      echelon: "REGIMENT",
      combatEffectiveness: undefined, // Should be removed
    });

    // Check updated properties
    expect(modifiers.uniqueDesignation).toBe("5");
    expect(modifiers.higherFormation).toBe("2-33 AR");
    expect(modifiers.echelon).toBe("REGIMENT");
    expect(modifiers.combatEffectiveness).toBeUndefined();

    // Check XML representation
    const xmlString = modifiers.toString();
    expect(xmlString).not.toContain("<CombatEffectiveness>");
    expect(xmlString).toContain("<UniqueDesignation>5</UniqueDesignation>");
    expect(xmlString).toContain("<Echelon>REGIMENT</Echelon>");
  });
});

describe("Unit.symbolModifiers property", () => {
  it("should be defined", () => {
    const unit = new Unit(parseFromString(UNIT_ATTACHED));
    expect(unit.symbolModifiers).toBeDefined();
    expect(unit.symbolModifiers).toBeInstanceOf(UnitSymbolModifiers);
  });

  it("should create a UnitSymbolModifiers element if not already created", () => {
    const unit = new Unit(parseFromString(UNIT_TEMPLATE));
    expect(unit.symbolModifiers).toBeUndefined;
    unit.symbolModifiers = UnitSymbolModifiers.fromModel({
      uniqueDesignation: "1",
      iff: "IFF123",
      echelon: "COMPANY",
    });
    expect(unit.symbolModifiers).toBeDefined();
    expect(unit.symbolModifiers).toBeInstanceOf(UnitSymbolModifiers);

    // check after serialization
    const xmlString = unit.toString();
    const newUnit = new Unit(parseFromString(xmlString));
    expect(newUnit.symbolModifiers).toBeDefined();
    expect(newUnit.symbolModifiers?.uniqueDesignation).toBe("1");
    expect(newUnit.symbolModifiers?.iff).toBe("IFF123");
    expect(newUnit.symbolModifiers?.echelon).toBe("COMPANY");
  });

  it("should support object syntax for setting properties", () => {
    const unit = new Unit(parseFromString(UNIT_TEMPLATE));
    unit.symbolModifiers = {
      uniqueDesignation: "2",
      iff: "IFF456",
      echelon: "PLATOON",
      combatEffectiveness: "GREEN",
    };
    expect(unit.symbolModifiers).toBeDefined();
    expect(unit.symbolModifiers?.uniqueDesignation).toBe("2");
    expect(unit.symbolModifiers?.iff).toBe("IFF456");
    expect(unit.symbolModifiers?.echelon).toBe("PLATOON");
    expect(unit.symbolModifiers?.combatEffectiveness).toBe("GREEN");

    // check after serialization
    const xmlString = unit.toString();
    const newUnit = new Unit(parseFromString(xmlString));
    expect(newUnit.symbolModifiers?.uniqueDesignation).toBe("2");
    expect(newUnit.symbolModifiers?.iff).toBe("IFF456");
    expect(newUnit.symbolModifiers?.echelon).toBe("PLATOON");
    expect(newUnit.symbolModifiers?.combatEffectiveness).toBe("GREEN");
  });
});
