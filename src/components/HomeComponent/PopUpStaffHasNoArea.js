import React from 'react';
import Modal from 'react-native-modal';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {colors, images} from '../../assets';
import TextComponent from '../TextComponent';

export default PopUpStaffHasNoArea = ({
  visible,
  onClosePopup,
  content1,
  content2,
  onConfirm,
  needConfirm,
}) => {
  return (
    <Modal
      isVisible={visible}
      animationIn="zoomInDown"
      animationOut="zoomOutDown"
      useNativeDriver
      hideModalContentWhileAnimating>
      <View style={styles.container}>
        <Image source={images.WELCOME} style={{height: 100, width: 100}} />
        <Text style={styles.title}>CẢNH BÁO</Text>
        <Text style={{textAlign: 'center', marginTop: 10}}>{content1}</Text>
        <Text>{content2}</Text>
        {needConfirm && onConfirm && (
          <View style={styles.row}>
            <TouchableOpacity
              onPress={onClosePopup}
              style={{...styles.button, backgroundColor: colors.RED}}>
              <TextComponent
                style={{color: colors.WHITE, fontWeight: 'bold', fontSize: 16}}>
                Huỷ bỏ
              </TextComponent>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={styles.button}>
              <TextComponent
                style={{color: colors.WHITE, fontWeight: 'bold', fontSize: 16}}>
                Xác nhận
              </TextComponent>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    paddingHorizontal: 15,
    paddingVertical: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderRadius: 10,
  },
  title: {
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: colors.ORANGE,
    fontSize: 18,
  },
  button: {
    height: 40,
    width: 110,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.ORANGE,
    marginTop: 15,
    marginHorizontal: 7,
  },
  row: {
    flexDirection: 'row',
  },
});
