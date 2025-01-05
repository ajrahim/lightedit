import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectAllModels,
  selectCurrentModel,
  setModels,
  setCurrentModel,
  setTemperature,
} from '../redux/modelsSlice';
import Icon from 'react-native-vector-icons/FontAwesome6';

import Slider from '@react-native-community/slider';

import { fetchModels } from '../infrastructures/logicService';

const ModelsScreen = () => {
  const dispatch = useDispatch();
  const models = useSelector(selectAllModels);
  const currentModel = useSelector(selectCurrentModel);
  const temperature = useSelector((state) => state.models.temperature);

  useEffect(() => {
    const initializeModels = async () => {
      try {
        const response = await fetchModels();
        const { models: modelsList, default: defaultModel } = response;

        dispatch(setModels(modelsList));

        if (!currentModel) {
          dispatch(setCurrentModel(defaultModel));
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };

    initializeModels();
  }, [dispatch, currentModel]);

  const handleModelSelect = (model) => {
    console.log(model);
    dispatch(setCurrentModel(model));
    console.log(currentModel);
  };

  const handleTemperatureChange = (value) => {
    dispatch(setTemperature(value));
  };

  const handleTemperatureColor = (value) => {
    if (temperature > 0.75) {
      return 'deeppink';
    } else if (temperature > 0.5) {
      return 'pink';
    } else if (temperature > 0.25) {
      return 'lightgreen';
    } else {
      return 'green';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Adjust Creativity</Text>
      <Slider
        minimumTrackTintColor={handleTemperatureColor(temperature)}
        maximumTrackTintColor={'#111'}
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        step={0.01}
        value={temperature}
        onValueChange={handleTemperatureChange}
      />
      <View style={styles.temperatureLabel}>
        <Icon name="arrow-left" size={12} color="#777" />
        <Text style={styles.temperatureLabelText}>
          Conservative or Creative
        </Text>
        <Icon name="arrow-right" size={12} color="#777" />
      </View>

      <Text style={styles.header}>Models</Text>
      <FlatList
        data={models}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => handleModelSelect(item)}
          >
            <Text
              style={[
                styles.listItemText,
                item === currentModel && styles.selectedModel,
              ]}
            >
              {currentModel}
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    padding: 20,
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'lightblue',
    opacity: 0.5,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  temperatureLabel: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  temperatureLabelText: {
    fontSize: 12,
    color: '#777',
    marginHorizontal: 10,
  },
  listItem: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  listItemText: {
    fontSize: 16,
    color: 'lightblue',
  },
  selectedModel: {
    fontWeight: 'bold',
    color: 'green',
  },
});

export default ModelsScreen;
