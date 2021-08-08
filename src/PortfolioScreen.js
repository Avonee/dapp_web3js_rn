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
    Dimensions
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

const Portfolio: () => Node = (props) => {
    const DEFAULT_WIDTH = Dimensions.get('window').width
    const project_id = 'c4b99fb495c649eb941a34d91d8d7bd2'
    // const link = 'https://mainnet.infura.io/'
    const link = `https://ropsten.infura.io/v3/${project_id}`
    const localhost_address = 'http://127.0.0.1:8545'//'http://localhost:8545'
    const web3 = new Web3(
        new Web3.providers.HttpProvider(link)
    );

    const [address, setAddress] = useState("")
    const [myPrivateKey, setMyPrivateKey] = useState("")
    const [balance, setBalance] = useState(0);

    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const loadStorage = async () => {
        let user_accountGet = await StorageHelper.getMySetting('user_account')
        let user_privatekeyGet = await StorageHelper.getMySetting('user_privatekey')

        if (user_accountGet || (user_accountGet !== '')) {
            setAddress(user_accountGet)
            setMyPrivateKey(user_privatekeyGet)
        }
    }

    const saveToStorage = async (addressGet, privateKeyGet) => {
        try {
            await StorageHelper.setMySetting('user_account', addressGet)
            await StorageHelper.setMySetting('user_privatekey', privateKeyGet)

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

    const createWallet = () => {
        let web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider(link));
        const newWallet = web3.eth.accounts.wallet.create(1);
        const newAccount = newWallet[0];
        // console.log("newAccount????", newAccount);

        setAddress(newAccount.address)
        setMyPrivateKey(newAccount.privateKey)
        saveToStorage(newAccount.address, newAccount.privateKey)
    }

    const walletBalance = () => {
        web3.eth.getBalance(address).then((result) => {
            setBalance(Web3.utils.fromWei(result, 'ether'));
        })
    }

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', async () => {
            console.log("有")
            loadStorage()
            address == "" ? null : walletBalance()
        })

        return () => {
            unsubscribe
        }
    }, [address])

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={backgroundStyle}>
                {/* <Header /> */}
                <View
                    style={{
                        backgroundColor: isDarkMode ? Colors.black : Colors.white,
                    }}>


                    <Section title="My Wallet">
                        {/* Edit <Text style={styles.highlight}>App.js</Text> to change this
               screen and then come back to see your edits. */}

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
            </ScrollView>
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
    }
});

export default Portfolio;
