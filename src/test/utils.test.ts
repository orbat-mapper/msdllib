import { describe, it, expect } from "vitest";
import {
  getBooleanValue,
  getNumberValue,
  setOrCreateTagValue,
  setTagValue,
} from "../lib/domutils.js";
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

describe("setTagValue", () => {
  it("should set the value of the tag", () => {
    const element = parseFromString(TEST);
    const tagName = "UniqueDesignation";
    const newValue = "NewValue";
    setTagValue(element, tagName, newValue);
    expect(element.getElementsByTagName(tagName)[0]?.textContent).toBe(
      newValue,
    );
  });
});

describe("setOrCreateTagValue", () => {
  it("should set the value of the tag if it exists", () => {
    const element = parseFromString(TEST);
    const tagName = "UniqueDesignation";
    const newValue = "NewValue";
    setOrCreateTagValue(element, tagName, newValue);
    expect(element.getElementsByTagName(tagName)[0]?.textContent).toBe(
      newValue,
    );
  });

  it("should create the tag if it does not exist", () => {
    const element = parseFromString(TEST);
    const tagName = "NewTag";
    const newValue = "NewValue";
    setOrCreateTagValue(element, tagName, newValue);
    expect(element.getElementsByTagName(tagName)[0]?.textContent).toBe(
      newValue,
    );
  });

  it("should remove the tag if deleteIfNull is true and value is null", () => {
    const element = parseFromString(TEST);
    const tagName = "UniqueDesignation";
    setOrCreateTagValue(element, tagName, null, { deleteIfNull: true });
    expect(element.getElementsByTagName(tagName).length).toBe(0);
  });

  it("should allow setting a different namespace", () => {
    const element = parseFromString(TEST);
    const tagName = "UniqueDesignation";
    const newValue = "NewValue";
    setOrCreateTagValue(element, tagName, newValue, { namespace: "ttt" });
    expect(element.getElementsByTagNameNS("ttt", tagName)[0]?.textContent).toBe(
      newValue,
    );
  });
});
