import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StartScreen from './components/Start';
import ChatScreen from './components/Chat';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect } from "react";
import { Alert } from "react-native";
import { getStorage } from "firebase/storage";

const Stack = createNativeStackNavigator();

import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, disableNetwork, enableNetwork } from "firebase/firestore";

const App = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyDMnJbzyZcW0UdRlz1KzUEfzqIBI1RpgdQ",
    authDomain: "chatapp-a37ef.firebaseapp.com",
    projectId: "chatapp-a37ef",
    storageBucket: "chatapp-a37ef.appspot.com",
    messagingSenderId: "356172084338",
    appId: "1:356172084338:web:d808590a15094ebc9abeeb",
    measurementId: "G-P6X7KHZ794"
  };
  
  const app = initializeApp(firebaseConfig);

  // const db = getFirestore(app); this code was causing an error
  // found this workaround online for DB connection problems. It replaced the line above.
  const db = initializeFirestore(app, {
    useFetchStreams: false,
    experimentalForceLongPolling: true
  });
  const storage = getStorage(app);

  const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="StartScreen"
        // screenOptions={{headerShown: false}}
      >
        <Stack.Screen
          name="StartScreen"
          component={StartScreen}
        />
        <Stack.Screen
          name="ChatScreen"
        >
          {props => <ChatScreen
            isConnected={connectionStatus.isConnected}
            db={db}
            storage={storage}
            {...props}
          />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
