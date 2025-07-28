import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";

export default function PriceEstimatorScreen() {
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleEstimate = async () => {
    try {
      const response = await fetch("http://192.168.0.204:5050/api/estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error("Noget gik galt på serveren");
      }

      const data = await response.json();

      const lines = data.items.map(
        (item: { name: any; quantity: any; unit_price: any; total: any }) => {
          return `${item.name}: ${item.quantity} stk á ${item.unit_price} kr = ${item.total} kr`;
        }
      );

      lines.push(`\nTotal: ${data.total_price} kr`);
      setResult(lines.join("\n"));
    } catch (error: any) {
      setResult("Fejl ved prisberegning: " + error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Indtast opgavebeskrivelse:
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 20,
          borderRadius: 8,
        }}
        multiline
        numberOfLines={5}
        value={description}
        onChangeText={setDescription}
        placeholder="Fx: Loft 4x5 m med 12 mm krydsfiner og reglar 45x95 mm c/c 60 cm"
      />
      <Button title="Beregn prisoverslag" onPress={handleEstimate} />
      {result && <Text style={{ marginTop: 20 }}>{result}</Text>}
    </ScrollView>
  );
}
