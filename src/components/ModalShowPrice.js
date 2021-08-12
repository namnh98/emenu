import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {View, Text} from 'react-native';
import {colors} from '../assets';
import {FormatNumber} from '../untils';

const ModalShowPrice = ({visible, price, onClosePopup}) => {
  return (
    <Modal
      statusBarTranslucent
      animationIn="zoomInDown"
      animationOut="zoomOutDown"
      onBackdropPress={onClosePopup}
      useNativeDriver
      hideModalContentWhileAnimating
      isVisible={visible}>
      <View
        style={{
          height: 150,
          width: '90%',
          borderRadius: 10,
          backgroundColor: colors.WHITE,
          alignSelf: 'center',
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.ORANGE,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 16, color: 'white'}}>
            Số tiền quý khách phải trả
          </Text>
        </View>
        <View
          style={{
            flex: 2,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FormatNumber
            titleStyle={{fontSize: 22}}
            heavy
            value={price}
            textColor={colors.BLACK}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ModalShowPrice;
