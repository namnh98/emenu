import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, images } from '../assets';
import { ButtonComponent } from '../components';
import { NOTIFICATION, SELECT_USER, LOGIN } from '../navigators/ScreenName';

const HeaderComponent = ({
  title = '',
  isNotify,
  isNotBack,
  onGoBack,
  onEdit,
  onAddFood,
  params,
  isLogOut,
  onLogout
}) => {
  const navigation = useNavigation();

  const _onBackScreen = () => {
    onGoBack ? onGoBack() : navigation.goBack();
  };

  const _onGoNotify = () => navigation.replace(NOTIFICATION);
  return (
    <ImageBackground style={styles.container} source={images.HEADER}>
      <SafeAreaView
        style={{
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        }}
      />

      <View style={styles.statusWrapper}>
        {isNotBack ? null : (
          <TouchableOpacity onPress={_onBackScreen} style={styles.buttonBack}>
            <MaterialIcons name="arrow-back-ios" size={24} color="white" />
          </TouchableOpacity>
        )}

        <Text style={styles.title}>{title}</Text>

        {isNotify && (
          <TouchableOpacity onPress={_onGoNotify} style={styles.buttonRight}>
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        )}
        {isLogOut && (
          <TouchableOpacity
            onPress={onLogout}
            style={[styles.buttonRight, { flexDirection: 'row' }]}>
            <MaterialCommunityIcons name="logout" size={24} color={'white'} />
            <Text style={styles.txtLogout}> Đăng xuất</Text>
          </TouchableOpacity>
        )}

        {onEdit && (
          <ButtonComponent
            style={styles.buttonEdit}
            titleStyle={styles.buttonEditText}
            iconName="edit"
            iconSize={15}
            title="Sửa"
            onPress={onEdit}
          />
        )}

        {onAddFood && (
          <ButtonComponent
            style={styles.buttonEdit}
            title="Gọi thêm món"
            titleStyle={styles.buttonEditText}
            onPress={onAddFood}
          />
        )}
      </View>
    </ImageBackground>
  );
};

export default HeaderComponent;

const styles = StyleSheet.create({
  container: {
    resizeMode: 'contain',
  },
  title: {
    color: 'white',
    fontSize: 18,
  },
  buttonBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
  buttonRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
  },
  buttonEdit: {
    position: 'absolute',
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    flexDirection: 'row',
    padding: 5,
    backgroundColor: colors.PRIMARY,
    borderRadius: 5,
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  notifyIcon: {
    width: 24,
  },
  buttonEditText: {
    marginLeft: 5,
    color: colors.WHITE,
  },
  txtLogout: {
    color: colors.WHITE,
  },
});
