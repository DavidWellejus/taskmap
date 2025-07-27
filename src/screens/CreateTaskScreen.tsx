import { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import { insertTask } from "../services/taskService";
import { supabase } from "../lib/supabase";

export default function CreateTaskScreeen() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [address, setAddress] = useState("");

  const handleCreateTask = async () => {
    if (!title || !address) {
      Alert.alert("Fejl", "Titel og addresse skal udfyldes!");
      return;
    }
    try {
      const geo = await axios.get(
        "https://api.opencagedata.com/geocode/v1/json",
        {
          params: {
            q: address,
            key: "a367bb18eadd4719af0a876d2f3a472c",
          },
        }
      );
      const result = geo.data.results[0];
      if (!result) throw new Error("Adresse ikke fundet");

      const lat = result.geometry.lat;
      const lng = result.geometry.lng;

      const user = await supabase.auth.getUser();
      console.log("Aktuel bruger:", user.data.user?.id);

      // Kald Supabase RPC
      await insertTask(title, notes, lat, lng);
      Alert.alert("Succes", "Opgave oprettet");
      setTitle("");
      setNotes("");
      setAddress("");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Fejl", error.message || "Kunne ikke oprette opgave");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Titel</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Fx Rens ventilationsfilter"
      />

      <Text style={styles.label}>Noter</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <Text style={styles.label}>Adresse</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Fx Lyngbyvej 2, København"
      />

      <Button title="Opret opgave" onPress={handleCreateTask} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  label: { fontWeight: "bold", fontSize: 16 },
  input: { borderWidth: 1, padding: 8, borderRadius: 6, borderColor: "#ccc" },
});
