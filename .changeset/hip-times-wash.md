---
"@orbat-mapper/msdllib": patch
---

Fix some issues with federate deployment.

Add functions to `MilitaryScenario`:

- removeEquipmentFromFederate(equipmentHandle: string, federateHandle: string): void
- removeUnitFromFederate(
  unitHandle: string,
  federateHandle: string,
  includeSubordinates: boolean = false,
  ): void
