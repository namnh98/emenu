import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
import {ButtonComponent} from '../../../components';
import {colors} from '../../../assets';
const {width} = Dimensions.get('screen');

export default ModalLogOut = ({
  isVisible,
  onClosePopup,
  onLeftBtnPress,
  onRightBtnPress,
}) => {
  const _renderButtonClose = () => {
    return (
      <ButtonComponent
        onPress={onClosePopup}
        iconName="close"
        iconSize={24}
        iconColor={colors.BLACK_GRAY}
        alignRight
        paddingH={8}
        paddingV={3}
      />
    );
  };

  const _renderContent = () => {
    return (
      <View style={[styles.contentContainer]}>
        <View style={styles.row}>
          <Text
            style={{
              ...styles.contentTitle,
              color: colors.BLACK,
            }}
            numberOfLines={1}>
            XÁC NHẬN ĐĂNG XUẤT
          </Text>
        </View>
        <Text style={styles.contentSubTitle} numberOfLines={3}>
          Hiện tại bạn đang trong ca làm việc, bạn muốn check out trước khi đăng
          xuất không?
        </Text>
      </View>
    );
  };

  const _renderButton = () => {
    return (
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          onPress={() => onLeftBtnPress()}
          style={styles.buttonCancel}>
          <Text style={styles.buttonTitle}>Không</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onRightBtnPress()}
          style={styles.buttonOk}>
          <Text style={styles.buttonTitle}>Có</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      statusBarTranslucent
      animationIn="zoomInDown"
      animationOut="zoomOutDown"
      animationOutTiming={500}
      onBackdropPress={onClosePopup}
      useNativeDriver
      hideModalContentWhileAnimating>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.modalContainer}>
          <View style={[styles.container]}>
            {_renderButtonClose()}

            <View style={styles.contentWrapper}>
              {_renderContent()}
              {_renderButton()}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  container: {
    backgroundColor: colors.GRAY,
    height: width / 1.9,
    borderRadius: 5,
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
  error: {
    color: colors.RED,
    paddingTop: 10,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginHorizontal: 5,
  },
  contentSubTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  buttonWrapper: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.BG_GRAY,
  },
  buttonCancel: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.RED,
    borderRadius: 20,
  },
  buttonOk: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.PRIMARY,
    borderRadius: 20,
    marginLeft: 10,
  },
  buttonTitle: {
    color: colors.WHITE,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.WHITE,
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    marginTop: 10,
    width: '90%',
    height: 70,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
