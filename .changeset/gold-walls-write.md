---
"@orbat-mapper/msdllib": major
---

`EquipmentItem.superiorHandle` now returns `ownerHandle` instead of `organicSuperiorHandle`

This may potentially break existing code that relies on the previous behavior. In cases where you need to access the
organic superior handle, you can use `EquipmentItem.relations.organicSuperiorHandle` (read only).
