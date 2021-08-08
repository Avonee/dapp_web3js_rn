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
  Image
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import './shim'

import Portfolio from './src/PortfolioScreen';
import TransactionHistory from './src/TransactionHistory';
import Send from './src/SendScreen';

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

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  function portfolioStack() {
    return (
      <Stack.Navigator
        initialRouteName='Portfolio'
        headerMode='none'
        screenOptions={{
          headerStyle: { backgroundColor: '#00cccc' },
          headerTintColor: 'white',
          headerBackTitle: '返回'
        }}
      >
        <Stack.Screen name="Portfolio" component={Portfolio} />
        <Stack.Screen name="TransactionHistory" component={TransactionHistory} />
      </Stack.Navigator>
    )
  }

  function sendStack() {
    return (
      <Stack.Navigator
        initialRouteName='Send'
        headerMode='none'
        screenOptions={{
          headerStyle: { backgroundColor: '#00cccc' },
          headerTintColor: 'white',
          headerBackTitle: '返回'
        }}
      >
        <Stack.Screen name="Send" component={Send} />
      </Stack.Navigator>
    )
  }


  return (

    <NavigationContainer>

      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            let iconUri;
            if (route.name == 'Transaction') {
              iconUri = 'https://cdn.iconscout.com/icon/premium/png-512-thumb/wallet-224-207902.png';
            }
            else if (route.name == 'Portfolio') {
              iconUri = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJDn0ojTITvcdAzMsfBMJaZC4STaDHzduleQ&usqp=CAU';

            }
            return <Image source={{ uri: iconUri }} style={{ width: 25, height: 25 }} />
          },
          tabBarActiveTintColor: '#00cccc',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: [
            {
              display: 'flex'
            }
          ]

        })}
      >
        <Tab.Screen name="Portfolio" component={portfolioStack} />
        <Tab.Screen name="Send" component={sendStack} />
      </Tab.Navigator>
    </NavigationContainer>

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
});

export default App;
