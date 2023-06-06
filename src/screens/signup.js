// signup.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';

const SignUpPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = () => {
    if (email && password) {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }

      // Password validation
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
      if (!passwordRegex.test(password)) {
        Alert.alert(
          'Error',
          'Please enter a password with at least 8 characters, one uppercase letter, one lowercase letter, and one number'
        );
        return;
      }

      setIsLoading(true); // Set loading state to true

      fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
      .then(response => {
        setIsLoading(false); // Set loading state to false
        if (response.ok) {
          console.log(response);  
          return response.json();
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
      .then(data => {
        if (data.success) {
          navigation.navigate('SignIn');
        } else {
          Alert.alert('Error', data.message);
        }
      })
      .catch((error) => {
        setIsLoading(false); // Set loading state to false
        console.error('Error:', error);
      });
    } else {
      Alert.alert('Error', 'Please provide email and password');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Sign Up"
        onPress={handleSignUp}
        disabled={isLoading} // Disable button when loading
      />
      {isLoading ? <ActivityIndicator /> : null}
    </View>
  );
};

export default SignUpPage;