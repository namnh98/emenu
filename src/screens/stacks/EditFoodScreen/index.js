import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {OrderApi, FoodApi} from '../../../api';
import {colors} from '../../../assets';
import {AlertModal} from '../../../common';
import messaging from '@react-native-firebase/messaging';
import {
  BottomSheetNote,
  HeaderComponent,
  ListEditFood,
  ModalCfirmComponent,
  NoDataComponent,
  TextComponent,
  LoadingComponent,
  ModalEnterQty,
} from '../../../components';
import {orderAction} from '../../../redux/actions'
import {FOOD_CATEGORY, ORDER_FOOD} from '../../../navigators/ScreenName';
import {
  BtnAdd,
  BtnCancel,
  BtnEdit,
  BtnSave,
  Container,
  EditWrapper,
  Row,
  RowItem,
  Wrapper,
} from './styles';
import {useDispatch} from 'react-redux'
const EditFood = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const RBSheetRef = useRef();
  const titleModal = useRef('');
  const contentModal = useRef('');
  const isNotConfirm = useRef(false);
  const actionWithFood = useRef();
  const foodsNotEdit = useRef([]);
  const foodsEdit = useRef([]);
  const orderInfo = useRef({});
  const [listFood, setListFood] = useState(null);
  const [itemSelect, setItemSelect] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isModalAlert, setIsModalAlert] = useState(false);
  const [isLoadModal, setIsLoadModal] = useState(false);
  const [isHandling, setIsHandling] = useState(false);
  const [modalQty, setModalQty] = useState(false);
  const itemSelected = useRef(null);
  const dispatch = useDispatch()
  useEffect(() => {
    return messaging().onMessage(async (remoteMessage) => {
      const {action} = remoteMessage.data;
      if (action === 'delivery_item') {
        getListFood();
      }
    });
  }, []);
  // const [currentPrinter, setCurrentPrinter] = useState();
  // const [printedDone, setPrintedDone] = useState(false);

  // const partners = useSelector((state) => state.partners);

  useEffect(() => {
    getListFood();
  }, [isFocused]);

  const getListFood = async () => {
    try {
      const data = await OrderApi.getOrderedById(route.params.id);
      orderInfo.current = data;
      const {order_combo_items, order_items} = data;
      const newData = order_items.concat(
        order_combo_items[0]?.order_items || [],
      );
      foodsEdit.current = [];
      foodsNotEdit.current = newData;
      setListFood(newData || []);
    } catch (error) {
      console.log('Err @getListFood ', error);
      setListFood([]);
    }
  };
  //EVENT
  const {id, order_status} = orderInfo.current || {};
  const {table} = route.params;
  const _onAddFood = async () => {
    dispatch(orderAction.resetFood())
    try {
      if (order_status?.id === 2) {
        titleModal.current = AlertModal.TITLE[4];
        contentModal.current = AlertModal.CONTENT[20];
        isNotConfirm.current = true;
        setIsModalAlert(true);
        return;
      }
      setIsHandling(true);
      const listCate = await FoodApi.getComboFoods();
      const listAllFood = await FoodApi.getFoods();
      const counterAllFoods = listAllFood.reduce(
        (init, item) => init + item.items.length,
        0,
      );
      if (!listCate.length) {
        navigation.navigate(ORDER_FOOD, {
          orderId: id,
          area_id: orderInfo.current.table.area.id,
          table,
          isPrice: false,
          isMoveOver: true,
        });
        return;
      } else if (
        listCate.length === 1 &&
        listCate[0].items.length === counterAllFoods
      ) {
        navigation.navigate(ORDER_FOOD, {
          orderId: id,
          area_id: orderInfo.current.table.area.id,
          table,
          combo_id: listCate[0].id,
          combo_name: listCate[0].name,
          isPrice: listCate[0].is_price,
          isMoveOver: true,
        });
      } else {
        navigation.navigate(FOOD_CATEGORY, {
          orderId: id,
          areaId: orderInfo.current.table.area.id,
          table,
        });
        return;
      }
    } catch (error) {
      console.log('Err @onAddFood ', error);
    } finally {
      setIsHandling(false);
    }
  };

  const _onNote = (item) => {
    setItemSelect(item);
    RBSheetRef.current.open();
  };

  const _onConfirmNote = (note) => {
    RBSheetRef.current.close();
    const foodNotEdit = foodsNotEdit.current.find(
      (food) => food.id === itemSelect.id,
    );
    if (foodNotEdit?.note?.trim() !== note.trim()) {
      const foodEdit = foodsEdit.current.find(
        (food) => food.id === itemSelect.id,
      );
      if (foodEdit) {
        const arrEdit = foodsEdit.current.map((food) => {
          if (food.id === itemSelect.id) food.note = note;
          return food;
        });
        foodsEdit.current = arrEdit;
      } else {
        foodsEdit.current = [...foodsEdit.current, {...itemSelect, note: note}];
      }
    } else {
      const arrEdit = foodsEdit.current.filter(
        (food) => food.id !== itemSelect.id,
      );
      foodsEdit.current = arrEdit;
    }

    const foods = listFood.map((food) => {
      if (food.id === itemSelect.id) return {...food, note: note};
      return food;
    });
    setListFood(foods);
  };

  const _onEdit = () => setIsEdit(true);

  const _onCancel = () => {
    setIsEdit(false);
    setListFood(foodsNotEdit.current);
    foodsEdit.current = [];
  };

  const _onSave = async () => {
    try {
      if (!foodsEdit.current.length) return setIsEdit(false);
      const {id: orderId, table} = orderInfo.current || {};

      await Promise.all(
        foodsEdit.current.map(async (food) => {
          const params = {
            itemName: food.item_name,
            tableName: table?.name,
            tableId: table?.id,
            orderId: orderId,
            itemId: food.item_id,
            areaId: table?.area?.id,
            itemQty: food.qty,
          };
          await OrderApi.updateFood(route.params.id, food, params);
        }),
      );
      foodsNotEdit.current = listFood;
      foodsEdit.current = [];
      setIsEdit(false);
    } catch (error) {
      console.log('Err onSave ', error);
    }
  };

  const _onCloseModal = () => setIsModalAlert(false);

  const _onShipFood = (item) => {
    titleModal.current = AlertModal.TITLE[0];
    contentModal.current = `${AlertModal.CONTENT[21]} ${item.item_name} ?`;
    isNotConfirm.current = false; // show button confirm button in modal
    actionWithFood.current = 'ship'; // check type button confirm modal
    setIsModalAlert(true);
    setItemSelect(item);
  };
  const onConfirmFood = (item) => {
    titleModal.current = AlertModal.TITLE[0];
    contentModal.current = `${AlertModal.CONTENT[71]} ${item.item_name} ?`;
    isNotConfirm.current = false; // show button confirm button in modal
    actionWithFood.current = 'confirm'; // check type button confirm modal
    setIsModalAlert(true);
    setItemSelect(item);
  };

  const _onDeleteFood = async (item) => {
    try {
      titleModal.current = AlertModal.TITLE[0];
      contentModal.current = `${AlertModal.CONTENT[22]} ${item.item_name} ?`;
      isNotConfirm.current = false; // show button confirm button in modal
      actionWithFood.current = 'delete';
      setIsModalAlert(true);
      setItemSelect(item);
    } catch (error) {
      console.log('Err onDeleteFood ', error);
    }
  };

  const _onConfirm = async () => {
    try {
      setIsLoadModal(true);
      let res;
      const {id: orderId, table} = orderInfo.current || {};
      const {id: item_id, item_name} = itemSelect || {};
      const params = {
        itemName: item_name,
        tableName: table?.name,
        tableId: table?.id,
        orderId: orderId,
        itemId: item_id,
        areaId: table?.area?.id,
      };

      actionWithFood.current === 'delete'
        ? (res = await OrderApi.deleteFood(orderId, item_id, params))
        : actionWithFood.current === 'ship'
        ? (res = await OrderApi.updateShipFood(orderId, item_id, params))
        : (res = await OrderApi.confirmFood(orderId, item_id, params));

      if (res.status === 200) {
        titleModal.current = AlertModal.TITLE[2];
        isNotConfirm.current = true; // hide button confirm button in modal
        actionWithFood.current === 'delete'
          ? (contentModal.current = `${AlertModal.CONTENT[23]} ${item_name} ${AlertModal.CONTENT[24]}`)
          : actionWithFood.current === 'ship'
          ? (contentModal.current = `${AlertModal.CONTENT[23]} ${item_name} ${AlertModal.CONTENT[25]}`)
          : (contentModal.current = `${AlertModal.CONTENT.confirmSuccess} ${item_name}`);

        await getListFood();
      }
    } catch (error) {
      console.log('Err onConfirm ', error);
    } finally {
      setIsLoadModal(false);
    }
  };

  const _onSetCount = (item, curIndex, qty, price) => {
    const countCur = item.qty + qty;
    if (countCur <= 0) return;
    if (foodsNotEdit.current[curIndex].qty !== countCur) {
      const foodEdit = foodsEdit.current.find((food) => food.id === item.id);
      if (foodEdit) {
        const arrEdit = foodsEdit.current.map((food) => {
          if (food.id === item.id) food.qty = countCur;
          return food;
        });
        foodsEdit.current = arrEdit;
      } else {
        foodsEdit.current = [...foodsEdit.current, {...item, qty: countCur}];
      }
    } else {
      const arrEdit = foodsEdit.current.filter((food) => food.id !== item.id);
      foodsEdit.current = arrEdit;
    }
    // add number for list food
    const foods = listFood.map((food) => {
      if (food.id === item.id)
        return {...food, qty: countCur, amount: countCur * food.price};
      return food;
    });
    setListFood(foods);
  };

  const _onConfirmQtyAndPrice = (qty = 0, price = 0) => {
    if (qty <= 0) return;
    let itemFound = foodsEdit.current.find(
      (item) => item.id === itemSelected.current.id,
    );
    if (itemFound) {
      foodsEdit.current = foodsEdit.current.map((food) => {
        if (food.id === itemSelected.current.id) {
          food.qty = qty;
          food.price = price;
        }
        return food;
      });
    } else {
      foodsEdit.current = [
        ...foodsEdit.current,
        {...itemSelected.current, qty: qty, price: price},
      ];
    }
    setListFood(
      listFood.map((item) => {
        if (item.id === itemSelected.current.id) {
          return {...item, qty: qty, price};
        } else return item;
      }),
    );
  };

  const _onReFresh = () => getListFood();
  const _onOpenModalEnterQty = (item) => {
    itemSelected.current = item;
    setModalQty(true);
  };
  //RENDER COMPONENT
  const _renderListFood = () => {
    if (!listFood) return <Loading />;
    if (!listFood.length)
      return (
        <>
          <NoDataComponent
            title="Không tìm thấy món ăn"
            onRefresh={_onReFresh}
          />
          {_renderButton()}
        </>
      );

    return (
      <Container>
        <Row>
          <TextComponent heavy medium>
            Tổng số món:{' '}
            <TextComponent color={colors.PRIMARY}>
              {listFood.length}
            </TextComponent>
          </TextComponent>

          <TextComponent heavy medium>
            Bàn:{' '}
            <TextComponent color={colors.PRIMARY}>{table?.name}</TextComponent>
          </TextComponent>
        </Row>

        <ListEditFood
          data={listFood}
          isEdit={isEdit}
          isOrdered={order_status?.id === 2}
          onOpenModalEnterQty={_onOpenModalEnterQty}
          onSetCount={_onSetCount}
          onShipFood={_onShipFood}
          onDeleteFood={_onDeleteFood}
          onNote={_onNote}
          onConfirmFood={onConfirmFood}
        />

        {_renderButton()}
      </Container>
    );
  };

  const _renderButton = () => {
    if (order_status?.id === 2) return null;

    return (
      <EditWrapper>
        {isEdit ? (
          <RowItem>
            <BtnCancel onPress={_onCancel} color={colors.RED} />
            <BtnSave onPress={_onSave} color={colors.ORANGE} />
          </RowItem>
        ) : (
          <RowItem>
            <BtnAdd onPress={_onAddFood} color={colors.PRIMARY} />
            {listFood.length ? (
              <BtnEdit onPress={_onEdit} color={colors.ORANGE} />
            ) : null}
          </RowItem>
        )}
      </EditWrapper>
    );
  };

  const Loading = () => {
    return (
      <Wrapper>
        <Container>
          <SkeletonPlaceholder>
            {[1, 1, 1].map((item, index) => {
              return (
                <View
                  key={`loadEditFood-${index}`}
                  style={{
                    width: '100%',
                    padding: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 70,
                        marginRight: 10,
                      }}
                    />
                    <View>
                      <View style={{width: 220, height: 15, marginTop: 8}} />
                      <View style={{width: 150, height: 10, marginTop: 8}} />
                      <View style={{width: 180, height: 10, marginTop: 8}} />
                    </View>
                  </View>
                  <View
                    style={{
                      width: 350,
                      height: 10,
                      marginTop: 10,
                    }}
                  />
                </View>
              );
            })}
          </SkeletonPlaceholder>
        </Container>
      </Wrapper>
    );
  };

  //RENDER MAIN
  return (
    <Wrapper>
      <HeaderComponent title="Danh sách món" />
      {_renderListFood()}
      <BottomSheetNote
        setRef={RBSheetRef}
        item={itemSelect}
        onConfirm={_onConfirmNote}
      />
      <LoadingComponent isLoading={isHandling} />
      <ModalCfirmComponent
        title={titleModal.current}
        content={contentModal.current}
        isVisible={isModalAlert}
        isNotConfirm={isNotConfirm.current}
        loading={isLoadModal}
        onClosePopup={_onCloseModal}
        onConfirm={_onConfirm}
      />
      <ModalEnterQty
        useVisible={[modalQty, setModalQty]}
        item={itemSelected.current}
        onConfirm={_onConfirmQtyAndPrice}
      />
    </Wrapper>
  );
};

export default EditFood;
