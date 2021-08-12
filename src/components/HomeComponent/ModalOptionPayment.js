import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/stack';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {colors} from '../../assets';
import ButtonComponent from '../ButtonComponent';
import {PAYMENT, PAY_ONEBYONE} from '../../navigators/ScreenName';

const {width} = Dimensions.get('screen');

const ModalOptionPayment = ({
  isVisible,
  onClosePopup,
  navigation,
  order,
  table,
  areaId,
}) => {
  const _renderButtonClose = () => {
    return (
      <ButtonComponent
        onPress={onClosePopup}
        iconName="close"
        iconSize={24}
        iconColor={colors.WHITE}
        alignRight
        paddingH={8}
        paddingV={3}
      />
    );
  };
  const onPayAll = () => {
    const checkIfPaidOneByOne = order.order_items.filter(
      (item) => item.qty_completed != 0,
    );
    if (checkIfPaidOneByOne.length === 0) {
      navigation.navigate(PAYMENT, {
        ...order,
        table: table,
      });
    } else {
      const listNew = order.order_items.map((item) => {
        return {
          ...item,
          qty: item.qty - item.qty_completed,
          qty_completed: 0,
        };
      });
      navigation.navigate(PAYMENT, {
        id: order.id,
        table: table,
        areaId,
      });
    }
    onClosePopup();
  };

  const onPayOneByOne = () => {
    navigation.navigate(PAY_ONEBYONE, {
      ...order,
      table: table,
      areaId,
    });
    onClosePopup();
  };
  // const _onPayAll = () => {
  //   onClosePopup();
  //   navigation.navigate(PAYMENT, data);
  // };
  // const _onPayOneByOne = () => {
  //   onClosePopup();
  //   navigation.navigate(PAY_ONEBYONE, data);
  // };
  const _renderButton = () => {
    return (
      <View style={styles.buttonWrapper}>
        <TouchableOpacity onPress={onPayAll} style={styles.button}>
          <Text style={styles.buttonTitle}>Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onPayOneByOne}>
          <Text style={styles.buttonTitle}>Theo món</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const _renderExplain = () => (
    <View
      style={{
        width: 280,
        alignSelf: 'center',
        marginTop: 10,
        paddingBottom: 20,
        paddingLeft: 5,
      }}>
      <Text
        style={{
          ...styles.buttonTitle,
          color: colors.ORANGE,
          fontWeight: 'bold',
        }}>
        Ghi chú
      </Text>
      <Text style={{...styles.buttonTitle, color: colors.ORANGE}}>
        Tất cả: Thanh toán toàn bộ món ăn trên hoá đơn
      </Text>
      <Text style={{...styles.buttonTitle, color: colors.ORANGE}}>
        Theo món: Có thể chia hoá đơn ra thành nhiều hoá đơn nhỏ và thanh toán
        riêng
      </Text>
    </View>
  );

  return (
    <Modal
      backdropColor={'transparent'}
      style={{margin: 0, backgroundColor: 'rgba(0,0,0,.6)'}}
      isVisible={isVisible}
      statusBarTranslucent
      animationIn="zoomInDown"
      animationOut="zoomOutDown"
      animationOutTiming={500}
      onBackdropPress={onClosePopup}
      useNativeDriver
      hideModalContentWhileAnimating>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          {_renderButtonClose()}
          <Text style={styles.contentTitle}>CHỌN CÁCH THANH TOÁN</Text>
        </View>
        {_renderButton()}
        {_renderExplain()}
      </View>
    </Modal>
  );
};

export default ModalOptionPayment;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    width: '90%',
  },
  container: {
    backgroundColor: colors.GRAY,
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
    borderTopWidth: 1,
    borderTopColor: colors.BG_GRAY,
    // padding: 20,
    // justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderRadius: 20,
    borderColor: colors.PRIMARY,
    borderWidth: 1,
    marginHorizontal: 10,
    width: 130,
    marginTop: 20,
  },
  buttonTitle: {
    color: colors.PRIMARY,
  },
  titleContainer: {
    backgroundColor: colors.ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});
