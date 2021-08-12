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
import {InputComponent} from '../../components';
import I18n from '../../i18n';
import {colors} from '../../assets';
import ButtonComponent from '../ButtonComponent';
import Entypo from 'react-native-vector-icons/Entypo';
import {AlertModal} from '../../common';

const {width} = Dimensions.get('screen');

const ModalPrint = (props) => {
  const {
    isVisible,
    title,
    content,
    loading,
    onClosePopup,
    onBackdropPress,
    onModalHide,
    onModalShow,
    isConnect,
    onContinute,
    onCancel,
    existPrint
  } = props;

  const _renderContent = () => {
    return (
      <View style={[styles.contentContainer]}>
        {title && (
          <View style={styles.row}>
            {title == AlertModal.TITLE[6 || 7] && (
              <Entypo name="warning" color={colors.RED} size={20} />
            )}
            <Text
              style={{
                ...styles.contentTitle,
                color:
                  title == AlertModal.TITLE[6 || 7] ? colors.RED : colors.BLACK,
              }}
              numberOfLines={1}>
              {title}
            </Text>
            {title == AlertModal.TITLE[6 || 7] && (
              <Entypo name="warning" color={colors.RED} size={20} />
            )}
          </View>
        )}
        <Text style={styles.contentSubTitle} numberOfLines={3}>
          {content}
        </Text>
      </View>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="zoomOutDown"
      animationOutTiming={500}
      useNativeDriver
      onModalHide={onModalHide}
      onModalShow={onModalShow}
      hideModalContentWhileAnimating>
      <View style={styles.container}>
        <View style={styles.contentWrapper}>{_renderContent()}</View>
        {loading && (
          <View style={{flex: 1}}>
            <ActivityIndicator size="large" color="orange" />
          </View>
        )}
        {!loading && isConnect !== undefined && isConnect === true && (
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              onPress={isConnect != undefined ? onContinute : onClosePopup}
              style={[
                styles.buttonCancel,
                {backgroundColor: colors.PRIMARY, marginRight: 10},
              ]}>
              <Text style={styles.buttonTitle}>
                {' '}
                {I18n.t('modalConfirm.button.3')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {isConnect !== undefined && isConnect === false && (
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              onPress={onContinute || onClosePopup}
              style={[
                styles.buttonCancel,
                {backgroundColor: colors.PRIMARY, marginRight: 10},
              ]}>
              <Text style={styles.buttonTitle}>
                {onContinute ? 'Tiếp tục' : 'OK'}
              </Text>
            </TouchableOpacity>
            {onContinute && (
              <TouchableOpacity onPress={onCancel} style={styles.buttonCancel}>
                <Text style={styles.buttonTitle}>
                  {I18n.t('modalConfirm.button.1')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {
          existPrint !== undefined && !existPrint && (
            <View style={styles.buttonWrapper}>
            <TouchableOpacity
              onPress={onClosePopup}
              style={[
                styles.buttonCancel,
                {backgroundColor: colors.PRIMARY, marginRight: 10},
              ]}>
              <Text style={styles.buttonTitle}>
                {' '}
                {I18n.t('modalConfirm.button.3')}
              </Text>
            </TouchableOpacity>
          </View>
          )
        }
      </View>
      {props.children}
    </Modal>
  );
};

export default ModalPrint;

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
    paddingTop: 20,
  },
  contentContainer: {
    flex: 3,
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
    flex: 0.7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.BG_GRAY,
  },
  buttonCancel: {
    height: 40,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.RED,
    borderRadius: 20,
    alignSelf: 'center',
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
