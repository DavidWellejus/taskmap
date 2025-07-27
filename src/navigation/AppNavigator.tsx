// src/navigation/AppNavigator.tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapScreen from "../screens/MapScreen";
import CreateTaskScreen from "../screens/CreateTaskScreen";

export type RootStackParamList = {
  Map: undefined;
  CreateTask: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Map">
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{ title: "Opgaver på kort" }}
        />
        <Stack.Screen
          name="CreateTask"
          component={CreateTaskScreen}
          options={{ title: "Ny opgave" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
