import { ScenarioId } from "./scenarioid.js";
import { getTagElement, getTagElements } from "./domutils.js";
import { Unit } from "./units.js";
import { rel2code, StandardIdentity } from "./enums.js";
import { ForceSide } from "./forcesides.js";
import { EquipmentItem } from "./equipment.js";

/**
 * MilitaryScenarioType
 *
 */
export interface MilitaryScenarioType {
  scenarioId: ScenarioId;
  forceSides: ForceSide[];
  unitMap: Record<string, Unit>;
  forceSideMap: Record<string, ForceSide>;
  equipmentMap: Record<string, EquipmentItem>;
  unitCount: number;
  equipmentCount: number;

  getUnitById(objectHandle: string): Unit | undefined;
  getForceSideById(objectHandle: string): ForceSide | undefined;
  getUnitOrForceSideById(objectHandle: string): Unit | ForceSide | undefined;
  getEquipmentById(objectHandle: string): EquipmentItem | undefined;

  toString(): string;
}

export class MilitaryScenario implements MilitaryScenarioType {
  scenarioId!: ScenarioId;
  forceSides: ForceSide[] = [];
  equipment: EquipmentItem[] = [];
  rootUnits: Unit[] = [];
  unitMap: Record<string, Unit> = {};
  element?: Element;
  forceSideMap: Record<string, ForceSide> = {};
  equipmentMap: Record<string, EquipmentItem> = {};
  private _primarySide: ForceSide | null | undefined = null;

  constructor(element?: Element) {
    this.element = element;
    if (element) {
      this.initializeMetaInfo();
      this.initializeForceSides();
      this.initializeUnits();
      this.initializeEquipment();
      this.updateSidesRootUnits();
      this.primarySide = this.forceSides[0]!;
    }
  }

  get unitCount() {
    return Object.keys(this.unitMap).length;
  }

  get equipmentCount() {
    return Object.keys(this.equipmentMap).length;
  }

  static createFromString(xmlString: string) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(xmlString, "text/xml");
    const errorNode = doc.querySelector("parsererror");
    if (errorNode) {
      throw new TypeError("Error parsing XML string: " + errorNode.textContent);
    }
    const militaryScenario = new MilitaryScenario(doc.documentElement);
    // is it valid?
    if (
      Object.keys(militaryScenario.unitMap).length === 0 &&
      Object.keys(militaryScenario.forceSides).length === 0 &&
      !militaryScenario.scenarioId?.element
    ) {
      throw new TypeError("Invalid MSDL");
    }
    return militaryScenario;
  }

  private initializeMetaInfo() {
    const scenarioIdElement = getTagElement(this.element, "ScenarioID");
    if (!scenarioIdElement) {
      // throw new Error("ScenarioID element is required but not found");
      return;
    }
    this.scenarioId = new ScenarioId(scenarioIdElement);
  }
  private initializeForceSides() {
    this.forceSides = [];
    const forceSideEl = getTagElement(this.element, "ForceSides");
    if (!forceSideEl) return;
    let forceSideElements = getTagElements(forceSideEl, "ForceSide");
    for (let e of forceSideElements) {
      let forceSide = new ForceSide(e);
      this.forceSides.push(forceSide);
      this.forceSideMap[forceSide.objectHandle] = forceSide;
    }

    const forces = this.forceSides.filter((fs) => !fs.isSide);
    for (let force of forces) {
      let parentSide = this.forceSideMap[force.allegianceHandle];
      if (parentSide) {
        parentSide.forces.push(force);
      }
    }
  }

  private initializeUnits() {
    const organizationsEl = getTagElement(this.element, "Organizations");
    const unitsEl = getTagElement(organizationsEl, "Units");
    let unitElements = getTagElements(unitsEl, "Unit");
    const _units = [];
    for (let unitElement of unitElements) {
      let unit = new Unit(unitElement);
      _units.push(unit);
      this.unitMap[unit.objectHandle] = unit;
    }
    this.buildUnitHierarchy(_units);
  }

  private buildUnitHierarchy(units: Unit[]) {
    for (let unit of units) {
      if (!unit.superiorHandle) continue;
      if (unit.isRoot) {
        this.rootUnits.push(unit);
        let forceSide = this.forceSideMap[unit.superiorHandle];
        if (forceSide) {
          forceSide.rootUnits.push(unit);
        }
      } else {
        let parentUnit = this.unitMap[unit.superiorHandle];
        if (parentUnit) {
          parentUnit.subordinates.push(unit);
        }
      }
    }
  }

  private initializeEquipment() {
    const organizationsEl = getTagElement(this.element, "Organizations");
    const equipmentEl = getTagElement(organizationsEl, "Equipment");
    let equipmentItemElements = getTagElements(equipmentEl, "EquipmentItem");
    for (let equipmentItemElement of equipmentItemElements) {
      const eq = new EquipmentItem(equipmentItemElement);
      if (
        eq.relations.organicSuperiorHandle ||
        eq.relations.ownerChoice === "UNIT"
      ) {
        let unit = this.unitMap[eq.superiorHandle];
        if (unit) {
          unit.equipment.push(eq);
        }
      } else if (eq.relations.ownerChoice === "FORCE_SIDE") {
        const side = this.forceSideMap[eq.relations.ownerHandle];
        if (side) {
          side.equipment.push(eq);
        }
      }
      this.equipmentMap[eq.objectHandle] = eq;
    }
  }

  set primarySide(side: ForceSide | null) {
    if (!side) {
      this._primarySide = null;
      return;
    }
    this._primarySide = side;
    for (let rootUnit of side.rootUnits) {
      this.setAffiliation(rootUnit, StandardIdentity.Friend);
    }
    for (let association of side.associations) {
      let code = rel2code(association.relationship);
      if (association.affiliateHandle === side.objectHandle) {
        console.warn(side.name + " has an association with itself");
        continue;
      }
      let rootUnits = this.forceSideMap[association.affiliateHandle]?.rootUnits;
      for (let unit of rootUnits ?? []) {
        this.setAffiliation(unit, code);
      }
    }
  }

  get primarySide(): ForceSide | null | undefined {
    return this._primarySide;
  }

  get sides() {
    return this.forceSides.filter((fs) => fs.isSide);
  }

  private setAffiliation(unit: Unit, s: StandardIdentity) {
    unit.setAffiliation(s);
    for (let subordinate of unit.subordinates) {
      this.setAffiliation(subordinate, s);
    }
  }

  getUnitById(objectHandle: string): Unit | undefined {
    return this.unitMap[objectHandle];
  }

  getEquipmentById(objectHandle: string): EquipmentItem | undefined {
    return this.equipmentMap[objectHandle];
  }

  getForceSideById(objectHandle: string): ForceSide | undefined {
    return this.forceSideMap[objectHandle];
  }

  getUnitOrForceSideById(objectHandle: string): Unit | ForceSide | undefined {
    return this.unitMap[objectHandle] ?? this.forceSideMap[objectHandle];
  }

  private updateSidesRootUnits() {
    for (let side of this.sides) {
      for (let force of side.forces) {
        for (let rootUnit of force.rootUnits) {
          side.rootUnits.push(rootUnit);
        }
      }
    }
  }

  toString() {
    if (!this.element) return "";
    const oSerializer = new XMLSerializer();
    return oSerializer.serializeToString(this.element);
  }
}
