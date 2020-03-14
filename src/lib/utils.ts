export const MSDL_NS2 = "urn:sisostds:scenario:military:data:draft:msdl:1";
export const MSDL_NS = "*";

export function getTagValue(
  element: Element | undefined,
  tagName: string,
  noTrim?: boolean
): string {
  if (!element) return "";
  let elements = element.getElementsByTagNameNS(MSDL_NS, tagName);
  if (elements.length) {
    return noTrim ? elements[0].innerHTML : elements[0].innerHTML.trim();
  }
  return "";
}

export function getTagElement(
  element: Element | undefined,
  tagName: string,
  required?: boolean
): Element | undefined {
  if (!element) return;
  let el = element.getElementsByTagNameNS(MSDL_NS, tagName)[0];
  if (required && !el) {
    console.warn("Required element not found", tagName);
  }
  return el;
}

export function getTagElements(element: Element | undefined, tagName: string): Element[] {
  if (!element) return [];
  let _elements = element.getElementsByTagNameNS(MSDL_NS, tagName);
  let elements = [];
  for (let i = 0; i < _elements.length; i++) {
    elements.push(_elements[i]);
  }
  return elements;
}

export function setCharAt(str: string, index: number, chr: string) {
  if (index > str.length - 1) return str;
  return str.substr(0, index) + chr + str.substr(index + 1);
}
