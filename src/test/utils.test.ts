import { describe, it, expect } from "vitest";
import { getBooleanValue, getNumberValue } from "../lib/domutils.js";
import { parseFromString } from "./testdata.js";

const TEST = `<SymbolModifiers>
    <Echelon>COMPANY</Echelon>
    <CombatEffectiveness>GREEN</CombatEffectiveness>
    <HigherFormation>OPFOR-ARMOR</HigherFormation>
    <UniqueDesignation>1</UniqueDesignation>
    <Quantity>44</Quantity>
    <TowedSonarArray>true</TowedSonarArray>
    <TowedSonarArray2>1</TowedSonarArray2>
    <TowedSonarArray3>false</TowedSonarArray3>
    <TowedSonarArray4>0</TowedSonarArray4>
    <TowedSonarArray5></TowedSonarArray5>
    
</SymbolModifiers>
`;

describe("getBooleanValue", () => {
  const element = parseFromString(TEST);

  it('should return true for "true" string', () => {
    expect(getBooleanValue(element, "TowedSonarArray")).toBe(true);
  });

  it('should return true for "1" string', () => {
    expect(getBooleanValue(element, "TowedSonarArray2")).toBe(true);
  });

  it('should return false for "false" string', () => {
    expect(getBooleanValue(element, "TowedSonarArray3")).toBe(false);
  });

  it('should return false for "0" string', () => {
    expect(getBooleanValue(element, "TowedSonarArray4")).toBe(false);
  });

  it("should return undefined for missing tag", () => {
    expect(getBooleanValue(element, "missing")).toBeUndefined();
  });

  it("should return undefined for empty element", () => {
    expect(getBooleanValue(element, "TowedSonarArray5")).toBeUndefined();
  });
});

describe("getNumbverValue", () => {
  const element = parseFromString(TEST);

  it("should return number for number string", () => {
    expect(getNumberValue(element, "Quantity")).toBe(44);
  });

  it("should return undefined for missing tag", () => {
    expect(getNumberValue(element, "missing")).toBeUndefined();
  });

  it("should return undefined for empty element", () => {
    expect(getNumberValue(element, "TowedSonarArray5")).toBeUndefined();
  });

  it("should return undefined for alphabetic string", () => {
    expect(getNumberValue(element, "CombatEffectiveness")).toBeUndefined();
  });
});
