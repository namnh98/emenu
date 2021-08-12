import React, {useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {InputComponent} from '..';
import {colors} from '../../assets';
import I18n from '../../i18n';

const {width} = Dimensions.get('screen');

const ModalCfirmDropdownComponent = ({
  isVisible,
  title,
  content,
  isNote,
  isNotConfirm,
  loading,
  onClosePopup,
  onConfirm,
  optionSelect,
  placeHolder,
  isDisabled,
}) => {
  const [showText, setShowText] = useState(false); //show input text
  const [showErr, setShowErr] = useState(false);
  const [value, setValue] = useState(null); //default seclect
  const [textValue, setTextValue] = useState(''); // giá trị input text

  // reset data when close popup
  const _resetValue = () => {
    setTextValue('');
    setValue(null);
    setShowText(false);
    onClosePopup();
  };

  const _CallbackConfirm = () => {
    if (!isNote) return onConfirm();

    if (value === null || (value === 4 && textValue === '')) {
      return setShowErr(true);
    } else {
      if (value === 4) {
        setShowText(false);
        setShowErr(false);
        onConfirm(textValue);
        return;
      }
    }
    setTextValue('');
    setShowText(false);
    onConfirm(value);
  };

  const _renderButtonClose = () => {
    return (
      <TouchableOpacity
        onPress={() => _resetValue()}
        style={styles.btnCloseWrapper}>
        <Ionicons name="close" size={24} color={colors.BLACK_GRAY} />
      </TouchableOpacity>
    );
  };

  const _onChangeItem = (item) => {
    if (item.value === 4) {
      setValue(item.value);
      setShowErr(false);
      return setShowText(true);
    }
    setShowErr(false);
    setValue(item.value);
    setShowText(false);
  };

  const _renderContent = () => {
    return (
      <View style={[styles.contentContainer, isNote && {flex: 10}]}>
        {title && (
          <Text style={styles.contentTitle} numberOfLines={1}>
            {title}
          </Text>
        )}
        <Text style={styles.contentSubTitle} numberOfLines={2}>
          {content}
        </Text>
        {isNote && (
          <View style={styles.dropdown}>
            <DropDownPicker
              items={optionSelect}
              defaultValue={value}
              onChangeItem={(item) => _onChangeItem(item)}
              dropDownStyle={{width: 250}}
              containerStyle={{height: 40}}
              itemStyle={{justifyContent: 'flex-start'}}
              placeholder={placeHolder}
              disabled={isDisabled}
            />
          </View>
        )}
        {showText && (
          <InputComponent
            style={styles.input}
            placeholder="Lý do khác"
            multiline
            value={textValue}
            onChangeText={(value) => setTextValue(value)}
          />
        )}
        {showErr && <Text style={styles.err}>Vui lòng xác nhận do hủy</Text>}
      </View>
    );
  };

  const _renderButton = () => {
    if (!onConfirm || isNotConfirm) {
      return (
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            onPress={() => _resetValue()}
            style={[styles.buttonCancel, {backgroundColor: colors.PRIMARY}]}>
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
          onPress={() => _resetValue()}
          style={styles.buttonCancel}>
          <Text style={styles.buttonTitle}>
            {I18n.t('modalConfirm.button.1')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={loading}
          onPress={() => _CallbackConfirm()}
          style={styles.buttonOk}>
          {loading ? (
            <ActivityIndicator animating size="small" color={colors.WHITE} />
          ) : (
            <Text style={styles.buttonTitle}>
              {I18n.t('modalConfirm.button.2')}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

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
      <View style={styles.modalContainer}>
        <View style={[styles.container, showText && {height: width * 0.85}]}>
          {_renderButtonClose()}
          <View style={styles.contentWrapper}>
            {_renderContent()}
            {_renderButton()}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalCfirmDropdownComponent;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  container: {
    backgroundColor: colors.GRAY,
    height: width / 1.5,
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
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
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
    zIndex: -5,
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
    borderColor: colors.BG_GRAY,
    marginTop: 10,
    width: '90%',
    height: 90,
    padding: 10,
    zIndex: -5,
  },
  dropdown: {
    width: 250,
    height: 40,
    marginTop: 10,
  },
  err: {
    color: 'red',
    padding: 10,
    fontStyle: 'italic',
    zIndex: -5,
  },
});
