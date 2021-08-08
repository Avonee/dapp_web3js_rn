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

const Send: () => Node = (props) => {
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
    const [otherAddress, setOtherAddress] = useState("");
    const [value, setValue] = useState(0);
    const [hash, setHash] = useState("");


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

        console.log("拿到？", user_accountGet)
    }

    const walletBalance = () => {
        web3.eth.getBalance(address).then((result) => {
            setBalance(Web3.utils.fromWei(result, 'ether'));
        })
    }

    const transferEth = () => {
        // const Tx = require('ethereumjs-tx').Transaction
        // const privateKey = Buffer.from(myPrivateKey, 'hex');
        // web3.eth.getTransactionCount(address).then(_nonce => {

        //   console.log("value: " + value);
        //   console.log("text: " + otherAddress);

        //   const money = web3.utils.toWei(value.toString(), 'ether')
        //   console.log("money: " + money);
        //   console.log("hexmoney: " + web3.utils.toHex(money));

        //   const txParams = {
        //     gasPrice: web3.utils.toHex(20000000000),
        //     gasLimit: web3.utils.toHex(2300000),
        //     to: otherAddress,
        //     from: address,
        //     nonce: web3.utils.toHex((_nonce)),
        //     value: web3.utils.toHex(money)
        //   };

        //   const tx = new Tx(txParams, { 'chain': 'ropsten' });

        //   tx.sign(privateKey); // Transaction Signing here

        //   const serializedTx = tx.serialize();

        //   web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).then((result) => {
        //     console.log(result);
        //     setHash(result.transactionHash);

        //   })

        //   walletBalance()

        // })
    }

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', async () => {
            console.log("!!!!!!!!!")
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


                    <Section title="From Account">
                        {/* Edit <Text style={styles.highlight}>App.js</Text> to change this
               screen and then come back to see your edits. */}

                        <Text>Address : {address === "" ? "no account" : address}</Text>

                    </Section>

                    <Section title="Wallet Balance">
                        <Text style={styles.text}> {address === "" ? "no account" : balance + " ETH"}</Text>
                    </Section>

                    <Section title="Transaction">
                        <Text style={styles.text}>Network Fee</Text>
                        {/* choose high low  */}
                    </Section>
                    <TextInput style={styles.inputText} placeholder="Recipient address" onChangeText={(otherAddress) => { setOtherAddress(otherAddress) }}></TextInput>
                    <TextInput style={styles.inputText} placeholder="Amount" onChangeText={(value) => { setValue(value) }}></TextInput>
                    <TouchableOpacity style={[styles.sendButton, { marginLeft: 30 }]} onPress={() => { transferEth() }}>
                        <Text style={styles.buttonText}>交易ETH</Text>
                    </TouchableOpacity>
                    {hash !== '' ? <Text style={styles.text}>交易hash值：{hash}</Text> : <Text></Text>}


                    {/* 
             <Section title="Debug">
               <DebugInstructions />
             </Section>
             <Section title="Learn More">
               Read the docs to discover what to do next:
             </Section>
             <LearnMoreLinks /> */}
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

export default Send;
