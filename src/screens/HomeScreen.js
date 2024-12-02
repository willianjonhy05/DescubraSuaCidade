import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/background.jpg')} // Substitua pelo caminho do seu arquivo de imagem
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.header}>Descubra Sua Cidade</Text>
        <Text style={styles.subheader}>Explore pontos turísticos incríveis e personalize seus favoritos!</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate('Location')}
          >
            <Icon name="map-marker" size={40} color="#fff" />
            <Text style={styles.buttonText}>Pontos Turísticos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate('Favorites')}
          >
            <Icon name="heart" size={40} color="#fff" />
            <Text style={styles.buttonText}>Meus Favoritos</Text>
          </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay para escurecer o fundo
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  subheader: {
    fontSize: 16,
    color: '#d9d9d9',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Espaçamento entre os botões
    alignItems: 'center',
    width: '100%', // Largura completa para alinhamento central
    maxWidth: 400, // Limita o tamanho máximo dos botões no container
    marginHorizontal: 'auto', // Centraliza horizontalmente
  },
  optionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1, // Faz com que os botões compartilhem o espaço igualmente
    marginHorizontal: 10, // Garante espaçamento horizontal consistente entre os botões
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default HomeScreen;
