import React from 'react';
import Modal from 'react-native-modal';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {colors, images} from '../../assets';
export const TempContractContent = () => (
  <View
    style={{
      width: '90%',
      paddingHorizontal: 15,
      paddingVertical: 30,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.WHITE,
      borderRadius: 10,
    }}>
    <Image source={images.WELCOME} style={{height: 100, width: 100}} />
    <Text style={{marginTop: 20, textAlign: 'center'}}>
      Bạn chưa đăng ký hợp hợp đồng chính thức
    </Text>
    <Text>Vui lòng liên hệ với Omenu</Text>
    <Text>Hotline: 028 6650 3102</Text>
    <Text>Email: hotro@midota.com</Text>
  </View>
);

export default PopUptTempContract = ({visible, onClosePopup}) => {
  return (
    <Modal
      isVisible={visible}
      animationIn="zoomInDown"
      animationOut="zoomOutDown"
      onBackdropPress={onClosePopup}
      useNativeDriver
      hideModalContentWhileAnimating>
      <TempContractContent />
    </Modal>
  );
};
