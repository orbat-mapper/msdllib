import { describe, expect, it } from "vitest";
import * as pkg from "../index.js";

describe("Package exports", () => {
  it("should export ForceSide", () => {
    expect(pkg.ForceSide).toBeDefined();
  });

  it("should export Association", () => {
    expect(pkg.Association).toBeDefined();
  });
});
