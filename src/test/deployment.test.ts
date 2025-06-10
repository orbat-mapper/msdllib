import { describe, it, expect } from "vitest";
import { Deployment, Federate } from "../lib/deployment.js";
import { createXMLElement } from "../lib/domutils.js";
import { loadTestScenario } from "./testutils.js";
const DEPLOYMENT_ELEMENT_SAMPLE = `<Deployment>
    <Federate>
        <Name>SIM A</Name>
        <ObjectHandle>c8e2b9d1-2f4a-4e3c-8a1b-7f6d2e3c4b5a</ObjectHandle>
    </Federate>
    <Federate>
        <ObjectHandle>e3f1c2d4-5b6a-4c7d-8e9f-0a1b2c3d4e5f</ObjectHandle>
        <Units>
            <Unit>
                <ObjectHandle>f7e6d5c4-b3a2-4c1d-9e8f-7a6b5c4d3e2f</ObjectHandle>
            </Unit>
            <Unit>
                <ObjectHandle>0a1b2c3d-4e5f-6789-abcd-ef0123456789</ObjectHandle>
            </Unit>
        </Units>
    </Federate>
    <Federate>
        <Name>SIM C</Name>
        <ObjectHandle>9b8c7d6e-5f4a-3b2c-1d0e-9f8e7d6c5b4a</ObjectHandle>
        <Units>
            <Unit>
                <ObjectHandle>1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d</ObjectHandle>
            </Unit>
            <Unit>
                <ObjectHandle>2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e</ObjectHandle>
            </Unit>
            <Unit>
                <ObjectHandle>3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f</ObjectHandle>
            </Unit>
            <Unit>
                <ObjectHandle>4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a</ObjectHandle>
            </Unit>
        </Units>
        <Equipment>
            <EquipmentItem>
                <ObjectHandle>5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b</ObjectHandle>
            </EquipmentItem>
            <EquipmentItem>
                <ObjectHandle>6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c</ObjectHandle>
            </EquipmentItem>
        </Equipment>
    </Federate>
</Deployment>
`;

const FEDERATE_ELEMENT_SAMPLE = `<Federate>
    <Name>SIM C</Name>
    <ObjectHandle>9b8c7d6e-5f4a-3b2c-1d0e-9f8e7d6c5b4a</ObjectHandle>
    <Units>
        <Unit>
            <ObjectHandle>1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d</ObjectHandle>
        </Unit>
        <Unit>
            <ObjectHandle>2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e</ObjectHandle>
        </Unit>
        <Unit>
            <ObjectHandle>3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f</ObjectHandle>
        </Unit>
        <Unit>
            <ObjectHandle>4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a</ObjectHandle>
        </Unit>
    </Units>
    <Equipment>
        <EquipmentItem>
            <ObjectHandle>5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b</ObjectHandle>
        </EquipmentItem>
        <EquipmentItem>
            <ObjectHandle>6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c</ObjectHandle>
        </EquipmentItem>
    </Equipment>
</Federate>
`;

describe("Deployment class", () => {
  it("is defined", () => {
    expect(Deployment).toBeDefined();
  });

  it("can be created from an XML string", () => {
    const deployment = new Deployment(
      createXMLElement(DEPLOYMENT_ELEMENT_SAMPLE),
    );
    expect(deployment).toBeInstanceOf(Deployment);
    expect(deployment.federates.length).toBe(3);
    expect(deployment.federates[0]?.name).toBe("SIM A");
    expect(deployment.federates[0]?.units.length).toBe(0);
    expect(deployment.federates[1]?.name).toBeUndefined();
    expect(deployment.federates[1]?.units.length).toBe(2);
    expect(deployment.federates[2]?.name).toBe("SIM C");
    expect(deployment.federates[2]?.units.length).toBe(4);

    expect(deployment.federates[0]?.objectHandle).toBe(
      "c8e2b9d1-2f4a-4e3c-8a1b-7f6d2e3c4b5a",
    );
    expect(deployment.federates[1]?.objectHandle).toBe(
      "e3f1c2d4-5b6a-4c7d-8e9f-0a1b2c3d4e5f",
    );
    expect(deployment.federates[2]?.objectHandle).toBe(
      "9b8c7d6e-5f4a-3b2c-1d0e-9f8e7d6c5b4a",
    );
  });
});

describe("Federate class", () => {
  it("is defined", () => {
    expect(Federate).toBeDefined();
  });

  it("can be created from an XML string", () => {
    const federateElement = createXMLElement(`
      <Federate>
        <Name>Test Federate</Name>
        <ObjectHandle>test-handle-123</ObjectHandle>
      </Federate>
    `);
    const federate = new Federate(federateElement);
    expect(federate).toBeInstanceOf(Federate);
    expect(federate.name).toBe("Test Federate");
    expect(federate.objectHandle).toBe("test-handle-123");
  });

  it("can parse units and equipment from XML", () => {
    const federate = new Federate(createXMLElement(FEDERATE_ELEMENT_SAMPLE));
    expect(federate.units.length).toBe(4);
    expect(federate.equipment.length).toBe(2);
    expect(federate.units[0]).toBe("1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d");
    expect(federate.units[1]).toBe("2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e");
    expect(federate.equipment[0]).toBe("5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b");
    expect(federate.equipment[1]).toBe("6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c");
  });
});

describe("MilitaryScenario Deployment", () => {
  it("should parse a Deployment element if present", () => {
    let scenario = loadTestScenario("/data/SimpleScenarioNETN.xml");
    expect(scenario.deployment).toBeInstanceOf(Deployment);
    expect(scenario.deployment?.federates.length).toBeGreaterThan(0);
    expect(scenario.deployment?.federates[0]?.name).toBe("SIM A");
  });
});
