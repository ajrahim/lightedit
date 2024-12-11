import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  toastContainer: {
    backgroundColor: 'lightblue',
    padding: 12,
    paddingHorizontal: 30,
    borderRadius: 100,
    marginHorizontal: 20,
    marginBottom: 80,
  },
  success: {
    backgroundColor: 'lightgreen',
  },
  warning: { 
    backgroundColor: 'lightcoral',
  },
  toastText: {
    color: '#000',
    fontSize: 14,
  },
});
