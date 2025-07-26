// App.tsx
import { useEffect } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { supabase } from "./src/lib/supabase";

export default function App() {
  useEffect(() => {
    (async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email: "test@test.dk",
        password: "1234",
      });
      if (error) {
        console.error("Login-fejl:", error.message);
      } else {
        console.log("Login OK");
      }
    })();
  }, []);

  return <AppNavigator />;
}
