import * as React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../reusableComponents/CustomButton';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackgroundLayout from '../reusableComponents/BackgroundLayout';
import { tempCharacterArray } from "../CharacterOptions";
import PerformanceBar from '../reusableComponents/PerformanceBar';
import { alphabetArray } from "../GameContent";

export default function SelectCharacter() {
  const router = useRouter();
  const { playerId = '[name]' } = useLocalSearchParams();
  const windowHeight = useWindowDimensions().height;

  const middleIndex = Math.ceil(alphabetArray.length / 2);

  return (
    <BackgroundLayout>
        <View style={[styles.container, { minHeight: Math.round(windowHeight) }]}>
            {/* =============== Back Button =============== */}
            <CustomButton image={require('../assets/back.png')} uniqueButtonStyling={styles.backBtnContainer} onPressRoute={`/MainMenu?&playerId=${playerId}`}/>

            <Text style={styles.headerText}>Performance Reports</Text>

            <Text style={styles.bodyText}>Select the following options to view results:</Text>

            {/* =============== Names Row =============== */}
            <LinearGradient colors={['#E1CEB6', 'rgba(0, 0, 0, 0)']} style={styles.selectionBars}>
                {[...tempCharacterArray].map((user, index) => (
                    <View key={user.id}>
                        <Text style={[styles.bodyText, index === 0 && {borderBottomWidth: 7, borderBottomColor: '#3E1911'}]}>{user.name}</Text>
                    </View>
                ))}
            </LinearGradient>

            {/* =============== Game Row =============== */}
            <LinearGradient colors={['#E1CEB6', 'rgba(0, 0, 0, 0)']} style={styles.selectionBars}>
                {[...tempCharacterArray].map((user, index) => (
                    <View key={user.id}>
                        <Text style={[styles.bodyText, index === 2 && {borderBottomWidth: 7, borderBottomColor: '#3E1911'}]}>{user.name}</Text>
                    </View>
                ))}
            </LinearGradient>

            {/* =============== Level Row =============== */}
            <LinearGradient colors={['#E1CEB6', 'rgba(0, 0, 0, 0)']} style={styles.selectionBars}>
                {[...tempCharacterArray].map((user, index) => (
                    <View key={user.id}>
                        <Text style={[styles.bodyText, index === 1 && {borderBottomWidth: 7, borderBottomColor: '#3E1911'}]}>{user.name}</Text>
                    </View>
                ))}
            </LinearGradient>

            <Text style={[styles.bodyText, {textDecorationLine: 'underline', paddingBottom: 0}]}>Click here for game & level descriptions</Text>

            <Text style={styles.bodyText}>Number of Games Completed:</Text>

            <View style={styles.barsContainer}>
                {/* 1st half */}
                <View style={{flex: 1}}>
                    {alphabetArray.slice(0, middleIndex).map((item) => (
                        <View key={item.id} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1}}>
                            <Text style={[{fontWeight: 'bold', color: '#3E1911'}]}>{item.id}</Text>
                            <PerformanceBar fillPercent={60} />
                        </View>
                    ))}
                    {/* <Text>hi</Text> */}
                </View>

                {/* 2nd half */}
                <View style={{flex: 1}}>
                    {alphabetArray.slice(middleIndex).map((item) => (
                        <View key={item.id} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1}}>
                            <Text style={[{fontWeight: 'bold', color: '#3E1911'}]}>{item.id}</Text>
                            <PerformanceBar fillPercent={60} />
                        </View>
                    ))}
                    {/* <Text>hey</Text> */}
                </View>

            </View>


        </View>
    </BackgroundLayout>
  );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%'
    //backgroundColor: 'red'
  },
  backBtnContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingVertical: 20
  },
  headerText: {
    verticalAlign: 'middle',
    padding: 20,
    paddingHorizontal: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 26,
    color: '#3E1911',
    //backgroundColor: 'blue'
  },
  bodyText: {
    verticalAlign: 'middle',
    padding: 10,
    paddingHorizontal: 20,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#3E1911',
    //backgroundColor: 'blue'
  },
  selectionBars: {
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(62, 25, 17, 0.3)',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    columnGap: '10%',
    //backgroundColor: 'blue'
  }
});