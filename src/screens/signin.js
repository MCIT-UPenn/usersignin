// signin.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

const SignInPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    if (email && password) {
      fetch('http://192.168.1.3:5000/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          navigation.navigate('Home');
        } else {
          Alert.alert('Error', data.message);
        }
      })
      .catch((error) => {
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
      <Button title="Sign In" onPress={handleSignIn} />
    </View>
  );
};

export default SignInPage;
