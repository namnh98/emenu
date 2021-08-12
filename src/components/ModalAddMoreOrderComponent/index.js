import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import QRCode from 'react-native-qrcode-svg';
import { colors, images } from '../../assets';
import { HeaderPopup } from '..';
import ButtonComponent from '../ButtonComponent';

const { width } = Dimensions.get('screen');

const ModalAddMoreOrder = ({
  isVisible,
  imageQrCode,
  onClosePopup,
  onOrderMore,
}) => {
  return (
    <Modal
      backdropColor={'transparent'}
      style={{ margin: 0, backgroundColor: 'rgba(0,0,0,.6)' }}
      isVisible={isVisible}
      statusBarTranslucent
      animationIn="zoomInDown"
      animationOut="zoomOutDown"
      onBackdropPress={onClosePopup}
      useNativeDriver
      hideModalContentWhileAnimating>
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <HeaderPopup
            title="Quét qr-code để thêm order"
            onClose={onClosePopup}
          />

          <View
            style={{
              flex: 8,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
              marginHorizontal: 50,
              padding: 10,
            }}>
            {imageQrCode ? (
              <QRCode
                value={imageQrCode}
                logo={images.LOGO_STAFF}
                size={width * 0.75}
                logoSize={30}
                logoBackgroundColor={colors.WHITE}
              />
            ) : (
              <Image
                style={{
                  flex: 1,
                  resizeMode: 'contain',
                }}
                source={images.LOGO_STAFF}
              />
            )}
          </View>

          <View
            style={{ flex: 2.5, justifyContent: 'center', alignItems: 'center' }}>
            <ButtonComponent
              onPress={onOrderMore}
              title="Gọi món"
              titleColor={colors.WHITE}
              paddingV={5}
              paddingH={15}
              borRadius={20}
              bgButton={colors.ORANGE}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalAddMoreOrder;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  container: {
    backgroundColor: colors.GRAY,
    height: width * 1.2,
    borderRadius: 5,
  },
});
