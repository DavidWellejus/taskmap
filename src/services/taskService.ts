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

export async function getAllTasks() {
  const { data, error } = await supabase.rpc("get_all_tasks");
  if (error) throw error;
  return data;
}

export async function closeTask(taskId: string) {
  const { error } = await supabase
    .from("tasks")
    .update({ status: "closed" })
    .eq("id", taskId);

  if (error) throw error;
}
