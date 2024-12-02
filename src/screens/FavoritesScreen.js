import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (!auth.currentUser) {
          Alert.alert("Erro", "Você precisa estar autenticado para ver seus favoritos.");
          return;
        }

        const q = query(
          collection(db, 'favorites'),
          where('userId', '==', auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);

        const favoriteList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFavorites(favoriteList);
      } catch (error) {
        console.error('Erro ao buscar favoritos:', error);
        Alert.alert("Erro", "Não foi possível carregar seus favoritos.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // Função para remover um favorito
  const removeFavorite = async (id) => {
    try {
      const docRef = doc(db, 'favorites', id);
      await deleteDoc(docRef);
      setFavorites((prev) => prev.filter((favorite) => favorite.id !== id));
      Alert.alert("Sucesso", "Favorito removido com sucesso.");
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      Alert.alert("Erro", "Não foi possível remover o favorito.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#134e5e" />
        <Text style={styles.loadingText}>Carregando seus favoritos...</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noFavoritesText}>Você ainda não tem favoritos.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Meus Favoritos</Text>
      </View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.favoriteContainer}>
            <View style={styles.favoriteContent}>
              <View>
                <Text style={styles.favoriteName}>{item.name}</Text>
                <Text style={styles.favoriteAddress}>{item.address}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFavorite(item.id)}>
                <Icon name="trash" size={24} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  headerContainer: {
    backgroundColor: '#4CAF50', // Mantém a cor do cabeçalho consistente com outras telas
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  favoriteContainer: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  favoriteContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoriteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  favoriteAddress: {
    fontSize: 14,
    color: '#777777',
  },
  separator: {
    height: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555555',
  },
  noFavoritesText: {
    fontSize: 18,
    color: '#888888',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default FavoritesScreen;
