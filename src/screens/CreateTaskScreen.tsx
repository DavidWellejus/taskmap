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

export default function CreateTaskScreeen() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [address, setAddress] = useState("");

  const handleCreateTask = async () => {};
}
