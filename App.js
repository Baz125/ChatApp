import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StartScreen from './components/Start';
import ChatScreen from './components/Chat';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";

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

  // const db = getFirestore(app);

  const db = initializeFirestore(app, {
    useFetchStreams: false,
    experimentalForceLongPolling: true
  });

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
          {props => <ChatScreen db={db} {...props} />}
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
