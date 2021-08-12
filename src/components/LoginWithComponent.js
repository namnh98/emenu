import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {colors} from '../assets';
import I18n from '../i18n';

const LoginWithComponent = () => {
  const _onLoginFacebook = () => {};
  const _onLoginTwitter = () => {};
  const _onLoginGoogle = () => {};
  const _onLoginFinger = () => {};

  return (
    <View style={[styles.footerWrapper, styles.itemCenter]}>
      <Text style={styles.titleFooter}>{I18n.t('login.loginWith')}</Text>

      <View style={styles.loginWithWrapper}>
        <TouchableOpacity onPress={_onLoginFacebook} style={styles.buttonWidth}>
          <Entypo
            name="facebook-with-circle"
            size={40}
            color={colors.FACEBOOK}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={_onLoginTwitter} style={styles.buttonWidth}>
          <Entypo name="twitter-with-circle" size={40} color={colors.TWITTER} />
        </TouchableOpacity>

        <TouchableOpacity onPress={_onLoginGoogle} style={styles.buttonWidth}>
          <FontAwesome
            name="google-plus-circle"
            size={45}
            color={colors.GOOGLE}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={_onLoginFinger} style={styles.buttonFinger}>
          <MaterialCommunityIcons name="fingerprint" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginWithComponent;

const styles = StyleSheet.create({
  itemCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerWrapper: {
    flex: 1.5,
  },
  loginWithWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonFinger: {
    backgroundColor: colors.PRIMARY,
    padding: 4,
    borderRadius: 30,
  },
  buttonWidth: {
    marginRight: 15,
  },
  titleFooter: {
    fontSize: 16,
    color: 'white',
  },
});
