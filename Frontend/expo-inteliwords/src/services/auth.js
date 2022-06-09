import { AsyncStorage } from '@react-native-async-storage/async-storage';

export const usuarioLogado = async () => await AsyncStorage.getItem('userToken') !== null;

