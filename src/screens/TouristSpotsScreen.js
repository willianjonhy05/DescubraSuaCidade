// TouristSpotsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, ActivityIndicator, Alert } from 'react-native';
import { fetchTouristSpots } from '../services/touristAPI';
import { db, auth } from '../firebaseConfig';
import * as Location from 'expo-location';

const TouristSpotsScreen = () => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para capturar a localização do usuário e buscar pontos turísticos próximos
  const loadSpotsNearby = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permissão para acessar localização negada');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      // Busca pontos turísticos próximos utilizando a API e as coordenadas do usuário
      const data = await fetchTouristSpots(latitude, longitude);
      setSpots(data);
    } catch (err) {
      setError('Erro ao carregar pontos turísticos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Carrega os pontos turísticos próximos ao carregar o componente
    loadSpotsNearby();
  }, []);

  // Função para favoritar um ponto turístico
  const favoriteSpot = async (spot) => {
    // Verifica se o usuário está autenticado
    if (!auth.currentUser) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    try {
      // Adiciona o ponto turístico aos favoritos no Firestore
      await db.collection('favorites').add({
        userId: auth.currentUser.uid,
        name: spot.name || 'Nome não disponível',
        address: spot.location?.address || 'Endereço não disponível',
        categories: spot.categories?.map((cat) => cat.name).join(', ') || 'Sem categoria',
        latitude: spot.geocodes?.main?.latitude || null,
        longitude: spot.geocodes?.main?.longitude || null,
        date: new Date(),
      });
      Alert.alert('Sucesso', 'Ponto turístico favoritado!');
    } catch (error) {
      // Log detalhado do erro para análise
      console.error('Erro ao favoritar:', error);
      Alert.alert('Erro', 'Erro ao favoritar o ponto turístico');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View>
      <FlatList
        data={spots}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontSize: 18 }}>{item.name || 'Nome não disponível'}</Text>
            <Text>{item.location?.address || 'Endereço não disponível'}</Text>
            <Text>{item.categories?.map((cat) => cat.name).join(', ') || 'Sem categoria'}</Text>
            <Button title="Favoritar" onPress={() => favoriteSpot(item)} />
          </View>
        )}
        keyExtractor={(item) => item.fsq_id}
      />
    </View>
  );
};

export default TouristSpotsScreen;
