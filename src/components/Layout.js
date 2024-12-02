import React from 'react';
import { View, StyleSheet } from 'react-native';
import Footer from './Footer';

const Layout = ({ component: Component, ...props }) => {
  const { navigation } = props; // Certifique-se de que `navigation` está sendo passado

  return (
    <View style={styles.container}>
      {/* Renderiza a tela principal */}
      <Component {...props} />

      {/* Footer */}
      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default Layout;
