# @orbat-mapper/msdllib

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
