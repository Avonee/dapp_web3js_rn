/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    TouchableOpacity,
    TextInput,
    Dimensions,
    FlatList
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import '../shim'
import Web3 from 'web3';

import * as StorageHelper from '../helpers/StorageHelpers'

const Section = ({ children, title }): Node => {
    const isDarkMode = useColorScheme() === 'dark';
    return (
        <View style={styles.sectionContainer}>
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        color: isDarkMode ? Colors.white : '#00cccc',
                    },
                ]}>
                {title}
            </Text>
            <Text
                style={[
                    styles.sectionDescription,
                    {
                        color: isDarkMode ? Colors.light : 'gray',//Colors.dark,
                    },
                ]}>
                {children}
            </Text>
        </View>
    );
};

const MOCK_DATA = [{
    "id": 0,
    "user_account": "33333",
    "user_privatekey": "4444",
}]

const Portfolio: () => Node = (props) => {
    const DEFAULT_WIDTH = Dimensions.get('window').width
    const project_id = 'c4b99fb495c649eb941a34d91d8d7bd2'
    // const link = 'https://mainnet.infura.io/'
    const link = `https://ropsten.infura.io/v3/${project_id}`
    const localhost_address = 'http://127.0.0.1:8545'//'http://localhost:8545'
    const web3 = new Web3(
        new Web3.providers.HttpProvider(link)
    );

    const [userList, setUserList] = useState([])
    // const [address, setAddress] = useState("")
    // const [myPrivateKey, setMyPrivateKey] = useState("")
    // const [balance, setBalance] = useState(0);

    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const loadStorage = async () => {
        // let user_accountGet = await StorageHelper.getMySetting('user_account')
        // let user_privatekeyGet = await StorageHelper.getMySetting('user_privatekey')
        let user_ListsGet = await StorageHelper.getMySetting('user_wallet_lists')
        let user_ListsGetParse = JSON.parse(user_ListsGet)

        // if (user_accountGet || (user_accountGet !== '')) {
        //     setAddress(user_accountGet)
        //     setMyPrivateKey(user_privatekeyGet)
        // }


        if (user_ListsGetParse !== []) {
            let newArray = []

            user_ListsGetParse.forEach((thing) => {

                web3.eth.getBalance(thing.user_account).then((result) => {
                    // setBalance(Web3.utils.fromWei(result, 'ether'));
                    let aaa = Web3.utils.fromWei(result, 'ether')
                    console.log("餘額？？？", aaa)

                    let addOne = [{
                        "id": thing.id,
                        "user_account": thing.user_account,
                        "user_privatekey": thing.user_privatekey,
                        "user_balance": aaa ?? 0
                    }]

                    // TODO:
                    // newArray.push( )
                    newArray = newArray.concat(addOne)
                    // console.log("組合後？？？", newArray)
                    setUserList(newArray)

                })
            })


            // console.log("組合後？？？", newArray)
            // setUserList(newArray)
        }


    }

    const saveToStorage = async (addressGet, privateKeyGet, balanceGet) => {

        if (addressGet !== '' && privateKeyGet !== '') {

            let addOne = [{
                "id": (userList && userList.length === null || userList.length === 0 ? 0 : userList[userList.length - 1].id + 1),
                "user_account": addressGet,
                "user_privatekey": privateKeyGet ?? "",
                // "user_balance": balanceGet ?? 0
            }]

            let newList
            newList = userList.concat(addOne)

            try {
                // await StorageHelper.setMySetting('user_account', addressGet)
                // await StorageHelper.setMySetting('user_privatekey', privateKeyGet)
                await StorageHelper.setMySetting('user_wallet_lists', JSON.stringify(newList))

            } catch (err) {

                console.log(err)
                Alert.alert(
                    'saveToStorage 發生錯誤',
                    `${err} `,
                    [

                        {
                            text: 'OK', onPress: () => {
                                // props.navigation.navigate('TestLoginScreen')
                                console.log('OK Pressed')
                            }
                        },
                    ],
                    { cancelable: false }
                );

            }
        }
        await loadStorage()

    }

    const createWallet = () => {
        let web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider(link));
        const newWallet = web3.eth.accounts.wallet.create(1);
        const newAccount = newWallet[0];
        // console.log("newAccount????", newAccount);

        // setAddress(newAccount.address)
        // setMyPrivateKey(newAccount.privateKey)
        saveToStorage(newAccount.address, newAccount.privateKey)
    }

    // const walletBalance = (address) => {
    //     // console.log("acc!!!", address)
    //     web3.eth.getBalance(address).then((result) => {
    //         // setBalance(Web3.utils.fromWei(result, 'ether'));
    //         let aaa = Web3.utils.fromWei(result, 'ether')
    //         console.log("餘額？？？", aaa)
    //         return <Text ellipsizeMode='tail' numberOfLines={3} style={{ color: '#348b89', marginTop: 8, fontSize: 16, marginBottom: 8, marginLeft: 8 }}>

    //             {aaa.toString()}</Text>
    //     })
    // }

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', async () => {

            await loadStorage()
            // address == "" ? null : walletBalance()
        })

        return () => {
            unsubscribe
        }
    }, [userList])

    const renderBook = (a) => {
        return (
            <TouchableOpacity onPress={() => props.navigation.push('TransactionHistory', {})} underlayColor='yellow'>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.MainView}>

                        <View style={{ flex: 1 }}>

                            <Text ellipsizeMode='tail' numberOfLines={3} style={{
                                color: '#0a2641',
                                fontSize: 24, marginTop: 8,
                                marginLeft: 8
                            }}>
                                {a.user_account}
                            </Text>


                            <Text ellipsizeMode='tail' numberOfLines={3} style={{ color: '#348b89', marginTop: 8, fontSize: 16, marginBottom: 8, marginLeft: 8 }}>
                                {/* {walletBalance(a.user_account)} */}
                                {a.user_balance}
                            </Text>
                        </View>

                    </View>
                    <View style={styles.seperator} />

                </View >

            </TouchableOpacity>
        )

    }


    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

            <Section title="My Wallet">
                <Text>Address count : {userList.length}</Text>
            </Section>

            <TouchableOpacity onPress={() => createWallet()} style={{
                width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: '#00cccc',
                flexDirection: "row",
                // flex: 1,
                left: DEFAULT_WIDTH * 0.8,// DEFAULT_WIDTH * 0.61,
                right: 0,
                justifyContent: 'center',//'space-between',
                marginBottom: 70,
                marginTop: -60,
                // backgroundColor: 'red'

            }}>
                <Text style={[styles.buttonText, { color: '#00cccc' }]}>+</Text>
            </TouchableOpacity>

            <FlatList
                data={userList}
                renderItem={cases => renderBook(cases.item)}
                keyExtractor={cases => cases.id.toString()}
                style={{
                    backgroundColor:
                        'white',//'#008080'// '#00cccc'

                    marginBottom: 50,
                    marginTop: 15

                }}
            />

            {/* <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={backgroundStyle}>
                
                <View
                    style={{
                        backgroundColor: isDarkMode ? Colors.black : Colors.white,
                    }}>


                    <Section title="My Wallet">
                       

                        <Text>Address : {address === "" ? "no account" : address}</Text>

                    </Section>

                    <TouchableOpacity onPress={() => createWallet()} style={{
                        width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: '#00cccc',
                        flexDirection: "row", flex: 1,
                        left: DEFAULT_WIDTH * 0.8,// DEFAULT_WIDTH * 0.61,
                        right: 0,
                        justifyContent: 'center',//'space-between',
                        marginBottom: 70,
                        marginTop: address === "" ? -60 : -100,

                    }}>
                        <Text style={[styles.buttonText, { color: '#00cccc' }]}>+</Text>
                    </TouchableOpacity>

                    <Section title="Wallet Balance">
                        <Text style={styles.text}> {address === "" ? "no account" : balance + " ETH"}</Text>
                    </Section>
                    <TouchableOpacity onPress={() => props.navigation.push('TransactionHistory', {})} style={{
                        width: 300, height: 30, borderRadius: 14, borderWidth: 1, borderColor: '#00cccc',
                        flexDirection: "row", flex: 1,
                        left: 50,
                        right: 0,
                        justifyContent: 'center',//'space-between',
                        marginTop: 20


                    }}>
                        <Text style={[styles.buttonText, { color: '#00cccc' }]}>History</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView> */}
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    inputText: {
        width: 350,
        height: 40,
        textAlign: 'center',
        color: 'black',
        borderColor: '#00cccc',
        borderWidth: 1,
        borderRadius: 8,
        margin: 10,
        marginLeft: 30
    },
    sendButton: {
        width: 350,
        height: 40,
        backgroundColor: '#00cccc',
        borderRadius: 10,
        marginTop: 10,
        justifyContent: 'center'
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 20,
        color: 'white'
    },
    MainView: {
        height: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',//'#008080',//'#000000',//'#00cccc',//
        padding: 8,
        borderRadius: 10,
        width: Dimensions.get('window').width / 1.2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,

    },
    seperator: {
        height: 20,
        // backgroundColor: '#dddddd'
    },
});

export default Portfolio;
