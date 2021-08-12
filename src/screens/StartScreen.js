import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  Platform,
  Alert,
  BackHandler,
  Linking,
} from 'react-native';
import I18n from '../i18n';
import {images} from '../assets';
import {lastLogin} from '../stores';
import {LoginApi, PartnerApi, TableApi} from '../api';
import {tableAction, partnerAction} from '../redux/actions';
import jwt_decode from 'jwt-decode'; //decode token để show role của user
import {users} from '../stores';
import {
  SELECT_USER,
  LOGIN,
  BOTTOM_TAB,
  TAB_WITH_CHECK_IN,
} from '../navigators/ScreenName';
import {useDispatch} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import SystemSetting from 'react-native-system-setting';

const {width} = Dimensions.get('screen');

const StartScreen = ({navigation}) => {
  const [isOffline, setOfflineStatus] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = !state.isConnected;

      if (offline) {
        Alert.alert('Không có kết nối', 'Vui lòng bật kết nối internet', [
          {
            text: 'Huỷ',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              SystemSetting.switchWifi(() => {
                // console.log('switch airplane successfully');
              });
            },
          },
        ]);
      }
    });
    I18n.locale = 'vi';
    checkUserLogged();
    return () => removeNetInfoSubscription();
  }, []);

  const checkUserLogged = async () => {
    try {
      const res = await LoginApi.updateToken();

      if (res) {
        await getPartnerInfo();
        // await getListTable();
        return;
      }

      const listLast = await lastLogin.getListLogin();
      if (listLast && listLast.length) {
        return navigation.replace(SELECT_USER);
      }

      navigation.replace(LOGIN);
    } catch (error) {
      console.log('Err @CheckUserLogged ', error);
      navigation.replace(LOGIN);
    }
  };

  const getListTable = async () => {
    try {
      // const res = await TableApi.getListTable();

      // if (res.length) {
      //   dispatch(tableAction.success(res));
      // }
      navigation.replace(TAB_WITH_CHECK_IN);
    } catch (error) {
      console.log('Err @getListTable ', error);
      navigation.replace(TAB_WITH_CHECK_IN);
    }
  };

  const getPartnerInfo = async () => {
    try {
      const [partnerInfo, partnerSetting] = await Promise.all([
        PartnerApi.getPartnerInfo(),
        PartnerApi.getPartnerSetting(),
      ]);

      if (partnerSetting) {
        const {token} = await users.getListUser();
        let decode = jwt_decode(token);
        const {role} = decode;
        if (
          !partnerSetting.is_checkin_out ||
          role.includes('master') ||
          !role.includes('role_18')
        ) {
          navigation.reset({index: 0, routes: [{name: BOTTOM_TAB}]});
        } else {
          navigation.reset({index: 0, routes: [{name: TAB_WITH_CHECK_IN}]});
        }
        dispatch(partnerAction.success({...partnerInfo, ...partnerSetting}));
      }
    } catch (error) {
      console.log('Err @getPartnerInfo ', error);
      navigation.reset({index: 0, routes: [{name: TAB_WITH_CHECK_IN}]});
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={images.LOGO_LOADING} />
    </View>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: width / 2,
    height: width / 2,
  },
});
