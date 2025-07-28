// src/navigation/AppNavigator.tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapScreen from "../screens/MapScreen";
import CreateTaskScreen from "../screens/CreateTaskScreen";
import PriceEstimatorScreen from "../screens/PriceEstimatorScreen";

export type RootStackParamList = {
  Map: undefined;
  CreateTask: undefined;
  PriceEstimator: undefined;
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
        <Stack.Screen
          name="PriceEstimator"
          component={PriceEstimatorScreen}
          options={{ title: "Prisoverslag" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
