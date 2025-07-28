import { useCallback, useState } from "react";
import { View, Alert, ActivityIndicator, Button } from "react-native";
import * as Location from "expo-location";
import { WebView } from "react-native-webview";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { closeTask, getAllTasks } from "../services/taskService";

export default function MapScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [pos, setPos] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Lokation", "Tilladelse afvist");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        if (isActive) {
          setPos({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }

        try {
          const fetchedTasks = await getAllTasks();
          const validTasks = fetchedTasks.filter(
            (t: { lat: any; lng: any }) =>
              typeof t.lat === "number" && typeof t.lng === "number"
          );
          if (isActive) {
            setTasks(validTasks);
          }
        } catch (err) {
          console.error("Kunne ikke hente opgaver:", err);
        }
      };

      fetchData();
      return () => {
        isActive = false;
      };
    }, [])
  );

  if (!pos) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Safe escape function for HTML
  const escapeHtml = (text: string) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  // Marker generation string
  const markersHtml = tasks
    .map((task) => {
      const title = escapeHtml(task.title);
      const notes = escapeHtml(task.notes || "Ingen noter");
      const color = task.status === "closed" ? "gray" : "red";
      const popup =
        task.status === "open"
          ? `<button onclick="window.ReactNativeWebView.postMessage('${task.id}')">Luk opgave</button>`
          : `<span style='color:gray;'>Opgave lukket</span>`;

      return `
        (() => {
          const marker = new maplibregl.Marker({ color: '${color}' })
            .setLngLat([${task.lng}, ${task.lat}]);

          const popupContent = document.createElement('div');
          popupContent.innerHTML = \`
            <strong>${title}</strong><br/>
            <em>${notes}</em><br/>
            ${popup}
          \`;

          marker.setPopup(new maplibregl.Popup().setDOMContent(popupContent)).addTo(map);
        })();
      `;
    })
    .join("\n");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css" rel="stylesheet" />
        <style>
          html, body, #map { margin: 0; height: 100%; width: 100%; }
          button { font-size: 16px; margin-top: 5px; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.js"></script>
        <script>
          const map = new maplibregl.Map({
            container: 'map',
            style: 'https://api.maptiler.com/maps/streets/style.json?key=AiUvGc0xtLeMjEDRJi02',
            center: [${pos.longitude}, ${pos.latitude}],
            zoom: 15
          });

          new maplibregl.Marker({ color: 'blue' })
            .setLngLat([${pos.longitude}, ${pos.latitude}])
            .addTo(map);

          ${markersHtml}
        </script>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        style={{ flex: 1 }}
        onMessage={async (event) => {
          const taskId = event.nativeEvent.data;
          try {
            await closeTask(taskId);
            Alert.alert("✅ Opgave lukket");
            const updated = await getAllTasks();
            setTasks(updated);
          } catch (err) {
            Alert.alert("Fejl", "Kunne ikke lukke opgave");
            console.error(err);
          }
        }}
      />
      <View style={{ position: "absolute", bottom: 50, left: 20, right: 20 }}>
        <View style={{ marginBottom: 10 }}>
          <Button
            title="Opret ny opgave"
            onPress={() => navigation.navigate("CreateTask")}
          />
        </View>

        <Button
          title="Åbn prisoverslag"
          onPress={() => navigation.navigate("PriceEstimator")}
        />
      </View>
    </View>
  );
}
