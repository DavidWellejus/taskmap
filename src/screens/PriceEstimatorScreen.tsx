import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  ActivityIndicator,
} from "react-native";

export default function PriceEstimateScreen() {
  const [description, setDescription] = useState("");
  const [estimate, setEstimate] = useState("");
  const [loading, setLoading] = useState(false); // 👈 loading state

  const handleEstimate = async () => {
    setLoading(true); // ⏳ start loading
    setEstimate(""); // ryd tidligere resultat
    try {
      const res = await fetch("http://192.168.0.204:5050/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = await res.json();
      setEstimate(data.estimate);
    } catch (err) {
      setEstimate("Fejl i forbindelse med serveren");
    }
    setLoading(false); // ✅ stop loading
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        Beregn prisoverslag
      </Text>
      <TextInput
        placeholder="Beskriv din opgave..."
        value={description}
        onChangeText={setDescription}
        style={{ marginVertical: 10, borderWidth: 1, padding: 8 }}
        multiline
        editable={!loading}
      />
      <Button
        title={loading ? "Beregner..." : "Beregn"}
        onPress={handleEstimate}
        disabled={loading}
      />
      {loading && (
        <View style={{ marginTop: 20 }}>
          <ActivityIndicator size="large" />
        </View>
      )}
      {estimate ? (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: "bold" }}>Prisoverslag:</Text>
          <Text>{estimate}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}
