---
"@orbat-mapper/msdllib": patch
---

Add functionality to assign a unit to another federate in a NETN deployment.

`Federate` class:

- `addUnit(unitHandle: string): void`
- `removeUnit(unitHandle: string): void`

`MilitaryScenario` class:

- `assignUnitToFederate(unitHandle: string, federateHandle: string): void`
- `getFederateById(objectHandle: string): Federate | undefined`
- `getFederateOfUnit(objectHandle: string): Federate | undefined`
