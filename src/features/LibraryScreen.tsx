/**
 * Copyright (c) 2024 Yousef Ibrahimkhil & AJ Rahim
 *
 * All rights reserved. Unauthorized copying of this file, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by Yousef Ibrahimkhil & AJ Rahim, 2024.
 */

// ========================================================
// === Start of Imports ===================================
// ========================================================

// React Native
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';

// Additional Libraries
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

// API Services
import { searchLibraries } from '../infrastructures/libraryService';

// Redux Actions & Selectors
import { saveLibrary, removeLibrary } from '../redux/librarySlice';
import {
  addLibrary,
  removeLibrary as removeProjectLibrary,
  selectActiveProject,
} from '../redux/projectsSlice';

// Components
import EmptyState from '../components/EmptyState';

// Styles, Colors, & Icons
import styles from '../styles/screens';
import Icon from 'react-native-vector-icons/FontAwesome6';

// ========================================================
// === Start of Code ======================================
// ========================================================

const LibraryScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('Connected');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const downloadedLibraries = useSelector(
    (state) => state.libraries.downloaded,
  );
  const activeProject = useSelector(selectActiveProject);

  const getActiveTabData = () => {
    if (activeTab === 'Connected') {
      return activeProject.libraries || [];
    }
    if (activeTab === 'Search') {
      return searchResults;
    }
    if (activeTab === 'Downloaded') {
      return downloadedLibraries;
    }
    return [];
  };

  const handleSaveLibrary = async (library) => {
    try {
      // Fetch the source code from the URL
      const response = await fetch(library.source);
      if (!response.ok) {
        throw new Error(`Failed to fetch code from ${library.source}`);
      }
      // Get the code as text
      const code = await response.text();

      // Create the library object with the code key
      const libraryWithCode = {
        ...library,
        code, // Add fetched code
      };

      // Save globally to librarySlice
      dispatch(saveLibrary(libraryWithCode));

      // Save to the active project's libraries if activeProject exists
      if (activeProject) {
        dispatch(
          addLibrary({
            projectId: activeProject.id,
            library: libraryWithCode,
          }),
        );
      }
    } catch (error) {
      console.error('Error fetching library code:', error);
    }
  };

  const handleRemoveLibrary = (name) => {
    dispatch(removeLibrary(name)); // Remove globally from librarySlice
    if (activeProject) {
      dispatch(
        removeProjectLibrary({
          projectId: activeProject.id,
          libraryName: name,
        }),
      );
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={styles.listContentTop}>
        <View style={styles.listContent}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
        </View>
        <View style={styles.listActions}>
          {activeTab === 'Search' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleSaveLibrary(item)}
            >
              <Text style={styles.actionText}>Save</Text>
            </TouchableOpacity>
          )}
          {activeTab !== 'Search' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleRemoveLibrary(item.name)}
            >
              <Text style={styles.actionText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.listContentBottom}>
        <Text style={styles.itemRepo}>{item.repo}</Text>
      </View>
    </View>
  );

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    setActiveTab('Search');

    try {
      const results = await searchLibraries(searchQuery); // Call the search API
      console.log('Search Results:', results);
      setSearchResults(results.libraries || []);
    } catch (error) {
      console.error('Error searching libraries:', error);
    }
  };

  useEffect(() => {
    console.log('Active Tab:', activeTab);
    console.log('Search Results:', searchResults);
  }, [activeTab, searchResults]);

  useEffect(() => {
    if (activeTab === 'Search' && searchQuery.trim() !== '') {
      handleSearch();
    }
  }, [activeTab]);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search libraries..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchIcon} onPress={handleSearch}>
          <Icon name="magnifying-glass" size={16} color="lightblue" />
        </TouchableOpacity>
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
              style={[
                styles.tabButtonText,
                activeTab === tab && styles.activeTabButtonText,
              ]}
            >
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Content */}
      {getActiveTabData().length > 0 ? (
        <FlatList
          data={getActiveTabData()}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.name || item.id || index.toString()
          }
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <>
          {activeTab === 'Connected' && (
            <EmptyState
              icon="plug-circle-plus"
              titleText="Connected Libraries"
            />
          )}

          {activeTab === 'Search' && (
            <EmptyState icon="satellite" titleText="Search for a Library" />
          )}

          {activeTab === 'Downloaded' && (
            <EmptyState icon="vault" titleText="Downloaded Libraries" />
          )}
        </>
      )}
    </View>
  );
};

export default LibraryScreen;
