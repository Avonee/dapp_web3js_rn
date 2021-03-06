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

import { Picker } from '@react-native-picker/picker';

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
    const fetchGasPriceUrl = "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken"
    const project_id = 'c4b99fb495c649eb941a34d91d8d7bd2'
    // const link = 'https://mainnet.infura.io/'
    // const link = `https://ropsten.infura.io/v3/${project_id}`
    const link = `https://rinkeby.infura.io/v3/${project_id}`
    const localhost_address = 'http://127.0.0.1:8545'//'http://localhost:8545'
    const web3 = new Web3(
        new Web3.providers.HttpProvider(link)
    );
    const [fetchSelectedGasPrice, setFetchSelectedGasPrice] = useState([]);
    const [selectedGasPrice, setSelectedGasPrice] = useState("choose below");
    const [address, setAddress] = useState("")
    const [address2, setAddress2] = useState("")
    const [myPrivateKey, setMyPrivateKey] = useState("")
    const [balance, setBalance] = useState(0);
    // const [otherAddress, setOtherAddress] = useState("");
    const [value, setValue] = useState(0);
    const [hash, setHash] = useState("");
    // const [gasPriceGet, setGasPriceGet] = useState(0)

    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const loadStorage = async () => {
        // let user_accountGet = await StorageHelper.getMySetting('user_account')
        // let user_privatekeyGet = await StorageHelper.getMySetting('user_privatekey')

        // if (user_accountGet || (user_accountGet !== '')) {
        //     setAddress(user_accountGet)
        //     setMyPrivateKey(user_privatekeyGet)
        // }

        // console.log("?????????", user_accountGet)

        let user_ListsGet = await StorageHelper.getMySetting('user_wallet_lists')
        let user_ListsGetParse = JSON.parse(user_ListsGet)

        // take 1st address to send
        if (user_ListsGetParse !== []) {
            // console.log("1111111", user_ListsGetParse[0])
            setAddress(user_ListsGetParse[0].user_account)
            setMyPrivateKey(user_ListsGetParse[0].user_privatekey)

            walletBalance(user_ListsGetParse[0].user_account)

            if (user_ListsGetParse.length >= 2) {
                setAddress2(user_ListsGetParse[1].user_account)
                // setMyPrivateKey2(user_ListsGetParse[1].user_privatekey)

            }

        }


    }

    const walletBalance = (address) => {
        web3.eth.getBalance(address).then((result) => {
            // console.log("????????????!!!???", result) // '1000000000000000'
            let aaa = Web3.utils.fromWei(result, 'ether')
            // console.log("????????????", aaa) // '0.001'
            setBalance(aaa);
        })
    }

    const transferEth = () => {
        const Tx = require('ethereumjs-tx').Transaction

        const privatekeyrModify = myPrivateKey.substring(2);
        const privateKey = Buffer.from(privatekeyrModify, 'hex');
        web3.eth.getTransactionCount(address).then(_nonce => {

            console.log("value: " + value);
            console.log("text: " + address2);

            const money = web3.utils.toWei(value.toString(), 'ether')
            console.log("money: " + money);
            console.log("hexmoney: " + web3.utils.toHex(money));

            const txParams = {
                gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),// TODO: selectedGasPrice //but no money so hard code temprary
                gasLimit: web3.utils.toHex(21000),
                to: address2,
                from: address,
                nonce: web3.utils.toHex((_nonce)),
                value: web3.utils.toHex(money)
            };

            // { 'chain': 'ropsten' }
            // { 'chain': 'rinkeby' }
            const tx = new Tx(txParams, { 'chain': 'rinkeby' });

            tx.sign(privateKey); // Transaction Signing here

            const serializedTx = tx.serialize();

            web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).then((result) => {
                console.log(result);
                setHash(result.transactionHash);

            })

            walletBalance(address)

        })
    }

    const fetchGasPrice = async () => {
        const options = {
            method: 'GET',
            // headers: {

            // },

        };

        let response = await fetch(fetchGasPriceUrl, options)
        if (response.status == 200) {
            let responseData = await response.json()
            if (responseData) {
                // console.log("uuuuuuuuu!!!!!!",
                //     responseData.result.SafeGasPrice,
                //     responseData.result.ProposeGasPrice,
                //     responseData.result.FastGasPrice
                // )
                setFetchSelectedGasPrice([responseData.result.FastGasPrice, responseData.result.ProposeGasPrice, responseData.result.SafeGasPrice])
            }

        } else {
            console.log("fetch gas price err!!!")
        }

    }

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', async () => {
            // console.log("!!!!!!!!!")

            // gasprice = await web3.eth.getGasPrice()
            // let gaspriceConvert = Web3.utils.fromWei(gasprice, 'gwei')
            // // console.log("?????????getGasPrice???", aaa)
            // setGasPriceGet(gaspriceConvert)

            // fetch gasPrice high low normal
            await fetchGasPrice()
            await loadStorage()
        })

        return () => {
            unsubscribe
        }
    }, [balance])

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
                        {/* <Text style={styles.text}>Network Fee???{gasPriceGet} Gwei</Text> */}
                        <Text style={styles.text}>Network Fee???{selectedGasPrice} Gwei</Text>
                    </Section>

                    <Picker
                        selectedValue={selectedGasPrice}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedGasPrice(itemValue)
                        }>
                        <Picker.Item label="High" value={fetchSelectedGasPrice[0]} />
                        <Picker.Item label="Average" value={fetchSelectedGasPrice[1]} />
                        <Picker.Item label="Low" value={fetchSelectedGasPrice[2]} />
                    </Picker>

                    {/* <TextInput style={styles.inputText} placeholder="Recipient address" onChangeText={(otherAddress) => { setOtherAddress(otherAddress) }}></TextInput> */}
                    <TextInput style={styles.inputText} placeholder="Recipient address" value={address2}></TextInput>

                    <TextInput style={styles.inputText} placeholder="Amount" onChangeText={(value) => { setValue(value) }}></TextInput>
                    <TouchableOpacity style={[styles.sendButton, { marginLeft: 30 }]} onPress={() => { transferEth() }}>
                        <Text style={styles.buttonText}>??????ETH</Text>
                    </TouchableOpacity>
                    {hash !== '' ? <Text style={styles.text}>??????hash??????{hash}</Text> : <Text></Text>}


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
