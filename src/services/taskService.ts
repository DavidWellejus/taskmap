// src/services/taskService.ts
import { supabase } from "../lib/supabase";

export async function insertTask(
  title: string,
  notes: string,
  lat: number,
  lng: number
) {
  const { error } = await supabase.rpc("insert_task_rpc", {
    p_title: title,
    p_notes: notes,
    p_lat: lat,
    p_lng: lng,
  });
  if (error) throw error;
}
