export const ForceOwnerType = {
  Unit: "UNIT",
  ForceSide: "FORCE_SIDE",
} as const;

export type ForceOwnerType =
  (typeof ForceOwnerType)[keyof typeof ForceOwnerType];

export const HostilityStatusCode = {
  AssumedFriend: "AFR",
  AssumedHostile: "AHO",
  AssumedInvolved: "AIV",
  AssumedNeutral: "ANT",
  Faker: "FAKER",
  Friend: "FR",
  Hostile: "HO",
  Involved: "IV",
  Joker: "JOKER",
  Neutral: "NEUTRL",
  Pending: "PENDNG",
  Suspect: "SUSPCT",
  Unknown: "UNK",
} as const;

export type HostilityStatusCode =
  (typeof HostilityStatusCode)[keyof typeof HostilityStatusCode];

export function rel2code(relationship: HostilityStatusCode): StandardIdentity {
  //     if(standardVersion == 'NATO'){
  // 		values = {	"P":"Pending",
  // 					"U":"Unknown",
  // 					"A":"Assumed Friend",
  // 					"F" :"Friend",
  // 					"N":"Neutral",
  // 					"S":"Suspect",
  // 					"H":"Hostile",
  // 					"J":"Joker",
  // 					"K":"Faker",
  // 					"O":"None Specified"};
  // RelationshipCode = "AFR" | "AHO" | "AIV" | "ANT" | "FAKER" | "FR" | "HO" | "IV" | "JOKER" | "NEUTRL" | "PENDING" | "SUSPCT" | "UNK";
  switch (relationship) {
    case "AFR":
      return StandardIdentity.AssumedFriend;
    case "AHO":
      return StandardIdentity.Hostile;
    case "AIV":
      return StandardIdentity.NoneSpecified;
    case "ANT":
      return StandardIdentity.Neutral;
    case "FAKER":
      return StandardIdentity.Faker;
    case "FR":
      return StandardIdentity.Friend;
    case "HO":
      return StandardIdentity.Hostile;
    case "IV":
      return StandardIdentity.NoneSpecified;
    case "JOKER":
      return StandardIdentity.Joker;
    case "NEUTRL":
      return StandardIdentity.Neutral;
    case "PENDNG":
      return StandardIdentity.Pending;
    case "SUSPCT":
      return StandardIdentity.Suspect;
    case "UNK":
      return StandardIdentity.Unknown;
    default:
      return StandardIdentity.NoneSpecified;
  }
}

export const StandardIdentity = {
  Pending: "P",
  Unknown: "U",
  AssumedFriend: "A",
  Friend: "F",
  Neutral: "N",
  Suspect: "S",
  Hostile: "H",
  ExercisePending: "G",
  ExerciseUnknown: "W",
  ExerciseFriend: "D",
  ExerciseNeutral: "L",
  ExerciseAssumedFriend: "M",
  Joker: "J",
  Faker: "K",
  NoneSpecified: "O",
} as const;

export type StandardIdentity =
  (typeof StandardIdentity)[keyof typeof StandardIdentity];
