import React, {useState, useRef} from 'react';
import {View, __spread} from 'react-native';
import {colors, images} from '../../assets';
import {FormatNumber} from '../../untils';
import {useDispatch, useSelector} from 'react-redux';
import {paymentAction} from '../../redux/actions';
import {TextComponent, ButtonComponent, ModalEnterQty} from '../../components';
import {
  Container,
  ImageWrapper,
  ContentWrapper,
  RowWrapper,
  Button,
  ButtonWrap,
  CountWrapper,
  InputQty,
} from './styles';

import {PAYMENT} from '../../navigators/ScreenName';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ListFoodPayment = ({
  data,
  isPayOneByOne,
  navigation,
  id,
  table,
  isCombo,
  isGetQtyFromRedux,
  areaId,
}) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const foodSelectRef = useRef({}); /// hiện modal nhập số lượng
  const payment = useSelector((state) => state.payment);

  const _onConfirmQty = (qty = 0, price = 0) => {
    const item = foodSelectRef.current;
    item.sale_price = price > 0 ? price : item.sale_price;

    // update store food ordered
    dispatch(paymentAction.setQtyPay(item, qty));

    // // set quantity food
    // setListFood((curFoods) => {
    //   return curFoods.map((food) => {
    //     const isSelected = food.id === item.id;
    //     return {...food, count: isSelected ? qty : food.count};
    //   });
    // });
  };

  const _onCloseQty = () => {
    setModalVisible(false);
  };
  const _onAction = (item, actionType) => {
    // setItemSelect(item);
    switch (actionType) {
      case 'select':
        dispatch(paymentAction.checkFood(item));
        break;

      case 'plus':
        dispatch(paymentAction.addOneItem(item));
        break;

      case 'minus':
        dispatch(paymentAction.minusOneItem(item));
        break;
      default:
        break;
    }
  };
  const renderPlusAndMinusQty = (item, itemInListPayment) => {
    return (
      <CountWrapper>
        <ButtonComponent
          onPress={() => _onAction(item, 'minus')}
          iconName="minus-circle"
          iconColor={colors.ORANGE}
          iconSize={25}
        />
        <TextComponent color={colors.ORANGE} width={30} center heavy>
          {itemInListPayment.qty}
        </TextComponent>
        <ButtonComponent
          onPress={() => _onAction(item, 'plus')}
          iconName="plus-circle"
          iconColor={colors.ORANGE}
          iconSize={25}
        />
      </CountWrapper>
    );
  };
  const renderInputQty = (item) => {
    return (
      <CountWrapper>
        <TextComponent heavy color={colors.ORANGE} mRight={15}>
          {item.qty}
        </TextComponent>
        <ButtonComponent
          iconColor={colors.ORANGE}
          iconName="edit"
          iconSize={25}
          onPress={() => {
            foodSelectRef.current = item;
            setModalVisible(true);
          }}
        />
      </CountWrapper>
    );
  };
  const renderButton = () => {
    return (
      <ButtonWrap>
        <Button
          red
          onPress={() => {
            dispatch(paymentAction.resetPayment());
            navigation.goBack();
          }}>
          <TextComponent style={{color: colors.RED}}>Hủy bỏ</TextComponent>
        </Button>
        <Button
          onPress={() =>
            payment.length > 0
              ? navigation.navigate(PAYMENT, {
                  listFoodSelected: payment.map((item) => {
                    return {...item, qty_completed: 0};
                  }),
                  id: id,
                  table: table,
                  areaId,
                })
              : null
          }>
          <TextComponent style={{color: colors.ORANGE}}>Xác nhận</TextComponent>
        </Button>
      </ButtonWrap>
    );
  };
  const _renderItem = (item, index) => {
    const {
      qty,
      image,
      item_name,
      qty_completed,
      price,
      discount_value,
      unit_item,
      order_item_status,
      is_open_price,
    } = item || {};

    const PRICE = discount_value ? price - discount_value : price;
    const itemInListPayment = payment.find((_item) => _item.id === item.id);
    // Tìm kiếm item đang xét trong list select để thanh toán
    return (
      /// Xử lý theo từng màn hình:
      // - Số lượng và số tiền nếu ko phải ở màn hình thanh toán từng món thì sẽ chính bằng qty và qty*price từ route.params
      // - Nếu là ở màn hình thanh toán theo món thì lấy từ redux và xử lý
      ((order_item_status &&
        order_item_status.id != 5 &&
        order_item_status.id != 6 &&
        qty - qty_completed > 0) ||
        isCombo) && ( // nếu đang ở màn hình thanh toán tất cả hoặc ở màn hình theo món có số lượng ban đầu lớn hơn số lượng đã thanh toán
        <Container
          onPress={() => (isPayOneByOne ? _onAction(item, 'select') : null)}
          key={String(index)}>
          <ImageWrapper source={image ? {uri: image} : images.IMAGE_DEFAULT} />
          <ContentWrapper>
            <RowWrapper>
              {/* render tên theo trường hợp suất hoặc món */}
              <TextComponent heavy>
                {isCombo ? item.combo_item_name : item_name}
              </TextComponent>
              {/* -------------------- */}
              {/* render dấu tích chọn */}
              {itemInListPayment && isPayOneByOne ? (
                <AntDesign name="checkcircle" size={25} color={colors.ORANGE} />
              ) : null}
              {/* -------------------- */}
            </RowWrapper>
            <RowWrapper>
              <TextComponent>Số lượng</TextComponent>
              {/* -------------------- */}
              {isPayOneByOne ? ( //nếu ở màn hình chọn món thanh toán
                itemInListPayment ? ( // và item đã được chọn để thanh toán thì hiện các button nhập số
                  //render theo loại giá
                  unit_item?.qty_type === 0 ? (
                    renderPlusAndMinusQty(item, itemInListPayment)
                  ) : (
                    renderInputQty(itemInListPayment)
                  ) //end render theo loại giá
                ) : (
                  //Item ko được chọn
                  <TextComponent color={colors.ORANGE} heavy>
                    {qty - qty_completed}
                  </TextComponent>
                ) // end trường hợp xét item có được chọn thanh toán hay ko
              ) : (
                //Nếu ko phải ở màn hình thanh toán theo món
                <TextComponent color={colors.ORANGE} heavy>
                  {isCombo ? qty : qty - qty_completed}
                </TextComponent>
              )}
              {/* -------------------- */}

              {/* Hiển thị số lượng còn lại */}
              {isPayOneByOne && itemInListPayment ? (
                <RowWrapper>
                  <TextComponent>Còn lại</TextComponent>
                  <TextComponent color={colors.ORANGE} heavy width={20} right>
                    {qty - qty_completed - itemInListPayment.qty}
                  </TextComponent>
                </RowWrapper>
              ) : null}
              {/* -------------------- */}
            </RowWrapper>
            <RowWrapper>
              <TextComponent>Giá</TextComponent>
              {is_open_price && !price ? (
                <TextComponent color={colors.ORANGE}>
                  Theo thời giá
                </TextComponent>
              ) : (
                <RowWrapper>
                  {!!discount_value && discount_value > 0 && (
                    <FormatNumber
                      value={price}
                      textColor={colors.BLACK}
                      notUnit
                      textLine
                    />
                  )}
                  <FormatNumber
                    mLeft={5}
                    value={PRICE}
                    textColor={colors.BLACK}
                  />
                </RowWrapper>
              )}
            </RowWrapper>
            <RowWrapper>
              <TextComponent>Thành tiền</TextComponent>
              {is_open_price && !price ? (
                <TextComponent color={colors.ORANGE}>
                  Chưa cập nhật giá
                </TextComponent>
              ) : (
                <FormatNumber
                  value={
                    isGetQtyFromRedux
                      ? qty * PRICE
                      : (qty - qty_completed) * PRICE
                  }
                  heavy
                />
              )}
            </RowWrapper>
          </ContentWrapper>
        </Container>
      )
    );
  };

  return (
    <View>
      {data.map((item, index) => _renderItem(item, index))}
      {isPayOneByOne ? renderButton() : null}
      <ModalEnterQty
        useVisible={[modalVisible, setModalVisible]}
        item={foodSelectRef.current}
        onConfirm={_onConfirmQty}
      />
    </View>
  );
};

export default ListFoodPayment;
