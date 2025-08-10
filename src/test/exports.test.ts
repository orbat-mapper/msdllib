import { describe, expect, it } from "vitest";
import * as pkg from "../index.js";

describe("Package exports", () => {
  it("should export ForceSide", () => {
    expect(pkg.ForceSide).toBeDefined();
  });

  it("should export Association", () => {
    expect(pkg.Association).toBeDefined();
  });

  it("should export UnitSymbolModifiers", () => {
    expect(pkg.UnitSymbolModifiers).toBeDefined();
  });

  it("should export EquipmentSymbolModifiers", () => {
    expect(pkg.EquipmentSymbolModifiers).toBeDefined();
  });

  it("should export UnitRelations", () => {
    expect(pkg.UnitRelations).toBeDefined();
  });
});
