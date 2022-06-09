import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, Text, StatusBar, FlatList, Image, Alert, ScrollView, RefreshControl } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { vw, vh } from 'react-native-expo-viewport-units';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faPen, faTrashCan, faCircle } from '@fortawesome/free-solid-svg-icons';


const Separator = () => <View style={styles.itemSeparator} />;

const LeftSwipeActions = () => {
  return (


    <View
      style={{
        flex: 1,
        backgroundColor: '#00C72C',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}
    >
      <Text
        style={{
          color: '#000',
          fontSize: 18,
          fontWeight: '600',
          paddingHorizontal: 30,
        }}
      >
        Aprendido
      </Text>
    </View>
  );
};

const rightSwipeActions = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#D90000',
        justifyContent: 'center',
        alignItems: 'flex-end',
      }}
    >
      <Text
        style={{
          color: '#FFF',
          fontSize: 18,
          fontWeight: '600',
          paddingHorizontal: 30,
        }}
      >
        A Revisar
      </Text>
    </View>
  );
};

const AlterarStatus = async (id, bool) => {
  try {

    await api.patch(`/PalavrasUsuarios/${id}/${bool}`)
      .then((resposta) => {
        if (resposta.status === 200) {
        } else {
          //console.log(resposta);
        }
      })
      .catch((ex) => {
        //console.log(ex);
      })

  } catch (error) {
    //console.log(error);
  }
}

const swipeFromLeftOpen = async (id) => {
  //console.log(id);
  AlterarStatus(id, true);
  Alert.alert(
    "InteliWords",
    "Parabéns, você aprendeu essa palavra!",
    [
      { text: "Obrigado!" }
    ]
  )
};

const swipeFromRightOpen = async (id) => {
  //console.log(id);
  AlterarStatus(id, false);
  Alert.alert(
    "InteliWords",
    "Tudo bem, você pode revisar essa palavra mais tarde!",
    [
      { text: "OK" }
    ]
  )
};

const ListItem = ({ text, id, aprendido }) => (


  <Swipeable
    renderLeftActions={LeftSwipeActions}
    renderRightActions={rightSwipeActions}
    onSwipeableRightOpen={() => swipeFromRightOpen(id)}
    onSwipeableLeftOpen={() => swipeFromLeftOpen(id)}
  >
    <View
      style={{
        paddingHorizontal: 30,
        justifyContent: 'center',
        backgroundColor: 'white',
        height: 60
      }}
    >
      <View style={styles.status}>
        <Text style={{ fontSize: 18 }}>
          {text}
        </Text>
        <View style={styles.containerStatus}>
          {aprendido ? <FontAwesomeIcon icon={faCircle} size={15} color={"green"} />
            : <FontAwesomeIcon icon={faCircle} size={15} color={"red"} />}
        </View>
      </View>
    </View>

  </Swipeable>
);



const Scroll = ({ navigation }) => {
  const [photoUrl, setPhotoUrl] = useState('../assets/user.png');
  const [userId, setUserId] = useState("");
  const [carregar, setCarregar] = useState(true);
  const [listaPalavras, setLista] = useState()
  const [palavras, setPalavras] = useState([]);
  const [refreshing, setRefreshing] = useState(false);


  const irPerfil = () => {
    navigation.navigate("Perfil")
  }

  useEffect(async () => {
    if (carregar === true) {
      await onLoad();
      ListarPalavras();
      setTimeout(function () { setCarregar(false) }, 1000)
    }
  });


  const tratarFoto = async (string, index) => {
    var valor = (string).slice(1);
    valor = (valor).slice(0, -1);
    valor = await (valor).split(",")[index];
    valor = await valor.split('"')[3]
    //console.log(valor)
    return await valor
  }


  const onLoad = async () => {
    try {
      const storedValue = await AsyncStorage.getItem("userToken");
      const categoriasHome = await AsyncStorage.getItem("categorias");

      //foto
      const photoUrl = await tratarFoto(storedValue, 4);
      setPhotoUrl(photoUrl)

    } catch (error) {
      //console.log(error);
    }
  }

  const tratarString = async (string, index) => {
    var valor = (string).slice(1);
    valor = (valor).slice(0, -1);
    valor = await (valor).split(",")[index];
    valor = await valor.split(":")[1]
    valor = await valor.slice(1)
    valor = await valor.slice(0, -1)
    //console.log(valor)
    return await valor
  }

  const ListarPalavras = async () => {
    try {

      const storedValue = await AsyncStorage.getItem("userToken");

      //id do google
      const userId = await tratarString(storedValue, 3)
      setUserId(userId)

      await api.get(`/PalavrasUsuarios/ListarTodas/${userId}`)
        .then(async (resposta) => {
          if (resposta.status === 200) {
            await setLista(resposta.data);
            setPalavras(listaPalavras.map((p) => {
              const palavras = {};
              palavras.id = p.idPalavrasUsuario
              palavras.text = p.tituloPalavra
              palavras.aprendido = p.aprendido
              return palavras
              console.log(palavras);
            }))
          } else {
            //console.log(resposta);
          }
        })
        .catch((ex) => {
          //console.log(ex);
        })
    } catch (ex) {
      //console.log(ex);
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setCarregar(true)
    setTimeout(function () { setRefreshing(false) }, 2000)
  }, [])


  return (
    <ScrollView

      scrollEnabled={true}
      horizontal={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <StatusBar />

      {/* Header */}
      <View style={styles.main}>
        <View style={styles.mainHeader}>
          <View style={styles.mainHeaderRow}>
            <Text style={styles.mainHeaderText}>Scroll de Palavras</Text>
            <TouchableOpacity onPress={() => irPerfil()}>
              <Image
                source={{ uri: photoUrl }}
                style={styles.mainBodyHeader}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginVertical: 20, marginHorizontal: 5 }}>
          Deslize para a Direita para Aprendido ou para a Esquerda para Revisar
        </Text>
        <View style={{ color: '#000', borderBottomWidth: 0.7 }}></View>
        <View style={styles.legenda}>
          <Text >
            <FontAwesomeIcon icon={faCircle} size={15} color={"green"} /> Aprendido
          </Text>
          <Text >
            <FontAwesomeIcon icon={faCircle} size={15} color={"red"} /> A Revisar
          </Text>
        </View>
        <FlatList
          data={palavras}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ListItem {...item}
          />}
          ItemSeparatorComponent={() => <Separator />}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  legenda: {
    flexDirection: 'row',
    //backgroundColor: 'red',
    marginVertical: 20,
    justifyContent: 'space-evenly',
  },

  itemSeparator: {
    flex: 1,
    height: 1,
    backgroundColor: '#444',
  },

  //Header
  main: {
    flex: 0.3,
    //backgroundColor: '#454545',
  },

  mainHeader: {
    height: vh(20),
    backgroundColor: '#292929',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainHeaderRow: {
    width: vw(85),
    //backgroundColor: 'blue',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  // texto do cabeçalho
  mainHeaderText: {
    width: vw(45),
    //backgroundColor: 'red',
    fontSize: 24,
    letterSpacing: 2,
    color: '#FFF',
    //fontFamily: 'Open Sans',
  },

  mainBodyHeader: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  status:{
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

export default Scroll;