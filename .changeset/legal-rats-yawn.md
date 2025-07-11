---
"@orbat-mapper/msdllib": minor
---

Add the following methods to `MsdlCoordinates`:

- `toObject(): MsdlCoordinatesType`
- `updateFromObject(model: Partial<MsdlCoordinatesType>): void`
- `MsdlCoordinates.fromModel(model: MsdlCoordinatesType, tagName?): MsdlCoordinates` (static method)
