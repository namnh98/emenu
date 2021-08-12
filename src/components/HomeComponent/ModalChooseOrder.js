import React from 'react';
import Modal from 'react-native-modal';
import {View} from 'react-native';
import colors from '../../assets/colors';
import {
  ButtonComponent,
  TextComponent,
  ListOrderPayment,
} from '../../components';

import BottomSheet from '../BottomSheet';

export default function ModalChooseOrder({
  data,
  onPress,
  visible,
  onClose,
  onConfirm,
  onModalHide,
  onModalShow,
}) {
  return (
    <Modal
      onModalShow={onModalShow}
      onModalHide={onModalHide}
      backdropColor={'transparent'}
      style={{margin: 0, backgroundColor: 'rgba(0,0,0,.6)'}}
      statusBarTranslucent
      animationIn="zoomInDown"
      animationOut="zoomOutDown"
      animationOutTiming={500}
      useNativeDriver={true}
      hideModalContentWhileAnimating
      onBackdropPress={onClose}
      isVisible={visible}>
      <View
        style={{
          width: '95%',
          padding: 20,
          alignSelf: 'center',
          padding: 10,
          backgroundColor: '#EEEEEE',
          borderRadius: 10,
        }}>
        <TextComponent mBottom={15} center heavy medium>
          CHỌN ORDER MUỐN CHUYỂN BÀN
        </TextComponent>
        <ListOrderPayment onPress={onPress} data={data} />
      </View>
    </Modal>
  );
}
