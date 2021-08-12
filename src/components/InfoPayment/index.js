import React, { useRef, useState } from 'react';
import { OrderApi } from '../../api';
import { colors } from '../../assets';
import { FormatNumber } from '../../untils';
import TextComponent from '../TextComponent';
import ModalShowPrice from '../ModalShowPrice';
import {
  BtnCloseVoucher,
  BtnConfirm,
  BtnVoucher,
  CloseVoucher,
  Container,
  Discount,
  DiscountWrap,
  FootWrapper,
  InputVoucher,
  Promotion,
  RowWrapper,
  VoucherWrapper,
  Row,
  ButtonPhuThu,
  UnderLine
} from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSelector } from 'react-redux';
import MoneyKeyboardComponent from './../MoneyKeyboardComponent/index';
import FormatMoment from '../../untils/FormatMoment'

const InfoPayment = ({
  totalMoney,
  discountBill,
  discountFood,
  discountDrink,
  varPer,
  vatValue,
  totalPayment,
  discountVoucher,
  forWardVoucher,
  onChangeSurcharge,
  isTakeAway,
}) => {
  const voucherInfo = useRef({});
  const [valueVoucher, setValueVoucher] = useState('');
  const [amount, setAmount] = useState();
  const [isErrorVoucher, setIsErrorVoucher] = useState(null);
  const [isVoucherSuccess, setIsVoucherSuccess] = useState(false);
  const [modalShowPrice, setModalShowPrice] = useState(false);
  const { currency } = useSelector((state) => state.partners);
  const { promotion, code, total_value, type } = voucherInfo.current;
  const [isShowMoneyKeyboard, setIsShowMoneyKeyboard] = useState(false);

  const TOTAL = isVoucherSuccess
    ? totalPayment -
    (type === 1 ? (total_value * totalMoney) / 100 : total_value)
    : totalPayment;

  forWardVoucher(TOTAL, total_value, type);

  const _onTextSurcharge = (surcharge) => setAmount(surcharge);

  const _onCheckVoucher = async () => {
    try {
      const voucher = await OrderApi.checkVoucher(valueVoucher);

      if (!voucher) setIsErrorVoucher(true);

      voucherInfo.current = voucher.data.data;
      setIsErrorVoucher(false);
    } catch (error) {
      console.log('Err @onCheckVoucher ', error);
      setIsErrorVoucher(true);
    }
  };

  const _onConfirmVoucher = () => {
    setIsErrorVoucher(null);
    setIsVoucherSuccess(!isVoucherSuccess);
  };

  const _onTextVoucher = (voucher) => setValueVoucher(voucher);


  const _MoneyKeyboard = value => {
    setAmount(value);
    onChangeSurcharge({value})
  }

  const _renderAlertVoucher = () => {
    if (isErrorVoucher === null) return;

    if (isErrorVoucher)
      return (
        <TextComponent color={colors.RED}>
          Mã voucher không tồn tại.
        </TextComponent>
      );
    return (
      <>
        <TextComponent color={colors.PRIMARY}>{`Giảm ${total_value}${type === 1 ? '%' : currency?.name_vn || 'VND'
          } cho mỗi hoá đơn`}</TextComponent>
        <BtnConfirm onPress={_onConfirmVoucher} />
      </>
    );
  };

  const _renderVoucher = () => {
    if (!isVoucherSuccess) return null;

    return (
      <VoucherWrapper>
        <RowWrapper>
          <RowWrapper>
            <TextComponent>Mã voucher</TextComponent>
            <BtnCloseVoucher title={code} onPress={_onConfirmVoucher} />
          </RowWrapper>

          <FormatNumber
            value={type === 1 ? (total_value * totalMoney) / 100 : total_value}
            textColor={colors.PRIMARY}
            leftUnit="-"
          />
        </RowWrapper>

        {/* <CloseVoucher /> bo icon check  */}
      </VoucherWrapper>
    );
  };

  const _renderDiscount = () => {
    if (!!!discountBill && !!!discountDrink && !!!discountFood) return null;

    return (
      <DiscountWrap>
        <TextComponent>Khuyến mãi</TextComponent>
        <Discount>
          {!!discountBill && (
            <RowWrapper>
              <TextComponent>(Hoá đơn) </TextComponent>
              <FormatNumber value={discountBill} leftUnit="-" />
            </RowWrapper>
          )}
          {!!discountFood && (
            <RowWrapper>
              <TextComponent>(Thức ăn) </TextComponent>
              <FormatNumber value={discountFood} leftUnit="-" />
            </RowWrapper>
          )}
          {!!discountDrink && (
            <RowWrapper>
              <TextComponent>(Đồ uống) </TextComponent>
              <FormatNumber value={discountDrink} leftUnit="-" />
            </RowWrapper>
          )}
        </Discount>
      </DiscountWrap>
    );
  };

  return (
    <Container>
      <RowWrapper isBottom>
        <TextComponent>Tổng cộng</TextComponent>
        <FormatNumber value={totalMoney} />
      </RowWrapper>


      <ButtonPhuThu onPress={() => setIsShowMoneyKeyboard(true)} isBottom>
        <TextComponent>Phụ thu</TextComponent>
        <RowWrapper>
          <TextComponent mRight={5} style={{ color: `${amount === undefined ? '#b3b3b3' : '#767676'}`, fontSize: 15 }}>
            {amount === undefined ? '0' : FormatMoment.NumberWithCommas(amount)}</TextComponent>
          <UnderLine />
          <TextComponent mLeft={5}>{currency?.name_vn || 'VND'}</TextComponent>
        </RowWrapper>
      </ButtonPhuThu>

      {/* <RowWrapper isBottom>
        <TextComponent>Phụ thu</TextComponent>
        <RowWrapper>
          <FormatNumber
            placeholder="Phụ thu"
            value={amount}
            onChangeText={_onTextSurcharge}
            onValueChange={onChangeSurcharge}
          />
          <TextComponent mLeft={5}>{currency?.name_vn || 'VND'}</TextComponent>
        </RowWrapper>
      </RowWrapper> */}

      {_renderDiscount()}
      <RowWrapper isBottom>
        <TextComponent>Thuế</TextComponent>
        <FormatNumber value={vatValue} leftUnit="+" />
      </RowWrapper>
      {discountVoucher > 0 && (
        <RowWrapper isBottom>
          <Promotion />
          <TextComponent color={colors.PRIMARY}>
            {discountVoucher || 0}%
          </TextComponent>
        </RowWrapper>
      )}
      <RowWrapper isBottom>
        <InputVoucher onChangeText={_onTextVoucher} />
        <BtnVoucher onPress={_onCheckVoucher} />
      </RowWrapper>
      {_renderAlertVoucher()}
      {_renderVoucher()}
      {isTakeAway && (
        <FootWrapper>
          <TextComponent heavy>Tổng tiền</TextComponent>
          <Row onPress={() => setModalShowPrice(true)}>
            <FontAwesome5
              name="search-dollar"
              size={18}
              color={colors.DARK_PRIMARY}
            />
            <FormatNumber
              value={TOTAL}
              heavy
              medium
              textColor={colors.ORANGE}
            />
          </Row>
        </FootWrapper>
      )}

      <ModalShowPrice
        visible={modalShowPrice}
        price={TOTAL}
        onClosePopup={() => setModalShowPrice(false)}
      />
      {
        isShowMoneyKeyboard &&
        <MoneyKeyboardComponent
          isShowMoneyKeyboard={isShowMoneyKeyboard}
          valueMoney={amount === undefined ? 0 : amount}
          title="Phụ thu"
          CloseMoneyKeyboard={() => setIsShowMoneyKeyboard(false)}
          MoneyKeyboard={(value) => _MoneyKeyboard(value)} />
      }
    </Container>
  );
};

export default InfoPayment;
