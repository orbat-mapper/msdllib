export enum ForceOwnerType {
    Unit = "UNIT",
    ForceSide = "FORCE_SIDE",
}

export enum HostilityStatusCode {
    AssumedFriend = "AFR",
    AssumedHostile = "AHO",
    AssumedInvolved = "AIV",
    AssumedNeutral = "ANT",
    Faker = "FAKER",
    Friend = "FR",
    Hostile = "HO",
    Involved = "IV",
    Joker = "JOKER",
    Neutral = "NEUTRL",
    Pending = "PENDNG",
    Suspect = "SUSPCT",
    Unknown = "UNK"
}

export function rel2code(relationship: HostilityStatusCode): StandardIdentities {
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
            return StandardIdentities.AssumedFriend;
        case "AHO":
            return StandardIdentities.Hostile;
        case "AIV":
            return StandardIdentities.NoneSpecified;
        case "ANT":
            return StandardIdentities.Neutral;
        case "FAKER":
            return StandardIdentities.Faker;
        case "FR":
            return StandardIdentities.Friend;
        case "HO":
            return StandardIdentities.Hostile;
        case "IV":
            return StandardIdentities.NoneSpecified;
        case "JOKER":
            return StandardIdentities.Joker;
        case "NEUTRL":
            return StandardIdentities.Neutral;
        case "PENDNG":
            return StandardIdentities.Pending;
        case "SUSPCT":
            return StandardIdentities.Suspect;
        case "UNK":
            return StandardIdentities.Unknown;
        default:
            return StandardIdentities.NoneSpecified;
    }
}


export enum StandardIdentities {
    Pending = "P",
    Unknown = "U",
    AssumedFriend = "A",
    Friend = "F",
    Neutral = "N",
    Suspect = "S",
    Hostile = "H",
    ExercisePending = "G",
    ExerciseUnknown = "W",
    ExerciseFriend = "D",
    ExerciseNeutral = "L",
    ExerciseAssumedFriend = "M",
    Joker = "J",
    Faker = "K",
    NoneSpecified = "O"
}
