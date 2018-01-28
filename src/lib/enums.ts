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

export function rel2code(relationship: HostilityStatusCode) {
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
            return "A";
        case "AHO":
            return "H";
        case "AIV":
            return "O";
        case "ANT":
            return "N";
        case "FAKER":
            return "K";
        case "FR":
            return "F";
        case "HO":
            return "H";
        case "IV":
            return "O";
        case "JOKER":
            return "J";
        case "NEUTRL":
            return "N";
        case "PENDNG":
            return "P";
        case "SUSPCT":
            return "S";
        case "UNK":
            return "U";
        default:
            return "O";
    }

}

