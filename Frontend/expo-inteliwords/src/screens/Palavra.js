import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Modal } from 'react-native';
import { vw, vh } from 'react-native-expo-viewport-units';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faPen, faTrashCan, faCircle } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function EditarPalavra({ navigation }) {
    const [carregar, setCarregar] = useState(true);
    const [dadosPalavra, setDadosPalavra] = useState([]);
    const [dadosCategoria, setDadosCategoria] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    const irEditarPalavra = () => {
        navigation.navigate("EditarPalavra")
    }

    useEffect(async () => {
        if (carregar == true) {
            carregarPalavra()
            setTimeout(function () { setCarregar(false) }, 1000)
        }
    });

    const carregarPalavra = async () => {
        const palavraSelecionadaString = await AsyncStorage.getItem("palavraSelecionada");
        const palavraSelecionadaInt = JSON.parse(palavraSelecionadaString)

        await api.get(`/PalavrasUsuarios/buscar/${palavraSelecionadaInt}`)
            .then(async (resposta) => {
                if (resposta.status === 200) {
                    setDadosPalavra(resposta.data)
                    setDadosCategoria(resposta.data.idCategoriaNavigation)
                } else {
                    //console.log(resposta);
                }
            })
            .catch((ex) => {
                //console.log(ex);
            })
    }

    const ExcluirPalavra = async () => {

        try {
            setIsVisible(false)

            const palavraSelecionadaString = await AsyncStorage.getItem("palavraSelecionada");
            const palavraSelecionadaInt = JSON.parse(palavraSelecionadaString);
    
            api.delete(`/PalavrasUsuarios/${palavraSelecionadaInt}`)
                .then(resposta => {
                    if (resposta.status === 200) {
                        //console.log("Palavra Excluída")
                        navigation.navigate("Home")
                        alert('Arraste para baixo para recarregar.');
                    } else {
                        //console.log(resposta);
                    }
                })

        } catch (error) {
            //console.log(error);
        }

    }

    return (
        <View style={styles.main}>
            {/* Cabeçalho - Header */}
            < View style={styles.mainHeader} >
                <View style={styles.mainHeaderRow1}>
                    <View style={styles.mainHeaderRow}>
                        <TouchableOpacity onPress={() => navigation.navigate("TabBar")}>
                            <FontAwesomeIcon icon={faArrowLeft} size={30} color={"#FFF"} />
                        </TouchableOpacity>
                        <Text style={styles.mainHeaderText}> {dadosPalavra.tituloPalavra}</Text>
                    </View>
                    <Modal
                        animationType={'fade'}
                        transparent={true}
                        visible={isVisible}
                        onRequestClose={() => {
                            setIsVisible(false)
                        }}
                    >
                      <View style={styles.centeredView}>
                                <View style={styles.modalViewDesativar}>

                                    <Text style={styles.modalTextDesativar}>Você tem certeza que deseja excluir essa palavra?</Text>
                                    <View style={styles.botoes}>
                                        <TouchableOpacity
                                            onPress={() => setIsVisible(false)}
                                            style={[styles.button, styles.buttonCloseCancelar]}
                                        >
                                            <Text style={styles.textStyleCancelar}>Cancelar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => ExcluirPalavra()}
                                            style={[styles.button, styles.buttonCloseDesativar]}
                                        >
                                            <Text style={styles.textStyleCancelar}>Excluir</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                    </Modal>
                    <TouchableOpacity onPress={() => setIsVisible(true)}>
                        <FontAwesomeIcon icon={faTrashCan} size={30} color={"red"} />
                    </TouchableOpacity>
                </View>
            </View>
            {/* Corpo - Body - Section */}
            < View style={styles.mainBody} >
                <View style={styles.container}>
                    <View >
                        <Text style={styles.TextTitulo}>Status</Text>
                        <View style={styles.containerStatus}>
                            {dadosPalavra.aprendido ? <FontAwesomeIcon icon={faCircle} size={15} color={"green"} />
                                : <FontAwesomeIcon icon={faCircle} size={15} color={"red"} />}
                            <Text style={styles.TextBody}>{dadosPalavra.aprendido ? ' Aprendida' : ' A Revisar'}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.TextTitulo}>Definição</Text>
                        <Text style={styles.TextBody}>{dadosPalavra.definicao} </Text>
                    </View>
                    <View>
                        <Text style={styles.TextTitulo}>Descrição</Text>
                        <Text style={styles.TextBody}>{dadosPalavra.descricao}</Text>
                    </View>
                    <View>
                        <Text style={styles.TextTitulo}>Categoria</Text>
                        <Text style={styles.TextBody}>{dadosCategoria.tituloCategoria}</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => irEditarPalavra()}
                style={[styles.buttonMain, styles.menu]}
            >
                <FontAwesomeIcon icon={faPen} size={28} color={"#000"} />
            </TouchableOpacity>

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

    buttonText: {
        color: '#FFF',
        fontSize: 22,
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

    //botão
    buttonMain: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 15,
        right: 15,
    },

    menu: {
        backgroundColor: '#FE7B1D'
    },

    //Modal

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    button: {
        borderRadius: 7,
        padding: 10,
        elevation: 2
    },

    buttonCloseCancelar: {
        borderColor: "#FA7B3B",
        borderWidth: 2,
        backgroundColor: "transparent",
        width: vw(25),
        alignItems: "center",
        justifyContent: "center",
    },


    buttonCloseDesativar: {
        backgroundColor: "#B40000",
        width: vw(25),
        alignItems: "center",
        justifyContent: "center",

    },

    textStyleCancelar: {
        color: "#FFF",
        fontWeight: "700",
        textAlign: "center",
        fontSize: 16,
    },

    botoes: {
        flexDirection: 'row',
        width: vw(60),
        justifyContent: "space-between",
    },


    //modal 2
    modalViewDesativar: {
        width: vw(80),
        height: vh(40),
        backgroundColor: "#333333",
        borderRadius: 15,
        padding: 15,
        justifyContent: "space-evenly",
        alignItems: "center",
        shadowColor: "#000",
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

    modalTextDesativar: {
        color: "#FFF",
        fontSize: 22,
        fontWeight: "400",
        textAlign: "center",
    },
})