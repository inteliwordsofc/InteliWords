import React, { useEffect, useState, useCallback } from 'react'
import { View, RefreshControl, Text, StyleSheet, Image, SectionList, Modal, TextInput, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Animated, Alert } from 'react-native'
import { vw, vh } from 'react-native-expo-viewport-units';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faFolderPlus, faPencilAlt, faPlus, faClose } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';


export default function Home({ navigation }) {

    const [isVisible, setIsVisible] = useState(false);
    const [carregar, setCarregar] = useState(true);
    const [name, setName] = useState("");
    const [busca, setBusca] = useState("");
    const [photoUrl, setPhotoUrl] = useState('../assets/user.png');
    const [userId, setUserId] = useState("");
    const [idUsuario, setIdUsuario] = useState(0);
    const [idCategoriaSelecionada, setIdCategoriaSelecionada] = useState(0);
    const [novoNomeCategoria, setNovoNomeCategoria] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
    const [categoriasBuscadas, setCategoriasBuscadas] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isTeste, setTeste] = useState(false);

    const navegar = useNavigation();

    useEffect(async () => {
        VerificaAtualizacao();
        if (carregar === true) {
            buscarCategorias()
            setTimeout(function () { setCarregar(false) }, 1000)
        }
    });

    const tratarString = async (string, index) => {
        var valor = (string).slice(1);
        valor = (valor).slice(0, -1);
        valor = await (valor).split(",")[index];
        valor = await valor.split(":")[1]
        valor = await valor.slice(1)
        valor = await valor.slice(0, -1)
        valor = valor[0].toUpperCase() + valor.substr(1);
        return await valor
    }

    const tratarFoto = async (string, index) => {
        var valor = (string).slice(1);
        valor = (valor).slice(0, -1);
        valor = await (valor).split(",")[index];
        valor = await valor.split('"')[3]
        return await valor
    }

    const onLoad = async () => {
        try {
            setTeste(false)

            const storedValue = await AsyncStorage.getItem("userToken");
            //nome
            const nome = await tratarString(storedValue, 2)
            setName(nome)

            //id do google
            const userId = await tratarString(storedValue, 3)
            setUserId(userId)

            //foto
            const PhotoUrl = await tratarFoto(storedValue, 4);
            setPhotoUrl(PhotoUrl)

            //pega id do usuário
            await api.get(`/Usuarios/${userId}`)
                .then(async (resposta) => {
                    if (resposta.status === 200) {
                        setIdUsuario(resposta.data.idUsuario)
                    } else {
                        setErroMensagem(resposta);
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

    const VerificaAtualizacao = async () => {
        const Recarregar = await AsyncStorage.getItem("recarregar");
        const valorRecarregar = JSON.parse(Recarregar)
        if (valorRecarregar === true) {
            setCarregar(true)
            const recarregar = JSON.stringify(false);
            await AsyncStorage.setItem("recarregar", recarregar);
        }

    }

    const buscarCategorias = useCallback(async () => {
        await onLoad();
        await api.get(`/Categorias/${userId}`)
            .then(async (resposta) => {
                if (resposta.status === 200) {
                    setCategorias(resposta.data)
                    const token = JSON.stringify(categorias);
                    await AsyncStorage.setItem("categorias", token);
                    setCategoriasFiltradas(
                        categorias.map((c) => {
                            const categoriasOrganizadas = {};
                            categoriasOrganizadas.id = c.idCategoria
                            categoriasOrganizadas.title = c.tituloCategoria
                            categoriasOrganizadas.data = c.palavrasUsuarios.map(p => {
                                const palavrasOrganizadas = {};
                                palavrasOrganizadas.id = p.idPalavrasUsuario
                                palavrasOrganizadas.title = p.tituloPalavra
                                return palavrasOrganizadas;
                            })

                            return categoriasOrganizadas
                        }
                        )
                    )
                } else {
                    setErroMensagem(resposta);
                    //console.log(resposta);
                }
            })
            .catch((ex) => {
                //console.log(ex);
            })
    })

    const EditarCategoria = async () => {
        try {
            setIsVisible(false)

            const categoriaNova = {
                "idCategoria": idCategoriaSelecionada,
                "idUsuario": idUsuario,
                "tituloCategoria": novoNomeCategoria,
            }

            await api.put(`/Categorias/`, categoriaNova)
                .then(resposta => {
                    if (resposta.status === 204) {
                        setCarregar(true)
                        setIdCategoriaSelecionada(0)
                        setNovoNomeCategoria("")
                        //console.log("Editou!")

                    } else {
                        //console.log(resposta);
                        setNovoNomeCategoria("")
                    }
                })

        } catch (error) {
            //console.log(error);
        }
    }

    const ExcluirCategoria = async () => {
        try {
            setIsVisible(false)
            await api.delete(`/Categorias/${idCategoriaSelecionada}`)
                .then(resposta => {
                    if (resposta.status === 204) {
                        setCarregar(true)
                        setIdCategoriaSelecionada(0)
                        //console.log("Excluiu!")

                    } else {
                        //console.log(resposta);
                    }
                })

        } catch (error) {
            //console.log(error);
        }
    }

    const irPerfil = () => {
        navigation.navigate("Perfil")
    }
    const FiltrarCategorias = (Busca) => {
        setBusca(Busca)
        setCategoriasBuscadas(categoriasFiltradas.filter(c => c.title.includes(Busca)))
    }

    function FabButton(props) {


        const [isVisibleFab, setIsVisibleFab] = useState(false);
        const [categoria, setCategoria] = useState("");

        const navigation = useNavigation();

        const irAddPalavra = () => {
            navigation.navigate("AddPalavra")
        }

        const cadastrarCategoria = async () => {
            const categoriaNova = {
                "idUsuario": idUsuario,
                "tituloCategoria": categoria,
            }

            await api.post(`/Categorias/`, categoriaNova)
                .then(async (resposta) => {
                    if (resposta.status === 201) {
                        setCarregar(true)
                        setCategoria("")
                    } else {
                        setErroMensagem(resposta);
                        //console.log(resposta);
                    }
                })
                .catch((ex) => {
                    //console.log(ex);
                })
        }

        const animation = new Animated.Value(0);

        var open = 0;

        const toggleMenu = () => {
            const toValue = open ? 0 : 1

            Animated.spring(animation, {
                toValue,
                friction: 6,
                useNativeDriver: true
            }).start();

            open = !open;
        }

        const CategoriaNova = () => {
            cadastrarCategoria(),
                setIsVisibleFab(false)
        }


        const folderStyle = {
            transform: [
                { scale: animation },
                {
                    translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -60]
                    })
                }
            ]
        }

        const pencilStyle = {
            transform: [
                { scale: animation },
                {
                    translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -115]
                    })
                }
            ]
        }

        const rotation = {
            transform: [
                {
                    rotate: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "45deg"]
                    })
                }
            ]
        }


        return (
            <View style={[styles.containerFabButton, props.style, props.navigation]}>

                <TouchableWithoutFeedback onPress={() => irAddPalavra()}>
                    <Animated.View style={[styles.buttonMainFabButton, styles.subMenuFabButton, pencilStyle]}>
                        <FontAwesomeIcon icon={faPencilAlt} size={23} color={"#000"} />
                    </Animated.View>
                </TouchableWithoutFeedback>


                <Modal
                    animationType={'slide'}
                    transparent={true}
                    visible={isVisibleFab}
                    onRequestClose={() => {
                        setIsVisibleFab(false)
                    }}
                >
                    <View style={styles.containerModalFabButton}>
                        <View style={styles.modalFabButton}>

                            <View>
                                <Text style={{ width: 250, fontSize: 22, color: '#FA7B3B' }}>Nome da Categoria*</Text>

                                <TextInput style={{ color: '#FFF', borderBottomColor: '#FA7B3B', borderBottomWidth: 2, width: vw(65), fontSize: 18 }}
                                    value={categoria}
                                    onChangeText={Categoria => setCategoria(Categoria)}
                                    maxLength={255}
                                ></TextInput>
                            </View>

                            <Text style={{ color: '#FFF', width: vw(65),}}>*Campo obrigatório</Text>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    width: vw(65),
                                    justifyContent: 'space-between'
                                }}>
                                <TouchableOpacity onPress={() => { setIsVisibleFab(false) }} style={styles.btnCancelarFabButton}>
                                    <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700' }}>Cancelar</Text>
                                </TouchableOpacity>

                                {categoria == "" || categoria == " " ? (<TouchableOpacity onPress={() => Alert.alert(
                        "InteliWords",
                        "O campo categoria precisa ser preenchido",
                        [
                          { text: "OK" }
                        ]
                      )} style={styles.btnAdicionarFabButton}>
                                    <Text style={{ color: '#000', fontSize: 16, fontWeight: '700' }}>Adicionar</Text>
                                </TouchableOpacity>) :
                                    (<TouchableOpacity onPress={async () => { CategoriaNova() }} style={styles.btnAdicionarFabButton}>
                                        <Text style={{ color: '#000', fontSize: 16, fontWeight: '700' }}>Adicionar</Text>
                                    </TouchableOpacity>)}

                            </View>

                        </View>
                    </View>
                </Modal>


                <TouchableWithoutFeedback onPress={() => { setIsVisibleFab(true) }}>
                    <Animated.View style={[styles.buttonMainFabButton, styles.subMenuFabButton, folderStyle]}>
                        <FontAwesomeIcon icon={faFolderPlus} size={23} color={"#000"} />
                    </Animated.View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={toggleMenu}>
                    <Animated.View style={[styles.buttonMainFabButton, styles.menuFabButton, rotation]}>
                        <FontAwesomeIcon icon={faPlus} size={28} color={"#000"} />
                    </Animated.View>
                </TouchableWithoutFeedback>
            </View>
        )
    }

    const onRefresh = useCallback(() => {
        setBusca("");
        setRefreshing(true);
        setCarregar(true)
        setTimeout(function () { setRefreshing(false) }, 2000)
    }, [])

    const setarPalavra = async (idPalavraSelecionada) => {
        const idString = JSON.stringify(idPalavraSelecionada)
        await AsyncStorage.setItem("palavraSelecionada", idString)
        navegar.navigate("Palavra")
    }


    return (

        <View style={styles.container}>
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
                {/* View do Header */}
                <View style={styles.headerMaior}>
                    <View
                        style={styles.header}
                    >
                        <View
                            style={styles.txtHeader}
                        >
                            <Text allowFontScaling={true}
                                style={styles.txtUp}
                            >Bem-vindo(a),</Text>
                            <Text allowFontScaling={true}
                                style={styles.txtDown}
                            >{name.split(" ")[0]}</Text>
                        </View>
                        <TouchableOpacity onPress={() => irPerfil()}
                            style={styles.imgPerfil}
                        >
                            <Image source={{ uri: photoUrl }} style={styles.mainBodyHeader} />
                        </TouchableOpacity>

                    </View>
                </View>

                {/* View da Barra de Busca */}
                <View
                    style={styles.searchBar}
                >
                    {isTeste
                        ? <TextInput
                            allowFontScaling={true}
                            style={styles.searchInput}
                            value={busca}
                            onChangeText={Busca => FiltrarCategorias(Busca)}
                            maxLength={255}
                        ></TextInput>
                        : <TextInput
                            allowFontScaling={true}
                            style={styles.searchInputFalse}
                            value={busca}
                            onChangeText={Busca => FiltrarCategorias(Busca)}
                            maxLength={255}
                        >InteliWords</TextInput>
                    }
                    <TouchableOpacity style={styles.searchIcon} onPress={() => isTeste == true ? setTeste(false) : setTeste(true)}>
                        <FontAwesomeIcon icon={faSearch} size={28} color={"#FE7B1D"} />
                    </TouchableOpacity>
                </View>


                {/* View da Lista de Palavras */}
                <ScrollView
                    horizontal={true} >
                    <View>
                        <SectionList
                            sections={busca == '' || busca == ' ' ? categoriasFiltradas : categoriasBuscadas}
                            style={styles.scroll}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.row}>
                                    <TouchableOpacity onPress={() => setarPalavra(item.id)}>
                                        <Text allowFontScaling={true} style={styles.rowTxt}>
                                            {item.title}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            renderSectionHeader={({ section: { id, title } }) => (
                                <View style={styles.section}>

                                    <Modal
                                        animationType={'fade'}
                                        transparent={true}
                                        visible={isVisible}
                                        onRequestClose={() => {
                                            setIsVisible(false)
                                        }}
                                    >
                                        <View style={styles.containerModal}>
                                            <View style={styles.modal}>

                                                <View>
                                                    <Text style={{ width: vw(60), fontSize: 22, color: '#FA7B3B' }}>Nome da Categoria</Text>

                                                    <View style={styles.fechar}>
                                                        <TouchableOpacity onPress={() => setIsVisible(false)} >
                                                            <FontAwesomeIcon icon={faClose} size={28} color={'#FFF'} />
                                                        </TouchableOpacity>
                                                    </View>
                                                    <TextInput
                                                        style={{ color: '#FFF', borderBottomColor: '#FA7B3B', borderBottomWidth: 2, width: vw(60), fontSize: 18 }}
                                                        value={novoNomeCategoria}
                                                        onChangeText={NovoNome => setNovoNomeCategoria(NovoNome)}
                                                        maxLength={255}
                                                    ></TextInput>
                                                </View>

                                                <Text style={{ color: '#FFF', width: vw(60),}}>*Campo obrigatório</Text>

                                                <View
                                                    style={{
                                                        // backgroundColor: '#00FF00',
                                                        flexDirection: 'row',
                                                        width: vw(60),
                                                        justifyContent: 'space-between'
                                                    }}>
                                                    <TouchableOpacity onPress={() => ExcluirCategoria()} style={styles.btnCancelar}>
                                                        <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700' }}>Excluir</Text>
                                                    </TouchableOpacity>

                                                    {novoNomeCategoria == "" || novoNomeCategoria == " " ? (<TouchableOpacity onPress={() => Alert.alert(
                        "InteliWords",
                        "O campo novo nome precisa ser preenchido",
                        [
                          { text: "OK" }
                        ]
                      )} style={styles.btnAdicionarFabButton}>
                                                        <Text style={{ color: '#000', fontSize: 16, fontWeight: '700' }}>Editar</Text>
                                                    </TouchableOpacity>) :
                                                        (<TouchableOpacity onPress={async () => { EditarCategoria() }} style={styles.btnAdicionarFabButton}>
                                                            <Text style={{ color: '#000', fontSize: 16, fontWeight: '700' }}>Editar</Text>
                                                        </TouchableOpacity>)}
                                                </View>

                                            </View>
                                        </View>
                                    </Modal>

                                    <TouchableOpacity onPress={() => { setIsVisible(true), setIdCategoriaSelecionada(id) }}>
                                        <Text allowFontScaling={true} style={styles.sectionTxt}>
                                            {title}
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                            )}
                        />
                    </View>
                </ScrollView>
            </ScrollView>
            <FabButton style={{ bottom: 75, right: 45 }} />
        </View>

    )
}
const styles = StyleSheet.create({

    container: {
        height: '100%',
        backgroundColor: '#292929',
    },

    scroll: {
        flex: 1,
        width: vw(100)
    },

    headerMaior: {
        alignItems: 'center',
        //justifyContent: 'center',
        height: vh(25),
    },

    header: {
        width: vw(85),
        // backgroundColor: 'red',
        flex: 1,
        height: 155,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        //padding: 30,
    },

    txtHeader: {
    },

    txtUp: {
        fontSize: 34,
        color: '#FFF'
    },

    txtDown: {
        fontSize: 34,
        color: '#FE7B1D'
    },

    imgPerfil: {
        marginBottom: 15
    },

    mainBodyHeader: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },

    // ------------------------

    searchBar: {
        borderTopColor: '#000',
        borderTopWidth: 1,
        height: 50,
        // backgroundColor: '#151515',
        // backgroundColor: '#00FF00',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 30
    },

    searchInput: {
        fontSize: 16,
        borderBottomColor: '#FA7B3B',
        borderBottomWidth: 2,
        width: vw(70),
        color: '#FFF'
    },

    searchInputFalse: {
        fontSize: 16,
        borderBottomColor: 'transparent',
        borderBottomWidth: 2,
        width: vw(70),
        color: '#FFF'
    },

    searchIcon: {
    },

    // ------------------------

    row: {
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderBottomColor: '#DEDEDE',
        borderBottomWidth: 1,
        backgroundColor: '#FFF',
    },

    section: {
        backgroundColor: '#EFEEF0',
        borderBottomColor: '#DEDEDE',
        borderBottomWidth: 1,
        paddingHorizontal: 30,
        paddingVertical: 10
    },

    rowTxt: {
        color: '#000'
    },

    sectionTxt: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
        backgroundColor: '#EFEEF0'
    },

    // ----------------------------------

    containerModal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    modal: {
        width: vw(80),
        height: vh(40),
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

    fechar: {
        //backgroundColor: '#000',
        right: -15,
        bottom: 45,
        position: 'absolute',

    },

    btnCancelar: {
        backgroundColor: '#D90000',
        width: vw(27),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 7,
        padding: 10,
        elevation: 2,
    },

    btnAdicionar: {
        backgroundColor: "#FA7B3B",
        width: vw(27),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 7,
        padding: 10,
        elevation: 2
    },

    containerFabButton: {
        alignItems: 'center',
        position: 'absolute'
    },

    buttonMainFabButton: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },

    menuFabButton: {
        backgroundColor: '#FE7B1D'
    },

    subMenuFabButton: {
        width: 45,
        height: 45,
        borderRadius: 45 / 2,
        backgroundColor: '#FE7B1D'
    },

    containerModalFabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalFabButton: {
        width: vw(80),
        height: vh(40),
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

    textFabButton: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: '400',
        marginTop: 10
    },

    btnCancelarFabButton: {
        borderColor: "#FA7B3B",
        borderWidth: 2,
        backgroundColor: "transparent",
        width: vw(27),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 7,
        padding: 10,
        elevation: 2,
    },

    btnAdicionarFabButton: {
        backgroundColor: "#FA7B3B",
        width: vw(27),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 7,
        padding: 10,
        elevation: 2
    }
})