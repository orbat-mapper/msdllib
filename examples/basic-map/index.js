import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {xml} from 'd3-request';
import {MilitaryScenario} from 'msdllib'
import url from './minimal.xml';

/** @type {MilitaryScenario} */
let scenario;
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


function addUnitsToMap() {
    console.warn("Not implemented yet");
    
}

xml(url, (doc) => {
    scenario = new MilitaryScenario(doc);
    addUnitsToMap();
});

