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

export function getTagElements(
  element: Element | undefined,
  tagName: string,
): Element[] {
  if (!element) return [];
  return Array.from(element.getElementsByTagNameNS(MSDL_NS, tagName));
}
