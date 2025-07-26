// App.tsx
import { useEffect } from "react";
import { supabase } from "./src/lib/supabase";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  useEffect(() => {
    supabase.auth
      .signInWithPassword({
        email: "test@test.dk",
        password: "1234",
      })
      .then(({ error }) => {
        if (error) console.error("Login-fejl:", error.message);
        else console.log("Login OK");
      });
  }, []);

  return <AppNavigator />;
}
