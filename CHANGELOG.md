# @orbat-mapper/msdllib

## 0.9.0 - 2025-03-11

### Added

- Add a `toString()` method to `MilitaryScenario` for serializing a scenario to an XML string

### Changed

- Rename `MilitaryScenario.rootElement` attribute to `element` for consistency

## 0.8.2

### Fixes

- Add missing toGeoJson options for root units and equipment

## 0.8.1 - 2025-03-02

### Fixes

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
