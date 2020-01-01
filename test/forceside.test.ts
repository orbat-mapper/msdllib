import { parseFromString } from "./testdata";
import { ForceSide } from "../src";
import { loadTestScenario } from "./testutils";
import { HostilityStatusCode } from "../src/lib/enums";

const FORCESIDE_TEMPLATE = `<ForceSide>
    <ObjectHandle>e7ad0e8d-2dcd-11e2-be2b-000c294c9df8</ObjectHandle>
    <ForceSideName>Friendly</ForceSideName>
    <AllegianceHandle>e7ad0e8d-2dcd-11e2-be2b-000c294c9df8</AllegianceHandle>
    <Associations>
        <Association>
            <AffiliateHandle>e7ae4710-2dcd-11e2-be2b-000c294c9df8</AffiliateHandle>
            <Relationship>HO</Relationship>
        </Association>
        <Association>
            <AffiliateHandle>e7ae4710-2ccc-11e2-be2b-000c294c9df8</AffiliateHandle>
            <Relationship>FR</Relationship>
        </Association>
    </Associations>
</ForceSide>`;


describe("ForceSide class", () => {
  it("is defined", () => {
    expect(ForceSide).toBeDefined();
  });

  it("create from Element", () => {
    let element = parseFromString(FORCESIDE_TEMPLATE);
    let forceSide = new ForceSide(element);
    expect(forceSide).toBeInstanceOf(ForceSide);
  });

  it("read attributes", () => {
    let element = parseFromString(FORCESIDE_TEMPLATE);
    let forceSide = new ForceSide(element);
    expect(forceSide.objectHandle).toBe("e7ad0e8d-2dcd-11e2-be2b-000c294c9df8");
    expect(forceSide.allegianceHandle).toBe("e7ad0e8d-2dcd-11e2-be2b-000c294c9df8");
    expect(forceSide.name).toBe("Friendly");
    expect(forceSide.isSide).toBe(true);
    expect(forceSide.associations).toBeDefined();
    expect(forceSide.associations.length).toBe(2);
    expect(forceSide.associations[0].affiliateHandle).toBe("e7ae4710-2dcd-11e2-be2b-000c294c9df8");
    expect(forceSide.associations[0].relationship).toBe(HostilityStatusCode.Hostile);
    expect(forceSide.associations[1].relationship).toBe(HostilityStatusCode.Friend);


  });

  it("has GeoJSON interface", () => {
    let scenario = loadTestScenario();
    let forceSide = scenario.forceSides[0];
    expect(forceSide.name).toBe("Friendly");
    expect(forceSide.toGeoJson).toBeDefined();
    let gjson = forceSide.toGeoJson();
    expect(gjson.type).toBe("FeatureCollection");
    expect(gjson.features.length).toBe(3);
  })
});

describe("Side relations", () => {
  it("root units", () => {
    let scenario = loadTestScenario();
    expect(scenario.forceSides).toBeInstanceOf(Array);
    expect(scenario.forceSides.length).toBe(3);
    let forceSide = scenario.forceSides[0];
    expect(forceSide.name).toBe("Friendly");
    expect(forceSide.rootUnits.length).toBe(1);
    expect(forceSide.rootUnits[0].name).toBe("HQ");
  });
});

