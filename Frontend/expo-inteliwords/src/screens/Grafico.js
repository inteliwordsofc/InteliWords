import React, { useEffect, useState, useCallback } from 'react';
import { View, RefreshControl, Text, StyleSheet, Image, Dimensions, LogBox } from 'react-native'
import { vw, vh } from 'react-native-expo-viewport-units';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from "react-native-chart-kit";
import api from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";


export default function Grafico({ navigation }) {

    const [photoUrl, setPhotoUrl] = useState('../assets/user.png');
    const [userId, setUserId] = useState("");
    const [listaPalavras, setListaPalavras] = useState([]);
    const [palavrasDia, setPalavrasDia] = useState([]);
    const [Datas, setDatas] = useState([]);
    const [carregar, setCarregar] = useState(true);
    const [isTeste, setTeste] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [expanded, setExpanded] = useState(false);


    useEffect(async () => {
        if (carregar === true) {
            await onLoad();
            buscarDados();
            setTimeout(function () { setCarregar(false) }, 1000)
        }
    });

    const tratarFoto = async (string, index) => {
        var valor = (string).slice(1);
        valor = (valor).slice(0, -1);
        valor = await (valor).split(",")[index];
        valor = await valor.split('"')[3]
        return await valor
    }

    const tratarString = async (string, index) => {
        var valor = (string).slice(1);
        valor = (valor).slice(0, -1);
        valor = await (valor).split(",")[index];
        valor = await valor.split(":")[1]
        valor = await valor.slice(1)
        valor = await valor.slice(0, -1)
        return await valor
    }

    const onLoad = async () => {
        try {
            const storedValue = await AsyncStorage.getItem("userToken");

            //foto
            const photoUrl = await tratarFoto(storedValue, 4);
            setPhotoUrl(photoUrl)


            //id do google
            const userId = await tratarString(storedValue, 3)
            setUserId(userId)


        } catch (error) {
            //console.log(error);
        }
    }

    const irPerfil = () => {
        buscarDados()
    }

    function dataAtualFormatada(data, days) {
        const mes = data.getMonth() + 1
        let dias = [];
        let novoDia = "";

        for (let day in days) {
            for (var x = 0; x < 8; x++) {
                switch (days[day]) {
                    case 31:
                        if ((mes - 1) === 0) {
                            novoDia = `${days[day].toString().padStart(2, '0')}/12`
                        } else {
                            novoDia = `${days[day].toString().padStart(2, '0')}/${(mes - 1).toString().padStart(2, '0')}`
                        }
                        break;
                    case 30:
                        if ((mes - 1) === 0) {
                            novoDia = `${days[day].toString().padStart(2, '0')}/12`
                        } else {
                            novoDia = `${days[day].toString().padStart(2, '0')}/${(mes - 1).toString().padStart(2, '0')}`
                        }
                        break;
                    case 29:
                        if ((mes - 1) === 0) {
                            novoDia = `${days[day].toString().padStart(2, '0')}/12`
                        } else {
                            novoDia = `${days[day].toString().padStart(2, '0')}/${(mes - 1).toString().padStart(2, '0')}`
                        }
                        break;
                    case 28:
                        if ((mes - 1) === 0) {
                            novoDia = `${days[day].toString().padStart(2, '0')}/12`
                        } else {
                            novoDia = `${days[day].toString().padStart(2, '0')}/${(mes - 1).toString().padStart(2, '0')}`
                        }
                        break;
                    case 27:
                        if ((mes - 1) === 0) {
                            novoDia = `${days[day].toString().padStart(2, '0')}/12`
                        } else {
                            novoDia = `${days[day].toString().padStart(2, '0')}/${(mes - 1).toString().padStart(2, '0')}`
                        }
                        break;
                    case 26:
                        if ((mes - 1) === 0) {
                            novoDia = `${days[day].toString().padStart(2, '0')}/12`
                        } else {
                            novoDia = `${days[day].toString().padStart(2, '0')}/${(mes - 1).toString().padStart(2, '0')}`
                        }
                        break;
                    case 25:
                        if ((mes - 1) === 0) {
                            novoDia = `${days[day].toString().padStart(2, '0')}/12`
                        } else {
                            novoDia = `${days[day].toString().padStart(2, '0')}/${(mes - 1).toString().padStart(2, '0')}`
                        }
                    case 24:
                        if ((mes - 1) === 0) {
                            novoDia = `${days[day].toString().padStart(2, '0')}/12`
                        } else {
                            novoDia = `${days[day].toString().padStart(2, '0')}/${(mes - 1).toString().padStart(2, '0')}`
                        }
                        break;
                    case 23:
                        if ((mes - 1) === 0) {
                            novoDia = `${days[day].toString().padStart(2, '0')}/12`
                        } else {
                            novoDia = `${days[day].toString().padStart(2, '0')}/${(mes - 1).toString().padStart(2, '0')}`
                        }
                        break;

                    default:
                        novoDia = `${days[day].toString().padStart(2, '0')}/${(mes).toString().padStart(2, '0')}`
                        break;
                }
            }
            dias.push(novoDia);
        }

        return dias;
    }

    const arrumarData = (data) => {
        const dia = data.getDate()
        const mes = data.getMonth() + 1


        const trintaUmDias = [31, 30, 29, 28, 27, 26]
        const trintaDias = [30, 29, 28, 27, 26, 25]
        const vinteOitoDias = [28, 27, 26, 25, 24, 23]

        const diasArrumados = [1, 2, 3, 4, 5, 6]
        let y = 6;

        const semana = [
            data.getDate(),
            data.getDate() - 1,
            data.getDate() - 2,
            data.getDate() - 3,
            data.getDate() - 4,
            data.getDate() - 5,
            data.getDate() - 6,
        ]

        if (mes === 2 || mes === 4 || mes === 6 || mes === 8 || mes === 9 || mes === 11 || mes === 1) {

            for (var x = 1; x < 6; x++) {
                if (dia === diasArrumados[x]) {
                    for (var z = diasArrumados[x] - 1; z < 6; z++) {
                        semana[y] = trintaUmDias[y - 3]
                        y--;
                    }
                }
            }
            return semana;
        }
        else if (mes === 3) {
            for (var x = 1; x < 6; x++) {
                if (dia === diasArrumados[x] - 1) {
                    for (var z = diasArrumados[z]; z < 6; z++) {
                        semana[y] = vinteOitoDias[y - 3]
                        y--;
                    }
                }
            }
            return semana;
        }
        else {
            for (var x = 1; x < 6; x++) {
                if (dia === diasArrumados[x] - 1) {
                    for (var z = diasArrumados[x]; z < 6; z++) {
                        semana[y] = trintaDias[y - 3]
                        y--;
                    }
                }
            }
            return semana;
        }

    }

    const buscarDados = async () => {

        try {

            api.get(`/PalavrasUsuarios/${userId}`)
                .then(resposta => {
                    if (resposta.status === 200) {

                        const info = resposta.data

                        const dataAtual = new Date();

                        setListaPalavras(info.map((p) => {
                            const lista = {};
                            lista.id = p.idPalavrasUsuario
                            lista.data = new Date(p.dataVerificacao).getDate()
                            lista.tituloPalavra = p.tituloPalavra
                            return lista;
                        }
                        ));

                        const semana = arrumarData(dataAtual)

                        const PalavrasDia = [
                            (listaPalavras.filter(p => p.data == semana[6])).length,
                            (listaPalavras.filter(p => p.data == semana[5])).length,
                            (listaPalavras.filter(p => p.data == semana[4])).length,
                            (listaPalavras.filter(p => p.data == semana[3])).length,
                            (listaPalavras.filter(p => p.data == semana[2])).length,
                            (listaPalavras.filter(p => p.data == semana[1])).length,
                            (listaPalavras.filter(p => p.data == semana[0])).length
                        ]
                        setPalavrasDia(PalavrasDia)

                        const dias = dataAtualFormatada(dataAtual, semana);
                        setDatas(dias)
                    } else {
                        setErroMensagem(resposta);
                        console.log(resposta);
                    }
                }).catch((ex) => {
                    console.log(ex);
                })

        } catch (error) {
            console.log(error);
        }

    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setCarregar(true)
        setTimeout(function () { setRefreshing(false) }, 2000)
    }, [])

    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const dataAtual = new Date();
    let mesAtual = meses[dataAtual.getMonth()];

    return (
        <View>
            <ScrollView
                style={styles.main}
                scrollEnabled={true}
                horizontal={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {/* Cabeçalho - Header */}
                <View style={styles.mainHeader}>
                    <View style={styles.mainHeaderRow}>
                        <Text style={styles.mainHeaderText}>Gráfico de Desempenho</Text>
                        <TouchableOpacity onPress={() => irPerfil()}>
                            <Image
                                source={{ uri: photoUrl }}
                                style={styles.mainBodyHeader}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Corpo - Body - Section */}
                <View style={styles.mainBody}>

                    {/* Gráfico */}
                    {Datas.length == 0 || palavrasDia.length == 0 ? (<View></View>) :
                        (
                            <LineChart
                                data={{
                                    labels: Datas.reverse(),
                                    datasets: [
                                        {
                                            data: palavrasDia,
                                            color: (opacity = 1) => `rgba(254, 123, 29, ${opacity})`, // optional
                                        }
                                    ],
                                    legend: [`${mesAtual}`]
                                }}
                                width={Dimensions.get("window").width}
                                height={400}
                                chartConfig={{
                                    backgroundGradientFromOpacity: 0,
                                    backgroundGradientToOpacity: 0,
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    barPercentage: 0.5,
                                    decimalPlaces: 1,
                                    //useShadowColorFromDataset: false,
                                }}
                                style={{
                                    borderRadius: 16
                                }}
                            />
                        )}


                    <View>
                        <Collapse
                            style={styles.container}
                            isExpanded={expanded}
                            onToggle={(isExpanded) => setExpanded(isExpanded ? true : false)}>
                            <CollapseHeader style={styles.headerColapser}
                            >
                                <Text style={{ fontSize: 22, color: '#FFF', textAlign: 'justify' }}><FontAwesomeIcon icon={faCircleQuestion} size={28} color={'#FFF'} />  Sobre</Text>
                            </CollapseHeader>
                            <CollapseBody style={styles.body} >
                                <Text style={{ fontSize: 19, color: '#FFF', textAlign: 'center', width: vw(100) }}>Este gráfico apresenta o número de palavras aprendidas por você em cada dia ao decorrer de uma semana.</Text>
                            </CollapseBody>
                        </Collapse>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.']);

const styles = StyleSheet.create({
    // conteúdo da main
    main: {
        //flex: 1,
        backgroundColor: '#454545',
    },
    // cabeçalho
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

    // conteúdo do body
    mainBody: {
        //flex: 3,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        padding: 10,
        //backgroundColor: "red",
        height: vh(90),
        padding: 4
    },
    modal: {
        left: 25,
        bottom: 40,
        // backgroundColor: 'red',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: "center"
    },

    //modal

    containerModalFabButton: {
        flex: 1,
    },
    //Colapsar

    container: {
        width: vw(100),
    },
    headerColapser: {
        // backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    body: {
        backgroundColor: '#292929',
    },

});