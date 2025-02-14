import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Login } from './Login';
 //import Numbers1 from './Numbers1';
//import NumberImages from './numberImages';
import LinkPage from './linkPage';





export default function App() {
  return (
    <LinkPage />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
