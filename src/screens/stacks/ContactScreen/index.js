import React, { useEffect, useRef, useState } from 'react';
import { View, Keyboard } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { colors } from '../../../assets';
import { AlertModal } from '../../../common';
import {
  HeaderComponent,
  ModalCfirmComponent,
  TextComponent,
  InputComponent,
  NoteComponent
} from '../../../components';

//import styles from './styles';
import { Wrapper, Body, ViewRow, ViewRowStart,  SendBtn } from './styles'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';

const ContactScreen = ({ route }) => {
  const [phoneNumber, setPhoneNumber] = useState(route.params.phone)
  const [valueNote, setValueNote] = useState('')
  const [showErr, setShowErr] = useState(false)

  const titleRef = useRef();
  const contentRef = useRef();

  const [isVisible, setIsVisible] = useState(false);
  const [isNotConfirm, setIsNotConfirm] = useState(false);

  const onSend = () => {
    if (valueNote === '') {
      setShowErr(true)
    } else {
      setShowErr(false)
      setIsVisible(true)
      _onModalSuccess()
    }
  }
  const _onClosePopup = () => {
    setIsVisible(false);
    setIsNotConfirm(false);
  };

  const _onModalSuccess = async () => {
    titleRef.current = AlertModal.TITLE[1];
    contentRef.current = AlertModal.CONTENT.smsContact;
    setIsNotConfirm(true);
  }

  return (
    <Wrapper>
      <HeaderComponent title="Liên hệ Omenu" />
      <Body>
        <TextComponent heavy upperCase>Thông tin liên hệ</TextComponent>
        <ViewRow>
          <Feather
            name="phone"
            size={16}
            color={'orange'}
          />
          <TextComponent pLeft={10}>Hotline: 028 6650 3102</TextComponent>
        </ViewRow>
        <ViewRow>
          <AntDesign
            name="mail"
            size={16}
            color={'orange'}
          />
          <TextComponent pLeft={10}>Email: hotro@omenu.vn</TextComponent>
        </ViewRow>
        <ViewRow>
          <Octicons
            name="location"
            size={20}
            color={'orange'}
          />
          <TextComponent lineHeight={24} pLeft={10}>Địa chỉ: 153 Đặng Thùy Trâm, Phường 13, Quận Bình Thạnh, TP. HCM.</TextComponent>
        </ViewRow>
        <TextComponent heavy upperCase mTop={20}>Gửi liên hệ</TextComponent>
        <ViewRow>
          <TextComponent pRight={10}>Điện thoại</TextComponent>
          <InputComponent borColor={'#e3e3e3'} flex={1} radius={5} value={phoneNumber} onChangeText={value => { setPhoneNumber(value) }} />
        </ViewRow>
        <ViewRowStart>
          <NoteComponent
            height={80}
            value={valueNote}
            onChangeText={value => setValueNote(value)}
            flex={1}
            placeholder={'Nội dung liên hệ'}
          />
        </ViewRowStart>
        {showErr && <TextComponent color={'red'} center mTop={10}>Vui lòng nhập nội dung liên hệ</TextComponent>}
        <SendBtn onPress={onSend} />
      </Body>
      <ModalCfirmComponent
        isVisible={isVisible}
        title={titleRef.current}
        content={contentRef.current}
        onClosePopup={_onClosePopup}
        isNotConfirm={isNotConfirm}
        onConfirm={_onModalSuccess}
      />
    </Wrapper>
  );
};

export default ContactScreen;
