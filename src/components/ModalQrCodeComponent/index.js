import React from 'react';
import { Dimensions, Image, StyleSheet, View, Platform } from 'react-native';
import Modal from 'react-native-modal';
import QRCode from 'react-native-qrcode-svg';
import { log } from 'react-native-reanimated';
import { colors, images } from '../../assets';
import { HeaderPopup } from '../../components';
import ButtonComponent from '../ButtonComponent';
import TextComponent from '../TextComponent';
import { Sizes } from '@dungdang/react-native-basic'

const { width } = Dimensions.get('screen');

const ModalQrCodeComponent = ({
  isVisible,
  imageQrCode,
  onClosePopup,
  isAddFriend,
  onOrderMore,
  tblName,
  titleHeader
}) => {
  const title = isAddFriend
    ? 'QR Code để thêm khách hàng vào order'
    : 'Quét QRCode, khách hàng có thể tự gọi món\n qua Web hoặc App Omenu';
  return (
    <Modal
      backdropColor={'transparent'}
      style={{ margin: 0, backgroundColor: 'rgba(0,0,0,.6)' }}
      isVisible={isVisible}
      statusBarTranslucent
      animationIn="zoomInDown"
      animationOut="zoomOutDown"
      onBackdropPress={onClosePopup}
      animationOutTiming={500}
      animationInTiming={500}
      useNativeDriver
      hideModalContentWhileAnimating>
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <HeaderPopup title={titleHeader ? titleHeader : "QRCODE DÀNH CHO KHÁCH HÀNG"} onClose={onClosePopup} />
          <TextComponent mTop={10} center mBottom={5} >
            {title}
          </TextComponent>

          <View
            style={{
              flex: 8,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
              padding: 10,
            }}>
            {imageQrCode ? (
              <QRCode
                value={imageQrCode}
                logo={images.OMENU_QRCODE}
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
                source={images.OMENU_QRCODE}
              />
            )}
          </View>

          <View
            style={{ flex: 2.5, justifyContent: 'flex-start', alignItems: 'center', }}>
            <TextComponent lineHeight={20} mBottom={20} medium color={colors.BLACK}>{"Bàn " + tblName}</TextComponent>
            <ButtonComponent
              onPress={onClosePopup}
              title="Đóng"
              titleColor={colors.WHITE}
              paddingV={5}
              mTop={5}
              bottom={5}
              width={Sizes.s160}
              height={Sizes.s100 - Sizes.s20}
              center
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

export default ModalQrCodeComponent;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  container: {
    backgroundColor: colors.GRAY,
    height: width * 1.3,
    borderRadius: 5,
    justifyContent: 'center',
    // alignItems: 'center',
  },
});
