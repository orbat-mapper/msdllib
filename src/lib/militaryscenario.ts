import { ScenarioId } from "./scenarioid.js";
import { getTagElement, getTagElements } from "./utils.js";
import { EquipmentItem, Unit } from "./unitequipment.js";
import { rel2code, StandardIdentities } from "./enums.js";
import { ForceSide } from "./forcesides.js";

/**
 * MilitaryScenarioType
 *
 */
export interface MilitaryScenarioType {
  scenarioId: ScenarioId;
  forceSides: ForceSide[];
  unitMap: Record<string, Unit>;
  forceSideMap: Record<string, ForceSide>;
  unitCount: number;
}

export class MilitaryScenario implements MilitaryScenarioType {
  scenarioId: ScenarioId = new ScenarioId();
  forceSides: ForceSide[] = [];
  _equipment: EquipmentItem[] = [];
  rootUnits: Unit[] = [];
  unitMap: Record<string, Unit> = {};
  forceSideMap: Record<string, ForceSide> = {};
  private _primarySide: ForceSide | null | undefined = null;

  constructor(public rootElement?: Element) {
    if (rootElement) {
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
      !militaryScenario.scenarioId.element
    ) {
      throw new TypeError("Invalid MSDL");
    }
    return militaryScenario;
  }

  private initializeMetaInfo() {
    this.scenarioId = new ScenarioId(
      getTagElement(this.rootElement, "ScenarioID"),
    );
  }

  private initializeForceSides() {
    this.forceSides = [];
    const forceSideEl = getTagElement(this.rootElement, "ForceSides");
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
    const organizationsEl = getTagElement(this.rootElement, "Organizations");
    const unitsEl = getTagElement(organizationsEl, "Units");
    let unitElements = getTagElements(unitsEl, "Unit");
    const _units = [];
    for (let unitElement of unitElements) {
      let unit = new Unit(unitElement);
      _units.push(unit);
      this.unitMap[unit.objectHandle] = unit;
    }
    this.buildHierarchy(_units);
  }

  private buildHierarchy(units: Unit[]) {
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
    const organizationsEl = getTagElement(this.rootElement, "Organizations");
    const equipmentEl = getTagElement(organizationsEl, "Equipment");
    let equipmentItemElements = getTagElements(equipmentEl, "EquipmentItem");
    for (let equipmentItemElement of equipmentItemElements) {
      this._equipment.push(new EquipmentItem(equipmentItemElement));
    }

    // for (let equip of this.equipment) {
    //     if (!equip.organicSuperiorHandle) continue;
    //     let unit = this.unitMap[equip.organicSuperiorHandle];
    //     if (unit) {
    //         unit.equipment.push(equip);
    //     }
    // }
  }

  set primarySide(side: ForceSide | null) {
    if (!side) {
      this._primarySide = null;
      return;
    }
    this._primarySide = side;
    for (let rootUnit of side.rootUnits) {
      this.setAffiliation(rootUnit, StandardIdentities.Friend);
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

  private setAffiliation(unit: Unit, s: StandardIdentities) {
    unit.setAffiliation(s);
    for (let subordinate of unit.subordinates) {
      this.setAffiliation(subordinate, s);
    }
  }

  getUnitByObjectHandle(objectHandle: string): Unit | undefined {
    return this.unitMap[objectHandle];
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
}
