import { describe, expect, it } from "vitest";
import {
  MODEL_TYPE_TEMPLATE_NETN,
  parseFromString,
  UNIT_NETN,
} from "./testdata.js";
import { UnitModelType } from "../lib/modelType.js";
import { Unit } from "../lib/units.js";
import { xmlToString } from "../lib/domutils.js";

describe("ModelType class", () => {
  describe("when parsing a ModelType from XML", () => {
    const modelType = new UnitModelType(
      parseFromString(MODEL_TYPE_TEMPLATE_NETN),
    );

    it("should have a Resolution", () => {
      expect(modelType.resolution).toBeDefined();
      expect(modelType.resolution).toBe("HIGH");
    });

    it("should have an EntityType", () => {
      expect(modelType.entityType).toBeDefined();
      expect(modelType.entityType).toBe("1.1.0.3.17.4.0");
    });
  });

  describe("when modifying a ModelType", () => {
    it("should be able to modify the Resolution", () => {
      const modelType = new UnitModelType(
        parseFromString(MODEL_TYPE_TEMPLATE_NETN),
      );

      expect(modelType.resolution).toBe("HIGH");
      modelType.resolution = "ENHANCED";
      expect(modelType.resolution).toBe("ENHANCED");
      const modelType2 = new UnitModelType(
        parseFromString(xmlToString(modelType.element)),
      );
      expect(modelType2.resolution).toBe("ENHANCED");
    });

    it("should be able to modify the EntityType", () => {
      const modelType = new UnitModelType(
        parseFromString(MODEL_TYPE_TEMPLATE_NETN),
      );

      expect(modelType.entityType).toBe("1.1.0.3.17.4.0");
      modelType.entityType = "1.9.9.3.17.4.9";
      expect(modelType.entityType).toBe("1.9.9.3.17.4.9");
      const modelType2 = new UnitModelType(
        parseFromString(xmlToString(modelType.element)),
      );
      expect(modelType2.entityType).toBe("1.9.9.3.17.4.9");
    });

    describe("when parsing a Unit with Model from XML", () => {
      const unit = new Unit(parseFromString(UNIT_NETN));
      it("should have a ModelType", () => {
        expect(unit.model).toBeDefined();
        expect(unit.model).toBeInstanceOf(UnitModelType);
        expect(unit.model?.resolution).toBeUndefined();
        expect(unit.model?.entityType).toBe("0.1.0.0.5.2.0");
      });
    });
  });
});
