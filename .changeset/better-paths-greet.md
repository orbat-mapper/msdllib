---
"@orbat-mapper/msdllib": patch
---

Add functions to `MilitaryScenario`:

- assignAllUnitsToFederate( fromFederateHandle: string, toFederateHandle: string): void
- assignAllEquipmentToFederate(fromFederateHandle: string, toFederateHandle: string): void

Add functions to `Federate`:

- addAllUnits(units: string[]): void
- addAllEquipment(equipment: string[]): void
- removeAllUnits(): void
- removeAllEquipment(): void
