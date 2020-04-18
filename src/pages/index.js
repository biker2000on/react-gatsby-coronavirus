import React from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';
import axios from 'axios'

import Layout from 'components/Layout';
import Map from 'components/Map';
import countryOutlines from 'data/countries'

const LOCATION = {
  lat: 38.9072,
  lng: -77.0369
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;

const IndexPage = () => {

  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement: map } = {}) {
    let response

    try {
      response = await axios.get('https://corona.lmao.ninja/v2/countries')
    } catch (e) {
      console.log(`Failed to fetch countries: ${e.message}`, e)
      return
    }

    const { data = {} } = response
    console.log("data", data)
    const hasData = Array.isArray(data) && data.length > 0

    if ( !hasData ) return

    // const geoJson = {
    //   type: 'FeatureCollection',
    //   features: data.map((country = {}) => {
    //     const { countryInfo = {} } = country;
    //     const { lat, long: lng } = countryInfo;
    //     return {
    //       type: 'Feature',
    //       properties: {
    //         ...country,
    //       },
    //       geometry: {
    //         type: 'Point',
    //         coordinates: [ lng, lat ]
    //       }
    //     }
    //   })
    // }

    // console.log('geoJSON', geoJson)

    // const geoJsonLayers = new L.GeoJSON(geoJson, {
    //   pointToLayer: (feature = {}, latlng) => {
    //     const { properties = {} } = feature;
    //     let updatedFormatted;
    //     let casesString;

    //     const {
    //       country,
    //       updated,
    //       cases,
    //       deaths,
    //       recovered
    //     } = properties

    //     casesString = `${cases}`;

    //     if ( cases > 1000 ) {
    //       casesString = `${casesString.slice(0, -3)}k+`
    //     }

    //     if ( updated ) {
    //       updatedFormatted = new Date(updated).toLocaleString();
    //     }

    //     const html = `
    //       <span class="icon-marker">
    //         <span class="icon-marker-tooltip">
    //           <h2>${country}</h2>
    //           <ul>
    //             <li><strong>Confirmed:</strong> ${cases}</li>
    //             <li><strong>Deaths:</strong> ${deaths}</li>
    //             <li><strong>Recovered:</strong> ${recovered}</li>
    //             <li><strong>Last Update:</strong> ${updatedFormatted}</li>
    //           </ul>
    //         </span>
    //         ${ casesString }
    //       </span>
    //     `;

    //     return L.marker( latlng, {
    //       icon: L.divIcon({
    //         className: 'icon',
    //         html
    //       }),
    //       riseOnHover: true
    //     });
    //   }
    // });

    let dataMap = {}
    data.map((c) => {
      dataMap[c.countryInfo.iso3] = c
    })

    countryOutlines.features.map((c,i) => {
      countryOutlines.features[i].properties = {...c.properties, ...dataMap[c.properties.ISO_A3] }
    })

    let geoJsonLayers

    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = props ? `
              <span class="icon-marker">
                <span class="icon-marker-tooltip">
                  <h2>${props.country}</h2>
                  <ul>
                    <li><strong>Confirmed:</strong> ${props.cases}</li>
                    <li><strong>Deaths:</strong> ${props.deaths}</li>
                    <li><strong>Recovered:</strong> ${props.recovered}</li>
                    <li><strong>Last Update:</strong> ${new Date(props.updated).toLocaleString()}</li>
                  </ul>
                </span>
                ${ props.cases }
              </span>`
            : 'Hover over a country'
    };

    info.addTo(map);

    function getColor(d) {
      return d > 100000 ? '#800026' :
             d > 50000  ? '#BD0026' :
             d > 20000 ? '#E31A1C' :
             d > 10000  ? '#FC4E2A' :
             d > 5000   ? '#FD8D3C' :
             d > 2000   ? '#FEB24C' :
             d > 1000   ? '#FED976' :
                        '#FFEDA0';
    }

    function style(feature) {
      return {
          fillColor: getColor(feature.properties.cases),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.3
      };
    }

    //highlight hovered country
    function highlightFeature(e) {
      var layer = e.target;
  
      layer.setStyle({
          weight: 5,
          color: '#ddd',
          dashArray: '',
          fillOpacity: 0.7
      });
  
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront();
      }
      info.update(layer.feature.properties);
    }

    // function for mouseout
    function resetHighlight(e) {
      geoJsonLayers.resetStyle(e.target);
      info.update();
    }

    function zoomToFeature(e) {
      map.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
      layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: zoomToFeature
      });
    }

    // console.log(countryOutlines)
    geoJsonLayers = new L.GeoJSON(countryOutlines, {style: style, onEachFeature: onEachFeature})

    geoJsonLayers.addTo(map)

  }

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    mapEffect
  };

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Coronavirus Map</title>
      </Helmet>

      <Map {...mapSettings} />

    </Layout>
  );
};

export default IndexPage;
