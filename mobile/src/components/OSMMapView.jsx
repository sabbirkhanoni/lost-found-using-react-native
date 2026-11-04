import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const buildHtml = ({
  latitude,
  longitude,
  zoom,
  markers,
  interactive,
  pickable,
}) => {
  const markersJs = markers
    .map(
      m => `
      L.circleMarker([${m.latitude}, ${m.longitude}], {
        radius: 10,
        fillColor: "${m.color || '#6C5CE7'}",
        color: "#fff",
        weight: 2,
        fillOpacity: 1
      }).addTo(map).on('click', function () {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: "markerPress", id: "${
          m.id
        }" }));
      });
    `,
    )
    .join('\n');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>html, body, #map { height: 100%; margin: 0; padding: 0; }</style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>
        var map = L.map('map', {
          zoomControl: ${interactive},
          dragging: ${interactive},
          scrollWheelZoom: ${interactive},
          doubleClickZoom: ${interactive},
          touchZoom: ${interactive}
        }).setView([${latitude}, ${longitude}], ${zoom});

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        ${markersJs}

        ${
          pickable
            ? `
        var pickedMarker = null;
        map.on('click', function (e) {
          if (pickedMarker) { map.removeLayer(pickedMarker); }
          pickedMarker = L.circleMarker([e.latlng.lat, e.latlng.lng], {
            radius: 10, fillColor: "#FF6B5B", color: "#fff", weight: 2, fillOpacity: 1
          }).addTo(map);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: "mapPress", latitude: e.latlng.lat, longitude: e.latlng.lng
          }));
        });
        `
            : ''
        }
      </script>
    </body>
    </html>
  `;
};

const OSMMapView = ({
  latitude,
  longitude,
  zoom = 15,
  markers = [],
  interactive = true,
  pickable = false,
  onMarkerPress,
  onMapPress,
  style,
}) => {
  const html = buildHtml({
    latitude,
    longitude,
    zoom,
    markers,
    interactive,
    pickable,
  });

  const handleMessage = event => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'markerPress' && onMarkerPress) onMarkerPress(data.id);
      if (data.type === 'mapPress' && onMapPress) {
        onMapPress({ latitude: data.latitude, longitude: data.longitude });
      }
    } catch (error) {
      console.log('OSMMapView message parse error:', error);
    }
  };

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html }}
      style={[styles.webview, style]}
      onMessage={handleMessage}
      javaScriptEnabled
      domStorageEnabled
    />
  );
};

const styles = StyleSheet.create({
  webview: { flex: 1, backgroundColor: 'transparent' },
});

export default OSMMapView;
