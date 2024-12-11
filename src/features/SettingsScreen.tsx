import React, { useLayoutEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLargeTitle: true,
      headerLargeTitleStyle: { fontSize: 30, fontWeight: 'bold' },
    });
  }, [navigation]);

  const openEmail = () => {
    Linking.openURL('mailto:hello@lightedit.com');
  };

  const openWebpage = (url) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.list}>
        <TouchableOpacity style={styles.listItem} onPress={openEmail}>
          <Text style={styles.listItemText}>Support</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => openWebpage('https://www.ajr.co')}
        >
          <Text style={styles.listItemText}>Terms & Conditions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => openWebpage('https://www.ajr.co')}
        >
          <Text style={styles.listItemText}>Privacy Policy</Text>
        </TouchableOpacity>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>Version</Text>
          <Text style={styles.listItemSubText}>1.0.0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  listItem: {
    paddingVertical: 20,
  },
  listItemText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  listItemSubText: {
    fontSize: 12,
    color: 'lightblue',
  },
});

export default SettingsScreen;
