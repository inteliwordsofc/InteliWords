import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import { vw, vh } from 'react-native-expo-viewport-units';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function AddPalavra({ navigation }) {

    const [categorias, setCategorias] = useState([]);
    const [carregar, setCarregar] = useState(true);
    const [palavra, setPalavra] = useState("");
    const [definicao, setDefinicao] = useState("");
    const [descricao, setDescricao] = useState("");
    const [idCategoria, setIdCategoria] = useState(0);

    const goBack = () => {
        navigation.navigate("Home")
    }

    useEffect(async () => {
        if (carregar == true) {
            await onLoad()
            setTimeout(function () { setCarregar(false) }, 2000)
        }
    }, []);

    const onLoad = async () => {
        try {
            const categoriasHome = await AsyncStorage.getItem("categorias");

            const categoriasHomeFiltradas = JSON.parse(categoriasHome)

            setCategorias(categoriasHomeFiltradas.map((c) => {
                const categoriasOrganizadas = {};
                categoriasOrganizadas.id = c.idCategoria
                categoriasOrganizadas.idUsuario = c.idUsuario
                categoriasOrganizadas.title = c.tituloCategoria

                return categoriasOrganizadas;
            }))

        } catch (error) {
            //console.log(error);
        }
    }

    const CadastrarPalavra = async () => {
        const palavraNova = {
            "idCategoria": idCategoria,
            "tituloPalavra": palavra,
            "definicao": definicao,
            "descricao": descricao,
            "aprendido": false,
            "dataVerificacao": (new Date()).toJSON()
        }

        api.post('/PalavrasUsuarios', palavraNova)
            .then(async (resposta) => {
                if (resposta.status === 201) {
                    const recarregar = JSON.stringify(true);
                    await AsyncStorage.setItem("recarregar", recarregar);
                    navigation.navigate('TabBar')
                    setIdCategoria(0)
                    setPalavra("")
                    setDefinicao("")
                    setDescricao("")
                    Alert.alert(
                        "InteliWords",
                        "Deslize para baixo para atualizar",
                        [
                          { text: "OK" }
                        ]
                      )
                } else {
                    console.warn(resposta)
                }
            })
            .catch((ex) => {
                console.warn(ex)
            })

    };

    return (
        <View style={{ flex: 1, backgroundColor: '#292929' }}>
            <TouchableOpacity
                onPress={() => goBack()}
            >
                <FontAwesomeIcon icon={faClose} size={45} color={'#FFF'} style={{ marginTop: 30, marginLeft: 20 }} />
            </TouchableOpacity>


            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                <View style={{ width: vw(80), height: vh(50), justifyContent: 'space-between', marginBottom: 30 }}>
                    {/* Input "Palavra" */}
                    <View>
                        <Text style={styles.inputTitle}>Palavra*</Text>
                        <TextInput
                            style={styles.input}
                            value={palavra}
                            onChangeText={Palavra => setPalavra(Palavra)}
                            maxLength={80}
                        ></TextInput>
                    </View>

                    {/* Input "Definição" */}
                    <View>
                        <Text style={styles.inputTitle}>Definição</Text>
                        <TextInput
                            style={styles.input}
                            value={definicao}
                            onChangeText={Definicao => setDefinicao(Definicao)}
                            maxLength={255}
                        ></TextInput>
                    </View>

                    {/* Input "Descrição" */}
                    <View>
                        <Text style={styles.inputTitle}>Descrição</Text>
                        <TextInput
                            style={styles.input}
                            value={descricao}
                            onChangeText={Descricao => setDescricao(Descricao)}
                            maxLength={255}
                        ></TextInput>
                    </View>

                    {/* Select "Selecionar uma Categoria" */}
                    <View>
                        <Text style={styles.inputTitle}>Selecione uma Categoria*</Text>


                        <View style={styles.containerSelect}>
                            <Picker
                                selectedValue={idCategoria}
                                style={styles.select}
                                onValueChange={(itemValue) => setIdCategoria(itemValue)}
                            >
                                {categorias.map(option => (<Picker.Item key={option.id + 1} label={option.title} value={option.id} />))}
                            </Picker>
                        </View>

                    </View>


                </View>

                {/* Botão "Adicionar" */}
                <View style={{ width: vw(80), alignItems: 'flex-end' }}>
                    {palavra == "" || palavra == " " ? (<TouchableOpacity onPress={() => Alert.alert(
                        "InteliWords",
                        "O campo palavra precisa ser preenchido",
                        [
                          { text: "OK" }
                        ]
                      )} style={styles.btn}>
                        <Text style={styles.btnText}>Adicionar</Text>
                    </TouchableOpacity>) :
                        (<TouchableOpacity onPress={() => CadastrarPalavra()} style={styles.btn}>
                            <Text style={styles.btnText}>Adicionar</Text>
                        </TouchableOpacity>)}
                </View>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    inputTitle: {
        color: '#FA7B3B',
        fontSize: 22
    },

    input: {
        borderBottomColor: '#FA7B3B',
        borderBottomWidth: 2,
        height: 25,
        fontSize: 16,
        color: '#FFF',
    },

    containerSelect: {
        borderBottomColor: '#FA7B3B',
        borderBottomWidth: 2
    },

    select: {
        color: '#FA7B3B'
    },

    btn: {
        backgroundColor: '#FA7B3B',
        width: vw(35),
        height: vh(6),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        padding: 10
    },

    btnText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700'
    }
})