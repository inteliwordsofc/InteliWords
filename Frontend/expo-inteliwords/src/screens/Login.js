import React, { useState } from 'react'
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-google-app-auth';
// import * as Google from 'expo-auth-session';
import api from '../services/api';

export default function Login({ navigation }) {
  const [envioDoGoogle, setEnvioDoGoogle] = useState(false);
  const [erroMensagem, setErroMensagem] = useState('');

  LoginComGoogle = async (event) => {
    event.preventDefault();

    Google.logInAsync({
      iosClientId: `1012216626476-fdun3926qubvq6bp8rrni27at2275jai.apps.googleusercontent.com`,
      androidClientId: `1012216626476-p6jm9mkrovfcke7rct3t0ht1j076hsmu.apps.googleusercontent.com`,
      scopes: ['profile', 'email']
    }).then(async (result) => {
      const { type, user } = result;

      if (type === 'success') {
        const usuario = {
          "email": user.email,
          "nome": user.name,
          "userId": user.id,
          "foto": user.photoUrl,
          "ativado": true
        }
        api.post('/Login', usuario)
          .then(async (resposta) => {
            if (resposta.status === 200) {
              api.get(`/Usuarios/${user.id}`)
                .then(async (respostaUsuario) => {
                  if (respostaUsuario.status === 200) {
                    navigation.navigate('TabBar')
                    const token = JSON.stringify(respostaUsuario.data);
                    await AsyncStorage.setItem("userToken", token);
                    const recarregar = JSON.stringify(false);
                    await AsyncStorage.setItem("recarregar", recarregar);
                    setErroMensagem('');
                  } else {
                    setErroMensagem(respostaUsuario.data);
                    //console.log(respostaUsuario.data)
                  }

                })
                .catch((resposta) => {
                  setErroMensagem(resposta.data);
                })
            } else {
              setErroMensagem(resposta.data);
              //console.log(resposta.data)
            }
          })
          .catch((resposta) => {
            setErroMensagem(resposta.data);
          })
      } else {
        setErroMensagem('O login com google foi cancelado');
      }
      setEnvioDoGoogle(false);
    })
      .catch(error => {
        //console.log(error);
        setErroMensagem('Ocorreu um erro. Verifique a conexão e tente novamente');
        setEnvioDoGoogle(false);
      })
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo2.png')}
        style={styles.logo}
      />

      <Image
        source={require('../assets/banner.png')}
        style={styles.banner}
      />

      {!envioDoGoogle && (
        <TouchableOpacity style={styles.btn} onPress={(e) => LoginComGoogle(e)}>
          <Image
            source={require('../assets/logoGoogle.png')}
            style={styles.logoGoogle}
          />
          <Text style={styles.btnText}>Entrar com Google</Text>
        </TouchableOpacity>
      )}
      {envioDoGoogle && (
        <TouchableOpacity style={styles.btn} disabled={true}>
          <Image
            source={require('../assets/logoGoogle.png')}
            style={styles.logoGoogle}
          />
          <Text style={styles.btnText}>Entrando...</Text>
        </TouchableOpacity>
      )}
      <Text style={{ color: 'red', fontSize: 20, textAlign: 'center' }}>{erroMensagem}</Text>
    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#292929'
  },

  containerLogo: {
    height: 90,
    justifyContent: 'space-between'
  },

  logo: {
    width: 314,
    height: 35
  },

  banner: {
    width: 300,
    height: 220
  },

  btn: {
    flexDirection: 'row',
    width: 315,
    height: 52,
    backgroundColor: '#292929',
    borderColor: '#FE7B1D',
    borderWidth: 3,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },

  logoGoogle: {
    marginRight: 10
  },

  btnText: {
    fontSize: 22,
    color: '#FE7B1D',
    marginLeft: 10
  }
})
