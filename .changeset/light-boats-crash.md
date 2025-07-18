---
"@orbat-mapper/msdllib": patch
---

Add functions to `domutils.ts`:

- `createXMLElementWithValue(tagName: string, value: string | number | boolean): Element`
- `addChildElementWithValue(parent: Element, tagName: string, value: string | number | boolean): void`
- `addEmptyChildElement(parent: Element, tagName: string): void`
