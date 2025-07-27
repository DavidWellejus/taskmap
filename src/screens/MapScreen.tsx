import { useEffect, useState } from "react";
import { View, Alert, ActivityIndicator, Button } from "react-native";
import * as Location from "expo-location";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
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

      try {
        const tasks = await getAllTasks();
        setTasks(tasks);
      } catch (err) {
        console.error("Kunne ikke hente opgaver:", err);
      }
    })();
  }, []);

  if (!pos) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const html = /* html */ `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css" rel="stylesheet" />
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
            style: 'https://api.maptiler.com/maps/streets/style.json?key=AiUvGc0xtLeMjEDRJi02',
            center: [${pos.longitude}, ${pos.latitude}],
            zoom: 15
          });

          new maplibregl.Marker({ color: 'blue' })
            .setLngLat([${pos.longitude}, ${pos.latitude}])
            .addTo(map);

            ${tasks
              .map(
                (task) => `
      const marker = new maplibregl.Marker({ color: '${
        task.status === "closed" ? "gray" : "red"
      }' })
        .setLngLat([${task.lng}, ${task.lat}]);

      const popupContent = document.createElement('div');
      popupContent.innerHTML = \`
        <strong>${task.title}</strong><br/>
        <em>${task.notes || "Ingen noter"}</em><br/>
        ${
          task.status === "open"
            ? `<button onclick="window.ReactNativeWebView.postMessage('${task.id}')">Luk opgave</button>`
            : `<span style='color:gray;'>Opgave lukket</span>`
        }
      \`;

      marker.setPopup(new maplibregl.Popup().setDOMContent(popupContent)).addTo(map);
    `
              )
              .join("\n")}
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
          const taskId = event.nativeEvent.data; // fx: '8fbb2c...'

          try {
            await closeTask(taskId); // opdater status til 'closed'
            Alert.alert("✅ Opgave lukket");

            const updated = await getAllTasks(); // hent igen
            setTasks(updated); // genopbyg kortet
          } catch (err) {
            Alert.alert("Fejl", "Kunne ikke lukke opgave");
            console.error(err);
          }
        }}
      />

      <View style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
        <Button
          title="Opret ny opgave"
          onPress={() => navigation.navigate("CreateTask")}
        />
      </View>
    </View>
  );
}
