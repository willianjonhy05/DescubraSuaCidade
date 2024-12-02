import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import logout from '../screens/Logout'; // Certifique-se de que o caminho está correto
import { useNavigation } from '@react-navigation/native';

const Footer = () => {
  const navigation = useNavigation(); // Obtém o objeto navigation

  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.footerButton}>
        <Icon name="home" size={24} color="#ffffff" />
        <Text style={styles.footerText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Location')} style={styles.footerButton}>
        <Icon name="map-marker" size={24} color="#ffffff" />
        <Text style={styles.footerText}>Pontos</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Favorites')} style={styles.footerButton}>
        <Icon name="heart" size={24} color="#ffffff" />
        <Text style={styles.footerText}>Favoritos</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => logout(navigation)} style={styles.footerButton}>
        <Icon name="sign-out" size={24} color="#ffffff" />
        <Text style={styles.footerText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footerButton: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#ffffff',
    marginTop: 2,
  },
});

export default Footer;
