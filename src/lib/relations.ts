import { EnumCommandRelationshipType, ForceOwnerType } from "./enums.js";
import {
  getTagValue,
  removeUndefinedValues,
  setOrCreateTagValue,
} from "./domutils.js";

export type EquipmentRelationsType = {
  organicSuperiorHandle?: string;
  ownerChoice: ForceOwnerType;
  ownerHandle: string;
};

// Relationship of units in terms of command, support, and organic relationships.

export type UnitRelationsType = {
  forceRelationChoice: ForceOwnerType;
  superiorHandle: string;
  commandRelationshipType?: EnumCommandRelationshipType;
};

export class UnitRelations implements UnitRelationsType {
  #forceRelationChoice: ForceOwnerType;
  #superiorHandle!: string;
  #commandRelationshipType?: EnumCommandRelationshipType;
  element: Element;

  constructor(element: Element) {
    this.element = element;
    let forceRelationChoice = getTagValue(element, "ForceRelationChoice");
    if (!forceRelationChoice) {
      console.warn("No ForceRelationChoice found, defaulting to Unit");
      forceRelationChoice = ForceOwnerType.Unit;
    }
    this.#forceRelationChoice = forceRelationChoice as ForceOwnerType;

    if (forceRelationChoice === ForceOwnerType.Unit) {
      this.#superiorHandle = getTagValue(element, "CommandingSuperiorHandle");
      this.#commandRelationshipType =
        getTagValue(element, "CommandRelationshipType") ||
        EnumCommandRelationshipType.None;
    } else if (forceRelationChoice === ForceOwnerType.ForceSide) {
      this.#superiorHandle = getTagValue(element, "ForceSideHandle");
    } else {
      console.error("Invalid ForceRelationChoice " + forceRelationChoice);
    }
  }

  get forceRelationChoice(): ForceOwnerType {
    return (
      this.#forceRelationChoice ||
      (getTagValue(this.element, "ForceRelationChoice") as ForceOwnerType)
    );
  }

  set forceRelationChoice(forceRelationChoice: ForceOwnerType) {
    this.#forceRelationChoice = forceRelationChoice;
    setOrCreateTagValue(
      this.element,
      "ForceRelationChoice",
      forceRelationChoice,
    );
  }

  get superiorHandle(): string {
    if (this.#superiorHandle) {
      return this.#superiorHandle;
    }
    if (this.forceRelationChoice === ForceOwnerType.Unit) {
      return (
        this.#superiorHandle ||
        getTagValue(this.element, "CommandingSuperiorHandle")
      );
    }
    if (this.forceRelationChoice === ForceOwnerType.ForceSide) {
      return (
        this.#superiorHandle || getTagValue(this.element, "ForceSideHandle")
      );
    }
    return "";
  }

  get isCommandRelation(): boolean {
    return this.forceRelationChoice === ForceOwnerType.Unit;
  }

  get isForceSideRelation(): boolean {
    return this.forceRelationChoice === ForceOwnerType.ForceSide;
  }

  toObject(): UnitRelationsType {
    return removeUndefinedValues({
      forceRelationChoice: this.forceRelationChoice,
      superiorHandle: this.superiorHandle,
      commandRelationshipType: this.commandRelationshipType,
    });
  }

  updateFromObject(data: Partial<UnitRelationsType>) {
    Object.entries(data).forEach(([key, value]) => {
      if (key in this) {
        this[key] = value;
      } else {
        console.warn(`Property ${key} does not exist on Holding class.`);
      }
    });
  }
}
