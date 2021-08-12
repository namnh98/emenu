import React from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import {colors, images} from '../../assets';
import ButtonComponent from '../ButtonComponent';
import PropTypes from 'prop-types';

const ModalPaymentPOS = ({isVisible, onClose, onRefresh, onCheckPayment}) => {
  return (
    <Modal
      backdropColor={'transparent'}
      style={{margin: 0, backgroundColor: 'rgba(0,0,0,.6)'}}
      isVisible={isVisible}
      statusBarTranslucent
      animationIn="zoomInDown"
      animationOut="zoomOutDown"
      animationOutTiming={500}
      onBackdropPress={onClose}
      useNativeDriver
      hideModalContentWhileAnimating>
      <Container>
        <Image source={images.PAYMENT_POS} resizeMode="contain" />

        <ButtonComponent
          disabled
          title="Đang chờ thu tiền bằng máy POS BIDV"
          iconName="check-circle-o"
          iconSize={28}
          iconColor={colors.BLUE}
          marginV={30}
          rowItem
        />

        <Button>
          <ButtonComponent
            title="Gủi lại"
            titleColor={colors.WHITE}
            bgButton={colors.PRIMARY}
            paddingV={8}
            paddingH={15}
            borRadius={20}
            mRight={10}
          />
          <ButtonComponent
            title="Kiểm tra giao dịch"
            titleColor={colors.WHITE}
            bgButton={colors.PRIMARY}
            paddingV={8}
            paddingH={15}
            borRadius={20}
            mRight={10}
          />
          <ButtonComponent
            onPress={onClose}
            title="Hủy bỏ"
            titleColor={colors.WHITE}
            bgButton={colors.RED}
            paddingV={8}
            paddingH={15}
            borRadius={20}
          />
        </Button>
      </Container>
    </Modal>
  );
};

ModalPaymentPOS.prototype = {
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
  onRefresh: PropTypes.func,
  onCheckPayment: PropTypes.func,
};

export default ModalPaymentPOS;

const Container = styled.View`
  background-color: ${colors.WHITE};
  padding: 30px 10px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
`;

const Image = styled.Image`
  width: 150px;
  height: 150px;
`;

const Button = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
