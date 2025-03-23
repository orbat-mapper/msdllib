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
export const UNIT_ATTACHED = ` <Unit>
                <ObjectHandle>f9e16593-2dcd-11e2-be2b-000c294c9df8</ObjectHandle>
                <SymbolIdentifier>S-G-----------G</SymbolIdentifier>
                <Name>1/OPFOR-ARMOR</Name>
                <UnitSymbolModifiers>
                    <Echelon>COMPANY</Echelon>
                    <CombatEffectiveness>GREEN</CombatEffectiveness>
                    <HigherFormation>OPFOR-ARMOR</HigherFormation>
                    <UniqueDesignation>1</UniqueDesignation>
                </UnitSymbolModifiers>
                <Disposition>
                    <Location>
                        <CoordinateChoice>GDC</CoordinateChoice>
                        <CoordinateData>
                            <GDC>
                                <Latitude>58.54383</Latitude>
                                <Longitude>15.038887</Longitude>
                                <ElevationAGL>141.03737</ElevationAGL>
                            </GDC>
                        </CoordinateData>
                    </Location>
                    <DirectionOfMovement>175.37999</DirectionOfMovement>
                    <Speed>4</Speed>
                    <FormationPosition>
                        <OutOfFormation>false</OutOfFormation>
                        <FormationOrder>2</FormationOrder>
                        <SensorOrientation>0.0</SensorOrientation>
                    </FormationPosition>
                    <OwnFormation>
                        <FormationLocationType>LEAD_ELEMENT</FormationLocationType>
                        <FormationSpacing>250.0</FormationSpacing>
                        <FormationOrientation>175.37999</FormationOrientation>
                        <FormationChoice>GROUND</FormationChoice>
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
                                <CommandingSuperiorHandle>f9c2b9f6-2dcd-11e2-be2b-000c294c9df8</CommandingSuperiorHandle>
                                <CommandRelationshipType>ATTACHED</CommandRelationshipType>
                            </CommandRelation>
                        </ForceRelationData>
                    </ForceRelation>
                </Relations>
                <Model>
                    <Resolution>HIGH</Resolution>
                    <AggregateBased>false</AggregateBased>
                </Model>
            </Unit>`;

export const UNIT_NO_DISPOSITION = `<Unit>
    <ObjectHandle>f9e16593-2dcd-11e2-be2b-000c294c9df8</ObjectHandle>
    <SymbolIdentifier>S-G-----------G</SymbolIdentifier>
    <Name>1/OPFOR-ARMOR</Name>
    <UnitSymbolModifiers>
        <Echelon>COMPANY</Echelon>
        <CombatEffectiveness>GREEN</CombatEffectiveness>
        <HigherFormation>OPFOR-ARMOR</HigherFormation>
        <UniqueDesignation>1</UniqueDesignation>
    </UnitSymbolModifiers>
    <Relations>
        <ForceRelation>
            <ForceRelationChoice>UNIT</ForceRelationChoice>
            <ForceRelationData>
                <CommandRelation>
                    <CommandingSuperiorHandle>f9c2b9f6-2dcd-11e2-be2b-000c294c9df8</CommandingSuperiorHandle>
                    <CommandRelationshipType>ATTACHED</CommandRelationshipType>
                </CommandRelation>
            </ForceRelationData>
        </ForceRelation>
    </Relations>
    <Model>
        <Resolution>HIGH</Resolution>
        <AggregateBased>false</AggregateBased>
    </Model>
</Unit>`;

export const UNIT_ROOT_UNIT = `<Unit>
    <ObjectHandle>1d8fbb85-1980-431f-aaaa-f4479e41c4a1</ObjectHandle>
    <SymbolIdentifier>S-G-UCA----F---</SymbolIdentifier>
    <UnitSymbolModifiers>
        <UniqueDesignation>4</UniqueDesignation>
        <HigherFormation>2-33 AR</HigherFormation>
        <Echelon>BATTALION</Echelon>
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
            <OutOfFormation>false</OutOfFormation>
            <FormationOrder>1</FormationOrder>
            <SensorOrientation>0</SensorOrientation>
        </FormationPosition>
        <OwnFormation>
            <FormationSpacing>1200</FormationSpacing>
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
            <ForceRelationChoice>FORCE_SIDE</ForceRelationChoice>
            <ForceRelationData>
                <ForceSideHandle>fbde006d-ffff-aaaa-cccc-892e67650eb9</ForceSideHandle>
            </ForceRelationData>
        </ForceRelation>
    </Relations>
</Unit>
`;
export const FORCESIDE_TEMPLATE_IS_SIDE = `<ForceSide>
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

export const FORCESIDE_TEMPLATE_IS_SIDE2 = `<ForceSide>
    <ObjectHandle>e7ad0e8d-2dcd-11e2-be2b-000c294c9df8</ObjectHandle>
    <ForceSideName>Friendly</ForceSideName>
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

export const FORCESIDE_TEMPLATE_IS_FORCE = `<ForceSide>
    <ObjectHandle>e7ae4710-2ccc-11e2-be2b-000c294c9df8</ObjectHandle>
    <ForceSideName>Army</ForceSideName>
    <AllegianceHandle>e7ad0e8d-2dcd-11e2-be2b-000c294c9df8</AllegianceHandle>
</ForceSide>`;
