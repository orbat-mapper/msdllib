import { EnumCommandRelationshipType, ForceOwnerType } from "./enums.js";
import {
  getTagValue,
  getValueOrUndefined,
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

  set superiorHandle(superiorHandle: string) {
    this.#superiorHandle = superiorHandle;
    if (this.forceRelationChoice === ForceOwnerType.Unit) {
      setOrCreateTagValue(
        this.element,
        "CommandingSuperiorHandle",
        superiorHandle,
      );
    } else if (this.forceRelationChoice === ForceOwnerType.ForceSide) {
      setOrCreateTagValue(this.element, "ForceSideHandle", superiorHandle);
    }
  }

  get commandRelationshipType(): EnumCommandRelationshipType | undefined {
    return (
      this.#commandRelationshipType ||
      getValueOrUndefined(this.element, "CommandRelationshipType")
    );
  }

  set commandRelationshipType(
    commandRelationshipType: EnumCommandRelationshipType | undefined,
  ) {
    this.#commandRelationshipType = commandRelationshipType;
    if (commandRelationshipType) {
      setOrCreateTagValue(
        this.element,
        "CommandRelationshipType",
        commandRelationshipType,
      );
    } else {
      this.element.removeChild(
        this.element.querySelector("CommandRelationshipType")!,
      );
    }
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
        if (key === "forceRelationChoice") {
          this.forceRelationChoice = value as ForceOwnerType;
        } else if (key === "superiorHandle") {
          this.superiorHandle = value as string;
        } else if (key === "commandRelationshipType") {
          this.commandRelationshipType = value as EnumCommandRelationshipType;
        }
      } else {
        console.warn(`Property ${key} does not exist on Holding class.`);
      }
    });
  }
}
