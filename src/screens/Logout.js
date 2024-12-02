import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

// Função para fazer logout
const logout = async (navigation) => {
  try {
    // Remove o usuário do AsyncStorage
    await AsyncStorage.removeItem('user');

    // Faz o logout no Firebase
    await signOut(auth);

    // Navega de volta para a tela de Login
    navigation.navigate('Login');
  } catch (error) {
    console.error('Erro ao fazer logout:', error.message);
  }
};

export default logout;
