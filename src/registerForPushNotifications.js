// services/registerForPushNotifications.js

import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { db, auth } from './firebaseConfig'; // Certifique-se de que o caminho está correto
import { collection, doc, setDoc } from 'firebase/firestore';

// Configuração do comportamento de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const registerForPushNotifications = async () => {
  try {
    // Solicita o token de notificação
    const tokenResponse = await Notifications.getExpoPushTokenAsync();
    const token = tokenResponse.data;
    console.log("Token de notificação:", token);

    // Verifica se o usuário está autenticado
    if (auth.currentUser) {
      // Salva o token no Firestore na coleção `user_tokens` com o ID do usuário
      const userDocRef = doc(collection(db, 'user_tokens'), auth.currentUser.uid);
      await setDoc(userDocRef, { token });
      console.log("Token salvo no Firestore.");
    } else {
      console.log("Usuário não autenticado. O token não foi salvo.");
    }
  } catch (error) {
    console.error("Erro ao registrar token de notificação:", error);
    Alert.alert('Erro', 'Não foi possível salvar o token de notificação.');
  }
};

export default registerForPushNotifications;
