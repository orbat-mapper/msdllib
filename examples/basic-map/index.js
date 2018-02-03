import * as L from 'leaflet';
import './styles.css';
import 'leaflet/dist/leaflet.css';

import { xml } from 'd3-request';
import { MilitaryScenario } from 'msdllib'
import url from '../../test/data/SimpleScenario.xml';
import * as ms from 'milsymbol';

/** @type {L.Map} */
var map = initializeMap();
/** @type {L.Control.Layers} */
var layersControl;

function initializeMap() {
    let map = L.map('map').setView([51.505, -0.09], 13);
    let baseLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    baseLayer.addTo(map);

    layersControl = L.control.layers({}, {}, { hideSingleBase: true }).addTo(map);
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

/** @param {MilitaryScenario} scenario */
function addUnitsToMap(scenario) {
    let g = L.featureGroup();
    for (let forceSide of scenario.forceSides) {
        let mlayer = L.geoJSON(forceSide.toGeoJson(), { pointToLayer: createUnitMarker });
        map.addLayer(mlayer);
        g.addLayer(mlayer);
        layersControl.addOverlay(mlayer, forceSide.name);
    }

    map.fitBounds(g.getBounds());
}

/** @param {MilitaryScenario} scenario */
function initializeScenario(scenario) {
    addUnitsToMap(scenario);
}

// Load scenario
xml(url, (doc) => {
    let scenario = new MilitaryScenario(doc);
    initializeScenario(scenario);
});

