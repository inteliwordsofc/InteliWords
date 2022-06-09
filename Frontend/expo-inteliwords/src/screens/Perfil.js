import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    Modal,
    TextInput,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { vw, vh } from 'react-native-expo-viewport-units';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';



//import AsyncStorage from '@react-native-async-storage/async-storage';
//import api from '../services/api';

export default class Perfil extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            novoNome: '',
            email: '',
            photoUrl: '../assets/user.png',
            isTeste: false,
            isVisible: false,
            userId: '',
            carregar: true
        };
    }

    componentDidMount() {
        this.VerificaAtualizacao()
        if (this.state.carregar === true) {
            this.onLoad();
            this.setState({ carregar: false })
        }
    }

    tratarString = async (string, index) => {
        var valor = (string).slice(1);
        valor = (valor).slice(0, -1);
        valor = await (valor).split(",")[index];
        valor = await valor.split(":")[1]
        valor = await valor.slice(1)
        valor = await valor.slice(0, -1)
        //console.log(valor)
        return await valor
    }

    tratarFoto = async (string, index) => {
        var valor = (string).slice(1);
        valor = (valor).slice(0, -1);
        valor = await (valor).split(",")[index];
        valor = await valor.split('"')[3]
        //console.log(valor)
        return await valor
    }


    onLoad = async () => {
        try {
            const storedValue = await AsyncStorage.getItem("userToken");

            //nome
            const nome = await this.tratarString(storedValue, 2)
            this.setState({ name: nome });
            this.setState({ novoNome: nome });

            //email
            const Email = await this.tratarString(storedValue, 1)
            this.setState({ email: Email });

            //foto
            const PhotoUrl = await this.tratarFoto(storedValue, 4);
            this.setState({ photoUrl: PhotoUrl });
            //console.log(this.state.photoUrl);

        } catch (error) {
            //console.log(error);
        }
    }

    VerificaAtualizacao = async () => {
        const Recarregar = await AsyncStorage.getItem("recarregar");
        const valorRecarregar = JSON.parse(Recarregar)

        if (valorRecarregar === true) {
            this.setState({ carregar: true });
            const recarregar = JSON.stringify(false);
            await AsyncStorage.setItem("recarregar", recarregar);
        }

    }

    DesativarConta = async () => {

        try {
            this.setState({ isVisible: false })

            const storedValue = await AsyncStorage.getItem("userToken");

            //userID
            const UserId = await this.tratarString(storedValue, 0);
            //console.log(UserId)


            api.patch(`/Usuarios/desativar/${UserId}`)
                .then(resposta => {
                    if (resposta.status === 200) {
                        this.Logout();
                        //console.log("Você vai sair daqui!")
                    } else {
                        setErroMensagem(resposta);
                        //console.log(resposta);
                    }
                })

        } catch (error) {
            //console.log(error);
        }

    }

    Logout = async () => {
        try {
            AsyncStorage.removeItem("userToken");
            this.props.navigation.navigate("Login");
        } catch (error) {
            //console.log(error);
        }
    }


    EditarDados = async () => {

        try {
            this.setState({ isTeste: false })

            const storedValue = await AsyncStorage.getItem("userToken");

            //userID
            const UserId = await this.tratarString(storedValue, 3);
            //console.log(UserId)

            api.patch(`/Usuarios/alterarnome/${UserId}?novoNome=${this.state.novoNome}`
            )
                .then(resposta => {
                    if (resposta.status === 200) {
                        api.get(`/Usuarios/${UserId}`)
                            .then(async (respostaUsuario) => {
                                if (respostaUsuario.status === 200) {
                                    const token = JSON.stringify(respostaUsuario.data);
                                    const recarregar = JSON.stringify(true);
                                    await AsyncStorage.setItem("recarregar", recarregar);
                                    await AsyncStorage.setItem("userToken", token);
                                    //console.log(this.state.novoNome)
                                } else {
                                    //console.log(respostaUsuario.data)
                                }

                            })
                            .catch((resposta) => {
                                setErroMensagem(resposta.data);
                            })

                    } else {
                        setErroMensagem(resposta);
                        //console.log(resposta);
                    }
                })

        } catch (error) {
            //console.log(error);
        }

    }

    render() {
        const { name, photoUrl, email, novoNome } = this.state;

        return (
            <View style={styles.main} >
                {/* Cabeçalho - Header */}
                < View style={styles.mainHeader} >
                    <View style={styles.mainHeaderRow}>
                        <Text style={styles.mainHeaderText}>Perfil</Text>
                        <Modal
                            animationType={'slide'}
                            transparent={true}
                            visible={this.state.isTeste}
                            onRequestClose={() => {
                                this.setState({ isTeste: false });
                            }}
                        >

                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>

                                    <Image
                                        source={{ uri: photoUrl }}
                                        style={styles.mainBodyImg}
                                    />

                                    <View style={styles.inputNome} >
                                        <Text style={styles.modalText}>Nome</Text>
                                        <TextInput
                                            value={novoNome}
                                            onChangeText={(name) => this.setState({ novoNome: name })}
                                            style={styles.input}></TextInput>
                                    </View>
                                    <View style={styles.botoes}>
                                        <TouchableOpacity
                                            style={[styles.button, styles.buttonCloseCancelar]}
                                            onPress={() => { this.setState({ isTeste: false }) }}
                                        >
                                            <Text style={styles.textStyleCancelar}>Cancelar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => { this.EditarDados() }}
                                            style={[styles.button, styles.buttonClose]}
                                        >
                                            <Text style={styles.textStyleEditar}>Editar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>

                        <TouchableOpacity
                            onPress={() => { this.setState({ isTeste: true }) }}
                        >
                            <FontAwesomeIcon icon={faPenToSquare} size={32} color={"#FA7B3B"} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Corpo - Body - Section */}
                < View 
                style={styles.mainBody} 
                >
                    <Image
                        source={{ uri: photoUrl }}
                        style={styles.mainBodyImg}
                    />
                    < View style={styles.mainBodyInfo} >
                        <Text style={[styles.mainBodyText, styles.textName]}>{name}</Text>
                        <Text style={styles.mainBodyText}>{email}</Text>
                        <Modal
                            animationType={'slide'}
                            transparent={true}
                            visible={this.state.isVisible}
                            onRequestClose={() => {
                                this.setState({ isVisible: false });
                            }}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalViewDesativar}>

                                    <Text style={styles.modalTextDesativar}>Você tem certeza que deseja desativar sua conta?</Text>
                                    <View style={styles.botoes}>
                                        <TouchableOpacity
                                            onPress={() => { this.setState({ isVisible: false }) }}
                                            style={[styles.button, styles.buttonCloseCancelar]}
                                        >
                                            <Text style={styles.textStyleCancelar}>Cancelar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => { this.DesativarConta() }}
                                            style={[styles.button, styles.buttonCloseDesativar]}
                                        >
                                            <Text style={styles.textStyleCancelar}>Desativar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>

                    </View >
                    <TouchableOpacity
                        onPress={() => { this.Logout() }}
                        style={[styles.btnLogout, styles.buttonDesativarConta]}>
                        <Text style={styles.btnLogoutText}>Sair</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { this.setState({ isVisible: true }) }}
                        style={[styles.btnDesativar, styles.btnLogout]}
                    >
                        <Text style={[styles.mainBodyText2]}>Desativar Conta</Text>
                    </TouchableOpacity>
                </View >
            </View >
        );
    }
}


const styles = StyleSheet.create({
    // conteúdo da main
    main: {
        flex: 1,
        backgroundColor: '#454545',
    },
    // cabeçalho
    mainHeader: {
        flex: 0.9,
        backgroundColor: '#292929',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainHeaderRow: {
        width: vw(80),
        //backgroundColor: 'red',
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    // texto do cabeçalho
    mainHeaderText: {
        fontSize: 24,
        letterSpacing: 2,
        color: '#FFF',
        //fontFamily: 'Open Sans',
    },

    buttonDesativarConta: {
        width: vw(50),
        height: vh(7),
        borderRadius: 7,
        backgroundColor: '#B40000',
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        color: '#FFF',
        fontSize: 22,
    },

    // conteúdo do body
    mainBody: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 10,
    },

    mainBodyInfo: {
        alignItems: 'center',
    },

    mainBodyImg: {
        backgroundColor: '#ccc',
        width:100,
        height: 100,
        borderRadius: 50,
    },

    mainBodyText: {
        color: '#BFBFBF',
        fontSize: 22,
        marginBottom: 20,
    },

    mainBodyText2: {
        alignItems: 'center',
        justifyContent: 'center',
        color: '#BFBFBF',
        fontSize: 20,
    },

    textName: {
        fontSize: 25,
        fontWeight:'bold',
    },
    // botão de logout
    btnLogout: {
        alignItems: 'center',
        justifyContent: 'center',
        width: vw(50),
        height: vh(6),
    },
    // texto do botão
    btnLogoutText: {
        fontSize: 22,
        //fontFamily: 'Open Sans',
        color: '#BFBFBF',
    },
    
    btnDesativar: {
        width: vw(50),
        height: vh(7),
        borderColor: '#BFBFBF',
        borderWidth: 1,
        borderRadius: 5,
    },

    //Modal

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    modalView: {
        width: vw(75),
        height: vh(50),
        backgroundColor: "#333333",
        borderRadius: 15,
        //padding: 20,
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

    foto: {
        position: 'absolute',
        marginTop: 33,
        justifyContent: 'center',
        alignItems: 'center'
    },

    button: {
        borderRadius: 7,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        //backgroundColor: "#F194FF",
    },
    buttonCloseCancelar: {
        borderColor: "#FA7B3B",
        borderWidth: 2,
        backgroundColor: "transparent",
        width: vw(27),
        alignItems: "center",
        justifyContent: "center",
    },

    buttonClose: {
        backgroundColor: "#FA7B3B",
        width: vw(27),
        alignItems: "center",
        justifyContent: "center",
    },

    buttonCloseDesativar: {
        backgroundColor: "#B40000",
        width: vw(27),
        alignItems: "center",
        justifyContent: "center",
    },

    textStyleCancelar: {
        color: "#FFF",
        fontWeight: "700",
        textAlign: "center",
        fontSize: 16,
    },
    textStyleEditar: {
        fontSize: 16,
        color: "#000",
        fontWeight: "700",
        textAlign: "center"
    },

    inputNome: {
        height: vh(9),
        justifyContent: "space-between",
    },

    modalText: {
        color: "#FFF",
        fontSize: 22,
        fontWeight: "400",
    },

    input: {
        borderBottomColor: '#FA7B3B',
        borderBottomWidth: 3,
        width: vw(60),
        color: '#FFF'
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

});