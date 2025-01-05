import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  emptyState: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    color: '#888',
    fontSize: 25,
    fontWeight: 500,
    marginVertical: 30,
    textAlign: 'center',
  },
  emptyStateButton: {
    backgroundColor: 'lightblue',
    padding: 14,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  emptyStateButtonText: {
    color: '#222',
    fontSize: 14,
    fontWeight: 600,
    textAlign: 'center',
  },
});
