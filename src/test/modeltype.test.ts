import { describe, expect, it } from "vitest";
import {
  EQUIPMENT_NETN,
  EQUIPMENT_NO_MODEL_TEMPLATE,
  EQUIPMENT_TEMPLATE,
  parseFromString,
  UNIT_MGRS,
  UNIT_NETN,
} from "./testdata.js";
import { EquipmentModel, UnitModel } from "../lib/modelType.js";
import { Unit } from "../lib/units.js";
import { xmlToString } from "../lib/domutils.js";
import { EquipmentItem } from "../lib/equipment.js";

export const EQUIPMENT_MODEL_TYPE_TEMPLATE = `<Model>
    <Resolution>HIGH</Resolution>
    <EntityType>1.1.0.3.17.4.0</EntityType>
</Model>`;

export const UNIT_MODEL_TYPE_TEMPLATE_NETN = `<Model>
    <Resolution>HIGH</Resolution>
    <EntityType>1.1.0.3.17.4.0</EntityType>
    <AggregateBased>true</AggregateBased>
</Model>`;

describe("UnitModelType class", () => {
  describe("when parsing a ModelType from XML", () => {
    const modelType = new UnitModel(
      parseFromString(UNIT_MODEL_TYPE_TEMPLATE_NETN),
    );

    it("should have a Resolution", () => {
      expect(modelType.resolution).toBeDefined();
      expect(modelType.resolution).toBe("HIGH");
    });

    it("should have an EntityType", () => {
      expect(modelType.entityType).toBeDefined();
      expect(modelType.entityType).toBe("1.1.0.3.17.4.0");
    });

    it("should have an AggregateBased flag", () => {
      expect(modelType.aggregateBased).toBeDefined();
      expect(modelType.aggregateBased).toBe(true);
    });
  });

  describe("when modifying a ModelType", () => {
    it("should be able to modify the Resolution", () => {
      const modelType = new UnitModel(
        parseFromString(UNIT_MODEL_TYPE_TEMPLATE_NETN),
      );

      expect(modelType.resolution).toBe("HIGH");
      modelType.resolution = "ENHANCED";
      expect(modelType.resolution).toBe("ENHANCED");
      const modelType2 = new UnitModel(
        parseFromString(xmlToString(modelType.element)),
      );
      expect(modelType2.resolution).toBe("ENHANCED");
    });

    it("should be able to modify the EntityType", () => {
      const modelType = new UnitModel(
        parseFromString(UNIT_MODEL_TYPE_TEMPLATE_NETN),
      );

      expect(modelType.entityType).toBe("1.1.0.3.17.4.0");
      modelType.entityType = "1.9.9.3.17.4.9";
      expect(modelType.entityType).toBe("1.9.9.3.17.4.9");
      const modelType2 = new UnitModel(
        parseFromString(xmlToString(modelType.element)),
      );
      expect(modelType2.entityType).toBe("1.9.9.3.17.4.9");
    });

    it("should be able to modify the AggregateBased flag", () => {
      const modelType = new UnitModel(
        parseFromString(UNIT_MODEL_TYPE_TEMPLATE_NETN),
      );

      expect(modelType.aggregateBased).toBe(true);
      modelType.aggregateBased = false;
      expect(modelType.aggregateBased).toBe(false);
      const modelType2 = new UnitModel(
        parseFromString(xmlToString(modelType.element)),
      );
      expect(modelType2.aggregateBased).toBe(false);
    });

    describe("when parsing a Unit with Model from XML", () => {
      const unit = new Unit(parseFromString(UNIT_NETN));
      it("should have a ModelType", () => {
        expect(unit.model).toBeDefined();
        expect(unit.model).toBeInstanceOf(UnitModel);
        expect(unit.model?.resolution).toBeUndefined();
        expect(unit.model?.entityType).toBe("0.1.0.0.5.2.0");
      });
    });

    describe("when parsing a Unit with no Model from XML", () => {
      it("should not have a ModelType", () => {
        const unit = new Unit(parseFromString(UNIT_MGRS));
        expect(unit.model).toBeUndefined();
      });

      it("should be possible to create a UnitModel ", () => {
        const unit = new Unit(parseFromString(UNIT_MGRS));
        expect(unit.model).toBeUndefined();
        unit.model = {
          entityType: "1.2.3.4.5",
          resolution: "HIGH",
          aggregateBased: true,
        };
        expect(unit.model).toBeInstanceOf(UnitModel);
        expect(unit.model?.entityType).toBe("1.2.3.4.5");
        expect(unit.model?.resolution).toBe("HIGH");
        expect(unit.model?.aggregateBased).toBe(true);

        const unit2 = new Unit(parseFromString(xmlToString(unit.element)));
        expect(unit2.model).toBeInstanceOf(UnitModel);
        expect(unit2.model?.entityType).toBe("1.2.3.4.5");
        expect(unit2.model?.resolution).toBe("HIGH");
        expect(unit2.model?.aggregateBased).toBe(true);
      });
    });
  });
});

describe("EquipmentModelType class", () => {
  describe("when parsing a ModelType from XML", () => {
    const modelType = new EquipmentModel(
      parseFromString(UNIT_MODEL_TYPE_TEMPLATE_NETN),
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
      const modelType = new EquipmentModel(
        parseFromString(EQUIPMENT_MODEL_TYPE_TEMPLATE),
      );

      expect(modelType.resolution).toBe("HIGH");
      modelType.resolution = "ENHANCED";
      expect(modelType.resolution).toBe("ENHANCED");
      const modelType2 = new UnitModel(
        parseFromString(xmlToString(modelType.element)),
      );
      expect(modelType2.resolution).toBe("ENHANCED");
    });

    it("should be able to modify the EntityType", () => {
      const modelType = new EquipmentModel(
        parseFromString(EQUIPMENT_MODEL_TYPE_TEMPLATE),
      );

      expect(modelType.entityType).toBe("1.1.0.3.17.4.0");
      modelType.entityType = "1.9.9.3.17.4.9";
      expect(modelType.entityType).toBe("1.9.9.3.17.4.9");
      const modelType2 = new UnitModel(
        parseFromString(xmlToString(modelType.element)),
      );
      expect(modelType2.entityType).toBe("1.9.9.3.17.4.9");
    });

    describe("when parsing Equipment with Model from XML", () => {
      const equipment = new EquipmentItem(parseFromString(EQUIPMENT_NETN));
      it("should have a ModelType", () => {
        expect(equipment.model).toBeDefined();
        expect(equipment.model).toBeInstanceOf(EquipmentModel);
        expect(equipment.model?.resolution).toBeUndefined();
        expect(equipment.model?.entityType).toBe("1.1.225.6.8.0.0");
      });
    });

    describe("when parsing Equipment with no Model from XML", () => {
      it("should not have a ModelType", () => {
        const equipment = new EquipmentItem(
          parseFromString(EQUIPMENT_NO_MODEL_TEMPLATE),
        );
        expect(equipment.model).toBeUndefined();
      });

      it("should be possible to create a UnitModel ", () => {
        const equipment = new EquipmentItem(
          parseFromString(EQUIPMENT_NO_MODEL_TEMPLATE),
        );
        expect(equipment.model).toBeUndefined();
        equipment.model = {
          entityType: "1.2.3.4.5",
          resolution: "HIGH",
        };
        expect(equipment.model).toBeInstanceOf(EquipmentModel);
        expect(equipment.model?.entityType).toBe("1.2.3.4.5");
        expect(equipment.model?.resolution).toBe("HIGH");

        const unit2 = new EquipmentItem(
          parseFromString(xmlToString(equipment.element)),
        );
        expect(unit2.model).toBeInstanceOf(EquipmentModel);
        expect(unit2.model?.entityType).toBe("1.2.3.4.5");
        expect(unit2.model?.resolution).toBe("HIGH");
      });
    });
  });
});
