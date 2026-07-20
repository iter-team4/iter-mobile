// A real map, without needing react-native-maps (which pulls in the Google
// Maps SDK on Android and needs an API key even just to render). Instead
// this embeds a tiny Leaflet page in a WebView - same tile source
// (CartoDB/OpenStreetMap) our web app already uses - and bridges taps and
// map updates back and forth with postMessage / injectJavaScript.
//
// Because it's "just" a WebView, this also means the whole app can run in
// plain Expo Go again - no custom dev client needed.

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import WebView, { type WebViewMessageEvent } from 'react-native-webview';
import type { LatLng } from '../utils/geo';

export interface LeafletPolyline {
  coordinates: LatLng[];
  color: string;
  weight?: number;
}

export interface LeafletMarker {
  coordinate: LatLng;
  color?: string;
  strokeColor?: string;
  radius?: number;
  // Draws a glowing "you are here" style dot (div icon) instead of a plain circle -
  // used for the live GPS position while a run is in progress.
  glow?: boolean;
}

export interface LeafletMapHandle {
  animateTo: (latitude: number, longitude: number) => void;
}

interface Props {
  center: LatLng;
  zoom?: number;
  polylines?: LeafletPolyline[];
  markers?: LeafletMarker[];
  onMapPress?: (coordinate: LatLng) => void;
  style?: StyleProp<ViewStyle>;
}

export const LeafletMap = forwardRef<LeafletMapHandle, Props>(function LeafletMap(
  { center, zoom = 15, polylines = [], markers = [], onMapPress, style },
  ref,
) {
  const webViewRef = useRef<WebView>(null);
  const [pageReady, setPageReady] = useState(false);

  // The starting center/zoom get baked into the HTML once, on first render.
  // If we rebuilt this string every time `center` changed, the WebView would
  // reload the whole page (and lose whatever pan/zoom the user was on) -
  // recentering later goes through animateTo() instead.
  const [html] = useState(() => buildMapHtml(center, zoom));

  // Push the latest routes/markers down to the page once it's actually
  // loaded and Leaflet has initialized (see the "ready" message below).
  useEffect(() => {
    if (!pageReady) return;
    const payload = encodeURIComponent(JSON.stringify({ polylines, markers }));
    webViewRef.current?.injectJavaScript(`window.updateMap(decodeURIComponent("${payload}")); true;`);
  }, [pageReady, polylines, markers]);

  useImperativeHandle(ref, () => ({
    animateTo: (latitude, longitude) => {
      webViewRef.current?.injectJavaScript(`window.animateTo(${latitude}, ${longitude}); true;`);
    },
  }));

  const handleMessage = (event: WebViewMessageEvent) => {
    let data: { type: string; latitude?: number; longitude?: number };
    try {
      data = JSON.parse(event.nativeEvent.data);
    } catch {
      return; // shouldn't happen, but don't crash the app over a bad message
    }

    if (data.type === 'ready') {
      setPageReady(true);
    } else if (data.type === 'press' && data.latitude !== undefined && data.longitude !== undefined) {
      onMapPress?.({ latitude: data.latitude, longitude: data.longitude });
    }
  };

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        source={{ html }}
        onMessage={handleMessage}
        style={styles.webview}
        originWhitelist={['*']}
        mixedContentMode="always"
        javaScriptEnabled
        domStorageEnabled
        // Nothing meaningful to go "back" to inside this mini page
        overScrollMode="never"
      />
    </View>
  );
});

// Builds the whole HTML page: Leaflet from a CDN, a tile layer pointed at
// the same CartoDB Voyager tiles the web app uses, and a couple of window-
// level functions (updateMap / animateTo) that the RN side calls into via
// injectJavaScript.
function buildMapHtml(center: LatLng, zoom: number): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; background: #d4d0ca; }
    .gps-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2.5px solid #fff;
      box-shadow: 0 0 0 4px rgba(213, 160, 33, 0.25), 0 2px 8px rgba(0, 0, 0, 0.3);
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map', { zoomControl: false, attributionControl: false })
      .setView([${center.latitude}, ${center.longitude}], ${zoom});

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    var polylineLayers = [];
    var markerLayers = [];

    function clearLayers() {
      polylineLayers.forEach(function (layer) { map.removeLayer(layer); });
      markerLayers.forEach(function (layer) { map.removeLayer(layer); });
      polylineLayers = [];
      markerLayers = [];
    }

    // Called from React Native whenever the routes/markers we're supposed
    // to be showing change. Simplest approach: wipe everything and redraw -
    // there are never more than a couple dozen points, so this is cheap.
    window.updateMap = function (dataStr) {
      var data = JSON.parse(dataStr);
      clearLayers();

      (data.polylines || []).forEach(function (line) {
        var latLngs = line.coordinates.map(function (c) { return [c.latitude, c.longitude]; });
        var layer = L.polyline(latLngs, {
          color: line.color,
          weight: line.weight || 4,
          opacity: 0.92,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);
        polylineLayers.push(layer);
      });

      (data.markers || []).forEach(function (marker) {
        var layer;
        if (marker.glow) {
          var dotColor = marker.color || '#D5A021';
              var icon = L.divIcon({
                className: '',
                html: '<div class="gps-dot" style="background:' + dotColor + ';"></div>',
                iconSize: [14, 14],
              });
          layer = L.marker([marker.coordinate.latitude, marker.coordinate.longitude], { icon: icon });
        } else {
          layer = L.circleMarker([marker.coordinate.latitude, marker.coordinate.longitude], {
            radius: marker.radius || 6,
            fillColor: marker.color || '#D5A021',
            fillOpacity: 1,
            color: marker.strokeColor || '#fff',
            weight: 2.5,
          });
        }
        layer.addTo(map);
        markerLayers.push(layer);
      });
    };

    window.animateTo = function (lat, lng) {
      map.flyTo([lat, lng], 16, { animate: true, duration: 1 });
    };

    map.on('click', function (e) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'press',
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      }));
    });

    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
  </script>
</body>
</html>`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
