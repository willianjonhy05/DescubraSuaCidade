import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Alert } from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import LocationScreen from './src/screens/LocationScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import Layout from './src/components/Layout'; // Layout padrão com footer

const Stack = createStackNavigator();

// Configuração do comportamento da notificação
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const App = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert('Permissão de Notificação', 'Permissões para notificações não foram concedidas!');
          return;
        }
      }
    };
    setupNotifications();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login', headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registrar' }} />
        {/* As telas abaixo usam o Layout padrão com footer */}
        <Stack.Screen name="Home">
          {(props) => <Layout {...props} component={HomeScreen} />}
        </Stack.Screen>
        <Stack.Screen name="Location">
          {(props) => <Layout {...props} component={LocationScreen} />}
        </Stack.Screen>
        <Stack.Screen name="Favorites">
          {(props) => <Layout {...props} component={FavoritesScreen} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
