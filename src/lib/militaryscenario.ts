import { ScenarioId, type ScenarioIdType } from "./scenarioid.js";
import {
  createEmptyXMLElementFromTagName,
  getTagElement,
  getTagElements,
  getTagValue,
} from "./domutils.js";
import { Unit } from "./units.js";
import {
  EnumCommandRelationshipType,
  rel2code,
  StandardIdentity,
} from "./enums.js";
import { ForceSide } from "./forcesides.js";
import { EquipmentItem } from "./equipment.js";
import { Deployment } from "./deployment.js";
import type { DropTarget } from "./types.js";

export type SetUnitForceRelationTypeOptions = {
  commandRelationshipType?: EnumCommandRelationshipType;
  target?: DropTarget;
};

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
  isNETN: Readonly<boolean>;

  getUnitById(objectHandle: string): Unit | undefined;
  getForceSideById(objectHandle: string): ForceSide | undefined;
  getUnitOrForceSideById(objectHandle: string): Unit | ForceSide | undefined;
  getEquipmentById(objectHandle: string): EquipmentItem | undefined;

  addUnit(unit: Unit): void;
  addEquipmentItem(equipmentitem: EquipmentItem): void;
  removeUnit(objectHandle: string): void;
  removeEquipmentItem(objectHandle: string): void;

  getUnitHierarchy(unitOrObjectHandle: Unit | string): {
    forceSide: ForceSide;
    hierarchy: Unit[];
  };

  setUnitForceRelation(
    unitOrObjectHandle: Unit | string,
    superiorOrObjectHandle: Unit | string,
    options: SetUnitForceRelationTypeOptions,
  ): void;
  setUnitForceRelation(
    unitOrObjectHandle: Unit | string,
    superiorOrObjectHandle: ForceSide | string,
  ): void;

  toString(): string;
}

export interface MilitaryScenarioInputType {
  scenarioId: ScenarioIdType;
  isNETN: boolean;
}

export class MilitaryScenario implements MilitaryScenarioType {
  static readonly TAG_NAME = "MilitaryScenario";
  scenarioId!: ScenarioId;
  forceSides: ForceSide[] = [];
  equipment: EquipmentItem[] = [];
  rootUnits: Unit[] = [];
  unitMap: Record<string, Unit> = {};
  element?: Element;
  forceSideMap: Record<string, ForceSide> = {};
  equipmentMap: Record<string, EquipmentItem> = {};
  deployment?: Deployment;
  private _primarySide: ForceSide | null | undefined = null;
  private _isNETN = false;

  constructor(element?: Element, options?: { isNETN?: boolean }) {
    this.element = element;
    if (element) {
      this.initializeMetaInfo();
      this.initializeForceSides();
      this.initializeUnits();
      this.initializeEquipment();
      this.updateSidesRootUnits();
      this.initializeDeployment();
      this.primarySide = this.forceSides[0]!;
      if (options?.isNETN !== undefined) {
        this._isNETN = options.isNETN;
      } else {
        this.detectNETN();
      }
    }
  }

  get isNETN(): boolean {
    return this._isNETN;
  }

  get unitCount() {
    return Object.keys(this.unitMap).length;
  }

  get equipmentCount() {
    return Object.keys(this.equipmentMap).length;
  }

  getUnitParent(unit: Unit): Unit | ForceSide | undefined {
    return (
      this.unitMap[unit.superiorHandle] ??
      this.forceSideMap[unit.superiorHandle]
    );
  }

  getUnitHierarchy(unitOrObjectHandle: Unit | string) {
    let unit: Unit | undefined;
    if (typeof unitOrObjectHandle === "string") {
      unit = this.getUnitById(unitOrObjectHandle);
    } else {
      unit = unitOrObjectHandle;
    }
    if (!unit) {
      throw new Error("Unit not found");
    }
    let that = this;
    let hierarchy: Unit[] = [];
    let forceSide!: ForceSide;

    function helper(unit: Unit) {
      let p = that.getUnitParent(unit);
      if (p instanceof Unit) {
        hierarchy.push(p);
        helper(p);
      } else if (p instanceof ForceSide) {
        forceSide = p;
      }
    }

    helper(unit);

    return { forceSide, hierarchy };
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

  static createFromModel(msdlInputType: MilitaryScenarioInputType) {
    if (!msdlInputType?.scenarioId || !msdlInputType?.scenarioId.name)
      throw new TypeError("Invalid MSDL input");
    const milScen = new MilitaryScenario(
      createEmptyXMLElementFromTagName(MilitaryScenario.TAG_NAME),
      {
        isNETN: msdlInputType.isNETN,
      },
    );
    milScen.scenarioId = ScenarioId.fromModel(msdlInputType.scenarioId);
    milScen.element!.appendChild(milScen.scenarioId.element);
    milScen.element!.appendChild(
      createEmptyXMLElementFromTagName("ForceSides"),
    );
    return milScen;
  }

  private initializeDeployment() {
    const deploymentEl = getTagElement(this.element, "Deployment");
    if (!deploymentEl) return;
    this.deployment = new Deployment(deploymentEl);
  }

  private initializeMetaInfo() {
    const scenarioIdElement = getTagElement(this.element, ScenarioId.TAG_NAME);
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
    let forceSideElements = getTagElements(forceSideEl, ForceSide.TAG_NAME);
    for (let e of forceSideElements) {
      let forceSide = new ForceSide(e);
      this.forceSides.push(forceSide);
      this.forceSideMap[forceSide.objectHandle] = forceSide;
    }

    const forces = this.forceSides.filter((fs) => !fs.isSide);
    for (let force of forces) {
      let parentSide =
        force.allegianceHandle && this.forceSideMap[force.allegianceHandle];
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
      this.addEquipmentItemToOwner(eq);
      this.equipmentMap[eq.objectHandle] = eq;
    }
  }

  private addEquipmentItemToOwner(eq: EquipmentItem) {
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

  getUnitOrEquipmentById(
    objectHandle: string,
  ): Unit | EquipmentItem | undefined {
    return this.unitMap[objectHandle] ?? this.equipmentMap[objectHandle];
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

  addUnit(unit: Unit): void {
    this.unitMap[unit.objectHandle] = unit;
    this.updateUnitHierarchy(unit);
    this.addUnitToElement(unit);
  }

  addEquipmentItem(eq: EquipmentItem, superiorHandle?: string): void {
    if (superiorHandle) {
      const superior = this.getUnitOrForceSideById(superiorHandle);
      if (!superior)
        throw new Error(`Could not find superior ${superiorHandle}`);
      eq.setHoldingOrganization(superior);
    } else if (!superiorHandle && this.primarySide) {
      // Set primary forceside as owner if no owner specified
      eq.setHoldingOrganization(this.primarySide);
    }
    this.addEquipmentItemToOwner(eq);
    this.equipmentMap[eq.objectHandle] = eq;
    this.addEquipmentToElement(eq);
  }

  removeUnit(objectHandle: string): void {
    const unit = this.getUnitById(objectHandle);
    if (!unit)
      throw new Error(`Cannot remove non-existing unit ${objectHandle}`);
    this.removeUnitOrEquipmentFromSuperior(unit);
    delete this.unitMap[objectHandle];
    const idx = this.rootUnits.findIndex(
      (u) => u.objectHandle === objectHandle,
    );
    if (idx >= 0) {
      this.rootUnits.splice(idx, 1);
    }
    this.removeUnitFromElement(objectHandle);
  }

  removeEquipmentItem(objectHandle: string): void {
    const equipment = this.getEquipmentById(objectHandle);
    if (!equipment)
      throw new Error(`Cannot remove non-existing equipment ${objectHandle}`);
    this.removeUnitOrEquipmentFromSuperior(equipment);
    delete this.equipmentMap[objectHandle];
    this.removeEquipmentFromElement(objectHandle);
  }

  private updateUnitHierarchy(unit: Unit) {
    if (!unit.superiorHandle) {
      // Set primary forceside as owner if no owner specified
      if (!this.primarySide) throw new Error("Primary ForceSide not set");
      unit.setForceRelation(this.primarySide);
    }
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

  private addUnitToElement(unit: Unit) {
    const organizationsEl = getTagElement(this.element, "Organizations");
    const unitsEl = getTagElement(organizationsEl, "Units");
    if (!unitsEl) throw new Error("No <Units> element found to add unit to");
    unitsEl.appendChild(unit.element);
  }

  private removeUnitFromElement(objectHandle: string) {
    const organizationsEl = getTagElement(this.element, "Organizations");
    const unitsEl = getTagElement(organizationsEl, "Units");
    if (!unitsEl)
      throw new Error("No <Units> element found to remove unit from");
    let unitElements = getTagElements(unitsEl, "Unit");
    let unitToRemove = unitElements.find(
      (u) => getTagValue(u, "ObjectHandle") === objectHandle,
    );
    if (unitToRemove) unitsEl?.removeChild(unitToRemove);
  }

  private addEquipmentToElement(equipment: EquipmentItem) {
    const organizationsEl = getTagElement(this.element, "Organizations");
    const equipmentsEl = getTagElement(organizationsEl, "Equipment");
    if (!equipmentsEl)
      throw new Error("No <Equipment> element found to add equipmentitem to");
    equipmentsEl.appendChild(equipment.element);
  }

  private removeEquipmentFromElement(objectHandle: string) {
    const organizationsEl = getTagElement(this.element, "Organizations");
    const equipmentsEl = getTagElement(organizationsEl, "Equipment");
    if (!equipmentsEl)
      throw new Error(
        "No <Equipment> element found to remove equipmentitem from",
      );
    let equipmentElements = getTagElements(equipmentsEl, "EquipmentItem");
    let equipmentItemToRemove = equipmentElements.find(
      (u) => getTagValue(u, "ObjectHandle") === objectHandle,
    );
    if (equipmentItemToRemove) equipmentsEl?.removeChild(equipmentItemToRemove);
  }

  private detectNETN() {
    const netnElement =
      getTagElement(this.element, "EntityType") ??
      getTagElement(this.element, "Holdings") ??
      getTagElement(this.element, "Deployment");
    this._isNETN = !!netnElement;
  }

  setUnitForceRelation(
    unitOrObjectHandle: Unit | string,
    superiorOrObjectHandle: Unit | ForceSide | string,
    options: SetUnitForceRelationTypeOptions = {},
  ) {
    const { commandRelationshipType } = options;
    const unit =
      typeof unitOrObjectHandle === "string"
        ? this.getUnitById(unitOrObjectHandle)
        : unitOrObjectHandle;
    if (!unit) throw new Error("Unit not found");

    const superior =
      typeof superiorOrObjectHandle === "string"
        ? this.getUnitOrForceSideById(superiorOrObjectHandle)
        : superiorOrObjectHandle;
    if (!superior) throw new Error("Superior not found");

    this.removeUnitOrEquipmentFromSuperior(unit);

    // Add to new superior
    if (superior instanceof Unit) {
      unit.setForceRelation(superior, commandRelationshipType);
      superior.subordinates.push(unit);
    } else {
      unit.setForceRelation(superior);
      superior.rootUnits.push(unit);
    }
  }

  private removeUnitOrEquipmentFromSuperior(item: Unit | EquipmentItem) {
    // Remove from previous superior
    const originalSuperior = item.superiorHandle
      ? this.getUnitOrForceSideById(item.superiorHandle)
      : undefined;
    if (originalSuperior instanceof Unit) {
      originalSuperior.subordinates = originalSuperior.subordinates.filter(
        (u) => u.objectHandle !== item.objectHandle,
      );
      originalSuperior.equipment = originalSuperior.equipment.filter(
        (u) => u.objectHandle !== item.objectHandle,
      );
    } else if (originalSuperior instanceof ForceSide) {
      originalSuperior.rootUnits = originalSuperior.rootUnits.filter(
        (u) => u.objectHandle !== item.objectHandle,
      );
      originalSuperior.equipment = originalSuperior.equipment.filter(
        (u) => u.objectHandle !== item.objectHandle,
      );
    }
  }

  toString() {
    if (!this.element) return "";
    const oSerializer = new XMLSerializer();
    return oSerializer.serializeToString(this.element);
  }
}
