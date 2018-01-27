import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { xml } from 'd3-request';
import { MilitaryScenario } from 'msdllib'
import url from '../../test/data/SimpleScenario.xml';
import * as ms from 'milsymbol';


/** @type {MilitaryScenario} */
var scenario;


let map = initializeMap();

function initializeMap() {
    let map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.control.scale({ metric: true, imperial: false }).addTo(map);
    console.info("Map initialized")
    return map;
}

function createMilsymbolIcon(feature, size = 25) {
    // https://www.spatialillusions.com/milsymbol/docs/index.html
    let mysymbol = new ms.Symbol(
        feature.properties.sidc, {});
    mysymbol = mysymbol.setOptions({ size });

    // http://leafletjs.com/reference-1.2.0.html#icon
    let myicon = L.icon({
        iconUrl: mysymbol.toDataURL(),
        iconAnchor: [mysymbol.getAnchor().x, mysymbol.getAnchor().y],
    });

    return myicon;
}

function createUnitMarker(feature, latlng) {

    let myicon = createMilsymbolIcon(feature)
    return L.marker(latlng, { icon: myicon, draggable: true });
}

function addUnitsToMap() {
    let mlayer = L.geoJSON(scenario.forceSides[0].toGeoJson(), { pointToLayer: createUnitMarker });
    map.addLayer(mlayer)
    mlayer.bindPopup(layer => `${layer.feature.properties.sidc}`);

}

xml(url, (doc) => {
    scenario = new MilitaryScenario(doc);
    addUnitsToMap();
});

