import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { colors, images } from '../assets';
import { NOTIFICATION, USER_DETAIL } from '../navigators/ScreenName';

const HeaderHome = ({ onMoveToNotiScreen }) => {
  const navigation = useNavigation();
  const partners = useSelector((state) => state.partners);
  const [isNotify, setIsNotify] = useState(false);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      setIsNotify(true);
    });

    return unsubscribe;
  }, []);

  const _onEditUser = () => navigation.navigate(USER_DETAIL);

  const _onShowNotify = () => {
    setIsNotify(false);
    navigation.navigate(NOTIFICATION);
  };

  return (
    <ImageBackground style={styles.container} source={images.HEADER}>
      <SafeAreaView
        style={{
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        }}
      />

      <View style={styles.statusWrapper}>
        <View style={styles.headerLeft}>
          <Image source={images.OMENU_WHITE} style={styles.logo} resizeMode='contain'/>
        </View>

        <View style={styles.titleWrapper}>
          <Text style={styles.title} numberOfLines={1}>
            {partners?.name || 'O-MENU'}
          </Text>
        </View>

        <View style={styles.wrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={onMoveToNotiScreen ? onMoveToNotiScreen : _onShowNotify}>
            <Ionicons name="notifications" size={24} color="white" />
            {isNotify && <View style={styles.notifyIcon} />}
          </TouchableOpacity>
          <View style={styles.spaceBetween} />
          <TouchableOpacity style={styles.button} onPress={_onEditUser}>
            <FontAwesome5 name="user-circle" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HeaderHome;

const styles = StyleSheet.create({
  container: {
    resizeMode: 'center',
  },
  headerLeft: {
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  titleWrapper: {
    flex: 7,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    width: 8,
  },
  title: {
    color: 'white',
    fontSize: 18,
  },
  button: {
    padding: 3,
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },
  logo: {
    width: '100%',
    height: '100%',

  },
  notifyIcon: {
    width: 10,
    height: 10,
    borderRadius: 10,
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: colors.RED,
  },
});
