export const MSDL_NS2 = "urn:sisostds:scenario:military:data:draft:msdl:1";
export const MSDL_NS = "*";


export function getTagValue(element: Element, tagName: string, noTrim?: boolean): string {
    if (!element) return "";
    let elements = element.getElementsByTagNameNS(MSDL_NS, tagName);
    if (elements.length) {
        return noTrim ? elements[0].innerHTML : elements[0].innerHTML.trim();
    }
    return "";
}

export function getTagElement(element: Element, tagName: string, required?: boolean): Element {
    let el = element.getElementsByTagNameNS(MSDL_NS, tagName)[0];
    if (required && !el) {
        console.warn("Required element not found", tagName);
    }
    return el;
}

export function getTagElements(element: Element, tagName: string): Element[] {
    let _elements = element.getElementsByTagNameNS(MSDL_NS, tagName);
    let elements = [];
    for (let i = 0; i < _elements.length; i++) {
        elements.push(_elements[i]);
    }
    return elements;
}

export function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
}
