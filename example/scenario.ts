import { MilitaryScenario } from "msdllib";

export var isLoaded = false;

export var scenario: MilitaryScenario;

export function parseScenario(text: string) {
  scenario = MilitaryScenario.createFromString(text);
  isLoaded = true;
}
