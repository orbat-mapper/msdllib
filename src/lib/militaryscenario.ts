import { ScenarioId, type ScenarioIdType } from "./scenarioid.js";
import { MsdlOptions, type MsdlOptionsType } from "./msdlOptions.js";
import {
  createEmptyXMLElementFromTagName,
  getOrCreateTagElement,
  getTagElement,
  getTagElements,
  getTagValue,
  removeTagValue,
} from "./domutils.js";
import { Unit } from "./units.js";
import {
  EnumCommandRelationshipType,
  rel2code,
  StandardIdentity,
} from "./enums.js";
import { ForceSide } from "./forcesides.js";
import { EquipmentItem } from "./equipment.js";
import { Deployment, Federate } from "./deployment.js";
import type { DropTarget } from "./types.js";
import { Environment } from "./environment.js";

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
  msdlOptions: MsdlOptionsType;
  forceSides: ForceSide[];
  environment?: Environment;
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
  addEquipmentItem(equipmentItem: EquipmentItem): void;
  removeUnit(objectHandle: string): void;
  removeEquipmentItem(objectHandle: string): void;
  addForceSide(side: ForceSide): void;
  removeForceSide(objectHandle: string): void;

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
  msdlOptions: MsdlOptionsType;
  isNETN: boolean;
}

export class MilitaryScenario implements MilitaryScenarioType {
  static readonly TAG_NAME = "MilitaryScenario";
  scenarioId!: ScenarioId;
  msdlOptions!: MsdlOptions;
  forceSides: ForceSide[] = [];
  equipment: EquipmentItem[] = [];
  rootUnits: Unit[] = [];
  unitMap: Record<string, Unit> = {};
  element?: Element;
  forceSideMap: Record<string, ForceSide> = {};
  equipmentMap: Record<string, EquipmentItem> = {};
  deployment?: Deployment;
  environment?: Environment;
  private _primarySide: ForceSide | null | undefined = null;
  private _isNETN = false;

  constructor(element?: Element, options?: { isNETN?: boolean }) {
    this.element = element;
    if (element) {
      this.initializeMetaInfo();
      this.initializeMsdlOptions();
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

  get forceSideCount() {
    return Object.keys(this.forceSideMap).length;
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
    const milScen = MilitaryScenario.create(msdlInputType.isNETN);
    milScen.scenarioId = ScenarioId.fromModel(msdlInputType.scenarioId);
    milScen.msdlOptions = MsdlOptions.fromModel(msdlInputType.msdlOptions);
    milScen.element!.appendChild(milScen.scenarioId.element);
    milScen.element!.appendChild(milScen.msdlOptions.element);
    milScen.element!.appendChild(
      createEmptyXMLElementFromTagName("ForceSides"),
    );
    return milScen;
  }

  static create(isNETN: boolean): MilitaryScenario {
    return new MilitaryScenario(
      createEmptyXMLElementFromTagName(MilitaryScenario.TAG_NAME),
      {
        isNETN,
      },
    );
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
    const environmentEl = getTagElement(this.element, Environment.TAG_NAME);
    if (environmentEl) {
      this.environment = new Environment(environmentEl);
    }
  }

  private initializeMsdlOptions() {
    const optionsElement = getTagElement(this.element, MsdlOptions.TAG_NAME);
    if (!optionsElement) {
      return;
    }
    this.msdlOptions = new MsdlOptions(optionsElement);
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
    } else {
      this.equipment.push(eq);
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

  getFederateById(objectHandle: string): Federate | undefined {
    return this.deployment?.getFederateById(objectHandle);
  }

  getFederateOfUnit(objectHandle: string): Federate | undefined {
    return this.deployment?.getFederateOfUnit(objectHandle);
  }

  getFederateOfEquipment(objectHandle: string): Federate | undefined {
    return this.deployment?.getFederateOfEquipment(objectHandle);
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
    this.removeSubordinatesOf(objectHandle);
  }

  private removeSubordinatesOf(objectHandle: string) {
    for (const unit of Object.values(this.unitMap)) {
      if (
        unit.forceRelationChoice === "UNIT" &&
        unit.superiorHandle === objectHandle
      ) {
        this.removeUnit(unit.objectHandle);
      }
    }
    for (const eq of Object.values(this.equipmentMap)) {
      if (eq.superiorHandle === objectHandle) {
        this.removeEquipmentItem(eq.objectHandle);
      }
    }
  }

  removeEquipmentItem(objectHandle: string): void {
    const equipment = this.getEquipmentById(objectHandle);
    if (!equipment)
      throw new Error(`Cannot remove non-existing equipment ${objectHandle}`);
    this.removeUnitOrEquipmentFromSuperior(equipment);
    delete this.equipmentMap[objectHandle];
    this.removeEquipmentFromElement(objectHandle);
  }

  addForceSide(side: ForceSide): void {
    this.forceSides.push(side);
    this.forceSideMap[side.objectHandle] = side;
    this.addForceSideToElement(side);
    if (this.forceSides.length === 1) {
      this.primarySide = this.forceSides[0]!;
    }
  }

  removeForceSide(objectHandle: string): void {
    const side = this.getForceSideById(objectHandle);
    if (!side)
      throw new Error(`Cannot remove non-existing force side ${objectHandle}`);
    this.removeUnitsOfForceSide(side);
    delete this.forceSideMap[objectHandle];
    this.forceSides = this.forceSides.filter(
      (s) => s.objectHandle !== objectHandle,
    );
    this.removeForceSideFromElement(objectHandle);
  }

  private addForceSideToElement(side: ForceSide) {
    const sidesEl = getTagElement(this.element, "ForceSides");
    if (!sidesEl)
      throw new Error("No <ForceSides> element found to add equipmentItem to");
    sidesEl.appendChild(side.element);
  }

  private removeForceSideFromElement(objectHandle: string) {
    const sidesEl = getTagElement(this.element, "ForceSides");
    if (!sidesEl)
      throw new Error(
        "No <ForceSides> element found to remove force side from",
      );
    let sideElements = getTagElements(sidesEl, ForceSide.TAG_NAME);
    let sideToRemove = sideElements.find(
      (u) => getTagValue(u, "ObjectHandle") === objectHandle,
    );
    if (sideToRemove) sidesEl.removeChild(sideToRemove);
  }

  addFederate(fed: Federate): void {
    this.assertDeployment();
    this.deployment!.addFederate(fed);
    this.updateDeploymentElement();
  }

  private assertDeployment() {
    if (!this.element) return;
    const deploymentEl = getOrCreateTagElement(
      this.element,
      Deployment.TAG_NAME,
    );
    this.deployment = new Deployment(deploymentEl);
  }

  private updateDeploymentElement() {
    removeTagValue(this.element!, Deployment.TAG_NAME);
    this.element!.appendChild(this.deployment!.element);
  }

  assignUnitToFederate(unitHandle: string, federateHandle: string) {
    if (!this.deployment) return;
    const unit = this.getUnitById(unitHandle);
    const federate = this.getFederateById(federateHandle);
    if (!unit) {
      throw new Error(`Unit ${unitHandle} not found`);
    }
    if (!federate) {
      throw new Error(`Federate ${federateHandle} not found`);
    }
    this.deployment.assignUnitToFederate(federateHandle, unitHandle);
    this.updateDeploymentElement();
  }

  assignEquipmentItemToFederate(
    equipmentItemHandle: string,
    federateHandle: string,
  ) {
    const equipmentItem = this.getEquipmentById(equipmentItemHandle);
    const federate = this.getFederateById(federateHandle);
    if (!equipmentItem) {
      throw new Error(`EquipmentItem ${equipmentItemHandle} not found`);
    }
    if (!federate) {
      throw new Error(`Federate ${federateHandle} not found`);
    }
    const oldFederate = this.getFederateOfEquipment(equipmentItemHandle);
    if (oldFederate) oldFederate.removeEquipmentItem(equipmentItemHandle);
    federate.addEquipmentItem(equipmentItemHandle);
    this.updateDeploymentElement();
  }

  assignAllUnitsToFederate(
    fromFederateHandle: string,
    toFederateHandle: string,
  ) {
    const fromFederate = this.getFederateById(fromFederateHandle);
    const toFederate = this.getFederateById(toFederateHandle);
    if (!toFederate) {
      throw new Error(`Unit ${toFederateHandle} not found`);
    }
    if (!fromFederate) {
      throw new Error(`Federate ${fromFederateHandle} not found`);
    }
    const units = fromFederate.removeAllUnits();
    toFederate.addAllUnits(units);
    this.updateDeploymentElement();
  }

  assignAllEquipmentToFederate(
    fromFederateHandle: string,
    toFederateHandle: string,
  ) {
    const fromFederate = this.getFederateById(fromFederateHandle);
    const toFederate = this.getFederateById(toFederateHandle);
    if (!toFederate) {
      throw new Error(`Unit ${toFederateHandle} not found`);
    }
    if (!fromFederate) {
      throw new Error(`Federate ${fromFederateHandle} not found`);
    }
    const equipment = fromFederate.removeAllEquipment();
    toFederate.addAllEquipment(equipment);
    this.updateDeploymentElement();
  }

  private detectNETN() {
    const netnElement =
      getTagElement(this.element, "EntityType") ??
      getTagElement(this.element, "Holdings") ??
      getTagElement(this.element, Deployment.TAG_NAME);
    this._isNETN = !!netnElement;
  }

  private removeUnitsOfForceSide(side: ForceSide) {
    for (const unit of Object.values(this.unitMap)) {
      if (
        unit.forceRelationChoice === "FORCE_SIDE" &&
        unit.superiorHandle === side.objectHandle
      ) {
        this.removeUnit(unit.objectHandle);
      }
    }
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
    if (!this.element) throw new Error("MilitaryScenario element is undefined");
    const organizationsEl = getOrCreateTagElement(
      this.element,
      "Organizations",
    );
    const unitsEl = getOrCreateTagElement(organizationsEl, "Units");
    if (!unitsEl) throw new Error("No <Units> element found to add unit to");
    unitsEl.appendChild(unit.element);
  }

  private removeUnitFromElement(objectHandle: string) {
    const organizationsEl = getTagElement(this.element, "Organizations");
    if (!organizationsEl)
      throw new Error("No <Organizations> element found to remove unit from");
    const unitsEl = getTagElement(organizationsEl, "Units");
    if (!unitsEl)
      throw new Error("No <Units> element found to remove unit from");
    let unitElements = getTagElements(unitsEl, "Unit");
    let unitToRemove = unitElements.find(
      (u) => getTagValue(u, "ObjectHandle") === objectHandle,
    );
    if (unitToRemove) unitsEl.removeChild(unitToRemove);
  }

  private addEquipmentToElement(equipment: EquipmentItem) {
    const organizationsEl = getTagElement(this.element, "Organizations");
    if (!organizationsEl)
      throw new Error("No <Organizations> element found to remove unit from");
    const equipmentsEl = getTagElement(organizationsEl, "Equipment");
    if (!equipmentsEl)
      throw new Error("No <Equipment> element found to add equipmentItem to");
    equipmentsEl.appendChild(equipment.element);
  }

  private removeEquipmentFromElement(objectHandle: string) {
    const organizationsEl = getTagElement(this.element, "Organizations");
    if (!organizationsEl)
      throw new Error("No <Organizations> element found to remove unit from");
    const equipmentsEl = getTagElement(organizationsEl, "Equipment");
    if (!equipmentsEl)
      throw new Error(
        "No <Equipment> element found to remove equipmentItem from",
      );
    let equipmentElements = getTagElements(equipmentsEl, "EquipmentItem");
    let equipmentItemToRemove = equipmentElements.find(
      (u) => getTagValue(u, "ObjectHandle") === objectHandle,
    );
    if (equipmentItemToRemove) equipmentsEl.removeChild(equipmentItemToRemove);
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
