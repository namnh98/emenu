import React, {useEffect, useRef, useState} from 'react';
import {
  Container,
  BodyWrapper,
  OptionWrapper,
  Row,
  Row2,
  ButtonShowAll,
} from './styles';
import {View, KeyboardAvoidingView} from 'react-native';
import {useSelector} from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  ButtonComponent,
  HeaderComponent,
  InfoPayment,
  ListFoodPayment,
  SplitTheMoney,
  PaymentOption,
  TextComponent,
  ModalShowPrice,
  ModalOption,
  LoadingComponent,
} from '../../../components';
import {colors} from '../../../assets';
import {
  PAYMENT_DETAIL,
  FOOD_ORDERED,
  EDIT_FOOD,
} from '../../../navigators/ScreenName';
import {OrderApi} from '../../../api';
import {FormatNumber} from '../../../untils';
import {useIsFocused} from '@react-navigation/native';

export const _renderBtnOption = (money, onPress, onShowMoney, titleBtn) => {
  return (
    <OptionWrapper>
      {/* {listFoodSelected || isTakeAway ? null : (
        <ButtonComponent
          onPress={_onShowSplitMoney}
          title="Chia tiền"
          borColor={colors.PRIMARY}
          paddingV={5}
          paddingH={10}
          borRadius={5}
          titleColor={colors.PRIMARY}
        />
      )} */}
      <Row2 onPress={onShowMoney}>
        <FontAwesome5
          name="search-dollar"
          size={18}
          color={colors.DARK_PRIMARY}
        />
        <FormatNumber
          value={money}
          heavy
          large
          textColor={colors.ORANGE}
          mLeft={5}
        />
      </Row2>

      <ButtonComponent
        onPress={onPress}
        title={titleBtn}
        borColor={colors.ORANGE}
        bgButton={colors.ORANGE}
        paddingV={10}
        paddingH={14}
        borRadius={5}
        titleColor={colors.ORANGE}
        borRadius={20}
        titleColor={colors.WHITE}
      />
    </OptionWrapper>
  );
};

const PaymentScreen = ({navigation, route}) => {
  const RBSheetRef = useRef();
  const orderInfo = useRef({});
  const [listFood, setListFood] = useState([]);
  const [listCombo, setListCombo] = useState([]);
  const [listItems, setListItems] = useState([]);
  const [isSplitMoney, setIsSplitMoney] = useState(false);
  const [valueSurcharge, setValueSurcharge] = useState(0);
  const {listFoodSelected, isTakeAway, table, areaId} = route.params;
  const foodsCounter = useRef(0);
  const voucherValue = useRef(0);
  const voucherType = useRef(-1);
  const [totalPayment, setTotalPayment] = useState(
    total_money + valueSurcharge,
  );
  const {currency} = useSelector((state) => state.partners);
  const [modalWarning, setModalWarning] = useState(false);
  const titleModalRef = useRef('');
  const contentModalRef = useRef('');
  const [modalShowPrice, setModalShowPrice] = useState(false);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    getListFood();
  }, [isFocused]);

  const ListFoodHavePrice = ({combo, items}) => {
    //Customize man hinh payment khi thanh toan tat ca
    if (combo.length > 0) {
      return (
        <View>
          <TextComponent color={colors.ORANGE} center heavy medium mBottom={10}>
            Suất ăn đã gọi
          </TextComponent>
          <ListFoodPayment data={combo} isCombo={true} isPayOneByOne={false} />
          <TextComponent color={colors.ORANGE} center medium marginV={10}>
            Mỗi suất bao gồm
          </TextComponent>
          <ListFoodPayment
            data={combo[0].order_items}
            isPayOneByOne={false}
            isCombo={false}
          />
          {items.length > 0 ? (
            <TextComponent
              color={colors.ORANGE}
              heavy
              center
              medium
              marginV={10}>
              Các món khác
            </TextComponent>
          ) : null}
          <ListFoodPayment isPayOneByOne={false} isCombo={false} data={items} />
        </View>
      );
    } else {
      return (
        <ListFoodPayment isPayOneByOne={false} isCombo={false} data={items} />
      );
    }
  };

  useEffect(() => {
    console.log('check');
    const list1 = listFood.filter(
      (item) =>
        item.order_item_status?.id === 1 ||
        item.order_item_status?.id === 2 ||
        item.order_item_status?.id === 3,
    );
    const list2 = listFood.filter((item) => item.is_open_price && !item.price);
    if (list1.length > 0) {
      contentModalRef.current =
        'Bạn không thể thanh toán khi có món ăn vẫn đang chờ xử lý. Vui lòng kiểm tra món trước khi thanh toán!';
      setModalWarning(true);
      return;
    } else if (list2.length > 0) {
      contentModalRef.current = `Có ${list2.length} món [Theo thời giá] chưa được cập nhật đơn giá. Vui lòng kiểm tra lại trước khi thanh toán!`;
      setModalWarning(true);
      return;
    }
  }, [listFood]);

  const getListFood = async () => {
    try {
      if (!isFocused) return;
      setLoading(true);
      const data = listFoodSelected
        ? await OrderApi.checkedPayment(route.params.id, listFoodSelected)
        : await OrderApi.getOrderedById(route.params.id);
      orderInfo.current = data;
      const {order_combo_items, order_items} = data;
      foodsCounter.current =
        order_items?.length +
        order_combo_items?.reduce(
          (init, item) => init + item?.order_items.length,
          0,
        );
      setListCombo(order_combo_items || []);
      setListItems(order_items || []);
      const newData = order_items.concat(
        order_combo_items[0]?.order_items || [],
      );
      setListFood(newData || []);
      setLoading(false);
    } catch (error) {
      console.log('Err @getListFood ', error);
      setListCombo([]);
      setListItems([]);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const _onShowSplitMoney = () => setIsSplitMoney(!isSplitMoney);

  const _onPaymentOption = () => {
    const list1 = listFood.filter(
      (item) =>
        item.order_item_status?.id === 1 ||
        item.order_item_status?.id === 2 ||
        item.order_item_status?.id === 3,
    );
    // const list2 = listFood.filter((item) => item.is_open_price && !item.price);
    // if (list1.length > 0) {
    //   titleModalRef.current = 'Không thành công';
    //   contentModalRef.current =
    //     'Bạn không thể thanh toán khi có món ăn vẫn đang chờ xử lý. Vui lòng kiểm tra món trước khi thanh toán!';
    //   setModalWarning(true);
    //   return;
    // } else if (list2.length > 0) {
    //   titleModalRef.current = 'Không thành công';
    //   contentModalRef.current = `Có ${list2.length} món [Theo thời giá] chưa được cập nhật đơn giá. Vui lòng kiểm tra lại trước khi thanh toán!`;
    //   setModalWarning(true);
    //   return;
    // } else {
      navigation.navigate(PAYMENT_DETAIL, {
        isPayAll: route.params.listFoodSelected ? false : true,
        isPaymentOffline: true,
        listFood: listFoodSelected ? listFoodSelected : listFood,
        id: route.params?.id,
        table: table,
        valueSurcharge,
        totalPayment: totalPayment,
        voucherValue: voucherValue.current,
        voucherType: voucherType.current,
        ...orderInfo.current,
        areaId,
        isTakeAway: route.params.isTakeAway ? route.params.isTakeAway : false,
      });
    
  };
  // Tam thoi an 2 phuong thuc thanh toan
  // const _onPayment = (isPaymentOffline) => {
  //   RBSheetRef.current.close();
  //   navigation.navigate(PAYMENT_DETAIL, {
  //     isPayAll : route.params.listFoodSelected? false: true,
  //     isPaymentOffline,
  //     listFood: listFoodSelected ? listFoodSelected : listFood,
  //     id: route.params?.id,
  //     table: route.params?.table,
  //     valueSurcharge,
  //     totalPayment: totalPayment,
  //     voucherPrice: voucherPrice.current,
  //     ...orderInfo.current,
  //   });
  // };

  const onEditFood = () => {
    setModalWarning(false);
    navigation.navigate(EDIT_FOOD, {...route.params});
  };
  const onContinuePay = () => {
    setModalWarning(false);
    navigation.navigate(PAYMENT_DETAIL, {
      isPayAll: route.params.listFoodSelected ? false : true,
      isPaymentOffline: true,
      listFood: listFoodSelected ? listFoodSelected : listFood,
      id: route.params?.id,
      table: table,
      valueSurcharge,
      totalPayment: totalPayment,
      voucherValue: voucherValue.current,
      voucherType: voucherType.current,
      ...orderInfo.current,
      areaId,
      isTakeAway: route.params.isTakeAway ? route.params.isTakeAway : false,
    });
  };

  const _onChangeSurcharge = (props) => {
    const {value} = props;
    setValueSurcharge(+value);
  };

  const _forWardVoucher = (total, value, type) => {
    voucherValue.current = value;
    voucherType.current = type;
    setTotalPayment(total);
  };
  const _onShowAll = () => {
    const list = listFood?.map((food) => {
      const {qty, image, item_name, price, unit_item} = food;
      return {
        count: qty,
        image: image,
        name: item_name,
        price: price,
        amount: qty * price,
        unit_item,
      };
    });
    navigation.navigate(FOOD_ORDERED, {listFood: list, isEdit: false});
  };

  const onShowMoney = () => setModalShowPrice(true);

  const {
    sub_total,
    discount_voucher_per,
    discount_bill_value,
    discount_food_value,
    discount_drink_value,
    vat_per,
    vat_value,
    total_money,
    is_vat_surcharge,
  } = orderInfo.current || {};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <Container>
        <HeaderComponent
          title={isTakeAway ? 'Thanh toán' : `Bàn ${table?.name} thanh toán`}
          isNotify
        />

        <BodyWrapper showsVerticalScrollIndicator={false}>
          <Row>
            <TextComponent heavy medium>
              Món ăn(
              {listFoodSelected
                ? listFoodSelected?.length
                : foodsCounter.current}
              )
            </TextComponent>
            {listFood.length > 10 && <ButtonShowAll onPress={_onShowAll} />}
          </Row>
          {listFoodSelected ? (
            <ListFoodPayment
              data={listFoodSelected.slice(0, 10)}
              isPayOneByOne={false}
              isGetQtyFromRedux={true}
            />
          ) : (
            <ListFoodHavePrice
              combo={listCombo}
              items={listItems.slice(0, 10)}
            />
          )}
          <View style={{height: 10}} />
          <InfoPayment
            totalMoney={sub_total}
            discountBill={discount_bill_value}
            discountFood={discount_food_value}
            discountDrink={discount_drink_value}
            varPer={vat_per}
            vatValue={
              vat_value +
              valueSurcharge * (is_vat_surcharge ? vat_per / 100 : 0)
            }
            totalPayment={
              sub_total +
              vat_value +
              valueSurcharge * (is_vat_surcharge ? vat_per / 100 + 1 : 1) -
              discount_food_value -
              discount_bill_value -
              discount_drink_value
            }
            discountVoucher={discount_voucher_per}
            forWardVoucher={_forWardVoucher}
            onChangeSurcharge={_onChangeSurcharge}
          />
          {isSplitMoney && <SplitTheMoney money={totalPayment} />}
        </BodyWrapper>
        {_renderBtnOption(
          totalPayment,
          _onPaymentOption,
          onShowMoney,
          'Thanh toán',
        )}

        {/* <PaymentOption setRef={RBSheetRef} onPress={_onPayment} /> */}
        <ModalShowPrice
          visible={modalShowPrice}
          price={totalPayment}
          onClosePopup={() => setModalShowPrice(false)}
        />
        <ModalOption
          isVisible={modalWarning}
          onClosePopup={() => setModalWarning(false)}
          content={contentModalRef.current}
          leftBtnTitle="Xem danh sách món"
          rightBtnTitle="Tiếp tục thanh toán"
          onLeftPress={onEditFood}
          onRightPress={() => setModalWarning(false)}
        />
        <LoadingComponent isLoading={loading} />
      </Container>
    </KeyboardAvoidingView>
  );
};

export default PaymentScreen;
