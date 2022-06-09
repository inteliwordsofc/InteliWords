import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, BackHandler, LogBox } from 'react-native';
import "@react-native-community/masked-view";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHouse, faChartLine, faUser, faList } from '@fortawesome/free-solid-svg-icons';
import Login from './src/screens/Login.js'

//Telas
import Home from './src/screens/Home.js';
import Grafico from './src/screens/Grafico.js';
import Perfil from './src/screens/Perfil.js';
import Palavra from './src/screens/Palavra.js';
import AddPalavra from './src/screens/AddPalavra.js';
import Scroll from './src/screens/Scroll.js';
import EditarPalavra from './src/screens/EditarPalavra.js';

const Tab = createBottomTabNavigator();
LogBox.ignoreLogs(['Warning: ...']);

function TabBar() {


  return (
    <Tab.Navigator
      initialRouteName='Home'
      backgroundColor
      style={styles.tabBar}
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarShowIcon: true,
        tabBarActiveBackgroundColor: '#292929',
        tabBarInactiveBackgroundColor: '#292929',
        tabBarIcon: ({ focused, size, color }) => {

          if (route.name === 'Home') {
            return (
              iconName = focused
                ? <FontAwesomeIcon icon={faHouse} size={28} color={"#FA7B3B"} />
                : <Image
                  style={styles.tabBarIcon}
                  source={require('./src/assets/house.png')} />
            )
          }

          if (route.name === 'Grafico') {
            return (
              iconName = focused
                ? <FontAwesomeIcon icon={faChartLine} size={28} color={"#FA7B3B"} />
                : <Image
                  style={styles.tabBarIcon}
                  source={require('./src/assets/chart-line.png')} />
            )
          }

          if (route.name === 'Scroll') {
            return (
              <FontAwesomeIcon icon={faList} size={28} color={"#FA7B3B"} />
            )
          }

          if (route.name === 'Perfil') {
            return (
              iconName = focused
                ? <FontAwesomeIcon icon={faUser} size={28} color={"#FA7B3B"} />
                : <Image
                  style={styles.tabBarIcon}
                  source={require('./src/assets/user.png')} />
            )
          }
        },

        headerShown: false,
      })}
    >

      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Grafico" component={Grafico} />
      <Tab.Screen name="Scroll" component={Scroll} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );

};


const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    BackHandler.addEventListener('backPress', () => true)
    return () => BackHandler.removeEventListener('backPress', () => true)
  }, [])
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="TabBar" component={TabBar} />
        <Stack.Screen name="EditarPalavra" component={EditarPalavra} />
        <Stack.Screen name="AddPalavra" component={AddPalavra} />
        <Stack.Screen name="Scroll" component={Scroll} />
        <Stack.Screen name="Palavra" component={Palavra} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({

  // estilo dos ícones da tabBar
  tabBarIcon: {
    width: 28,
    height: 28,
  },
  main: {
    flex: 1,
    borderTopColor: 'transparent'
  },
  container: {
    alignItems: 'center',
    position: 'absolute'
  },

  buttonMain: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    justifyContent: 'center',
    alignItems: 'center'
  },

  menu: {
    backgroundColor: '#FE7B1D'
  },

  subMenu: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
    backgroundColor: '#FE7B1D'
  },

  containerModal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modal: {
    width: 300,
    height: 300,
    backgroundColor: '#333',
    borderRadius: 15,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: '#FA7B3B',
    borderWidth: 1,
  },

  text: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '400',
    marginTop: 10
  },

  btnCancelar: {
    borderColor: "#FA7B3B",
    borderWidth: 2,
    backgroundColor: "transparent",
    width: 95,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
    padding: 10,
    elevation: 2,
  },

  btnAdicionar: {
    backgroundColor: "#FA7B3B",
    width: 95,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
    padding: 10,
    elevation: 2
  }

});