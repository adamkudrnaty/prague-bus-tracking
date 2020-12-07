var request = new XMLHttpRequest();
var autobusy;
var lat = [];
var lon = [];
var cisla_busu = [];
var smery_busu = [];
var vsechnybusy = [];
var rychlost_busu = [];
var pocet_busu;
muj_token = "YOUR TOKEN";

function mapa() {
    function json() {
        autobusy = JSON.parse(text);
        lat = [];
        lon = [];
        cisla_busu = [];
        smery_busu = [];

        pocet_busu = Object.keys(autobusy.features).length;
        console.log('POCET BUSU:', pocet_busu);

        for (var i = 0; i < pocet_busu; i++) {
            lat[i] = autobusy.features[i].geometry.coordinates[1];
            lon[i] = autobusy.features[i].geometry.coordinates[0];
            cisla_busu[i] = autobusy.features[i].properties.trip.gtfs.route_short_name;
            smery_busu[i] = autobusy.features[i].properties.trip.gtfs.trip_headsign;
            rychlost_busu[i] = autobusy.features[i].properties.last_position.speed;
        }

    }

    function kresleni_busu() {
        var bus = L.icon({
            iconUrl: 'images/bus.png',
            shadowUrl: 'images/bushadow.png',
            iconSize: [50, 50],
            shadowSize: [50, 50],
            iconAnchor: [25, 25],
            shadowAnchor: [25, 25],
            popupAnchor: [-3, -20]
        });


        mymap.eachLayer((layer) => {
            layer.remove();
        });

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {maxZoom: 18,attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',id: 'mapbox/streets-v11',tileSize: 512, zoomOffset: -1}).addTo(mymap);

        var busy = [];

        for (var i = 0; i < pocet_busu; i++) {
            console.log("PRIDAL JSEM BUS");
            busy[i] = L.marker([lat[i], lon[i]], {
                icon: bus
            });
            if (rychlost_busu[i]) {
                busy[i].bindPopup("<b>CISLO: </b>" + cisla_busu[i] + "\n <b>SMER: </b>" + smery_busu[i] + "\n <b>RYCHLOST: </b>" + rychlost_busu[i] + " km/h");
            } else {
                busy[i].bindPopup("<b>CISLO: </b>" + cisla_busu[i] + "\n <b>SMER: </b>" + smery_busu[i]);
            }
            busy[i].addTo(mymap);
        }
        console.log("HOTOVO");
        setTimeout(mapa, 5 * 1000);
    }

    request.open('GET', 'https://private-anon-9b400439be-golemioapi.apiary-proxy.com/v2/vehiclepositions');
    request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    request.setRequestHeader('x-access-token', muj_token);

    var text;

    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            text = this.responseText;
            json();
            kresleni_busu();
        }
    };

    request.send();
}

mapa();
