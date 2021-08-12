import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import I18n from '../../i18n';
import { colors } from '../../assets';
import ButtonComponent from '../ButtonComponent';

const { width } = Dimensions.get('screen');
const TooltipComponent = ({
  isVisible,
  title,
  content,
  onClosePopup,
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
      <View style={styles.contentContainer}>
        {title && (
          <Text style={styles.contentTitle} numberOfLines={1}>
            {title}
          </Text>
        )}
        <Text style={styles.contentSubTitle} numberOfLines={2}>
          {content}
        </Text>
      </View>
    );
  };

  return (
    <Modal
      backdropOpacity={0.5}
      isVisible={isVisible}
      statusBarTranslucent
      animationIn="zoomInDown"
      animationOut="zoomOutDown"
      animationOutTiming={500}
      onBackdropPress={onClosePopup}
      useNativeDriver
      hideModalContentWhileAnimating>
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          {_renderButtonClose()}
          <View style={styles.contentWrapper}>
            {_renderContent()}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TooltipComponent;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  container: {
    backgroundColor: colors.WHITE,
    height: width /2.5,
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
    borderColor: colors.BG_GRAY,
    marginTop: 10,
    width: '90%',
    height: 70,
    padding: 10,
  },
});
