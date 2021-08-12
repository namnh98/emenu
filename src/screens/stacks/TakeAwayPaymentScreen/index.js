import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {NotifyApi, OrderApi} from '../../../api';
import {colors, images} from '../../../assets';
import {AlertModal} from '../../../common';
import {
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  ButtonComponent,
  HeaderComponent,
  InfoPayment,
  ModalCfirmComponent,
  PaymentOption,
  TextComponent,
} from '../../../components';
import {FOOD_ORDERED, PAYMENT_DETAIL} from '../../../navigators/ScreenName';
import {orderAction} from '../../../redux/actions';
import {userInfo} from '../../../stores';
import {FormatNumber} from '../../../untils';
import {
  BottomWrap,
  ButtonPayment,
  ButtonPrinter,
  ButtonSave,
  ButtonBackToHome,
  ButtonShowAll,
  CardImage,
  CardInfo,
  CardWrap,
  Container,
  InfoWrap,
  InputName,
  InputPhone,
  PaymentWrap,
  Row,
  RowCenter,
  RowItem,
  Wrapper,
  CheckTakeAway,
} from './styles';

const TakeAwayPayment = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {orders} = useSelector((state) => state);
  const {partners} = useSelector((state) => state);
  const RBSheetRef = useRef();
  const titleModal = useRef(null);
  const contentModal = useRef(null);
  const voucherPrice = useRef(0);
  const [valueSurcharge, setValueSurcharge] = useState(0);
  const [isPrint, setIsPrint] = useState(false);
  const [isModalAlert, setIsModalAlert] = useState(false);
  const [isLoadModal, setIsLoadModal] = useState(false);
  const [isNotConfirm, setIsNotConfirm] = useState(null);
  const [totalPayment, setTotalPayment] = useState(0);
  const [bill, setBill] = useState({});
  const [cusName, setCusName] = useState('');
  const [cusTel, setCusTel] = useState('');
  const [showErr, setShowErr] = useState(false);
  const [saveOrPay, setSaveOrPay] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const orderIdRef = useRef(null);

  useEffect(() => {
    checkPayment();
    // if (orders.length) {
    //   let result = 0;
    //   orders.map((value) => {
    //     const {sale_price, count, promotion} = value;
    //     const price = promotion ? promotion.sale_price_discount : sale_price;
    //     result += price * count;
    //   });
    //   setTotalPayment(result || 0);
    // }
  }, [isFocused]);

  const checkPayment = async () => {
    console.log(orders);
    const foods = orders.map((food) => {
      return {
        item_id: food.id,
        qty: food.count,
        note: food.note || '',
        is_takeaway: true,
        price: food.price || food.sale_price,
      };
    });
    try {
      const data = await OrderApi.checkedPayment('', foods);
      console.log(foods);
      console.log(data);
      setBill(data || {});
    } catch (error) {
      console.log('Err@GetCheckPayment ', error);
      setBill({});
    }
  };

  const _onShowAll = () => {
    const listFood = orders?.map((food) => {
      const {count, image, name, sale_price, unit_item} = food;
      return {
        count: count,
        image: image,
        name: name,
        price: sale_price,
        amount: count * sale_price,
        unit_item,
      };
    });
    navigation.navigate(FOOD_ORDERED, {listFood, isEdit: false});
  };
  const _onSetPrinter = () => setIsPrint(!isPrint);
  const _onOpenPayment = () => RBSheetRef.current.open();
  const _onSave = () => {
    titleModal.current = AlertModal.TITLE[0];
    contentModal.current = AlertModal.CONTENT[37];
    setIsNotConfirm(false);
    setIsModalAlert(true);
  };
  const onCheckTakeAway = (item) => {
    dispatch(orderAction.checkTakeAway(item));
  };

  const _onPayment = (isPaymentOffline) => {
    RBSheetRef.current.close();
    const convert = orders?.map((food) => {
      return {
        id: food?.id,
        item_id: food?.id,
        image: food?.image,
        item_name: food?.name,
        price: food?.sale_price,
        qty: food?.count,
        note: '',
        is_takeaway: food?.is_takeaway || false,
      };
    });
    navigation.navigate(PAYMENT_DETAIL, {
      isPaymentOffline: true,
      listFood: convert,
      valueSurcharge,
      totalPayment,
      voucherPrice: voucherPrice.current,
      ...route.params,
      ...bill,
    });
  };

  const _onChangeSurcharge = ({value}) => setValueSurcharge(+value);

  const _onCloseModal = () => setIsModalAlert(false);

  const _onConfirm = async () => {
    try {
      setIsLoadModal(true);
      const foods = orders.map((food) => {
        return {
          item_id: food?.id,
          qty: food?.count,
          note: food?.note || '',
          is_takeaway: food?.is_takeaway || false,
          price: food?.price || food?.sale_price,
        };
      });
      const _order = {
        customer_name: cusName,
        customer_tel: cusTel,
      };
      const resOrder = await OrderApi.addOrderFood(null, foods, _order);
      if (resOrder) {
        dispatch(orderAction.resetFood())
        orderIdRef.current = resOrder.order_id;
        const {UserAreas} = await userInfo.getListUser();
        NotifyApi.postOrderFood(
          '',
          '',
          UserAreas[0].area_id,
          foods,
          resOrder.order_id,
          cusName,
        );
      }
      if (saveOrPay === 1) {
        titleModal.current = AlertModal.TITLE[1];
        contentModal.current = AlertModal.CONTENT[39];
        setIsSaved(true);
        navigation.pop(route.params.isMoveOver ? 2 : 3);
      } else if (saveOrPay === 2) {
        setIsSaved(true);
        onPay();
        titleModal.current = AlertModal.TITLE[1];
        contentModal.current = AlertModal.CONTENT[39];
      }
    } catch (error) {
      console.log('Err@TakeAway', error);
    } finally {
      setIsNotConfirm(true);
      setIsLoadModal(false);
    }

    // try {
    //   setIsLoadModal(true);
    //   const foods = orders.map((food) => {
    //     return {
    //       item_id: food.id,
    //       qty: food.count,
    //       note: food.note,
    //       is_takeaway: true,
    //     };
    //   });

    //   const {UserAreas} = await userInfo.getListUser();
    //   NotifyApi.postOrderFood('', '', UserAreas[0].area_id, foods, order_id);

    //   return navigation.popToTop();
    // } catch (error) {
    //   console.log('Err @onConfirm ', error);
    //   titleModal.current = AlertModal.TITLE[3];
    //   contentModal.current = AlertModal.CONTENT[38];
    // } finally {
    //   setIsNotConfirm(true);
    //   setIsLoadModal(false);
    // }
  };

  const onPay = () => {
    const convert = orders?.map((food) => {
      return {
        id: food?.id,
        item_id: food?.id,
        image: food?.image,
        item_name: food?.name,
        price: food?.price || food?.sale_price,
        qty: food?.count,
        note: '',
        is_takeaway: food?.is_takeaway || false,
      };
    });
    navigation.navigate(PAYMENT_DETAIL, {
      isPaymentOffline: true,
      listFood: convert,
      valueSurcharge,
      totalPayment,
      voucherPrice: voucherPrice.current,
      id: orderIdRef.current,
      isPayAll: true,
      ...bill,
    });
  };

  const _forWardVoucher = (total, price) => {
    voucherPrice.current = price;
    setTotalPayment(total);
  };

  const _renderList = () => {
    const convert = orders?.map((food) => {
      const {image, name, promotion, sale_price, count, id, is_takeaway} = food;
      return {
        id: id,
        is_takeaway: is_takeaway,
        image: image,
        item_name: name,
        price: sale_price,
        discount_value: promotion ? (promotion / 100) * sale_price : null,
        qty: count,
        amount: promotion
          ? count * ((100 - promotion) * sale_price)
          : sale_price * count,
      };
    });
    return convert?.map((item, index) => {
      if (index > 9) return null;
      const {
        image,
        item_name,
        price,
        qty,
        amount,
        discount_value,
        is_takeaway,
      } = item || {};
      const PRICE = !!discount_value ? price - discount_value : price;
      return (
        <CardWrap key={index}>
          <CardImage source={image ? {uri: image} : images.IMAGE_DEFAULT} />
          <CardInfo>
            <RowItem isBetween={true}>
              <TextComponent heavy medium numberLine={1}>
                {item_name}
              </TextComponent>
              {!partners?.is_table && (
                <ButtonComponent
                  onPress={() => onCheckTakeAway(item)}
                  title="Mang về"
                  iconColor={colors.ORANGE}
                  iconName={is_takeaway ? 'check-circle' : 'circle'}
                  rowItem={true}
                  isIconRight={true}
                />
              )}
            </RowItem>

            <RowItem>
              <TextComponent>Số lượng: </TextComponent>
              <TextComponent color={colors.ORANGE}>{qty}</TextComponent>
            </RowItem>
            <RowItem isBetween>
              <TextComponent>Giá</TextComponent>
              <RowItem isBetween>
                {discount_value > 0 && (
                  <FormatNumber
                    value={discount_value}
                    textColor={colors.TEXT_GRAY}
                    notUnit
                    textLine
                  />
                )}
                <FormatNumber value={PRICE} textColor={colors.TEXT_GRAY} />
              </RowItem>
            </RowItem>
            <RowItem isBetween>
              <TextComponent>Thành tiền</TextComponent>
              <FormatNumber value={amount} heavy />
            </RowItem>
          </CardInfo>
        </CardWrap>
      );
    });
  };

  const {
    sub_total,
    order_items,
    discount_voucher_per,
    discount_bill_value,
    discount_food_value,
    discount_drink_value,
    vat_per,
    vat_value,
    total_money,
    is_vat_surcharge,
  } = bill || {};

  const _onAction = (flag) => {
    if (cusTel === '' || cusName === '') {
      setShowErr(true);
      return;
    } else {
      switch (flag) {
        case 'save':
          setSaveOrPay(1);
          titleModal.current = AlertModal.TITLE[0];
          contentModal.current = AlertModal.CONTENT[37];
          setIsNotConfirm(false);
          setIsModalAlert(true);
          break;
        case 'pay':
          if (isSaved) {
            onPay();
          } else {
            setSaveOrPay(2);
            titleModal.current = AlertModal.TITLE[0];
            contentModal.current = AlertModal.CONTENT[53];
            setIsNotConfirm(false);
            setIsModalAlert(true);
          }

          break;
        default:
          break;
      }
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <Wrapper>
        <HeaderComponent title="Thanh toán" isNotBack={isSaved} />
        <Container>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View onStartShouldSetResponder={() => true}>
              <Row>
                <TextComponent heavy medium>
                  Món ăn({orders.length})
                </TextComponent>
                {orders.length > 10 && <ButtonShowAll onPress={_onShowAll} />}
              </Row>

              {_renderList()}

              <BottomWrap>
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
                    valueSurcharge *
                      (is_vat_surcharge ? vat_per / 100 + 1 : 1) -
                    discount_food_value -
                    discount_bill_value -
                    discount_drink_value
                  }
                  discountVoucher={discount_voucher_per}
                  forWardVoucher={_forWardVoucher}
                  onChangeSurcharge={_onChangeSurcharge}
                  isTakeAway={true}
                />
                <ButtonPrinter onPress={_onSetPrinter} isPrint={isPrint} />

                <InfoWrap>
                  <TextComponent upperCase>Thông tin khách hàng</TextComponent>
                  <InputName
                    eidtable={!isSaved}
                    placeholder="Tên khách hàng"
                    value={cusName}
                    onChangeText={(text) => {
                      setCusName(text);
                      setShowErr(false);
                    }}
                  />
                  <InputPhone
                    eidtable={!isSaved}
                    placeholder="Số điện thoại"
                    keyboardType="phone-pad"
                    value={cusTel}
                    onChangeText={(text) => {
                      setCusTel(text);
                      setShowErr(false);
                    }}
                  />
                  {showErr && (
                    <TextComponent mTop={10} color={colors.RED}>
                      Vui lòng điền đầy đủ thông tin
                    </TextComponent>
                  )}
                </InfoWrap>

                <RowCenter>
                  <ButtonPayment
                    onPress={() => _onAction('pay')}
                    color={colors.ORANGE}
                  />
                  {isSaved ? (
                    <ButtonBackToHome
                      onPress={() => navigation.pop(1)}
                      color={colors.PRIMARY}
                    />
                  ) : (
                    <ButtonSave
                      onPress={() => _onAction('save')}
                      color={colors.PRIMARY}
                    />
                  )}
                </RowCenter>
              </BottomWrap>
            </View>
          </TouchableWithoutFeedback>
        </Container>

        <PaymentOption setRef={RBSheetRef} onPress={_onPayment} />

        <ModalCfirmComponent
          isVisible={isModalAlert}
          title={titleModal.current}
          content={contentModal.current}
          isNotConfirm={isNotConfirm}
          loading={isLoadModal}
          onClosePopup={_onCloseModal}
          onConfirm={_onConfirm}
        />
      </Wrapper>
    </KeyboardAvoidingView>
  );
};

export default TakeAwayPayment;
