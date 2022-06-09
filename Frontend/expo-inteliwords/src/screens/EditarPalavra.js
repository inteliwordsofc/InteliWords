import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { vw, vh } from 'react-native-expo-viewport-units';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function EditarPalavra2({ navigation }) {

    const [idCategoria, setIdCategoria] = useState(0);
    const [categorias, setCategorias] = useState([]);
    const [carregar, setCarregar] = useState(true);
    const [dadosPalavra, setDadosPalavra] = useState([]);
    const [palavra, setPalavra] = useState("");
    const [definicao, setDefinicao] = useState("");
    const [descricao, setDescricao] = useState("");
    const [idPalavra, setIdPalavra] = useState(0);

    const EditarPalavra = async (id) => {
        try {
            const palavraNova = {
                "idCategoria": idCategoria,
                "tituloPalavra": palavra,
                "definicao": definicao,
                "descricao": descricao,
                "aprendido": dadosPalavra.aprendido,
                "dataVerificacao": dadosPalavra.dataVerificacao
            }

            await api.put(`/PalavrasUsuarios/${id}`, palavraNova)
                .then(resposta => {
                    if (resposta.status === 204) {
                        setCarregar(true)
                        setIdCategoria(0)
                        setPalavra("")
                        setDefinicao("")
                        setDescricao("")
                        navigation.navigate("Home")
                        Alert.alert(
                            "InteliWords",
                            "Deslize para baixo para atualizar",
                            [
                              { text: "OK" }
                            ]
                          )

                    } else {
                        //console.log(resposta);
                    }
                })

        } catch (error) {
           //console.log(error);
        }
    }

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

    useEffect(async () => {
        if (carregar == true) {
            onLoad()
            carregarPalavra()
            setTimeout(function () { setCarregar(false) }, 1000)
        }
    });

    const carregarPalavra = async () => {
        const palavraSelecionadaString = await AsyncStorage.getItem("palavraSelecionada");
        const palavraSelecionadaInt = JSON.parse(palavraSelecionadaString)
        setIdPalavra(palavraSelecionadaInt)

        await api.get(`/PalavrasUsuarios/buscar/${palavraSelecionadaInt}`)
            .then(async (resposta) => {
                if (resposta.status === 200) {
                    setDadosPalavra(resposta.data)
                    setPalavra(dadosPalavra.tituloPalavra)
                    setIdCategoria(dadosPalavra.idCategoria)
                    setDefinicao(dadosPalavra.definicao)
                    setDescricao(dadosPalavra.descricao)
                } else {
                    //console.log(resposta);
                }
            })
            .catch((ex) => {
                //console.log(ex);
            })
    }

    return (
        // <View>
        //     <Text>Teste de Tela</Text>
        // </View>

        <View style={styles.main}>
            {/* Cabeçalho - Header */}
            < View style={styles.mainHeader} >
                <View style={styles.mainHeaderRow1}>
                    <View style={styles.mainHeaderRow}>
                        <TouchableOpacity onPress={() => navigation.navigate("Palavra")}>
                            <FontAwesomeIcon icon={faArrowLeft} size={30} color={"#FFF"} />
                        </TouchableOpacity>
                        <Text style={styles.mainHeaderText}> Editar Palavra</Text>
                    </View>
                </View>
            </View>
            {/* Corpo - Body - Section */}
            < View style={styles.mainBody} >
                <View style={styles.container}>
                    <View >
                        <Text style={styles.TextTitulo}>Palavra</Text>
                        <TextInput
                            style={[styles.Input, styles.TextBody]}
                            value={palavra}
                            onChangeText={Palavra => setPalavra(Palavra)}
                            maxLength={80} />
                    </View>
                    <View>
                        <Text style={styles.TextTitulo}>Definição</Text>
                        <TextInput
                            style={[styles.Input, styles.TextBody]}
                            value={definicao}
                            onChangeText={Definicao => setDefinicao(Definicao)}
                            maxLength={255} />
                    </View>
                    <View>
                        <Text style={styles.TextTitulo}>Descrição</Text>
                        <TextInput
                            style={[styles.Input, styles.TextBody]}
                            value={descricao}
                            onChangeText={Descricao => setDescricao(Descricao)}
                            maxLength={255} />
                    </View>
                    <View>
                        <Text style={styles.TextTitulo}>Categoria</Text>
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
            </View>

            <View style={{ width: vw(100), alignItems: 'center', marginBottom: 20 }}>
                <View style={styles.containerBotoes}>
                    {/* Botão de Editar */}
                    <TouchableOpacity onPress={() => EditarPalavra(idPalavra)} style={styles.buttonEdit} >
                        <Text style={styles.buttonEditText}>Editar</Text>
                    </TouchableOpacity>
                </View>
            </View>


        </View>

    )
}

const styles = StyleSheet.create({
    // conteúdo da main
    main: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    // cabeçalho
    mainHeader: {
        flex: 0.9,
        backgroundColor: '#292929',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainHeaderRow1: {
        width: vw(80),
        //backgroundColor: 'red',
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mainHeaderRow: {
        //backgroundColor: 'red',
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    // texto do cabeçalho
    mainHeaderText: {
        marginLeft: 10,
        fontSize: 24,
        letterSpacing: 2,
        color: '#FFF',
        //fontFamily: 'Open Sans',
    },
    // conteúdo do body
    mainBody: {
        flex: 3,
        padding: 20,
    },
    container: {
        height: vh(60),
        alignItems: 'flex-start',
        justifyContent: 'space-around',
    },
    TextTitulo: {
        color: '#FA7B3B',
        fontSize: 24,
    },

    containerStatus: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },

    TextBody: {
        color: '#000',
        fontSize: 22,
        fontWeight: "300"
    },

    containerBotoes: {
        width: vw(80),
        // backgroundColor: '#00FF00',
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },

    buttonEdit: {
        backgroundColor: '#FA7B3B',
        width: vw(30),
        height: vh(7),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7
    },

    buttonEditText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold'
    },

    Input: {
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        width: vw(80),
        padding: 0
    },

    containerSelect: {
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        width: vw(80)
    },

    select: {
        color: '#000'
    },
})
// }