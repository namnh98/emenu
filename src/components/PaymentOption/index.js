import React from 'react';
import {colors} from '../../assets';
import BottomSheet from '../BottomSheet';
import ButtonComponent from '../ButtonComponent';
import TextComponent from '../TextComponent';

const PaymentOption = ({setRef, onPress}) => {
  return (
    <BottomSheet setRef={setRef} height={300}>
      <TextComponent heavy medium center mTop={10}>
        Phương thức thanh toán
      </TextComponent>

      <ButtonComponent
        onPress={() => onPress(true)}
        title="Bằng tiền mặt"
        iconName="credit-card-alt"
        titleColor={colors.WHITE}
        bgButton={colors.PRIMARY}
        borRadius={30}
        padding={15}
        mTop={20}
        center
        iconStyle={{
          position: 'absolute',
          left: 20,
        }}
        titleStyle={{
          fontSize: 16,
        }}
      />

      <ButtonComponent
        onPress={() => onPress(false)}
        title="Bằng thẻ ngân hàng"
        iconName="credit-card"
        titleColor={colors.WHITE}
        bgButton={colors.PRIMARY}
        borRadius={30}
        padding={15}
        mTop={15}
        center
        iconStyle={{
          position: 'absolute',
          left: 20,
        }}
        titleStyle={{
          fontSize: 16,
        }}
      />
    </BottomSheet>
  );
};

export default PaymentOption;
