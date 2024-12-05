import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LibraryScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Connected');
  const [searchQuery, setSearchQuery] = useState('');

  const data = {
    Connected: [{ id: '1', name: 'Connected Item 1' }, { id: '2', name: 'Connected Item 2' }],
    Search: [{ id: '3', name: 'Search Result 1' }, { id: '4', name: 'Search Result 2' }],
    Downloaded: [{ id: '5', name: 'Downloaded Item 1' }, { id: '6', name: 'Downloaded Item 2' }],
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.itemText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Title Bar */}

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['Connected', 'Search', 'Downloaded'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[styles.tabButtonText, activeTab === tab && styles.activeTabText]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>


      {/* Main Content */}
      <FlatList
        data={data[activeTab].filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  titleBar: {
    padding: 16,
    backgroundColor: '#6200EE',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#eee',
    paddingVertical: 8,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: '#6200EE',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#000',
  },
  activeTabText: {
    color: '#fff',
  },
  searchBarContainer: {
    padding: 8,
    backgroundColor: '#fff',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  listItem: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRadius: 5,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default LibraryScreen;