import fs from "fs";
import { parse } from "csv-parse";
import axios from "axios";
import { insertTask } from "../services/taskService"; // Genbrug fra frontend

const OPENCAGE_API_KEY = "a367bb18eadd4719af0a876d2f3a472c";

// Samme som i frontend
async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number }> {
  const response = await axios.get(
    "https://api.opencagedata.com/geocode/v1/json",
    {
      params: {
        q: address,
        key: OPENCAGE_API_KEY,
      },
    }
  );

  const result = response.data.results[0];
  if (!result) throw new Error("Adresse ikke fundet: " + address);

  return {
    lat: result.geometry.lat,
    lng: result.geometry.lng,
  };
}

// Hovedfunktion til at læse CSV og oprette tasks
async function uploadTasksFromCSV(filePath: string) {
  const rows: any[] = [];

  const parser = fs
    .createReadStream(filePath)
    .pipe(parse({ columns: true, delimiter: ";" }));

  for await (const row of parser) {
    rows.push(row);
  }

  for (const [i, row] of rows.entries()) {
    const { title, notes, address } = row;
    try {
      console.log(`📍 Geocoder: ${address}`);
      const { lat, lng } = await geocodeAddress(address);
      await insertTask(title, notes, lat, lng); // genbrug
      console.log("✅ Tilføjet:", title);
    } catch (err: any) {
      console.error(`❌ Fejl i række ${i + 1}:`, err.message);
    }
  }
}

// Start upload
uploadTasksFromCSV("tasks.csv");
