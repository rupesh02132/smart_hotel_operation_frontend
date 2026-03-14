import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      {/* AUTH */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* GUEST */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="RoomDetails" component={RoomDetailsScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="QRCode" component={QRCodeScreen} />
      <Stack.Screen name="Chatbot" component={ChatbotScreen} />

      {/* STAFF */}
      <Stack.Screen name="Housekeeping" component={HousekeepingScreen} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} />

      {/* ADMIN */}
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} />

    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
