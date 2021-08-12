import React, { useEffect, useState } from 'react';
import DeviceInfo from 'react-native-device-info';
import { colors, images } from '../../../assets';
import { HeaderComponent, TextComponent, ToggleOpion } from '../../../components';
import Clipboard from '@react-native-clipboard/clipboard';
import I18n from '../../../i18n';
import {
  SELECT_USER,
  TAB_WITH_CHECK_IN,
  REPORT,
  CONTACT,
  MANAGE,
  HISTORYPAYMENT
} from '../../../navigators/ScreenName';
import { userInfo, users } from '../../../stores';
import { Moment } from '../../../untils';
import moment from 'moment';
import { StaffApi, PartnerApi, SettingApi, LoginApi } from '../../../api';
import { partnerAction, shiftsAction } from '../../../redux/actions';
import ModalLogOut from './ModalLogOut';
import { useDispatch, useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid, AlertIOS, Platform } from 'react-native';
import {
  Avatar,
  AvatarWrap,
  BodyWrap,
  FootWrap,
  Logout,
  RowWrap,
  Wrapper,
  CheckOut,
  AllowOption,
  LinkNavigate,
  RowWrap2,
  ViewBlockRow,
  ViewBlockCol,
  OrderdHistory
} from './styles';
import { ModalCfirmComponent } from '../../../components';

const UserDetailScreen = ({ navigation, route }) => {
  const [modalCheckOut, setModalCheckOut] = useState(false);
  const { shift } = useSelector((state) => state);
  const partners = useSelector((state) => state.partners);
  const {
    is_call_staff,
    is_order_item_in_web,
    is_confirm_order_item,
    contract_type_id,
  } = partners;
  const [modalLogOutVisible, setModalLogOutVisible] = useState(false);

  const [callStaff, setCallStaff] = useState(null);
  const [orderWeb, setOrderWeb] = useState(null);

  const dispatch = useDispatch();
  const [valueUser, setValueUser] = useState({
    full_name: I18n.t('userDetail.title'),
    avatar: '',
    birthday: '',
    phone_number: '',
    email: '',
    address1: '',
    language: 'Tiếng việt',
  });

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const userInfoStore = await userInfo.getListUser();
    if (userInfoStore) {
      const {
        full_name,
        avatar,
        birthday,
        phone_number,
        email,
        address1,
      } = userInfoStore;
      setValueUser({
        ...valueUser,
        full_name,
        avatar,
        birthday,
        phone_number,
        email,
        address1,
      });
    }
  };

  const _renderAvatar = () => {
    const url = valueUser.avatar ? { uri: valueUser.avatar } : images.LOGO_STAFF;
    return (
      <AvatarWrap>
        <Avatar source={url} />
      </AvatarWrap>
    );
  };

  const compareTime = (time) => {
    const splitTime = time.split(':');
    const currTime = new Date();
    return (
      currTime.getHours() * 60 + currTime.getMinutes() <
      parseInt(splitTime[0]) * 60 + parseInt(splitTime[1])
    );
  };
  const onShowDebugInfo = async () => {
    const fcm = await AsyncStorage.getItem('@fcmToken');
    const { user_id, device_id } = await users.getListUser();
    const string = `FCM TOKEN : ${fcm}\n DEVICE_ID: ${device_id} \nUSER_ID: ${user_id}`;
    Clipboard.setString(string);
    let msg = 'Copy thành công'
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
  };

  const _checkOut = async () => {
    const { staffId, id, check_in, check_in_out_at } = shift;
    let _data = {
      user_id: staffId,
      shift_id: id ? id : '',
      check_in_out_at: moment(check_in_out_at).format('DD - MM - YYYY'),
      check_in: check_in,
      check_out: moment(new Date()).format('HH:mm'),
      description: '',
    };
    const _res = await StaffApi.CheckIn(_data);
    if (_res) {
      dispatch(shiftsAction.reset());
      setModalCheckOut(false);
      navigation.reset({
        index: 0,
        routes: [{ name: TAB_WITH_CHECK_IN }],
      });
    }
  };

  const _renderRowItem = (title, content) => {
    return (
      <RowWrap>
        <TextComponent>{title}</TextComponent>
        <TextComponent>{content}</TextComponent>
      </RowWrap>
    );
  };

  const _renderRowItemOption = (title, content) => {
    return (
      <RowWrap>
        <TextComponent>{title}</TextComponent>
        <AllowOption>{content}</AllowOption>
      </RowWrap>
    );
  };

  const _renderRowItemContact = (title, content) => {
    return (
      <LinkNavigate
        onPress={() =>
          navigation.navigate(CONTACT, { phone: valueUser.phone_number })
        }>
        <RowWrap>
          <TextComponent>{title}</TextComponent>
          <AllowOption>{content}</AllowOption>
        </RowWrap>
      </LinkNavigate>
    );
  };

  const _onLogOutWithoutCheckOut = async () => {
    const res = await LoginApi.LogOut();
    if (res) {
      console.log(res);
      users.removeUser();
      userInfo.removeUser();
    }
    dispatch(partnerAction.reset());
    dispatch(shiftsAction.reset());
    navigation.reset({
      index: 0,
      routes: [{ name: SELECT_USER }],
    });
  };
  const _onLogOutAndCheckOut = async () => {
    await _checkOut();
    await _onLogOutWithoutCheckOut();
  };

  const _onLogout = async () => {
    if (shift?.end_time != null && shift?.end_time != '') {
      if (compareTime(shift.end_time)) {
        setModalLogOutVisible(true);
      } else {
        _onLogOutWithoutCheckOut();
      }
    } else {
      _onLogOutWithoutCheckOut();
    }
  };

  const updateCallStaff = async (value) => {
    let data = {
      is_call_staff: value,
    };
    await SettingApi.putPartnerSetting(data);
    const partnerSetting = await PartnerApi.getPartnerSetting();
    dispatch(partnerAction.success(partnerSetting));
    setCallStaff(value);
  };

  const updateOrderWeb = async (value) => {
    let data = {
      is_order_item_in_web: value,
    };
    await SettingApi.putPartnerSetting(data);
    const partnerSetting = await PartnerApi.getPartnerSetting();
    dispatch(partnerAction.success(partnerSetting));
    setOrderWeb(value);
  };

  const _renderBigButton =()=>{
    return(
      <ViewBlockRow>
        <OrderdHistory onPress={() => navigation.navigate(HISTORYPAYMENT)}/>
        {shift?.check_in != null && shift?.check_in != '' ? (
          <CheckOut onPress={() => setModalCheckOut(true)} />
       ) : null}
      </ViewBlockRow>
    )
  }

  const _renderInfPersonal = ()=>{
    return(
      <ViewBlockCol>
        <TextComponent medium color="#555" bold pTop={15} pBottom={15}>Cá nhân</TextComponent>
        {_renderRowItem(
          I18n.t('userDetail.birthday'),
          valueUser.birthday
            ? Moment.FormatBirthday(valueUser.birthday)
            : 'Chưa cập nhật',
        )}
        {_renderRowItem(
          I18n.t('userDetail.phone'),
          valueUser.phone_number ? valueUser.phone_number : 'Chưa cập nhật',
        )}
        {_renderRowItem(
          I18n.t('userDetail.email'),
          valueUser.email ? valueUser.email : 'Chưa cập nhật',
        )}
        {_renderRowItem(
          I18n.t('userDetail.address'),
          valueUser.address1 ? valueUser.address1 : 'Chưa cập nhật',
        )}
      </ViewBlockCol>
    )
  }

  const _renderSettingOptions = ()=>{
    return(
      <ViewBlockCol>
        <TextComponent medium color="#555" bold pTop={15} pBottom={15}>Cài đặt</TextComponent>
        {_renderRowItem(
          I18n.t('userDetail.language'),
          valueUser.language ? valueUser.language : 'Chưa cập nhật',
        )}

        {_renderRowItemOption(
          I18n.t('userDetail.allowCallStaff'),
          <ToggleOpion
            selected={is_call_staff}
            onChange={(value) => updateCallStaff(value)}
          />,
        )}

        {contract_type_id === 1
          ? null
          : _renderRowItemOption(
            I18n.t('userDetail.allowOrderWeb'),
            <ToggleOpion
              selected={is_order_item_in_web}
              onChange={(value) => updateOrderWeb(value)}
            />,
          )}
      </ViewBlockCol>
    )
  }
  const _renderManagement = ()=>{
    return(
      <ViewBlockCol>
        <TextComponent medium color="#555" bold pTop={15} pBottom={15}>Quản lý</TextComponent>
        {is_confirm_order_item && (
          <LinkNavigate onPress={() => navigation.navigate(REPORT)}>
            <RowWrap>
              <TextComponent>Báo cáo tổng quan</TextComponent>
              <MaterialCommunityIcons
                name={'chart-bar'}
                size={30}
                color={'orange'}
              />
            </RowWrap>
          </LinkNavigate>
        )}
        <LinkNavigate onPress={() => navigation.navigate(MANAGE)}>
          <RowWrap>
            <TextComponent>Quản lý</TextComponent>
            <MaterialCommunityIcons
              name={'android-messages'}
              size={30}
              color={'orange'}
            />
          </RowWrap>
        </LinkNavigate>
        {_renderRowItemContact(
          I18n.t('userDetail.contact'),
          <AntDesign name="mail" size={22} color={'orange'} />,
        )}
      </ViewBlockCol>
    )
  }



  return (
    <Wrapper>
      <HeaderComponent
        title={valueUser.full_name}
        isLogOut
        onLogout={_onLogout}
      />
      <BodyWrap>
        {_renderAvatar()}
        {_renderBigButton()}
        {_renderInfPersonal()}
        {_renderSettingOptions()}
        {_renderManagement()}
        <LinkNavigate onPress={onShowDebugInfo}>
          <TextComponent mTop={10} center>
            Debug FCM
          </TextComponent>
        </LinkNavigate>
      <FootWrap>
        <TextComponent mTop={8} color={colors.BLACK_GRAY}>
          midota - v{DeviceInfo.getVersion()}
        </TextComponent>
      </FootWrap>
      </BodyWrap>

      {/* {_renderButton()} */}

      <ModalCfirmComponent
        content={
          shift.start_time != undefined
            ? `Ca làm hiện tại: ${shift?.start_time} - ${shift.end_time}`
            : ''
        }
        onClosePopup={() => setModalCheckOut(false)}
        onConfirm={() => _checkOut()}
        isVisible={modalCheckOut}
        title="XÁC NHẬN CHECK-OUT"
      />

      <ModalLogOut
        isVisible={modalLogOutVisible}
        onLeftBtnPress={_onLogOutWithoutCheckOut}
        onRightBtnPress={_onLogOutAndCheckOut}
        onClosePopup={() => setModalLogOutVisible(false)}
      />
    </Wrapper>
  );
};

export default UserDetailScreen;
