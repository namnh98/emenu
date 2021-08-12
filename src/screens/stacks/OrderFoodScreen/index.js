import {useIsFocused,CommonActions} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Transition, Transitioning} from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';
import {
  FoodApi,
  NotifyApi,
  OrderApi,
  PromotionApi,
  TableApi,
  ConfirmOrderApi,
} from '../../../api';
import {colors} from '../../../assets';
import {AlertModal} from '../../../common';
import {
  HeaderComponent,
  ListFood,
  LoadingFood,
  ModalCfirmComponent,
  ModalEnterQty,
  NoDataComponent,
  TextComponent,
  ModalPrint,
  ModalChoosePrinter,
} from '../../../components';
import {
  BOTTOM_TAB,
  EDIT_FOOD,
  FOOD_ORDERED,
  SEARCH_FOOD,
  TAB_WITH_CHECK_IN,
} from '../../../navigators/ScreenName';
import {orderAction, tableAction} from '../../../redux/actions';
import {ConvertCategory, ConvertFood} from '../../../untils';
import {
  Body,
  BtnDetails,
  BtnOrderFood,
  BtnSearch,
  CateWrap,
  FootWrap,
  HeaderWrap,
  RowWrap,
} from './styles';
import {BackHandler} from 'react-native';

import {NetPrinter, BLEPrinter} from 'react-native-thermal-receipt-printer';
import {users} from '../../../stores';
import BaseUrl from '../../../api/BaseUrl';
import axios from 'axios';
import {userInfo} from '../../../stores';

let USER;
const TYPE_PRINT = {wifi: 3, bluetooth: 4};
const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={200} />
    <Transition.Change />
    <Transition.Out type="fade" durationMs={200} />
  </Transition.Together>
);

const OrderFood = ({navigation, route}) => {
  const {
    area_id,
    table_id,
    table_name,
    combo_id,
    isPrice,
    countRate,
    orderId,
    combo_name,
    isMoveOver,
    table,
  } = route.params;
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {orders, partners} = useSelector((state) => state);

  const ref = useRef();
  const orderIdRef = useRef(orderId || null);
  const titleModal = useRef(AlertModal.TITLE[0]);
  const contentModal = useRef(AlertModal.CONTENT[27]);
  const foodSelectRef = useRef({});
  const listCateRef = useRef(null);
  const confirmType = useRef(0);

  const [listCategory, setListCategory] = useState(null);
  const [listFood, setListFood] = useState([]);
  const [isModalAlert, setIsModalAlert] = useState(false);
  const [isNotConfirm, setIsNotConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalQty, setIsModalQty] = useState(false);
  const [isNoFood, setIsNoFood] = useState(false);

  //print order
  const printTitle = useRef();
  const printContent = useRef();
  const [isShowPrint, setIsShowPrint] = useState(false);
  const [isConnect, setIsConnect] = useState();
  const [isLoadingPrint, setIsLoadingPrint] = useState();
  const isConnectRef = useRef(null);

  const [modalChoosePrinter, setModalChoosePrinter] = useState(false);
  const listPrintersRef = useRef([]);
  const [printerSelected, setPrinterSelected] = useState(null);
  const [errPrint, setErrPrint] = useState(false);

  useEffect(() => {
    const foodCur = listFood.map((food) => {
      const order = orders.find((order) => order.id === food.id);
      return {
        ...food,
        count: order ? order.count : 0,
        sale_price: order ? order.sale_price : food.sale_price,
      };
    });
    setListFood(foodCur);
  }, [isFocused]);

  useEffect(() => {
    fetchApi();
    fectchPrinter();
  }, []);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', _onGoBack);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', _onGoBack);
  });

  const fetchApi = async () => {
    try {
      //call api
      const [foods, comboFoods, promotions] = await Promise.all([
        FoodApi.getFoods(),
        FoodApi.getComboItemById(combo_id),
        PromotionApi.getPromotionFood(),
      ]);
      //check combo or not
      const categoryFoods = comboFoods.length ? comboFoods : foods;
      if (!categoryFoods.length) setIsNoFood(true);
      const arrPromotion = isPrice ? [] : promotions;
      //convert add list
      const [categoryAll, arrCate] = ConvertCategory(
        categoryFoods,
        arrPromotion,
      );

      //set list
      const arrFood = categoryAll?.items.map((food) => {
        return {...food, count: 0};
      });
      listCateRef.current = arrCate || [];
      setListCategory([categoryAll] || []);
      setListFood(arrFood || []);
    } catch (error) {
      console.log('Err @fetchApi ', error);
      setListCategory([]);
      setListFood([]);
    }
  };

  //EVENT

  const _onRefresh = () => fetchApi();

  const _onShowFoodOrdered = () => {
    navigation.navigate(FOOD_ORDERED, {
      isEdit: true,
      onOrderFood: _onOrderFood,
    });
  };

  const _onSetCount = (item, action) => {
    const {id, count, unit_item, is_open_price} = item || {};
    // check qty
    if (is_open_price || (!is_open_price && unit_item?.qty_type === 1)) {
      foodSelectRef.current = item;
      setIsModalQty(true);
      return;
    }
    // update store food ordered
    action === 1
      ? dispatch(orderAction.addFood(item))
      : dispatch(orderAction.removeFood(item));
    // set quantity food
    const countCur = action === 1 ? count + 1 : count - 1;
    const arrFood = listFood.map((value) => {
      const isSelected = value.id === id;
      return {...value, count: isSelected ? countCur : value.count};
    });
    setListFood(arrFood);
  };

  const _onConfirmQty = (qty = 0, price = 0) => {
    const item = foodSelectRef.current;
    item.sale_price = price > 0 ? price : item.sale_price;

    // update store food ordered
    dispatch(orderAction.addQtyFood(item, qty, price));

    // set quantity food
    setListFood((curFoods) => {
      return curFoods.map((food) => {
        const isSelected = food.id === item.id;
        return {...food, count: isSelected ? qty : food.count};
      });
    });
  };

  const _onShowModal = (type = 0, title = '', content = '') => {
    confirmType.current = type;
    titleModal.current = title;
    contentModal.current = content;
    setIsNotConfirm(false);
    setIsModalAlert(true);
  };

  //Get api danh sach may in
  const fectchPrinter = async () => {
    const resListPrint = await ConfirmOrderApi.getPrintChickenBar(area_id);
    if (resListPrint) {
      if (resListPrint[0].printer_chicken_bars.length === 1) {
        setPrinterSelected(resListPrint[0].printer_chicken_bars[0]);
        return;
      }

      listPrintersRef.current = resListPrint[0].printer_chicken_bars;
    } else {
      console.log('Err@callApiGetPrinterBar', error);
    }
  };

  //Kết nối máy in trc khi gọi order
  const _onOrderFood = async () => {
    const {is_print_item} = partners;
    if (is_print_item) {
      //Kiểm tra Partner có chức năng in
      if (listPrintersRef.current.length === 0) {
        _onShowModal(1, AlertModal.TITLE[0], AlertModal.CONTENT[27]);
      } else if (listPrintersRef.current.length === 1) {
        if (printerSelected) {
          //khu vuc co 1 may in
          showPopUpPrinter();
        }
      } else {
        setModalChoosePrinter(true);
      }
    } else {
      _onShowModal(1, AlertModal.TITLE[0], AlertModal.CONTENT[27]);
    }
  };

  const showPopUpPrinter = () => {
    printTitle.current = 'ĐANG KẾT NỐI MÁY IN';
    printContent.current = 'Vui lòng đợi trong giây lát!...';
    setIsLoadingPrint(true);
    setIsShowPrint(true);
  };

  const showPopUpError = () => {
    printTitle.current = 'THẤT BẠI';
    printContent.current =
      'Không thể lấy thông tin order\nVui lòng thử lại sau';
    setIsLoadingPrint(false);
    setErrPrint(true);
    setIsShowPrint(true);
  };

  const handleConnectPrinter = () => {
    if (errPrint) return;
    checkConnectPrint(printerSelected);
  };

  const _onGoBack = () => {
    if (navigation.isFocused()) {
      if (orders.length) {
        _onShowModal(2, AlertModal.TITLE[0], AlertModal.CONTENT[47]);
        return true;
      } else {
        navigation.goBack();
        return true;
      }
    } else {
      return false;
    }
  };

  const _onConfirmAlert = async () => {
    if (confirmType.current === 1) {
      _handleOrder();
    } else {
      setIsModalAlert(false);
      navigation.goBack();
    }
  };

  const _onGoSearch = () => {
    navigation.navigate(SEARCH_FOOD, {
      idSelect: listCategory[0]?.id,
      categories: listCateRef.current,
      onSetCategory,
    });
  };

  const onSetCategory = (category = {}, foods) => {
    setListCategory([category] || []);
    setListFood(foods);
  };

  const _onCloseCate = () => {
    const filterCate = listCateRef.current.find((value) => value.id === 'all');
    const foods = filterCate.items.map((item) => {
      const order = orders.find((order) => order.id === item.id);
      return {
        ...item,
        count: order ? order.count : 0,
        sale_price: order ? order.sale_price : item.sale_price,
      };
    });
    setListCategory([filterCate] || []);
    setListFood(foods || []);
  };

  //HANDLE

  const _handleOrder = async () => {
    const {is_table_join, table_join_id, id, name} = table;
    try {
      setIsLoading(true);
      const [foodNoPrice, foodPrice] = ConvertFood(
        orders,
        combo_id,
        countRate,
        false,
      );

      const resOrder =
        !orderIdRef.current &&
        (await OrderApi.addOrderFood(
          is_table_join && table_join_id != null && table_join_id != ''
            ? table_join_id
            : id,
          [],
        ));

      const hasOrderId = orderIdRef.current || resOrder?.order_id;
      const res = await OrderApi.addOrderFoodById(
        hasOrderId,
        isPrice ? foodPrice : [],
        isPrice ? [] : foodNoPrice,
      );
      let tableOrder = name;
      const {is_print_item} = partners;
      if (res) {
        if (is_print_item && isConnect && listPrintersRef.current.length > 0) {
          await onPrintStart(orders, hasOrderId); // in order sau khi gọi món thành công
        }
        // await TableApi.updateStatusTable(table_id, true);
        if (is_table_join && table_join_id) {
          const tableMerged = await TableApi.getMergedTableInfo(id);
          if (tableMerged && tableMerged.length) {
            for (item of tableMerged) {
              await TableApi.updateStatusTable(item.id, true);
              tableOrder += `, ${item.name}`;
            }
            tableOrder = `(${tableOrder})`;
          }
        }
        const resNoti = await NotifyApi.postOrderFood(
          tableOrder,
          id,
          area_id,
          foodNoPrice,
          hasOrderId,
        );
      }
      titleModal.current = AlertModal.TITLE[2];
      contentModal.current = AlertModal.CONTENT[28];
      dispatch(orderAction.resetFood())
      navigation.reset({
        index: 0,
        routes: [
          {name: BOTTOM_TAB, params: {areaId: area_id}},
          {name: EDIT_FOOD, params: {id: hasOrderId, ...route.params}},
        ],
      });
    } catch (error) {
      console.log('Err @handleOrder', error);
      titleModal.current = AlertModal.TITLE[4];
      contentModal.current = AlertModal.CONTENT[29];
    } finally {
      setIsLoading(false);
      setIsNotConfirm(true);
    }
  };

  //In order tới bếp bar
  const onPrintStart = async (OrderItems, orderId) => {
    const {id, connect_type} = printerSelected;
    const listItems = OrderItems?.map(({id, name, count, description}) => {
      return {
        item_id: id,
        item_name: name,
        qty: count,
        note: description || '',
      };
    });
    const body = {
      printer_id: `${id}`,
      order_items: listItems || [],
    };
    const receiptCook = await ConfirmOrderApi.postReceiptCook(orderId, body);
    if (receiptCook) {
      if (connect_type === TYPE_PRINT.wifi) {
        NetPrinter.printText(`<C> ${receiptCook.receipt} \n\n\n\n\n\n\n<C>`);
        NetPrinter.closeConn();
      } else {
        BLEPrinter.printBill(`<C> ${receiptCook.receipt} \n\n\n\n\n\n\n<C>`);
        BLEPrinter.closeConn();
      }
    } else {
      showPopUpError();
    }
  };

  const onModalHidePrint = async () => {
    if (errPrint) {
      setErrPrint(false);
      await _handleOrder();
      return;
    }
    _onShowModal(1, AlertModal.TITLE[0], AlertModal.CONTENT[27]);
  };

  //Check kết nối máy in trong khu vực
  const checkConnectPrint = (print) => {
    const {connect_type, device_name} = print;
    if (connect_type === TYPE_PRINT.wifi) {
      const strName = device_name.split(':');
      NetPrinter.init();
      NetPrinter.connectPrinter(strName[0], Number(strName[1]))
        .then((printer) => {
          isConnectRef.current = true;
          setIsShowPrint(false);
          setIsLoadingPrint(false);
          setIsConnect(true);
        })
        .catch((err) => {
          isConnectRef.current = false;
          printTitle.current = AlertModal.TITLE.errConnect;
          printContent.current = AlertModal.CONTENT.errPrint;
          setIsLoadingPrint(false);
          setIsConnect(false);
          console.log('@NetPrinter', err);
        });
    } else if (connect_type === TYPE_PRINT.bluetooth) {
      BLEPrinter.init();
      BLEPrinter.connectPrinter(device_name)
        .then(() => {
          isConnectRef.current = true;
          setIsLoadingPrint(false);
          setIsConnect(true);
        })
        .catch((err) => {
          isConnectRef.current = false;
          printTitle.current = AlertModal.TITLE.errConnect;
          printContent.current = AlertModal.CONTENT.errPrint;
          setIsLoadingPrint(false);
          setIsConnect(false);
          console.log('@BLEPrinter', err);
        });
    }
  };

  const onSelectPrinter = (item) => setPrinterSelected(item);

  const _onContinute = () => {
    setIsShowPrint(false);
  };

  //RENDER COMPONENT

  const _renderHeader = () => {
    if (listCategory === null || !listCategory.length) return null;

    return (
      <HeaderWrap>
        {listCategory[0]?.id !== 'all' &&
          !(listCategory === null || !listCategory.length) && (
            <CateWrap title={listCategory[0]?.name} onPress={_onCloseCate} />
          )}
        <RowWrap>
          <TextComponent medium>
            Tổng số món: <TextComponent heavy>{listFood.length}</TextComponent>
          </TextComponent>
          <BtnSearch onPress={_onGoSearch} />
        </RowWrap>
      </HeaderWrap>
    );
  };

  const _renderListFood = () => {
    if (listCategory === null) return <LoadingFood />;

    if (isNoFood) {
      return (
        <NoDataComponent
          title="Hiện tại nhà hàng chưa có món ăn!"
          onRefresh={_onRefresh}
        />
      );
    } else
      return (
        <ListFood
          data={listFood}
          isCategoryPrice={isPrice}
          onPress={_onSetCount}
        />
      );
  };

  const _renderFooter = () => {
    if (!orders.length) return null;

    return (
      <FootWrap>
        <BtnDetails
          color={colors.PRIMARY}
          badge={orders.length}
          onPress={_onShowFoodOrdered}
        />
        <BtnOrderFood color={colors.ORANGE} onPress={_onOrderFood} />
      </FootWrap>
    );
  };

  //RENDER MAIN

  return (
    <Transitioning.View ref={ref} style={{flex: 1}} transition={transition}>
      <HeaderComponent title={combo_name || 'Món ăn'} onGoBack={_onGoBack} />

      <Body>
        {_renderHeader()}
        {_renderListFood()}
        {_renderFooter()}
      </Body>

      <ModalCfirmComponent
        isVisible={isModalAlert}
        title={titleModal.current}
        content={contentModal.current}
        isNotConfirm={isNotConfirm}
        loading={isLoading}
        onClosePopup={() => setIsModalAlert(false)}
        onConfirm={_onConfirmAlert}
      />

      <ModalEnterQty
        useVisible={[isModalQty, setIsModalQty]}
        item={foodSelectRef.current}
        onConfirm={_onConfirmQty}
      />

      <ModalPrint
        onModalHide={onModalHidePrint}
        onModalShow={handleConnectPrinter}
        title={printTitle.current}
        isVisible={isShowPrint}
        content={printContent.current}
        onClosePopup={() => setIsShowPrint(false)}
        loading={isLoadingPrint}
        isConnect={isConnect}
        onContinute={_onContinute}
      />

      <ModalChoosePrinter
        isVisible={modalChoosePrinter}
        onClosePopup={() => setModalChoosePrinter(false)}
        onPrint={() => setModalChoosePrinter(false)}
        onModalHide={() => checkConnectPrint(printerSelected)}
        listPrinters={listPrintersRef.current}
        onSelectPrinter={onSelectPrinter}
        printerSelected={printerSelected}
        textAgree="Đồng ý"
        // area_name={item.table.area.name}
      />
    </Transitioning.View>
  );
};

export default OrderFood;
