import * as L from 'leaflet';
import './styles.css';
import 'leaflet/dist/leaflet.css';

import { xml } from 'd3-request';
import { MilitaryScenario, TacticalJson } from 'msdllib'
import url from '../../test/data/SimpleScenario.xml';
import * as ms from 'milsymbol';

/** @type {L.Map} */
var map;
/** @type {L.Control.Layers} */
var layersControl;
/** @type {L.Layer[]} */
var unitLayers = [];

map = initializeMap();
setupDragNDrop();

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

function setupDragNDrop() {
    let dropArea = document.getElementById('drop-area');
    dropArea.ondragover = function () { this.className = 'hover'; return false; };
    dropArea.ondragend = function () { this.className = ''; return false; };
    dropArea.ondrop = function (e) {
        this.className = '';
        e.preventDefault();
        readfiles(e.dataTransfer.files);
    }
}

function readfiles(files) {
    if (!files.length) {
        console.warn("Please drag file");
        return;
    }
    var reader = new FileReader();

    reader.onload = function (event) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(event.target.result, "application/xml");
        let scenario = new MilitaryScenario(doc);
        initializeScenario(scenario);
    };
    reader.readAsText(files[0]);
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
    return L.marker(latlng, { icon: myicon, draggable: false });
}

/** @param {MilitaryScenario} scenario */
function addUnitsToMap(scenario) {
    let g = L.featureGroup();
    for (let forceSide of scenario.forceSides) {
        let mlayer = L.geoJSON(forceSide.toGeoJson(), { pointToLayer: createUnitMarker, onEachFeature });
        unitLayers.push(mlayer);
        map.addLayer(mlayer);
        g.addLayer(mlayer);
        layersControl.addOverlay(mlayer, forceSide.name);
    }

    map.fitBounds(g.getBounds());
}

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties) {
        /** @type {TacticalJson} */
        let properties = feature.properties;
        layer.bindPopup(`<b>SIDC</b> ${properties.sidc}`);
    }
}


/** @param {MilitaryScenario} scenario */
function initializeScenario(scenario) {
    if (unitLayers.length > 0) {
        for (let layer of unitLayers) {
            layersControl.removeLayer(layer);
            layer.remove();
        }
        unitLayers = [];
    }
    addUnitsToMap(scenario);
}

// Load scenario
xml(url, (doc) => {
    let scenario = new MilitaryScenario(doc);
    initializeScenario(scenario);
});

