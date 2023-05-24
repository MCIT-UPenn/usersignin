import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import SignInPage from './src/screens/signin';
import SignUpPage from './src/screens/signup';
import HomePage from './src/screens/home';

const Stack = createStackNavigator();

const fetchFonts = () => {
  return Font.loadAsync({
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
  });
};

function Greetings({ navigation }) {
  const greeting = 'Hello, world!';
  const [displayedGreeting, setDisplayedGreeting] = useState('H');
  const indexRef = useRef(1);
  const addingRef = useRef(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    function updateText() {
      if (addingRef.current) {
        indexRef.current++;
        if (indexRef.current > greeting.length) {
          addingRef.current = false;
          indexRef.current--;
          clearInterval(intervalRef.current);
          setTimeout(() => {
            intervalRef.current = setInterval(updateText, 150);
          }, 2000);
        } else {
          setDisplayedGreeting(greeting.slice(0, indexRef.current));
        }
      } else {
        if (indexRef.current <= 1) {
          addingRef.current = true;
          indexRef.current = 0;
          clearInterval(intervalRef.current);
          intervalRef.current = setInterval(updateText, 150);
        } else {
          indexRef.current--;
          setDisplayedGreeting(greeting.slice(0, indexRef.current));
        }
      }
    }

    intervalRef.current = setInterval(updateText, 150);

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <LinearGradient
      colors={['lightpink', '#fff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <Text style={styles.text}>{displayedGreeting}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Greetings">
        <Stack.Screen name="Greetings" component={Greetings} />
        <Stack.Screen name="SignIn" component={SignInPage} />
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="SignUp" component={SignUpPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  text: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 40,
    textAlign: 'center',
    color: 'hotpink',
  },
  buttonContainer: {
    marginTop: 200,
  },
  button: {
    backgroundColor: 'hotpink',
    padding: 10,
    margin: 10,
    borderRadius: 8,
    width: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

