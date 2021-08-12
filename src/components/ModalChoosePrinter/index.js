import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/stack';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../../assets';
import Feather from 'react-native-vector-icons/Feather';
import TextComponent from '../TextComponent';

const { width, height } = Dimensions.get('screen');

const ModalChoosePrinter = (props) => {
  const {
    isVisible,
    onClosePopup,
    onPrint,
    listPrinters,
    onSelectPrinter,
    printerSelected,
    area_name,
    onModalHide,
    textAgree
  } = props;
  const _renderButton = () => {
    return (
      <View style={styles.buttonWrapper}>
        <TouchableOpacity onPress={onClosePopup} style={styles.button}>
          <Text style={styles.buttonTitle}>Huỷ bỏ</Text>
        </TouchableOpacity>
        {listPrinters.length ? (
          <TouchableOpacity style={styles.button} onPress={onPrint}>
            <Text style={styles.buttonTitle}>{textAgree !== undefined ? textAgree : 'In'}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };
  const renderPrinter = (item) => (
    <TouchableOpacity
      onPress={() => onSelectPrinter(item)}
      key={item.id}
      style={styles.printer}>
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.label}>
        {item?.printer_name} ({area_name ? item?.device_name : item?.area_name})
      </Text>
      {printerSelected && printerSelected.id === item.id && (
        <Feather name="check-circle" size={20} color={colors.GREEN} />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      backdropColor={'transparent'}
      style={{ margin: 0, backgroundColor: 'rgba(0,0,0,.6)' }}
      isVisible={isVisible}
      statusBarTranslucent
      animationIn="zoomInDown"
      animationOut="zoomOutDown"
      animationOutTiming={500}
      onBackdropPress={onClosePopup}
      useNativeDriver
      onModalHide={onModalHide}
      hideModalContentWhileAnimating>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.contentTitle}>{`CHỌN MÁY IN ${area_name || ''
            }`}</Text>
        </View>
        {listPrinters?.length && listPrinters.length >= 7 ? (
          <ScrollView style={{ height: 300 }}>
            {listPrinters.map((item) => renderPrinter(item))}
          </ScrollView>
        ) : listPrinters?.length && listPrinters.length < 7 ? (
          listPrinters.map((item) => renderPrinter(item))
        ) : (
          <>
            <TextComponent mTop={10} center>
              Không xác định được thiết bị in
            </TextComponent>
            <TextComponent center colors>
              Xin vui lòng kiểm tra phần cài đặt ở trang quản trị và trạng thái
              kết nối thiết bị của bạn
            </TextComponent>
            <TextComponent center>
              Hoặc liện hệ bộ phận kỹ thuật của Omenu qua 02866503102 hoặc email
              hotro@omenu.vn
            </TextComponent>
          </>
        )}
        {_renderButton()}
        {props.children}
      </View>
    </Modal>
  );
};

export default ModalChoosePrinter;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    width: '90%',
  },
  container: {
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
  },
  btnCloseWrapper: {
    alignSelf: 'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  contentWrapper: {
    flex: 1,
  },
  contentContainer: {
    flex: 6,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.WHITE,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    // padding: 20,
    // justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.ORANGE,
    borderRadius: 20,
    marginHorizontal: 10,
    width: 130,
    marginTop: 20,
  },
  buttonTitle: {
    color: colors.WHITE,
  },
  titleContainer: {
    backgroundColor: colors.ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
  },
  printer: {
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.WHITE,
    paddingHorizontal: 5,
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
