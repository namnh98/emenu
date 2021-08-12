import React, { useState, useEffect } from 'react';
import { colors, images } from '../../../assets';
import TextComponent from '../../../components/TextComponent';
import { StatusBar } from 'react-native';
import FormatNumber from '../../../untils/FormatNumber';
import { ButtonComponent, ModalShowPrice } from '../../../components';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { BillApi } from '../../../api';
import {
  Wrapper,
  Container,
  Heading,
  Title,
  Row,
  Logo,
  LogoTitle,
  DeviceWrapper,
  Footer,
  Item,
  ItemWrapper,
  Line,
  LineItem,
  Menu,
  MenuName,
  MenuPrice,
  MenuSL,
  MenuTotal,
  PriceWrapper,
  RowBetween,
  Scanner,
  UnitWrapper,
  Voucher,
  LineLeft,
  LineRight,
  RowTop,
  DiscountWrap,
  Discount,
  BodyWrap,
  ShowPrice,
} from './styles';
import { useSelector } from 'react-redux';
import userInfo from '../../../stores/userInfo';
import FormatMoment from '../../../untils/FormatMoment';

const InvoiceScreen = ({ navigation, route }) => {
  const {
    listFood,
    table,
    valueSurcharge,
    isProvisional,
    order_no,
    sub_total,
    discount_voucher_per,
    discount_bill_value,
    discount_drink_value,
    discount_food_value,
    vat_per,
    vat_value,
    totalPayment,
    voucherValue,
    voucherType,
    is_vat,
    is_vat_surcharge,
    customer_name,
    customer_tel,
  } = route.params;

  const partners = useSelector((state) => state.partners);
  const [staffName, setStaffName] = useState('Nhân viên');
  const [modalShowPrice, setModalShowPrice] = useState(false);
  const [billDetail, setBillDetail] = useState(null);

  const { address, name, logo, tel, website } = partners || {};

  useEffect(() => {
    (async () => {
      const { full_name } = await userInfo.getListUser();
      setStaffName(full_name);
    })();
    getBillInfo();
  }, []);

  const getBillInfo = async () => {
    if (totalPayment != undefined && !route.params.id) return;
    try {
      const res = await BillApi.getBillByOrderId(route.params.id);
      setBillDetail(res[0]);
    } catch (error) {
      console.log('loi');
    }
  };

  const _onGoBack = () => navigation.goBack();

  const _onPrintBill = () => {
    // navigation.navigate('PRINT_BILL_BLUETOOTH', {
    // order_no, table, staffName, item_name, qty, price
  };

  const _renderUnit = () => (
    <UnitWrapper>
      <TextComponent tiny color={colors.TEXT_GRAY}>
        (đ)
      </TextComponent>
    </UnitWrapper>
  );

  const _renderHeader = () => {
    return (
      <Heading>
        <Row>
          <Logo source={logo ? { uri: logo } : images.LOGO_STAFF} />
          <LogoTitle>
            <TextComponent large center>
              {name}
            </TextComponent>
            {website && <TextComponent small>Web: {website}</TextComponent>}
            {tel && <TextComponent small>Tel: {tel}</TextComponent>}
            <TextComponent small>{address}</TextComponent>
          </LogoTitle>
        </Row>
      </Heading>
    );
  };

  const _renderDevice = () => {
    return (
      <DeviceWrapper>
        <Line source={images.LINE} />
        <LineLeft source={images.CIRCLE_2} />
        <Line source={images.CIRCLE_1} />
        <LineRight source={images.CIRCLE_3} />
        <Line source={images.LINE} />
      </DeviceWrapper>
    );
  };

  const _renderTitle = () => {
    return (
      <Title>
        <TextComponent large center mBottom={5}>
          HÓA ĐƠN TÍNH TIỀN
        </TextComponent>
        <TextComponent center mBottom={10}>
          {FormatMoment.FormatCurrentDate()}
        </TextComponent>

        <RowBetween>
          {table ? (
            <TextComponent>Bàn số: {table?.name}</TextComponent>
          ) : (
            <TextComponent>Khách hàng: {customer_name || ''}</TextComponent>
          )}
          <TextComponent>Số hóa đơn: {order_no}</TextComponent>
        </RowBetween>

        <RowTop>
          {table ? (
            <TextComponent>Khu vực: {table?.area?.name || ''}</TextComponent>
          ) : (
            <TextComponent>SĐT: {customer_tel || 0}</TextComponent>
          )}
          <TextComponent>Thu ngân: {staffName}</TextComponent>
        </RowTop>
      </Title>
    );
  };

  const _renderHeaderMenu = () => {
    return (
      <Menu>
        <MenuName>
          <TextComponent>Tên món</TextComponent>
        </MenuName>
        <MenuSL>
          <TextComponent>SL</TextComponent>
        </MenuSL>
        <MenuPrice>
          {_renderUnit()}
          <TextComponent>Đơn giá</TextComponent>
        </MenuPrice>
        <MenuTotal>
          {_renderUnit()}
          <TextComponent>TH.Tiền</TextComponent>
        </MenuTotal>
      </Menu>
    );
  };

  const _renderListFood = () => {
    return listFood?.map((value) => {
      const { id, item_name, qty, price } = value || {};
      return (
        <ItemWrapper key={id}>
          <Item>
            <MenuName>
              <TextComponent numberLine={1}>{item_name}</TextComponent>
            </MenuName>
            <MenuSL>
              <TextComponent numberLine={1}>{qty}</TextComponent>
            </MenuSL>
            <MenuPrice>
              <FormatNumber value={price} notUnit numberLine={1} />
            </MenuPrice>
            <MenuTotal>
              <FormatNumber value={qty * price} notUnit numberLine={1} />
            </MenuTotal>
          </Item>
          <LineItem source={images.LINE_BOTTOM} />
        </ItemWrapper>
      );
    });
  };

  const _renderDiscount = () => {
    if (
      !!!discount_bill_value &&
      !!!discount_drink_value &&
      !!!discount_food_value
    ) {
      return null;
    }

    return (
      <DiscountWrap>
        <TextComponent>Khuyến mãi</TextComponent>
        <Discount>
          {!!discount_bill_value && (
            <Row>
              <FormatNumber value={discount_bill_value} notUnit />
              <TextComponent>(Hoá đơn)</TextComponent>
            </Row>
          )}
          {!!discount_food_value && (
            <Row>
              <FormatNumber value={discount_food_value} notUnit />
              <TextComponent>(Thức ăn)</TextComponent>
            </Row>
          )}
          {!!discount_drink_value && (
            <Row>
              <FormatNumber value={discount_drink_value} notUnit />
              <TextComponent>(Thức uống)</TextComponent>
            </Row>
          )}
        </Discount>
      </DiscountWrap>
    );
  };

  const _renderPrice = () => {
    return (
      <PriceWrapper>
        <RowBetween>
          <TextComponent heavy>Tổng cộng</TextComponent>
          <FormatNumber value={sub_total} notUnit />
        </RowBetween>
        <RowTop>
          <TextComponent>Phụ thu</TextComponent>
          <FormatNumber
            value={
              route.params.totalPayment != undefined
                ? valueSurcharge
                : billDetail?.surcharge_value
            }
            notUnit
          />
        </RowTop>
        <RowTop>
          <TextComponent heavy>Tiền trước thuế</TextComponent>
          <FormatNumber
            value={
              sub_total +
              (route.params.totalPayment != undefined
                ? valueSurcharge
                : billDetail?.surcharge_value)
            }
            notUnit
          />
        </RowTop>
        {_renderDiscount()}
        <RowTop>
          <TextComponent heavy>Thuế ({vat_per}%)</TextComponent>
          <FormatNumber
            value={
              route.params.totalPayment != undefined
                ? vat_value +
                valueSurcharge * (is_vat_surcharge ? vat_per / 100 : 0)
                : billDetail?.vat_value
            }
            notUnit
          />
        </RowTop>
        {voucherValue && (
          <RowTop>
            <TextComponent>
              Voucher {voucherType === 1 ? `(Giảm ${voucherValue}%)` : ''}
            </TextComponent>
            <FormatNumber
              value={
                voucherType === 1
                  ? (voucherValue * sub_total) / 100
                  : voucherValue
              }
              notUnit
            />
          </RowTop>
        )}
      </PriceWrapper>
    );
  };
  const _renderTotal = () => {
    if (isProvisional) {
      return (
        <PriceWrapper>
          <RowBetween>
            <TextComponent medium heavy>
              Tổng thanh toán
            </TextComponent>
            <ShowPrice onPress={() => setModalShowPrice(true)}>
              <FontAwesome5 name="search-dollar" size={16} />
              <FormatNumber
                value={
                  route.params.totalPayment != undefined
                    ? totalPayment
                    : billDetail?.total_payment
                }
                notUnit
                heavy
              />
            </ShowPrice>
          </RowBetween>
        </PriceWrapper>
      );
    }

    return (
      <PriceWrapper>
        <RowBetween>
          <TextComponent medium heavy>
            Tổng thanh toán
          </TextComponent>
          <TextComponent heavy>1.181.000</TextComponent>
        </RowBetween>
        <RowTop>
          <TextComponent>Tiền mặt</TextComponent>
          <TextComponent>1.181.000</TextComponent>
        </RowTop>
        <RowTop>
          <TextComponent>Tiền trả lại khách</TextComponent>
          <TextComponent>1.181.000</TextComponent>
        </RowTop>
      </PriceWrapper>
    );
  };

  const _renderVoucher = () => {
    if (isProvisional) return null;
    return (
      <Voucher>
        <TextComponent heavy>HĐ đã được khuyến mãi</TextComponent>
        <TextComponent center mTop={10}>
          Giảm voucher 150.000đ
        </TextComponent>
        <TextComponent center mTop={10} heavy small>
          Trân trọng cảm ơn
        </TextComponent>
        <TextComponent center mTop={15} medium>
          Tải ngay ứng dụng để nhận ưu đãi giảm giá 50%
        </TextComponent>
        <Scanner source={images.LOGO_STAFF} />
      </Voucher>
    );
  };

  const _renderFooter = () => {
    return (
      <Footer>
        <ButtonComponent
          onPress={_onPrintBill}
          title="In"
          iconName="print"
          borColor={colors.PRIMARY}
          iconColor={colors.PRIMARY}
          titleColor={colors.PRIMARY}
          paddingV={5}
          paddingH={10}
          borRadius={5}
          rowItem
          mRight={10}
        />
        <ButtonComponent
          onPress={_onGoBack}
          title="Trở về"
          iconName="arrow-left"
          borColor={colors.TEXT_GRAY}
          iconColor={colors.TEXT_GRAY}
          titleColor={colors.TEXT_GRAY}
          paddingV={5}
          paddingH={10}
          borRadius={5}
          rowItem
        />
      </Footer>
    );
  };

  return (
    <Wrapper>
      <Container>
        <StatusBar barStyle="dark-content" />
        <BodyWrap>
          {_renderHeader()}
          {_renderDevice()}
          {_renderTitle()}
          {_renderHeaderMenu()}
          {_renderListFood()}
          {_renderPrice()}
          {_renderTotal()}
          {_renderVoucher()}
        </BodyWrap>
        {_renderFooter()}
      </Container>
      <ModalShowPrice
        visible={modalShowPrice}
        price={totalPayment}
        onClosePopup={() => setModalShowPrice(false)}
      />
    </Wrapper>
  );
};

export default InvoiceScreen;
