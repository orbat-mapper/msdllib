export function parseFromString(xmlString: string): Element {
  let parser = new DOMParser();
  let doc = parser.parseFromString(xmlString, "text/xml");
  return doc.documentElement;
}

export const EMPTY_SCENARIO = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<MilitaryScenario xmlns="urn:sisostds:scenario:military:data:draft:1"
                  xmlns:modelID="http://www.sisostds.org/schemas/modelID">
    <ScenarioID>
        <modelID:name>Empty scenario</modelID:name>
        <modelID:type></modelID:type>
        <modelID:version>0</modelID:version>
        <modelID:modificationDate>2012-11-13-05:00</modelID:modificationDate>
        <modelID:securityClassification>Unclassified</modelID:securityClassification>
        <modelID:description>Description</modelID:description>
        <modelID:poc>
            <modelID:pocType>e-mail</modelID:pocType>
            <modelID:pocEmail>test@test.com</modelID:pocEmail>
        </modelID:poc>
    </ScenarioID>
    <Options>
        <MSDLVersion>MSDL Standard Nov 2008</MSDLVersion>
    </Options>
    <Environment>
    </Environment>
    <ForceSides>
    </ForceSides>
    <Organizations>
        <Units></Units>
        <Equipment></Equipment>
    </Organizations>
    <Overlays></Overlays>
    <Installations></Installations>
    <TacticalGraphics></TacticalGraphics>
    <MOOTWGraphics></MOOTWGraphics>
</MilitaryScenario>
`;

export const UNIT_TEMPLATE = `<Unit>
    <ObjectHandle></ObjectHandle>
    <SymbolIdentifier>S-G-U----------</SymbolIdentifier>
    <Name>NEW UNIT</Name>
    <UnitSymbolModifiers></UnitSymbolModifiers>
    <Relations>
        <ForceRelation>
            <ForceRelationChoice></ForceRelationChoice>
            <ForceRelationData></ForceRelationData>
        </ForceRelation>
    </Relations>
</Unit>
`;

export const UNIT_MGRS = `<Unit>
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
</Unit>

`;
