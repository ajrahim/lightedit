import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#333',
    padding: 10,
    justifyContent: 'space-around',
  },
  navButton: {
    padding: 8,
    backgroundColor: '#444',
    borderRadius: 4,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#222',
    padding: 10,
    justifyContent: 'space-around',
  },
  tabButton: {
    padding: 8,
    borderRadius: 4,
  },
  activeTab: {
    backgroundColor: '#555',
  },
  tabButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editorContainer: {
    flex: 1,
    padding: 10,
  },
  codeEditor: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  footer: {
    backgroundColor: '#222',
    alignContent: 'center',
    justifyContent: 'center',
    height: 70,
    alignItems: 'center',
  },
  lastSavedText: {
    color: '#fff',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#444',
    borderRadius: 4,
    alignSelf: 'center',
    marginVertical: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  webview: {
    flex: 1,
  },
  historyItem: {
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
  },
  historyText: {
    fontSize: 14,
    color: '#333',
  },
  inputContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1000,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
  },
});