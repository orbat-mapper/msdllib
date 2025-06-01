/**
 * Enum values for use in dropdowns or similar UI components.
 */
import type { HostilityStatusCode, MilitaryService } from "./enums.js";

export type MsdlEnumItem<G = string> = {
  value: G;
  label: string;
  description?: string;
};

export const HostilityStatusCodeItems: MsdlEnumItem<HostilityStatusCode>[] = [
  {
    value: "AFR",
    label: "Assumed friend",
    description:
      "An OBJECT-ITEM that is assumed to be a friend because of its characteristics, behaviour or origin.",
  },
  {
    value: "AHO",
    label: "Assumed hostile",
    description:
      "An indication that the OBJECT-ITEM in question is likely to belong to enemy forces.",
  },
  {
    value: "AIV",
    label: "Assumed involved",
    description:
      "An indication that the OBJECT-ITEM in question is likely to belong to involved forces different from own, allied and enemy forces.",
  },
  {
    value: "ANT",
    label: "Assumed neutral",
    description:
      "An indication that the OBJECT-ITEM in question is likely to belong to neither own, allied, enemy or otherwise involved forces.",
  },
  {
    value: "FAKER",
    label: "Faker",
    description:
      "An OBJECT-ITEM that is a friendly aircraft simulating a hostile aircraft in an air defence exercise.",
  },
  {
    value: "FR",
    label: "Friend",
    description: "An OBJECT-ITEM that belongs to a declared friendly nation.",
  },
  {
    value: "HO",
    label: "Hostile",
    description: "An OBJECT-ITEM that is positively identified as enemy.",
  },
  {
    value: "IV",
    label: "Involved",
    description:
      "An indication that the OBJECT-ITEM in question belongs to involved forces different from own, allied and enemy forces.",
  },
  {
    value: "JOKER",
    label: "Joker",
    description:
      "An OBJECT-ITEM that is acting as a suspect track for exercise purposes only.",
  },
  {
    value: "NEUTRL",
    label: "Neutral",
    description:
      "An OBJECT-ITEM whose characteristics, behaviour, origin or nationality indicate that it is neither supporting friendly nor opposing forces.",
  },
  {
    value: "PENDNG",
    label: "Pending",
    description: "An OBJECT-ITEM for which identification is to be determined.",
  },
  {
    value: "SUSPCT",
    label: "Suspect",
    description:
      "An OBJECT-ITEM that is potentially hostile because of its characteristics, behaviour or origin.",
  },
  {
    value: "UNK",
    label: "Unknown",
    description:
      "An OBJECT-ITEM for which its hostility status information is not available.",
  },
];

export const MilitaryServiceItems: MsdlEnumItem<MilitaryService>[] = [
  {
    value: "AIRFRC",
    label: "Air Force",
    description:
      "The MILITARY-ORGANISATION-TYPE in question belongs to the Air Force (includes reserves and mobilised air national guard).",
  },
  {
    value: "ARMY",
    label: "Army",
    description:
      "The MILITARY-ORGANISATION-TYPE in question belongs to the Army (includes territorial army, reserves, and mobilised national guard).",
  },
  {
    value: "BRDRGD",
    label: "Border guard",
    description:
      "A paramilitary MILITARY-ORGANISATION-TYPE whose primary task is to maintain the security of national borders.",
  },
  {
    value: "COASTG",
    label: "Coast guard",
    description:
      "The MILITARY-ORGANISATION-TYPE that may be responsible for one or more of the following: coastal defence, protection of life and property at sea, and enforcement of customs, immigration, and navigation laws.",
  },
  {
    value: "COMBND",
    label: "Combined",
    description:
      "The MILITARY-ORGANISATION-TYPE contains two or more forces or agencies of two or more allies.",
  },
  {
    value: "CVLSVC",
    label: "Civil service",
    description:
      "The MILITARY-ORGANISATION-TYPE that is staffed solely by civilian personnel.",
  },
  {
    value: "GUERLL",
    label: "Guerrilla",
    description:
      "The MILITARY-ORGANISATION-TYPE in question is an irregular military force.",
  },
  {
    value: "JOINT",
    label: "Joint",
    description:
      "The MILITARY-ORGANISATION-TYPE contains elements of more than one Service from the same nation.",
  },
  {
    value: "LCLDFF",
    label: "Local defence force",
    description:
      "A military MILITARY-ORGANISATION-TYPE whose primary task is defence of a specific region (before mobilisation, a national guard is a local defence force).",
  },
  {
    value: "LCLMLT",
    label: "Local militia",
    description:
      "A civilian MILITARY-ORGANISATION-TYPE that has a defence and possibly also a police role (may include irregular civilian MILITARY-ORGANISATION-TYPEs).",
  },
  {
    value: "MARINE",
    label: "Marines",
    description:
      "The MILITARY-ORGANISATION-TYPE in question belongs to the Marines (includes reserves).",
  },
  {
    value: "NAVY",
    label: "Navy",
    description:
      "The MILITARY-ORGANISATION-TYPE in question belongs to the Navy (includes reserves).",
  },
  {
    value: "NKN",
    label: "Not known",
    description:
      "It is not possible to determine which value is most applicable.",
  },
  {
    value: "NOS",
    label: "Not otherwise specified",
    description: "The appropriate value is not in the set of specified values.",
  },
  {
    value: "PAR",
    label: "Paramilitary",
    description:
      "Forces or groups distinct from the regular armed forces of any country, but resembling them in organization, equipment, training, or mission.",
  },
  {
    value: "SPFRC",
    label: "Special force",
    description:
      "The MILITARY-ORGANISATION-TYPE in question is trained and equipped for special purposes.",
  },
  {
    value: "TERFRC",
    label: "Territorial force",
    description:
      "The MILITARY-ORGANISATION-TYPE of a nation's armed forces that is responsible for regional defence.",
  },
];
