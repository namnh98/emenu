import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../../assets';
import ButtonComponent from '../ButtonComponent';
import { images } from '../../assets';
import TextComponent from '../TextComponent';

const { width } = Dimensions.get('screen');

const ModalOption = ({
  isVisible,
  onLeftPress,
  onRightPress,
  leftBtnTitle,
  rightBtnTitle,
  title,
  content,
  imgPath,
  navigation,
  onClosePopup,
}) => {
  const _renderButton = () => {
    return (
      <View style={styles.buttonWrapper}>
        <TouchableOpacity onPress={onLeftPress} style={{ ...styles.button }}>
          <TextComponent heavy color={colors.WHITE}>
            {leftBtnTitle || ''}
          </TextComponent>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.button }}
          onPress={onRightPress}>
          <TextComponent heavy color={colors.WHITE}>
            {rightBtnTitle || ''}
          </TextComponent>
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
      <Text style={{ ...styles.buttonTitle, color: colors.ORANGE }}>
        Tất cả: Thanh toán toàn bộ món ăn trên hoá đơn
      </Text>
      <Text style={{ ...styles.buttonTitle, color: colors.ORANGE }}>
        Theo món: Có thể chia hoá đơn ra thành nhiều hoá đơn nhỏ và thanh toán
        riêng
      </Text>
    </View>
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
      useNativeDriver
      hideModalContentWhileAnimating>
      <View style={styles.container}>
        <Image
          source={imgPath || images.WELCOME}
          style={{ height: 150, width: 150 }}
        />

        <TextComponent center fontSize={'500'} mTop={10}>{content || ''}</TextComponent>
        {_renderButton()}
      </View>
    </Modal>
  );
};

export default ModalOption;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
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
  },
  button: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.ORANGE,
    borderRadius: 20,
    marginHorizontal: 10,
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
