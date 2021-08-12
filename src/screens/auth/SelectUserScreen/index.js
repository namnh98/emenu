import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  SafeAreaView,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import { colors, images } from '../../../assets';
import { LoginWithComponent } from '../../../components';
import {
  BOTTOM_TAB,
  LOGIN,
  TAB_WITH_CHECK_IN,
} from '../../../navigators/ScreenName';
import styles from './styles';
import I18n from '../../../i18n';
import { lastLogin } from '../../../stores';

const SelectUser = ({ navigation }) => {
  const [listUser, setListUser] = useState([]);

  useEffect(() => {
    getListLast();
  }, []);

  const getListLast = async () => {
    const listLast = await lastLogin.getListLogin();
    if (listLast) {
      setListUser(listLast);
    }
  };

  const _onOtherUser = () => navigation.navigate(LOGIN);

  const _renderListItem = () => {
    const _onSelectUser = (item) => navigation.navigate(LOGIN, item);

    const _onRemoveUser = async (item) => {
      const listLast = await lastLogin.removeListLogin(item.user_id);
      setListUser(listLast);
    };

    return listUser.map((value, index) => {
      return (
        <TouchableWithoutFeedback
          key={String(index)}
          onPress={() => _onSelectUser(value)}>
          <View style={styles.itemWrapper}>
            <View style={styles.itemHeader}>
              <Image
                style={styles.itemHeaderImage}
                source={images.LOGO_STAFF}
                resizeMode="contain"
              />

              <View style={styles.itemBody}>
                <Text style={styles.itemBodyTitle}>{value.full_name}</Text>
                <Text style={styles.itemBodySubTitle}>{value.username}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => _onRemoveUser(value)}
              style={styles.itemFooter}>
              <Entypo name="circle-with-minus" size={24} color={colors.RED} />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      );
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={images.HEADER} style={styles.container}>
        <SafeAreaView style={{ flex: 0 }} />
        <View style={styles.statusWrapper}>
          {/* header logo */}
          <View style={[styles.headerWrapper, styles.itemCenter]}>
            <Image
              style={styles.headerImage}
              source={images.LOGO}
              resizeMode="contain"
            />
          </View>

          {/* list user */}
          <View style={[styles.bodyWrapper]}>
            <Text style={styles.bodyTitle}>{I18n.t('selectUser.title')}</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {_renderListItem()}
              <TouchableOpacity
                onPress={_onOtherUser}
                style={styles.buttonSelect}>
                <EvilIcons name="user" size={30} color="black" />
                <Text style={styles.titleSelect}>
                  {I18n.t('selectUser.submit')}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* login with */}
          {/* <LoginWithComponent /> */}
        </View>
      </ImageBackground>
    </View>
  );
};

export default SelectUser;
