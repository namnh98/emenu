import React, { useRef, useState } from 'react';
import {
  HeaderComponent,
  ListOrdered,
  BottomSheetNote,
  TextComponent,
  ModalEnterQty,
} from '../../../components';
import { Container, ButtonOrder } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { orderAction } from '../../../redux/actions';

const FoodOrdered = ({ route }) => {
  const { isEdit, onOrderFood, listFood } = route.params || {};
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders);

  const RBSheetRef = useRef();
  const [itemSelect, setItemSelect] = useState({});
  const [isModalQty, setIsModalQty] = useState(false);

  const _onAction = (item, actionType) => {
    setItemSelect(item);
    const { is_open_price, unit_item } = item
    switch (actionType) {
      case 1:
        if (item.count === 0) return;
        dispatch(orderAction.removeFood(item));
        break;

      case 2:
        is_open_price || (!is_open_price && unit_item?.qty_type === 1)
          ? setIsModalQty(true)
          : dispatch(orderAction.addFood(item));
        break;

      case 3:
        RBSheetRef.current.open();
        break;

      default:
        break;
    }
  };

  const _onConfirmNote = (note) => {
    RBSheetRef.current.close();
    dispatch(orderAction.noteFood(itemSelect, note));
  };

  const _onConfirmQty = (qty = 0, price = 0) => {
    itemSelect.sale_price = price > 0 ? price : itemSelect.sale_price;
    setIsModalQty(false);
    dispatch(orderAction.addQtyFood(itemSelect, qty));
  };
  return (
    <Container>
      <HeaderComponent title="Danh sách đang gọi" />

      {(listFood ? listFood : orders).length ? (
        <Container>
          <ListOrdered
            data={listFood ? listFood : orders}
            isEdit={isEdit}
            isShowBtn={onOrderFood}
            onPress={_onAction}
          />
          {onOrderFood && <ButtonOrder onPress={onOrderFood} />}
        </Container>
      ) : (
        <TextComponent center mTop={20} medium bold>
          Hiện tại bạn chưa gọi món
        </TextComponent>
      )}

      <BottomSheetNote
        setRef={RBSheetRef}
        item={itemSelect}
        onConfirm={_onConfirmNote}
      />

      <ModalEnterQty
        useVisible={[isModalQty, setIsModalQty]}
        item={itemSelect}
        onConfirm={_onConfirmQty}
      />
    </Container>
  );
};

export default FoodOrdered;
