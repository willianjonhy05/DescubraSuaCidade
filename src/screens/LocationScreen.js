import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import * as Location from 'expo-location';
import { fetchTouristSpots } from '../services/touristAPI'; // Função para buscar pontos turísticos próximos
import { db, auth } from '../firebaseConfig'; // Firebase Config
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importa os ícones
import { requestNotificationPermissions } from '../services/notificationSetup';
import * as Notifications from 'expo-notifications';




const LocationScreen = () => {
  const [location, setLocation] = useState(null);
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Carregar favoritos do Firestore
  const loadFavorites = async () => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    const favoriteIds = querySnapshot.docs.map((doc) => doc.data().fsq_id);
    setFavorites(favoriteIds);
  };

  // Solicitar permissão de localização e obter a localização do usuário
  const getLocationAndSpots = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão para acessar localização foi negada');
        setLoading(false);
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation);

      const data = await fetchTouristSpots(
        userLocation.coords.latitude,
        userLocation.coords.longitude
      );
      setSpots(data);
    } catch (error) {
      setErrorMsg('Erro ao carregar pontos turísticos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocationAndSpots();
    loadFavorites();
  }, []);

  // Adicionar ponto turístico aos favoritos
  const favoriteSpot = async (spot) => {
    try {
      if (!auth.currentUser) {
        alert('Você precisa estar autenticado para favoritar locais.');
        return;
      }
  
      if (favorites.includes(spot.fsq_id)) {
        alert('Este local já está nos seus favoritos.');
        return;
      }
  
      await addDoc(collection(db, 'favorites'), {
        userId: auth.currentUser.uid,
        name: spot.name || 'Nome não disponível',
        address: spot.location?.address || 'Endereço não disponível',
        latitude: spot.geocodes?.main?.latitude || null,
        longitude: spot.geocodes?.main?.longitude || null,
        fsq_id: spot.fsq_id,
        dateAdded: new Date(),
      });
  
      setFavorites((prev) => [...prev, spot.fsq_id]);
  
      ToastAndroid.show('Local adicionado aos favoritos!', ToastAndroid.SHORT);
  
      // Solicitar permissão para notificações
      const hasPermission = await requestNotificationPermissions();
      if (hasPermission) {
        // Enviar notificação
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Encontro de Turistas!',
            body: `No local ${spot.name}, está acontecendo um encontro de turistas de Teresina. Você será bem-vindo à festa!`,
            data: { spot },
          },
          trigger: null, // Envia imediatamente
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
      alert('Erro ao favoritar o local.');
    }
  };
  

  if (errorMsg) {
    return (
      <View style={styles.centered}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Pontos Turísticos Próximos</Text>
      </View>
      {location && (
        <Text style={styles.locationText}>
          Sua localização: Latitude {location.coords.latitude.toFixed(4)}, Longitude {location.coords.longitude.toFixed(4)}
        </Text>
      )}
      <FlatList
        data={spots}
        keyExtractor={(item) => item.fsq_id}
        renderItem={({ item }) => (
          <View style={styles.spotCard}>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => favoriteSpot(item)}
            >
              <Icon
                name={favorites.includes(item.fsq_id) ? 'heart' : 'heart-o'}
                size={28}
                color="red"
              />
            </TouchableOpacity>
            <Text style={styles.spotName}>{item.name || 'Sem nome'}</Text>
            <Text style={styles.spotAddress}>{item.location?.address || 'Endereço não disponível'}</Text>
            <Text style={styles.spotCategories}>
              {item.categories?.map((cat) => cat.name).join(', ') || 'Sem categoria'}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  locationText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#555',
  },
  spotCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  spotName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  spotAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  spotCategories: {
    fontSize: 14,
    color: '#999',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LocationScreen;
