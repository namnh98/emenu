import React, { useState } from 'react';
import { Keyboard, StatusBar, SafeAreaView, Dimensions } from 'react-native';
import * as Devices from 'react-native-device-info';
import { useDispatch } from 'react-redux';
import { LoginApi, PartnerApi, TableApi } from '../../../api';
import { colors, images } from '../../../assets';
import { DeviceInfoToBase64 } from '../../../common';
import { ButtonComponent, LoadingHome, TextComponent } from '../../../components';
import I18n from '../../../i18n';
import { BOTTOM_TAB, TAB_WITH_CHECK_IN } from '../../../navigators/ScreenName';
import jwt_decode from 'jwt-decode'; //decode token để show role của user
import { users } from '../../../stores';
import { partnerAction, tableAction } from '../../../redux/actions';
import {
  AreaView,
  BodyWrap,
  Container,
  FootWrap,
  FormWrap,
  HeadingWrap,
  InputName,
  InputPass,
  Logo,
  PassWrap,
  Wrapper,
} from './styles';

const Login = ({ navigation, route }) => {
  const { username } = route.params || {};
  const dispatch = useDispatch();

  const [isShowPass, setIsShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [textErr, setTextErr] = useState('');
  const [value, setValue] = useState({
    name: username || '',
    pass: '',
  });

  const _onShowPass = () => setIsShowPass(!isShowPass);

  const _onChangeName = (name) => {
    setValue({ ...value, name });
  };

  const _onChangePass = (pass) => {
    setValue({ ...value, pass });
  };

  const _onLogin = () => {
    Keyboard.dismiss();
    if (!value.name || !value.pass) {
      setTextErr('Vui lòng nhập đầy đủ');
      return;
    }
    handleLogin();
  };
  //Kiểm tra thông tin Đăng nhập
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const res = await LoginApi.Login(value, DeviceInfoToBase64());
      switch (res?.redirect) {
        case 1:
          await getPartnerInfo();
          // await getListTable();
          break;

        case 3:
          handleDeleteDevice();
          break;

        default:
          setIsLoading(false);
          setTextErr('Tài khoản hoặc mật khẩu không chính xác');
          break;
      }
    } catch (error) {
      setIsLoading(false);
      setTextErr('Đăng nhập thất bại. Vui lòng kiểm tra tài khoản và mật khẩu!');
      console.log(error);
    }
  };

  const handleDeleteDevice = async () => {
    try {
      const res = await LoginApi.getDeviceById();
      setIsLoading(false);

      if (res.status === 200) {
        await getPartnerInfo();
        return;
      }
      setTextErr('Đăng nhập thất bại !');
    } catch (error) {
      setIsLoading(false);
      setTextErr('Đăng nhập thất bại !');
      console.log(error);
    }
  };

  // const getListTable = async () => {
  //   try {
  //     // const res = await TableApi.getListTable();

  //     // if (res.length) {
  //     //   dispatch(tableAction.success(res));
  //     // }
  //     navigation.reset({
  //       index: 0,
  //       routes: [{name: BOTTOM_TAB}],
  //     });
  //   } catch (error) {
  //     console.log('Err @getListTable ', error);
  //     navigation.reset({
  //       index: 0,
  //       routes: [{name: BOTTOM_TAB}],
  //     });
  //   }
  // };

  const getPartnerInfo = async () => {
    try {
      const [partnerInfo, partnerSetting] = await Promise.all([
        PartnerApi.getPartnerInfo(),
        PartnerApi.getPartnerSetting(),
      ]);


      if (partnerSetting) {
        const { token } = await users.getListUser();
        let decode = jwt_decode(token);
        const { role } = decode;
        if (
          !partnerSetting.is_checkin_out ||
          role.includes('master') ||
          !role.includes('role_18')
        ) {
          navigation.reset({ index: 0, routes: [{ name: BOTTOM_TAB }] });
        } else {
          navigation.reset({ index: 0, routes: [{ name: TAB_WITH_CHECK_IN }] });
        }
        dispatch(partnerAction.success({ ...partnerInfo, ...partnerSetting }));
      }
    } catch (error) {
      console.log('Err @getPartnerInfo ', error);
      navigation.replace(TAB_WITH_CHECK_IN);
    }
  };

  return (
    <Wrapper>
      <Container source={images.HEADER}>
        <SafeAreaView />
        {navigation.canGoBack() && (<ButtonComponent
          onPress={() => navigation.goBack()}
          iconName="chevron-left"
          iconSize={35}
          absolute
          width={50}
          height={50}
          justCenter={true}
          alignCenter={true}
          mTop={50}
          mLeft={15}
        />)}
        <BodyWrap style={{ marginTop: Dimensions.get('window').height * 0.05 }}>
          {/* back select user */}
          {/* {navigation.canGoBack() ? (
            <ButtonComponent
              onPress={_onBackSelectUser}
              iconName="chevron-left"
              iconSize={30}
              absolute
              top={8}
              left={15}
            />
          ) : null} */}

          {/* header logo */}
          <HeadingWrap>
            <Logo source={images.LOGO} resizeMode="contain" />
          </HeadingWrap>

          {/* form input */}
          <FormWrap>
            <InputName
              value={value.name}
              onChangeText={_onChangeName}
              placeholder={I18n.t('login.input1')}
              autoFocus
            />

            <PassWrap>
              <InputPass
                value={value.pass}
                onChangeText={_onChangePass}
                placeholder={I18n.t('login.input2')}
                secureTextEntry={!isShowPass}
              />
              <ButtonComponent
                onPress={_onShowPass}
                iconName={isShowPass ? 'eye-slash' : 'eye'}
                iconColor={colors.TEXT_GRAY}
              />
            </PassWrap>

            <ButtonComponent
              disabled={isLoading}
              onPress={_onLogin}
              title={I18n.t('login.submit')}
              titleColor={colors.WHITE}
              bgButton={colors.PRIMARY}
              width="80%"
              paddingV={15}
              borRadius={50}
              center
            />

            <TextComponent color={colors.RED} heavy mTop={15}>
              {textErr}
            </TextComponent>
          </FormWrap>

          <FootWrap>
            <TextComponent mTop={8} color={colors.BLACK_GRAY}>
              midota - v{Devices.getVersion()}
            </TextComponent>
          </FootWrap>
        </BodyWrap>
      </Container>

      {/* loading */}
      <LoadingHome isVisible={isLoading} />
    </Wrapper>
  );
};

export default Login;
