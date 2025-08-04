# @orbat-mapper/msdllib

## 1.1.1

### Patch Changes

- ca525da: Add logic for unallocated units and equipment

## 1.1.0

### Minor Changes

- 87a1994: Add support for writing GCC (geocentric) coordinates

### Patch Changes

- 5b2aa97: Use first equipment item for affiliation if there are no units in a ForceSide

## 1.0.3

### Patch Changes

- 0dd52e1: Update `ForceSide` root equipment when setting primary side

## 1.0.2

### Patch Changes

- 6d1bdce: `ForceSide.setAffiliation` now sets the affiliation of equipment assigned directly to the `ForceSide`

## 1.0.1

### Patch Changes

- ffb2e18: Fix bug in equipment assignment introduced by changes to `EquipmentItem.superiorHandle` behavior

## 1.0.0

### Major Changes

- c64b6cd: `EquipmentItem.superiorHandle` now returns `ownerHandle` instead of `organicSuperiorHandle`

  This may potentially break existing code that relies on the previous behavior. In cases where you need to access the
  organic superior handle, you can use `EquipmentItem.relations.organicSuperiorHandle` (read only).

## 0.29.0

### Minor Changes

- 4006566: Make `EquipmentItem.symbolModifiers` writable
- f227e34: Make `Unit.symbolModifiers` writable

## 0.28.0

### Minor Changes

- 40a3b0c: Make `ForceSide` associations writable:
  - `ForceSide.associations` is writable
  - added `addAssociation`, `removeAssociation` and `updateAssociation` methods to `ForceSide` class

## 0.27.0

### Minor Changes

- 165cb7e: Add `MilitaryScenario.setItemRelation(.)` `ForceSide` reordering support

## 0.26.1

### Patch Changes

- e579c3c: Fix bug where Unit and EquipmentItem elements were put in wrong parent element

## 0.26.0

### Minor Changes

- d8318ba: Add `MilitaryScenario.msdlOptions:MsdlOptions` attribute

## 0.25.1

### Patch Changes

- 25b7685: Improve `setItemRelation` error handling and input validation

## 0.25.0

### Minor Changes

- 112f94e: Add `MilitaryScenario.setItemRelation(.)` method that allows you to reorder unit and equipment in the ORBAT

## 0.24.2

### Patch Changes

- 52d4eb7: Fix bug when setting unit or equipment disposition

## 0.24.1

### Patch Changes

- 6924eb0: Add functions to `MilitaryScenario`:
  - assignAllUnitsToFederate( fromFederateHandle: string, toFederateHandle: string): void
  - assignAllEquipmentToFederate(fromFederateHandle: string, toFederateHandle: string): void

  Add functions to `Federate`:
  - addAllUnits(units: string[]): void
  - addAllEquipment(equipment: string[]): void
  - removeAllUnits(): void
  - removeAllEquipment(): void

## 0.24.0

### Minor Changes

- c24854e: Add `getItemHierarchy(.)` and `getItemParent(.)` methods to `MilitaryScenario` class
- 59eb4b0: Add `superiorHandle` getter to `ForceSide` class (for consistency with units and equipment)

## 0.23.1

### Patch Changes

- 62dd181: Bugfix in `Deployment` and `Federate` class where the `<Unit>` and `<EquipmentItem>` were missing a nested `<ObjectHandle>` tag

## 0.23.0

### Minor Changes

- ea61a3e: Add `recursive` option to `Unit.setAffiliation(.)`

## 0.22.1

### Patch Changes

- 135a312: Add functionality to assign a unit to another federate in a NETN deployment.

  `Federate` class:
  - `addUnit(unitHandle: string): void`
  - `removeUnit(unitHandle: string): void`

  `MilitaryScenario` class:
  - `assignUnitToFederate(unitHandle: string, federateHandle: string): void`
  - `getFederateById(objectHandle: string): Federate | undefined`
  - `getFederateOfUnit(objectHandle: string): Federate | undefined`

- 135a312: Add functionality to assign equipment to federates in a NETN deployment.

  `Federate` class:
  - `addEquipmentItem(equipmentItemHandle: string): void`
  - `removeEquipmentItem(equipmentItemHandle: string): void`

  `MilitaryScenario` class:
  - `getFederateOfEquipment(objectHandle: string): Federate | undefined`
  - `assignEquipmentItemToFederate(equipmentItemHandle: string, federateHandle: string): void`

- 135a312: Add functions to `domutils.ts`:
  - `createXMLElementWithValue(tagName: string, value: string | number | boolean): Element`
  - `addChildElementWithValue(parent: Element, tagName: string, value: string | number | boolean): void`
  - `addEmptyChildElement(parent: Element, tagName: string): void`

## 0.22.0

### Minor Changes

- 75e9538: Add `MilitaryScenario.msdlOptions:MsdlOptions` attribute

### Patch Changes

- 1937cad: - Add function `addFederate` to `MilitaryScenario`
  - Add `.prettierrc.json`

## 0.21.0

### Minor Changes

- cc701c9: Add the following methods to `MsdlCoordinates`:
  - `toObject(): MsdlCoordinatesType`
  - `updateFromObject(model: Partial<MsdlCoordinatesType>): void`
  - `MsdlCoordinates.fromModel(model: MsdlCoordinatesType, tagName?): MsdlCoordinates` (static method)

## 0.20.0

### Minor Changes

- 159e75f: Add read support for the `Environment` element (`scenarioTime` and `areaOfInterest`)
- 8add1e0: Add `toObject()` and `toGeoJson()` methods to `MsdlCoordinates` class

### Patch Changes

- 0b7a80e: - Add writable `units` and `equipment` fields to `Federate` classes
  - Add static `create` and `fromModel` functions to `Deployment` and `Federate`
  - Add tests for `Deployment` and `Federate` classes
  - Remove unused class `FederateItem`
- 9c7a17e: Add generic `MsdlCoordinates` class to represent the `CoordinatesType` from MSDL

## 0.19.0

### Minor Changes

- d750f85: - 0292f8e: Add functions to `MilitaryScenario`:
  - `addForceSide(side: ForceSide): void`
  - `removeForceSide(objectHandle: string): void;`

### Patch Changes

- d750f85: Add util function getOrCreateTagElement
- 789d4b3: Export `UnitModel`, `UnitModelType`, `EquipmentModelType` and `EquipmentModel` types

## 0.18.1

### Patch Changes

- 10c06b0: Add function to `MilitaryScenario`:
  - `getUnitOrEquipmentById(objectHandle: string)`

## 0.18.0 2025-07-02

### Minor Changes

- 8b19523: Add `MilitaryScenario.setUnitForceRelation(.)` method
- 8b19523: Add `Unit.setForceRelation()` method
- 6b1d617: Make `ForceSide.allegianceHandle` writable
- daa5cbc: Add functions to `MilitaryScenario`:
  - `addUnit(unit: Unit): void`
  - `addEquipmentItem(equipmentitem: EquipmentItem): void`
  - `removeUnit(objectHandle: string): void`
  - `removeEquipmentItem(objectHandle: string): void`

## 0.17.0 2025-06-27

### Added

- Add `MilitaryScenario.createFromModel` method to create a minimal scenario

## 0.16.0 2025-06-20

### Minor Changes

- Add holdings write support

## 0.15.1 2025-06-18

### Fixed

- Fix location property to use getter/setter in Disposition, Equipment, and Unit classes

## 0.15.0 2025-06-18

### Added

- Add experimental GDC Location write support
- Add `disposition` to `Unit` and `EquipmentItem` classes
- Add `toObject` and `updateFromObject` methods to ForceSide

### Changed

- `ForceSide.countryCode` is now undefined if not set
- Rename `Holding.toJson()` and `Holding.updateFromJson()` to `toObject()` and `updateFromObject()`

## 0.14.0 - 2025-06-11

### Added

- Add basic read support for NETN `<Holdings>` and `<Holding>` element

## 0.13.1 - 2025-06-11

### Fixed

- Add missing `Deployment`, `Federate` and `FederateItem` exports

## 0.13.0 - 2025-06-10

### Added

- Add basic read support for the NETN `<Deployment>` element

## 0.12.1 - 2025-06-06

### Fixed

- Fix ScenarioId modificationDate, version and type initialization

## 0.12.0 - 2025-06-06

### Added

- Add basic support for the `<EntityType>` NETN element
- Add writable `model` element to `Unit` and `EquipmentItem` classes
- Add HostilityStatusCodeItems and MilitaryServiceItems
- Add `isNETN` property to `MilitaryScenario` class
- Add writable `modificationData`, `version` and `type` to `ScenarioId`

## 0.11.0 - 2025-05-29

### Added

- Add writable `militaryService` and `countryCode` properties to ForceSide class
- Make ForceSide `name` and `description` writable

## 0.10.0 - 2025-05-25

### Added

- Add `forceRelationChoice` attribute to `Unit` class
- Add `commandRelationshipType` attribute to `Unit` class
- Add `toString` method to `Unit` and `EquipmentItem` classes
- Add `setForceRelation` method to `Unit` class
- Make unit and equipment name writable
- Make ScenarioId name, description and securityClassification writable

### Fixed

- 54e5f13: Refactor constructors to be compatible with erasableSyntaxOnly TS setting

## 0.9.0 - 2025-03-11

### Added

- Add a `toString()` method to `MilitaryScenario` for serializing a scenario to an XML string

### Changed

- Rename `MilitaryScenario.rootElement` attribute to `element` for consistency

## 0.8.2

### Fixed

- Add missing toGeoJson options for root units and equipment

## 0.8.1 - 2025-03-02

### Fixed

- Fix missing `includeId` options in `toGeoJson` for equipment

## 0.8.0 - 2025-03-02

### Added

- Add `includeId` (default `true`) and `includeIdInProperties` (default `false`) options to `toGeoJson({...})` methods

## 0.7.0 - 2025-03-01

### Added

- Add `symbolModifiers` attribute to `EquipmentItem` class
- Add an `includeUnits` option with default value `true` to ForceSide.toGeoJson(.)

### Fixed

- Add missing Unit and EquipmentItem exports

## 0.6.0 - 2025-02-27

### Added

- Add equipment to `Unit` and `ForceSide` classes. Available through the `equipment` attribute
- Add `getEquipmentById` method to MilitaryScenario class
- Add option `includeEquipment` to `ForceSide.toGeoJson(.)` to include equipment in the output. Default is `true`

### Fixed

- Add missing `sidc` and `label` properties to `EquipmentItem.toGeoJson(.)` output
- Add missing `label` property to `EquipmentItem` class

## 0.5.0 - 2025-02-24

### Added

- Export constants
- Add a `getAllUnits()` method to ForceSide class to return all units in the force side as a flat array
- Add a `setAffiliation()` and `getAffiltiation()` method to ForceSide, Unit and EquipmentItem classes
- Add `getForceSideById(.)` and `getUnitOrForceSideById(.)` methods to `MilitaryScenario` class

### Changed

- Rename StandardIdentities to StandardIdentity for consistency

## 0.4.0 - 2025-02-22

### Added

- Add `includeEmptyLocations` option to `ForceSide.toGeoJson` to include units with no location in the output
- Add `unitCount` attribute to `MilitaryScenario` class

### Changed

- Rename `getUnitByObjectHandle` to `getUnitById` in `MilitaryScenario` class
- Refactor enums to const objects

### Fixed

- Exclude by default units with no location from `ForceSide.toGeoJson` output

## 0.3.0

### Changed

- Throw a TypeError exception when calling `MilitaryScenario.createFromString` with invalid MSDL.

## 0.2.0

- First npm release of msdllib
