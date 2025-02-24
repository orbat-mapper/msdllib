# @orbat-mapper/msdllib

## 0.5.0 - 2025-02-24

### Added

- f58ea14: Export constants
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

### Minor Changes

- 8a197ee: Throw a TypeError exception when calling `MilitaryScenario.createFromString` with invalid MSDL.

## 0.2.0

### Minor Changes

- b159372: First npm release of msdllib
