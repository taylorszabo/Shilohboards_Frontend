import { StyleSheet} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import Login from "./Login";

type RootStackParamList = {
  LinkPage: undefined;
};

export default function App() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
      <Login navigation={navigation} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
