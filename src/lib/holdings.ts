import {
  getBooleanValue,
  getNumberValue,
  getTagValue,
  getValueOrUndefined,
  setOrCreateBooleanValue,
  setOrCreateTagValue,
} from "./domutils.js";

export type HoldingType = {
  nsnCode: string;
  nsnName?: string;
  isEquipment?: boolean;
  operationalCount?: number;
  totalQuantity?: number;
  postTypeCategory?: string;
  postTypeRank?: string;
  onHandQuantity?: number;
  requiredTotalQuantity?: number;
  requiredOnHandQuantity?: number;
  requiredCalculationMethodCode?: number;
};

/*
The quantity of each specific Equipment/Consumable defined by a Nato Stock Number
that is held by, installed in, or included with a unit.
*/
export class Holding implements HoldingType {
  element: Element;
  #isEquipment?: boolean;
  #nsnCode: string;
  #nsnName?: string;
  #onHandQuantity?: number;
  #operationalCount?: number;
  #postTypeCategory?: string;
  #postTypeRank?: string;
  #requiredCalculationMethodCode?: number;
  #requiredOnHandQuantity?: number;
  #requiredTotalQuantity?: number;
  #totalQuantity?: number;
  constructor(element: Element) {
    this.element = element;
    this.#nsnCode = getTagValue(element, "NSN_Code");
    this.#nsnName = getValueOrUndefined(element, "NSN_Name");
    this.#isEquipment = getBooleanValue(element, "IsEquipment");
    this.#operationalCount = getNumberValue(element, "OperationalCount");
    this.#totalQuantity = getNumberValue(element, "TotalQuantity");
    this.#onHandQuantity = getNumberValue(element, "OnHandQuantity");
    this.#requiredTotalQuantity = getNumberValue(
      element,
      "RequiredTotalQuantity",
    );
    this.#requiredOnHandQuantity = getNumberValue(
      element,
      "RequiredOnHandQuantity",
    );
    this.#postTypeCategory = getValueOrUndefined(element, "Post_Type_Category");
    this.#postTypeRank = getValueOrUndefined(element, "Post_Type_Rank");
    this.#requiredCalculationMethodCode = getNumberValue(
      element,
      "RequiredCalculationMethodCode",
    );
  }

  get isEquipment() {
    return this.#isEquipment ?? getBooleanValue(this.element, "IsEquipment");
  }

  set isEquipment(isEquipment: boolean | undefined) {
    this.#isEquipment = isEquipment;
    setOrCreateBooleanValue(this.element, "IsEquipment", isEquipment);
  }

  get nsnCode(): string {
    return this.#nsnCode ?? getTagValue(this.element, "NSN_Code");
  }

  set nsnCode(nsnCode: string) {
    this.#nsnCode = nsnCode;
    setOrCreateTagValue(this.element, "NSN_Code", nsnCode);
  }

  get nsnName(): string | undefined {
    return this.#nsnName ?? getValueOrUndefined(this.element, "NSN_Name");
  }

  set nsnName(nsnName: string | undefined) {
    this.#nsnName = nsnName;
    setOrCreateTagValue(this.element, "NSN_Name", nsnName);
  }

  get onHandQuantity(): number | undefined {
    return (
      this.#onHandQuantity ?? getNumberValue(this.element, "OnHandQuantity")
    );
  }

  set onHandQuantity(onHandQuantity: number | undefined) {
    this.#onHandQuantity = onHandQuantity;
    setOrCreateTagValue(
      this.element,
      "OnHandQuantity",
      onHandQuantity?.toString(),
    );
  }

  get operationalCount(): number | undefined {
    return (
      this.#operationalCount ?? getNumberValue(this.element, "OperationalCount")
    );
  }

  set operationalCount(operationalCount: number | undefined) {
    this.#operationalCount = operationalCount;
    setOrCreateTagValue(
      this.element,
      "OperationalCount",
      operationalCount?.toString(),
    );
  }

  get postTypeCategory(): string | undefined {
    return (
      this.#postTypeCategory ??
      getValueOrUndefined(this.element, "Post_Type_Category")
    );
  }

  set postTypeCategory(postTypeCategory: string | undefined) {
    this.#postTypeCategory = postTypeCategory;
    setOrCreateTagValue(this.element, "Post_Type_Category", postTypeCategory);
  }

  get postTypeRank(): string | undefined {
    return (
      this.#postTypeRank ?? getValueOrUndefined(this.element, "Post_Type_Rank")
    );
  }

  set postTypeRank(postTypeRank: string | undefined) {
    this.#postTypeRank = postTypeRank;
    setOrCreateTagValue(this.element, "Post_Type_Rank", postTypeRank);
  }

  get requiredCalculationMethodCode(): number | undefined {
    return (
      this.#requiredCalculationMethodCode ??
      getNumberValue(this.element, "RequiredCalculationMethodCode")
    );
  }

  set requiredCalculationMethodCode(
    requiredCalculationMethodCode: number | undefined,
  ) {
    this.#requiredCalculationMethodCode = requiredCalculationMethodCode;
    setOrCreateTagValue(
      this.element,
      "RequiredCalculationMethodCode",
      requiredCalculationMethodCode?.toString(),
    );
  }

  get requiredOnHandQuantity(): number | undefined {
    return (
      this.#requiredOnHandQuantity ??
      getNumberValue(this.element, "RequiredOnHandQuantity")
    );
  }

  set requiredOnHandQuantity(requiredOnHandQuantity: number | undefined) {
    this.#requiredOnHandQuantity = requiredOnHandQuantity;
    setOrCreateTagValue(
      this.element,
      "RequiredOnHandQuantity",
      requiredOnHandQuantity?.toString(),
    );
  }

  get requiredTotalQuantity(): number | undefined {
    return (
      this.#requiredTotalQuantity ??
      getNumberValue(this.element, "RequiredTotalQuantity")
    );
  }

  set requiredTotalQuantity(requiredTotalQuantity: number | undefined) {
    this.#requiredTotalQuantity = requiredTotalQuantity;
    setOrCreateTagValue(
      this.element,
      "RequiredTotalQuantity",
      requiredTotalQuantity?.toString(),
    );
  }

  get totalQuantity(): number | undefined {
    return this.#totalQuantity ?? getNumberValue(this.element, "TotalQuantity");
  }

  set totalQuantity(totalQuantity: number | undefined) {
    this.#totalQuantity = totalQuantity;
    setOrCreateTagValue(
      this.element,
      "TotalQuantity",
      totalQuantity?.toString(),
    );
  }

  toObject(): HoldingType {
    return {
      isEquipment: this.isEquipment,
      nsnCode: this.nsnCode,
      nsnName: this.nsnName,
      onHandQuantity: this.onHandQuantity,
      operationalCount: this.operationalCount,
      postTypeCategory: this.postTypeCategory,
      postTypeRank: this.postTypeRank,
      requiredCalculationMethodCode: this.requiredCalculationMethodCode,
      requiredOnHandQuantity: this.requiredOnHandQuantity,
      requiredTotalQuantity: this.requiredTotalQuantity,
      totalQuantity: this.totalQuantity,
    };
  }

  updateFromObject(data: Partial<HoldingType>) {
    Object.entries(data).forEach(([key, value]) => {
      if (key in this) {
        (this as any)[key] = value;
      } else {
        console.warn(`Property ${key} does not exist on Holding class.`);
      }
    });
  }
}
