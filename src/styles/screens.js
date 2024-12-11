import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  containerMargins: {
    paddingVertical: 20,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    paddingHorizontal: 20,
    backgroundColor: '#252525',
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#222',
  },
  tabButton: {
    padding: 10,
    paddingVertical: 15,
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderBottomColor: '#222',
    borderBottomWidth: 2,
  },
  activeTab: {
    borderBottomColor: 'lightblue',
    borderBottomWidth: 2,
  },
  tabButtonText: {
    color: '#777',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeTabButtonText: {
    color: 'lightblue',
    fontSize: 12,
    fontWeight: 'bold',
  },
  editorContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#282c34',
  },
  codeEditor: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  footer: {
    padding: 10,
    backgroundColor: '#222',
    alignItems: 'center',
  },
  lastSavedText: {
    color: '#fff',
    opacity: 0.3,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContent: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 4,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  keyboardOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  keyboardOverlayContainer: {
    width: '100%',
    backgroundColor: '#222', // white background for the modal
    padding: 20,
  },
  keyboardOverlayTop: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    width: '100%',
    height: 50,
  },
  keyboardOverlayIcon: {
    marginBottom: 14,
    marginRight: 10,
  },
  keyboardOverlayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'lightblue',
  },
  keyboardOverlayInput: {
    backgroundColor: '#333',
    borderRadius: 6,
    color: '#fff',
    padding: 10,
    marginBottom: 15,
  },
  keyboardOverlayProcessing: { alignItems: 'center', marginVertical: 50 },
  keyboardOverlayProcessingText: {
    color: 'lightblue', marginTop: 10
  },
  keyboardOverlayResponse: { marginVertical: 20},
  keyboardOverlayResponseText: { color: 'lightblue' },
  keyboardOverlayButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  keyboardOverlayButton: {
    marginLeft: 10,
    padding: 10,
  },
  keyboardOverlayButtonText: {
    color: '#555',
    fontSize: 16,
  },
  keyboardOverlayButtonTextSubmit: {
    color: 'lightblue',
  },
  footerContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 50
  },
  codeButtonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  codeButton: {
    height: 40,
    width: 40,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeButtonClean: {
    backgroundColor: 'lightblue',
    marginHorizontal: 20,
    borderRadius: 20
  },
  codeButtonText: {
    color: '#fff', // Text color
    fontSize: 14,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginHorizontal: 12,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: '#fff',
  },
  searchIcon: {
    marginHorizontal: 8,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
    backgroundColor: '#222',
  },
  listItem: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 5,
    marginBottom: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listContentTop: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    width: '100%'
  },
  listContentBottom: {
    display: 'flex',
    flex: 1,
    padding: 16,
    width: '100%'
  },
  listContent: {
    padding: 16,
    display: 'flex',
    flex: 1
  },
  listActions: {
    display: 'flex',
    width: 120,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    color: 'lightblue',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 12,
    color: '#999',
  },
  itemRepo: {
    fontSize: 10,
    color: 'lightblue',
  },
  actionButton: {
    paddingVertical: 8,
    backgroundColor: 'lightgreen',
    borderRadius: 20,
    textAlign: 'center',
    alignItems: 'center',
    width: 80
  },
  actionText: {
    color: '#111',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Preview Screen
  webview: {
    flex: 1,
  },
  draggableBar: {
    height: 20,
    backgroundColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#888',
    borderRadius: 2,
  },
  consoleContainer: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
  },
  consoleTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  consoleScrollView: {
    flex: 1,
  },
  consoleText: {
    fontSize: 12,
  },
  logText: {
    color: '#ffffff',
  },
  warnText: {
    color: '#ffae42',
  },
  errorText: {
    color: '#ff4c4c',
  },
  headerButton: {
    padding: 5,
  },

  // History Screen
  historyItem: {
    marginHorizontal: 16,
    flexDirection: 'row',
  },
  historyLineContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
  },
  historyLine : {
    width: 1,
    height: '100%',
    borderWidth: 0.5,
    borderColor: '#333',
  },
  historyLineFirst: {
    height: '50%',
    position: 'absolute',
    bottom: 0,
    left: 13,
  },
  historyLineLast: {
    height: '50%',
    position: 'absolute',
    top: 0,
    left: 13,
  },
  historyCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: -4,
    backgroundColor: '#444',
  },
  historyContent: {
    padding: 20,
    paddingHorizontal: 10,
    marginVertical: 4,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 4,
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  historyVersion: {
    fontSize: 12,
    width: 50,
    textAlign: 'center',
    color: '#ccc',
    backgroundColor: '#444',
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 20,
  },
  historyText: {
    fontSize: 14,
    color: 'lightblue',
    flex: 1,
  },
  currentVersionLabel: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 5,
  },
  currentItemHighlight: {
    backgroundColor: '#e0ffe0', // a light green to highlight current version
  },
  currentCheck: { marginRight: 10, padding: 6, paddingHorizontal: 7, backgroundColor: 'lightgreen', borderRadius: 20 },
});