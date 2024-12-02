// VisitHistoryScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { db, auth } from '../firebaseConfig';

const VisitHistoryScreen = () => {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    // Busca o histórico de visitas do usuário no Firestore
    const fetchVisits = () => {
      const visitsRef = db.collection('visits').where("userId", "==", auth.currentUser.uid);
      const unsubscribe = visitsRef.onSnapshot((snapshot) => {
        setVisits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      // Limpa o snapshot listener quando o componente é desmontado
      return unsubscribe;
    };

    fetchVisits();
  }, []);

  return (
    <View>
      <FlatList
        data={visits}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name} - {item.date ? item.date.toDate().toLocaleString() : 'Data indisponível'}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default VisitHistoryScreen;
