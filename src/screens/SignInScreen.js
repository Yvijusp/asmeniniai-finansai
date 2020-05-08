import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-community/google-signin';

GoogleSignin.configure();

const SignInScreen = ({navigation}) => {
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const {user} = await GoogleSignin.signIn();

      navigation.replace('Pagrindinis', {user});
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <GoogleSigninButton onPress={signIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignInScreen;
