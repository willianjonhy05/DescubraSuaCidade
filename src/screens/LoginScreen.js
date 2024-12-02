import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground, Switch } from 'react-native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // Estado para a caixinha de marcação
  const navigation = useNavigation();

  // Verifica se o login foi salvo no AsyncStorage
  useEffect(() => {
    const checkRememberedLogin = async () => {
      const cachedUser = await AsyncStorage.getItem('rememberMe');
      if (cachedUser === 'true') {
        navigation.navigate('Home');
      }
    };

    checkRememberedLogin();
  }, []);

  // Função para login com email e senha
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Salva a preferência de "Lembrar login" no AsyncStorage
      if (rememberMe) {
        await AsyncStorage.setItem('rememberMe', 'true');
      } else {
        await AsyncStorage.removeItem('rememberMe');
      }

      navigation.navigate('Home'); // Navega para a tela Home
    } catch (error) {
      Alert.alert('Erro no login', error.message);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://img.freepik.com/vetores-premium/fundo-ondulado-gradiente-colorido_677411-3454.jpg?w=360',
      }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.header}>Bem-vindo!</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={styles.rememberMeContainer}>
            <Text style={styles.rememberMeText}>Lembrar login</Text>
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              thumbColor={rememberMe ? '#4CAF50' : '#ccc'}
            />
          </View>
          <Button title="Entrar" onPress={handleLogin} color="#4CAF50" />
          <Text style={styles.registerText} onPress={() => navigation.navigate('Register')}>
            Não tem uma conta? Registre-se aqui
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  rememberMeText: {
    fontSize: 16,
    color: '#333',
  },
  registerText: {
    color: '#4CAF50',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
