---
"@orbat-mapper/msdllib": patch
---

Add functionality to assign equipment to federates in a NETN deployment.

`Federate` class:

- `addEquipmentItem(equipmentItemHandle: string): void`
- `removeEquipmentItem(equipmentItemHandle: string): void`

`MilitaryScenario` class:

- `getFederateOfEquipment(objectHandle: string): Federate | undefined`
- `assignEquipmentItemToFederate(equipmentItemHandle: string, federateHandle: string): void`
