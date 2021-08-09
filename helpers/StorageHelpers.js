import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 
 * {string} user_account 
 * {string} user_privatekey 
 * {object} user_wallet_lists
 */

// export const setUserToken = (key, value)=>AsyncStorage.setItem(key,value)
export const getMySetting = (key) => AsyncStorage.getItem(key)
export const setMySetting = (key, value) => AsyncStorage.setItem(key, value)