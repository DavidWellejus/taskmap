// App.tsx
import { useEffect, useState } from "react";
import { View, Alert, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { WebView } from "react-native-webview";

export default function App() {
  const [pos, setPos] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Lokation", "Tilladelse afvist");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setPos({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  if (!pos) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link
          href="https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css"
          rel="stylesheet"
        />
        <style>
          html, body, #map { margin: 0; height: 100%; width: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.js"></script>
        <script>
          const map = new maplibregl.Map({
            container: 'map',
            style: 'https://demotiles.maplibre.org/style.json',
            center: [${pos.longitude}, ${pos.latitude}],
            zoom: 14
          });

          new maplibregl.Marker({ color: 'blue' })
            .setLngLat([${pos.longitude}, ${pos.latitude}])
            .addTo(map);
        </script>
      </body>
    </html>
  `;

  return (
    <WebView originWhitelist={["*"]} source={{ html }} style={{ flex: 1 }} />
  );
}
