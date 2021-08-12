import React, { useState } from 'react';
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
import { InputComponent } from '../../components';
import I18n from '../../i18n';
import { colors } from '../../assets';
import ButtonComponent from '../ButtonComponent';
import Entypo from 'react-native-vector-icons/Entypo';
import { AlertModal } from '../../common';

const { width } = Dimensions.get('screen');

const ModalCfirmComponent = (props) => {
  const {
    isVisible,
    title,
    content,
    isNote,
    isNotConfirm,
    loading,
    onClosePopup,
    onConfirm,
    isError,
    onBackdropPress,
    onReject,
    onModalHide,
    confirmItem,
    onDelItem,
    ShowDialog,
    ProcessAll
  } = props;
  const [note, setNote] = useState('');

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
      <View style={[styles.contentContainer, isNote && { flex: 10 }, ShowDialog !== undefined && ShowDialog === 'SHOW_DIALOG' && { flex: 8 }]}>
        {title && (
          <View style={styles.row}>
            {title == AlertModal.TITLE[5] || title == AlertModal.TITLE[6] && (
              <Entypo name="warning" color={colors.RED} size={20} />
            )}
            <Text
              style={{
                ...styles.contentTitle,
                color:
                  title == AlertModal.TITLE[5] || title == AlertModal.TITLE[6] ? colors.RED : colors.BLACK,
              }}
              numberOfLines={1}>
              {title}
            </Text>
            {title == AlertModal.TITLE[5] || title == AlertModal.TITLE[6] && (
              <Entypo name="warning" color={colors.RED} size={20} />
            )}
          </View>
        )}
        {ShowDialog !== undefined && ShowDialog === 'SHOW_DIALOG' ?
          <Text style={styles.contentSubTitle} numberOfLines={5}>
            {content}
          </Text> :
          <Text style={styles.contentSubTitle} numberOfLines={3}>
            {content}
          </Text>
        }

        {isNote && (
          <InputComponent
            style={styles.input}
            placeholder="Lý do hủy"
            multiline
            value={note}
            onChangeText={(value) => setNote(value)}
          />
        )}
        {isError && (
          <Text style={styles.error} numberOfLines={1}>
            Vui lòng nhập lý do hủy
          </Text>
        )}
      </View>
    );
  };

  const _renderButton = () => {
    if (!onConfirm || isNotConfirm) {
      return (
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            onPress={onClosePopup}
            style={[styles.buttonCancel, { backgroundColor: colors.PRIMARY }]}>
            <Text style={styles.buttonTitle}>
              {I18n.t('modalConfirm.button.3')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          onPress={onReject ? onReject : confirmItem && ProcessAll === 'PROCESS' ? onDelItem : onClosePopup}
          style={styles.buttonCancel}>
          <Text style={styles.buttonTitle}>
            {onReject ? 'Từ chối' : confirmItem && ProcessAll === 'PROCESS' ? I18n.t('modalConfirm.button.4') : I18n.t('modalConfirm.button.1')}

          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={loading}
          onPress={() => onConfirm(note)}
          style={styles.buttonOk}>
          {loading ? (
            <ActivityIndicator animating size="small" color={colors.WHITE} />
          ) : (
            <Text style={styles.buttonTitle}>
              {confirmItem ? I18n.t('modalConfirm.button.5') : I18n.t('modalConfirm.button.2')}
            </Text>
          )}
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
      onBackdropPress={onBackdropPress ? onBackdropPress : onClosePopup}
      onModalWillShow={() => setNote('')}
      useNativeDriver
      onModalHide={onModalHide}
      hideModalContentWhileAnimating>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.modalContainer}>
          <View style={[styles.container, isNote && { height: width / 1.3 }, ShowDialog !== undefined && ShowDialog === 'SHOW_DIALOG' && { height: width / 1.3 }]}>
            {_renderButtonClose()}

            <View style={styles.contentWrapper}>
              {_renderContent()}
              {_renderButton()}
            </View>
          </View>
          {props.children}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalCfirmComponent;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  container: {
    backgroundColor: colors.WHITE,
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
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
  },
  buttonWrapper: {
    flex: 2.5,
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
