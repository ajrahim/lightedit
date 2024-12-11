import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { setActiveProject } from '../redux/projectsSlice';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';

const ProjectItem = ({ item }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handlePress = () => {
    dispatch(setActiveProject({ projectId: item.id }));
    navigation.navigate('Editor', { projectName: item.name });
  };

  return (
    <TouchableOpacity style={styles.item} onPress={handlePress}>
      <View style={styles.itemAvatar}>
        {/* <Text style={styles.avatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text> */}
        <Icon name="code" size={14} color="#222" />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.modified}>Last Modified: December 8th, 9:13 PM</Text>
      </View>
      <View style={styles.itemArrow}>
        <Icon name="chevron-right" size={16} color="lightblue" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingVertical: 10,
    marginBottom: 8,
    marginHorizontal: 16,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  itemContent: {
    flex: 1,
  },
  itemArrow: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: 'lightblue',
    marginBottom: 4,
  },
  modified: {
    fontSize: 12,
    fontWeight: '400',
    color: 'lightblue',
    opacity: 0.5
  },
});

export default ProjectItem;
