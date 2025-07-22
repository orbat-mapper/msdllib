import {
  createEmptyXMLElementFromTagName,
  createXMLElement,
  getTagElement,
  getTagValue,
  getValueOrUndefined,
  setOrCreateTagValue,
} from "./domutils.js";
import type { Feature, Point } from "geojson";
import {
  type EnumCombatEffectivenessType,
  EnumCommandRelationshipType,
  type EnumEchelon,
  type EnumReinforcedReducedType,
  ForceOwnerType,
  StandardIdentity,
} from "./enums.js";
import { EquipmentItem } from "./equipment.js";
import {
  type IdGeoJsonOptions,
  type SetAffiliationOptions,
  type TacticalJson,
  UnitEquipmentBase,
  type UnitEquipmentInterface,
} from "./common.js";
import { setCharAt } from "./symbology.js";
import { ForceSide } from "./forcesides.js";
import { UnitModel, type UnitModelType } from "./modelType.js";
import type { LngLatElevationTuple, LngLatTuple } from "./types.js";
import { v4 as uuidv4 } from "uuid";
import { type DispositionType, UnitDisposition } from "./disposition.js";

type UnitGeoJsonOptions = IdGeoJsonOptions;

export class Unit extends UnitEquipmentBase implements UnitEquipmentInterface {
  static readonly TAG_NAME = "Unit";
  symbolModifiers?: UnitSymbolModifiers;
  equipment: EquipmentItem[] = [];
  subordinates: Unit[] = [];
  superiorHandle = "";
  forceRelationChoice: ForceOwnerType | undefined;
  commandRelationshipType: EnumCommandRelationshipType | undefined;
  #model?: UnitModel;
  #disposition?: UnitDisposition;

  constructor(element: Element) {
    super(element);
    const unitSymbolModifiersElement = getTagElement(
      element,
      "UnitSymbolModifiers",
    );
    if (unitSymbolModifiersElement) {
      this.symbolModifiers = new UnitSymbolModifiers(
        unitSymbolModifiersElement,
      );
    }

    const modelElement = getTagElement(this.element, "Model");
    if (modelElement) {
      this.#model = new UnitModel(modelElement);
    }

    const dispositionElement = getTagElement(
      this.element,
      UnitDisposition.TAG_NAME,
    );
    if (dispositionElement) {
      this.#disposition = new UnitDisposition(dispositionElement);
    }
    this.initializeRelations();
  }

  get location(): LngLatTuple | LngLatElevationTuple | undefined {
    return this.#disposition?.location;
  }

  get isRoot(): boolean {
    return this.forceRelationChoice === ForceOwnerType.ForceSide;
  }

  get disposition(): UnitDisposition | undefined {
    return this.#disposition;
  }

  set disposition(disposition: UnitDisposition | DispositionType | undefined) {
    const dispElm = getTagElement(this.element, UnitDisposition.TAG_NAME);
    if (!disposition) {
      this.#disposition = undefined;
      if (dispElm) {
        this.element.removeChild(dispElm);
      }
      return;
    }

    let test =
      disposition instanceof UnitDisposition
        ? disposition
        : UnitDisposition.fromModel(disposition);
    this.#disposition = test;
    if (dispElm) {
      this.element.replaceChild(this.#disposition.element, dispElm);
    } else {
      this.element.appendChild(this.#disposition.element);
    }
  }

  get speed(): number | undefined {
    return this.#disposition?.speed;
  }

  get directionOfMovement(): number | undefined {
    return this.#disposition?.directionOfMovement;
  }

  get model(): UnitModel | undefined {
    return this.#model;
  }

  set model(model: UnitModel | UnitModelType | undefined | null) {
    if (!model) {
      this.#model = undefined;
      const modelElement = getTagElement(this.element, "Model");
      if (modelElement) {
        this.element.removeChild(modelElement);
      }
      return;
    }

    let test = model instanceof UnitModel ? model : UnitModel.fromModel(model);
    if (this.#model) {
      this.#model.element.replaceWith(test.element);
    } else {
      this.element.appendChild(test.element);
    }

    this.#model = test;
  }

  get label(): string {
    return (
      this.name || this.symbolModifiers?.uniqueDesignation || this.objectHandle
    );
  }

  toGeoJson(
    options: UnitGeoJsonOptions = {},
  ): Feature<Point | null, TacticalJson> {
    const { includeId = true, includeIdInProperties = false } = options;
    let feature: Feature<Point | null, TacticalJson>;
    let properties: TacticalJson = {};

    if (this.disposition?.speed) {
      properties.speed = this.disposition.speed;
    }
    if (this.disposition?.directionOfMovement) {
      properties.direction = this.disposition.directionOfMovement;
    }
    properties.sidc = this.sidc;
    properties.label = this.label;
    if (includeIdInProperties) {
      properties.id = this.objectHandle;
    }

    feature = {
      ...(includeId ? { id: this.objectHandle } : {}),
      type: "Feature",
      geometry: this.location
        ? {
            type: "Point",
            coordinates: this.location,
          }
        : null,
      properties,
    };
    return feature;
  }

  override setAffiliation(
    s: StandardIdentity,
    options?: SetAffiliationOptions,
  ): void {
    this.sidc = setCharAt(this.sidc, 1, s);
    for (let equipment of this.equipment) {
      equipment.setAffiliation(s);
    }
    if (options?.recursive) {
      for (let subordinate of this.subordinates) {
        subordinate.setAffiliation(s, options);
      }
    }
  }

  setForceRelation(
    superior: Unit,
    commandRelationshipType?: EnumCommandRelationshipType,
  ): void;
  setForceRelation(superior: ForceSide): void;
  setForceRelation(
    superior: Unit | ForceSide,
    commandRelationshipType?: EnumCommandRelationshipType,
  ) {
    let forceRelationElement = getTagElement(this.element, "ForceRelation");

    if (superior instanceof Unit) {
      let unitRelation = createUnitRelation(
        superior.objectHandle,
        commandRelationshipType ?? EnumCommandRelationshipType.None,
      );
      forceRelationElement
        ? forceRelationElement.replaceWith(unitRelation)
        : this.element.appendChild(unitRelation);

      this.superiorHandle = superior.objectHandle;
      this.forceRelationChoice = ForceOwnerType.Unit;
      this.commandRelationshipType =
        commandRelationshipType ?? EnumCommandRelationshipType.None;
    } else if (superior instanceof ForceSide) {
      this.superiorHandle = superior.objectHandle;
      this.forceRelationChoice = ForceOwnerType.ForceSide;
      this.commandRelationshipType = undefined;
      let forceRelation = createForceRelation(superior.objectHandle);
      forceRelationElement
        ? forceRelationElement.replaceWith(forceRelation)
        : this.element.appendChild(forceRelation);
    }
  }

  private initializeRelations() {
    let forceRelationChoice = getTagValue(this.element, "ForceRelationChoice");

    if (forceRelationChoice === ForceOwnerType.Unit) {
      this.forceRelationChoice = ForceOwnerType.Unit;
      this.superiorHandle = getTagValue(
        this.element,
        "CommandingSuperiorHandle",
      );
      this.commandRelationshipType =
        getTagValue(this.element, "CommandRelationshipType") ||
        EnumCommandRelationshipType.None;
    } else if (forceRelationChoice === ForceOwnerType.ForceSide) {
      this.forceRelationChoice = ForceOwnerType.ForceSide;
      this.superiorHandle = getTagValue(this.element, "ForceSideHandle");
    } else {
      console.error("Invalid ForceRelationChoice " + this.forceRelationChoice);
    }
    // Todo: Add support for support and organic relations
  }

  static create(): Unit {
    const unit: Unit = new Unit(
      createEmptyXMLElementFromTagName(Unit.TAG_NAME),
    );
    const baseProps: Partial<UnitEquipmentInterface> = {
      objectHandle: uuidv4(),
    };
    unit.updateFromObject(baseProps);
    // TODO: getter and setter for relations
    setOrCreateTagValue(unit.element, "Relations", null, {
      deleteIfNull: false,
    });
    return unit;
  }
}

export type UnitSymbolModifiersType = {
  echelon?: EnumEchelon | string;
  reinforcedReduced?: EnumReinforcedReducedType | string;
  staffComments?: string;
  additionalInfo?: string;
  combatEffectiveness?: EnumCombatEffectivenessType | string;
  higherFormation?: string;
  iff?: string;
  uniqueDesignation: string;
  specialC2HQ?: string;
};

export class UnitSymbolModifiers implements UnitSymbolModifiersType {
  echelon?: EnumEchelon | string;
  reinforcedReduced?: EnumReinforcedReducedType | string;
  staffComments?: string;
  additionalInfo?: string;
  combatEffectiveness?: EnumCombatEffectivenessType | string;
  higherFormation?: string;
  iff?: string;
  uniqueDesignation: string;
  specialC2HQ?: string;
  element: Element;

  constructor(element: Element) {
    this.element = element;
    this.echelon = getValueOrUndefined(element, "Echelon");
    this.reinforcedReduced = getValueOrUndefined(element, "ReinforcedReduced");
    this.staffComments = getValueOrUndefined(element, "StaffComments");
    this.additionalInfo = getValueOrUndefined(element, "AdditionalInfo");
    this.combatEffectiveness = getValueOrUndefined(
      element,
      "CombatEffectiveness",
    );
    this.higherFormation = getValueOrUndefined(element, "HigherFormation");
    this.iff = getValueOrUndefined(element, "Iff");
    this.uniqueDesignation =
      getValueOrUndefined(element, "UniqueDesignation") ?? "";
    this.specialC2HQ = getTagValue(element, "SpecialC2HQ");
  }
}

function createUnitRelation(
  commandingSuperiorHandle: string,
  commandRelationshipType: EnumCommandRelationshipType,
) {
  return createXMLElement(
    `<ForceRelation>
    <ForceRelationChoice>UNIT</ForceRelationChoice>
    <ForceRelationData>
        <CommandRelation>
            <CommandingSuperiorHandle>${commandingSuperiorHandle}</CommandingSuperiorHandle>
            <CommandRelationshipType>${commandRelationshipType}</CommandRelationshipType>
        </CommandRelation>
    </ForceRelationData>
</ForceRelation>`,
  );
}

function createForceRelation(forceSideHandle: string) {
  return createXMLElement(
    `<ForceRelation>
    <ForceRelationChoice>FORCE_SIDE</ForceRelationChoice>
    <ForceRelationData>
        <ForceSideHandle>${forceSideHandle}</ForceSideHandle>
    </ForceRelationData>
</ForceRelation>`,
  );
}
