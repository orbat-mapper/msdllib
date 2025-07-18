export const MSDL_NS2 = "urn:sisostds:scenario:military:data:draft:msdl:1";
export const MSDL_NS = "*";

export function getTagValue(
  element: Element | undefined,
  tagName: string,
  noTrim?: boolean,
): string {
  if (!element) return "";
  let elements = element.getElementsByTagNameNS(MSDL_NS, tagName);
  if (elements.length === 0) return "";
  return (
    (noTrim ? elements[0]?.textContent : elements[0]?.textContent?.trim()) ?? ""
  );
}

export function setTagValue(
  parent: Element | undefined,
  tagName: string,
  value: string,
): void {
  if (!parent) return;
  let el = parent.getElementsByTagNameNS(MSDL_NS, tagName).item(0);
  if (!el) return;
  el.textContent = value;
}

export function setOrCreateTagValue(
  parent: Element,
  tagName: string,
  value: string | null | undefined,
  { deleteIfNull = true, namespace = "*" } = {},
): void {
  let el = parent.getElementsByTagNameNS(namespace, tagName).item(0);
  if (el) {
    if (deleteIfNull && value == null) {
      el.parentNode?.removeChild(el);
    } else {
      el.textContent = value ?? "";
    }
  } else {
    let newElem =
      namespace === "*"
        ? parent.ownerDocument.createElement(tagName)
        : parent.ownerDocument.createElementNS(namespace, tagName);
    newElem.textContent = value ?? "";
    parent.appendChild(newElem);
  }
}

export function setOrCreateBooleanValue(
  parent: Element,
  tagName: string,
  value: boolean | null | undefined,
  { deleteIfNull = true, namespace = "*" } = {},
): void {
  setOrCreateTagValue(
    parent,
    tagName,
    value === null || value === undefined ? value : value ? "true" : "false",
    {
      deleteIfNull,
      namespace,
    },
  );
}

export type GetValueOptions = {
  noTrim?: boolean;
};

export function getValueOrUndefined(
  element: Element | undefined,
  tagName: string,
  { noTrim = false }: GetValueOptions = {},
): string | undefined {
  if (!element) return;
  let elements = element.getElementsByTagNameNS(MSDL_NS, tagName);
  if (elements.length === 0) return;
  return (
    (noTrim ? elements[0]?.textContent : elements[0]?.textContent?.trim()) ?? ""
  );
}

export function getNumberValue(
  element: Element | undefined,
  tagName: string,
  options?: GetValueOptions,
): number | undefined {
  let value = getValueOrUndefined(element, tagName, options);
  if (value === undefined) return;
  if (isNaN(+value) || value === "") return;
  return +value;
}

export function getBooleanValue(
  element: Element | undefined,
  tagName: string,
  options?: GetValueOptions,
): boolean | undefined {
  let value = getValueOrUndefined(element, tagName, options);
  if (value === undefined) return;
  if (value === "") return undefined;
  return value === "true" || value === "1";
}

export function getTagElement(
  element: Element | undefined,
  tagName: string,
  required?: boolean,
): Element | undefined {
  if (!element) return;
  let el = element.getElementsByTagNameNS(MSDL_NS, tagName)[0];
  if (required && !el) {
    console.warn("Required element not found", tagName);
  }
  return el;
}

export function getOrCreateTagElement(
  element: Element,
  tagName: string,
): Element {
  let el = element.getElementsByTagNameNS(MSDL_NS, tagName)[0];
  return el || createEmptyXMLElementFromTagName(tagName);
}

export function getTagElements(
  element: Element | undefined,
  tagName: string,
): Element[] {
  if (!element) return [];
  return Array.from(element.getElementsByTagNameNS(MSDL_NS, tagName));
}

export function createXMLElement(xml: string): Element {
  let parser = new DOMParser();
  let doc = parser.parseFromString(xml, "text/xml");
  return doc.documentElement;
}

export function createEmptyXMLElementFromTagName(tagName: string): Element {
  let parser = new DOMParser();
  let doc = parser.parseFromString(`<${tagName}></${tagName}>`, "text/xml");
  return doc.documentElement;
}

export function createXMLElementWithValue(
  tagName: string,
  value: string | number | boolean,
): Element {
  let parser = new DOMParser();
  let doc = parser.parseFromString(
    `<${tagName}>${value}</${tagName}>`,
    "text/xml",
  );
  return doc.documentElement;
}

export function addChildElementWithValue(
  parent: Element,
  tagName: string,
  value: string | number | boolean,
): void {
  let child = createXMLElementWithValue(tagName, value);
  parent.appendChild(child);
}

export function addEmptyChildElement(parent: Element, tagName: string): void {
  let child = createEmptyXMLElementFromTagName(tagName);
  parent.appendChild(child);
}

export function xmlToString(element: Element): string {
  let serializer = new XMLSerializer();
  return serializer.serializeToString(element);
}

export function removeUndefinedValues<T extends Record<string, any>>(
  v: T,
): {
  [K in keyof T]: T[K] extends undefined ? never : T[K];
} {
  return Object.fromEntries(
    Object.entries(v).filter(([_, value]) => value !== undefined),
  ) as {
    [K in keyof T]: T[K] extends undefined ? never : T[K];
  };
}

export function removeTagValue(parent: Element, tagName: string): void {
  let el = parent.getElementsByTagNameNS(MSDL_NS, tagName).item(0);
  if (el) {
    el.parentNode?.removeChild(el);
  }
}

export function removeTagValues(parent: Element, tagName: string): void {
  let els = parent.getElementsByTagNameNS(MSDL_NS, tagName);
  for (const el of els) {
    el.parentNode?.removeChild(el);
  }
}
