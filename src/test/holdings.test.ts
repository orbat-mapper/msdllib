import { describe, expect, it } from "vitest";
import { createXMLElement, xmlToString } from "../lib/domutils.js";
import { Holding } from "../lib/holdings.js";
import { Unit } from "../lib/units.js";

const HOLDINGS_ELEMENT_SAMPLE = `<Holdings>
    <Holding>
        <NSN_Code>192-4848-484848-48484848</NSN_Code>
        <NSN_Name>Personnel</NSN_Name>
        <IsEquipment>false</IsEquipment>
        <OperationalCount>0.0</OperationalCount>
        <OnHandQuantity>5.0</OnHandQuantity>
        <RequiredOnHandQuantity>0.0</RequiredOnHandQuantity>
    </Holding>
    <Holding>
        <NSN_Code>192-4848-484848-48484848</NSN_Code>
        <NSN_Name>Jeep</NSN_Name>
        <IsEquipment>true</IsEquipment>
        <OperationalCount>0.0</OperationalCount>
        <OnHandQuantity>2.0</OnHandQuantity>
        <RequiredOnHandQuantity>0.0</RequiredOnHandQuantity>
    </Holding>
</Holdings>`;

const HOLDING_ELEMENT_SAMPLE = `<Holding>
    <NSN_Code>192-4848-484848-48484848</NSN_Code>
    <NSN_Name>Jeep</NSN_Name>
    <IsEquipment>true</IsEquipment>
    <OperationalCount>0.0</OperationalCount>
    <OnHandQuantity>2.0</OnHandQuantity>
    <RequiredOnHandQuantity>0.0</RequiredOnHandQuantity>
    <TotalQuantity>22.0</TotalQuantity>
    <RequiredTotalQuantity>33.0</RequiredTotalQuantity>
    <RequiredCalculationMethodCode>3</RequiredCalculationMethodCode>
    <Post_Type_Category>SURPHY</Post_Type_Category>
    <Post_Type_Rank>NCO</Post_Type_Rank>
</Holding>`;

const HOLDING_ELEMENT_SAMPLE2 = `<Holding>
    <NSN_Code>192-4848-484848-48484848</NSN_Code>
    <NSN_Name>Jeep</NSN_Name>
    <IsEquipment>true</IsEquipment>
    <OperationalCount>0.0</OperationalCount>
    <OnHandQuantity>2.0</OnHandQuantity>
    <RequiredOnHandQuantity>0.0</RequiredOnHandQuantity>
    <TotalQuantity>22.0</TotalQuantity>
    <RequiredTotalQuantity>33.0</RequiredTotalQuantity>
</Holding>`;

const UNIT_HOLDINGS = `<Unit>
    <ObjectHandle>8747aebb-6b76-45d2-8bab-b78450453649</ObjectHandle>
    <SymbolIdentifier>S-G-UH-----E---</SymbolIdentifier>
    <UnitSymbolModifiers>
        <UniqueDesignation>BN HQs-HHC</UniqueDesignation>
        <HigherFormation>4</HigherFormation>
        <Echelon>COMPANY</Echelon>
        <CombatEffectiveness>GREEN</CombatEffectiveness>
    </UnitSymbolModifiers>
    <Disposition>
        <Location>
            <CoordinateChoice>MGRS</CoordinateChoice>
            <CoordinateData>
                <MGRS>
                    <MGRSGridZone>11S</MGRSGridZone>
                    <MGRSGridSquare>NV</MGRSGridSquare>
                    <MGRSPrecision>5</MGRSPrecision>
                    <MGRSEasting>31919</MGRSEasting>
                    <MGRSNorthing>10790</MGRSNorthing>
                    <ElevationAGL>0</ElevationAGL>
                </MGRS>
            </CoordinateData>
        </Location>
        <DirectionOfMovement>0</DirectionOfMovement>
        <Speed>0</Speed>
        <FormationPosition>
            <FormationOrder>1</FormationOrder>
        </FormationPosition>
        <OwnFormation>
            <FormationSpacing>171</FormationSpacing>
            <FormationOrientation>85</FormationOrientation>
            <FormationChoice>GROUND</FormationChoice>
            <FormationLocationType>LEAD_ELEMENT</FormationLocationType>
            <FormationData>
                <GroundFormationType>WEDGE</GroundFormationType>
            </FormationData>
        </OwnFormation>
    </Disposition>
    <Relations>
        <ForceRelation>
            <ForceRelationChoice>UNIT</ForceRelationChoice>
            <ForceRelationData>
                <CommandRelation>
                    <CommandingSuperiorHandle>dfc963b8-2079-40e3-ac2d-dcda64001f09</CommandingSuperiorHandle>
                    <CommandRelationshipType>ORGANIC</CommandRelationshipType>
                </CommandRelation>
            </ForceRelationData>
        </ForceRelation>
    </Relations>
    <Holdings>
        <Holding>
            <NSN_Code>192-4848-484848-48484848</NSN_Code>
            <NSN_Name>Personnel</NSN_Name>
            <IsEquipment>false</IsEquipment>
            <OperationalCount>0.0</OperationalCount>
            <OnHandQuantity>5.0</OnHandQuantity>
            <RequiredOnHandQuantity>0.0</RequiredOnHandQuantity>
        </Holding>
        <Holding>
            <NSN_Code>192-4848-484848-48484848</NSN_Code>
            <NSN_Name>Jeep</NSN_Name>
            <IsEquipment>true</IsEquipment>
            <OperationalCount>0.0</OperationalCount>
            <OnHandQuantity>2.0</OnHandQuantity>
            <RequiredOnHandQuantity>0.0</RequiredOnHandQuantity>
        </Holding>
    </Holdings>
</Unit>

`;

describe("Holding class", () => {
  it("is defined", () => {
    expect(Holding).toBeDefined();
  });

  it("can be created from an XML string", () => {
    const holding = new Holding(createXMLElement(HOLDING_ELEMENT_SAMPLE));
    expect(holding).toBeInstanceOf(Holding);
    expect(holding.nsnCode).toBe("192-4848-484848-48484848");
    expect(holding.nsnName).toBe("Jeep");
    expect(holding.isEquipment).toBe(true);
    expect(holding.operationalCount).toBe(0.0);
    expect(holding.onHandQuantity).toBe(2.0);
    expect(holding.requiredOnHandQuantity).toBe(0.0);
    expect(holding.totalQuantity).toBe(22.0);
    expect(holding.requiredTotalQuantity).toBe(33.0);
    expect(holding.postTypeCategory).toBe("SURPHY");
    expect(holding.postTypeRank).toBe("NCO");
    expect(holding.requiredCalculationMethodCode).toBe(3);
  });

  it("can be modified and serialized back to XML", () => {
    const holding = new Holding(createXMLElement(HOLDING_ELEMENT_SAMPLE));
    holding.nsnName = "Modified Jeep";
    holding.nsnCode = "192-4848-484848-48484849";
    holding.onHandQuantity = 3.0;
    holding.requiredOnHandQuantity = 1.0;
    holding.totalQuantity = 25.0;
    holding.requiredTotalQuantity = 35.0;
    holding.postTypeCategory = "MODIFIED";
    holding.postTypeRank = "MODIFIED_RANK";
    holding.requiredCalculationMethodCode = 4;

    const xmlString = xmlToString(holding.element);
    const modifiedHolding = new Holding(createXMLElement(xmlString));

    expect(modifiedHolding.nsnName).toBe("Modified Jeep");
    expect(modifiedHolding.nsnCode).toBe("192-4848-484848-48484849");
    expect(modifiedHolding.onHandQuantity).toBe(3.0);
    expect(modifiedHolding.requiredOnHandQuantity).toBe(1.0);
    expect(modifiedHolding.totalQuantity).toBe(25.0);
    expect(modifiedHolding.requiredTotalQuantity).toBe(35.0);
    expect(modifiedHolding.postTypeCategory).toBe("MODIFIED");
    expect(modifiedHolding.postTypeRank).toBe("MODIFIED_RANK");
    expect(modifiedHolding.requiredCalculationMethodCode).toBe(4);
  });

  it("has a toJson method that returns a JSON representation", () => {
    const holding = new Holding(createXMLElement(HOLDING_ELEMENT_SAMPLE));
    const json = holding.toObject();
    expect(json).toEqual({
      nsnCode: "192-4848-484848-48484848",
      nsnName: "Jeep",
      isEquipment: true,
      operationalCount: 0.0,
      onHandQuantity: 2.0,
      requiredOnHandQuantity: 0.0,
      totalQuantity: 22.0,
      requiredTotalQuantity: 33.0,
      postTypeCategory: "SURPHY",
      postTypeRank: "NCO",
      requiredCalculationMethodCode: 3,
    });
  });

  it("has a updateFromJson method that updates properties from a JSON object", () => {
    const holding = new Holding(createXMLElement(HOLDING_ELEMENT_SAMPLE2));
    holding.updateFromObject({
      nsnName: "Updated Jeep",
      onHandQuantity: 4.0,
      requiredTotalQuantity: 40.0,
      postTypeCategory: "UPDATED",
      postTypeRank: "UPDATED_RANK",
      totalQuantity: undefined,
    });

    expect(holding.nsnName).toBe("Updated Jeep");
    expect(holding.onHandQuantity).toBe(4.0);
    expect(holding.postTypeCategory).toBe("UPDATED");
    expect(holding.postTypeRank).toBe("UPDATED_RANK");
    expect(holding.totalQuantity).toBeUndefined();

    const holding2 = new Holding(
      createXMLElement(xmlToString(holding.element)),
    );
    expect(holding2.nsnName).toBe("Updated Jeep");
    expect(holding2.onHandQuantity).toBe(4.0);
    expect(holding2.postTypeCategory).toBe("UPDATED");
    expect(holding2.postTypeRank).toBe("UPDATED_RANK");
    expect(holding2.totalQuantity).toBeUndefined();
  });
});

describe("Unit holdings", () => {
  it("can parse holdings from a unit element", () => {
    const unitElement = new Unit(createXMLElement(UNIT_HOLDINGS));
    const holdings = unitElement.holdings;
    expect(holdings.length).toBe(2);
    expect(holdings[0]?.nsnCode).toBe("192-4848-484848-48484848");
    expect(holdings[0]?.nsnName).toBe("Personnel");
    expect(holdings[0]?.isEquipment).toBe(false);
    expect(holdings[0]?.onHandQuantity).toBe(5.0);
    expect(holdings[1]?.nsnCode).toBe("192-4848-484848-48484848");
    expect(holdings[1]?.nsnName).toBe("Jeep");
    expect(holdings[1]?.isEquipment).toBe(true);
    expect(holdings[1]?.onHandQuantity).toBe(2.0);
  });
});
