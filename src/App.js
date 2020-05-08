import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SignInScreen from './screens/SignInScreen';
import MainScreen from './screens/MainScreen';

const App = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Prisijungimas" component={SignInScreen} />
        <Stack.Screen name="Pagrindinis" component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
