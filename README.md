# MSDLlib

**Experimental**

A JavaScript library for parsing Military Scenario Definition Language (MSDL) data.
Currently, MSDLlib only supports the most commonly used MSDL data structures.

The Military Scenario Definition Language is an XML-based language designed to support military
scenario development. MSDL, also known as [SISO-STD-007-2008](https://www.sisostds.org/DesktopModules/Bring2mind/DMX/Download.aspx?Command=Core_Download&EntryId=45690&PortalId=0&TabId=105), is a standard developed by the [Simulation Interoperability Standards
Organization (SISO)](https://www.sisostds.org/Home.aspx). For more information about MSDL please
visit the [SISO standards page](https://www.sisostds.org/productspublications/standards/sisostandards.aspx)
and [SISO Product data files page](https://www.sisostds.org/Schemas.aspx).

Please note that MSDL will be superseded by C2SIM-Initialize. You can read more about this on the
[C2SIM PDG/PSG page](https://www.sisostds.org/StandardsActivities/DevelopmentGroups/C2SIMPDGPSG-CommandandControlSystems.aspx).

See [msdl-viewer](https://github.com/orbat-mapper/msdl-viewer) for an example project that uses MSDLlib.

## Copyright notice

The MSDL schema [SISO-STD-007-2008](https://www.sisostds.org/DesktopModules/Bring2mind/DMX/Download.aspx?Command=Core_Download&EntryId=45690&PortalId=0&TabId=105)
is copyright © 2015 by the Simulation Interoperability Standards Organization, Inc.

## Usage

To use MSDLlib in your project, follow these steps:

1. Install the library using npm:

   ```sh
   npm install @orbat-mapper/msdllib
   ```

2. Import and use the library in your TypeScript or JavaScript code:

   ```typescript
   // Example usage
   import { MilitaryScenario } from "@orbat-mapper/msdllib";

   async function loadMsdlFile(url: string) {
     try {
       const response = await fetch(url);
       const msdlAsText = await response.text();
       const msdlScenario = MilitaryScenario.createFromString(msdlString);
       return msdlScenario;
     } catch (error) {
       console.error("Failed to load MSDL file", error);
     }
   }

   const msdl = loadMsdlFile("https://example.com/msdl-file.xml");
   console.log(msdl.forceSides[0].toGeoJson());
   ```

## Development

MSDLlib is developed in TypeScript. To contribute or modify the library, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/orbat-mapper/msdllib.git
   cd msdllib
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Build the project:

   ```sh
   npm run build
   ```

4. Run tests:
   ```sh
   npm run test
   ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
