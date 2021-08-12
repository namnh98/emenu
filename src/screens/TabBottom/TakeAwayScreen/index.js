import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useDispatch, useSelector} from 'react-redux';
import {OrderApi, FoodApi, BillApi} from '../../../api';
import colors from '../../../assets/colors';
import {AlertModal} from '../../../common';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useScrollToTop} from '@react-navigation/native';
import {TempContractContent} from '../../../components/PopUpTempContract';
import {View, Text, Image} from 'react-native';
import jwt_decode from 'jwt-decode';
import {users, userInfo} from '../../../stores';
import {
  ItemTakeAway,
  ModalCfirmDropdownComponent,
  NoDataComponent,
  TextComponent,
  HeaderComponent,
  ModalChoosePrinter,
  ModalPrint,
} from '../../../components';

import {
  INVOICE,
  TAKEAWAY_CATEGORY,
  TAKEAWAY_PAYMENT,
  TAKEAWAY_SEARCH,
  TAKEAWAY_FOOD,
  PAYMENT,
} from '../../../navigators/ScreenName';
import {orderAction} from '../../../redux/actions';

import {
  BodyWrap,
  Button,
  ItemSeparator,
  ListOrder,
  Wrapper,
  SearchBar,
  SearchBtn,
  SearchIcon,
  NotiNewOrder,
} from './styles';
import {images} from '../../../assets';
import {ActivityIndicator, FlatList} from 'react-native';
import {RefreshControl} from 'react-native';
import messaging from '@react-native-firebase/messaging';

import {NetPrinter, BLEPrinter} from 'react-native-thermal-receipt-printer';

const options_1 = [
  {label: 'Khách hàng không đến', value: 'Khách hàng không đến'},
  {label: 'Khách về do đợi lâu', value: 'Khách về do đợi lâu'},
  {label: 'Khách không hài lòng', value: 'Khách không hài lòng'},
  {label: 'Khác', value: 4},
];
const options_2 = [
  {label: 'Ghi sai order', value: 'Ghi sai order'},
  {label: 'Khách hàng đổi/trả món', value: 'Khách hàng đổi/trả món'},
  {label: 'Thu ngân tính sai tiền', value: 'Thu ngân tính sai tiền'},
  {label: 'Khác', value: 4},
];

const ContentIfNoRole5 = () => (
  <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
    <View
      style={{
        width: '90%',
        paddingHorizontal: 15,
        paddingVertical: 30,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.WHITE,
        borderRadius: 10,
      }}>
      <Image source={images.WELCOME} style={{height: 100, width: 100}} />
      <Text style={{marginTop: 20, textAlign: 'center'}}>
        Bạn chưa được phân quyền quản lý order mang về
      </Text>
      <Text>Vui lòng liên hệ với quản lý nhà hàng</Text>
    </View>
  </View>
);

const TakeAway = ({navigation}) => {
  const STATUS = [1, 2];
  //START RENDER
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {partners} = useSelector((state) => state);
  const titleModal = useRef(null);
  const contentModal = useRef(null);
  const isNotConfirm = useRef(null);
  const isNote = useRef(null);
  const actionType = useRef(null);
  const orderSelect = useRef({});
  const connectType = useRef(0);
  const [listBill, setListBill] = useState([]);
  const [isModalAlert, setIsModalAlert] = useState(false);
  const [isLoadModal, setIsLoadModal] = useState(false);
  const countOrders = useRef(0);
  const pageSize = 10;
  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const statusRef = useRef(STATUS);
  const customer_nameRef = useRef('');
  const customer_telRef = useRef('');
  const order_noRef = useRef('');
  const listRef = useRef(null);
  const [haveNewOrder, setHaveNewOrder] = useState(false); /// testt
  const [canUse, setCanUse] = useState(true);
  const [orderStatus, setOrderStatus] = useState(0);

  const {currency} = useSelector((state) => state.partners);
  const [modalChoosePrinter, setModalChoosePrinter] = useState(false);
  const [modalPrint, setModalPrint] = useState(false);
  const [currentPrinter, setCurrentPrinter] = useState();
  const [bill, setBill] = useState([]);
  const [idprinter, setidprinter] = useState('');
  const listPrintersRef = useRef([]);
  const [printerSelected, setPrinterSelected] = useState(null);
  const [contentModalPrint, setContentModalPrint] = useState('');
  const isPrintingRef = useRef(false);
  const titleModalPrintRef = useRef('');

  useScrollToTop(listRef);

  useEffect(() => {
    return messaging().onMessage(async (remoteMessage) => {
      const {action, order_id, table_id} = remoteMessage.data;
      if (
        action === 'staff_order_item' &&
        checkIsSearching() &&
        table_id == ''
      ) {
        setHaveNewOrder(true);
        const res = await OrderApi.getOrderedById(order_id);
        countOrders.current += 1;
        setListBill([...listBill, res]);
      }
    });
  }, []);
  useEffect(() => {
    getRole();
    getListPrinter();
  }, []);

  //AFTER RENDER
  useEffect(() => {
    getListOrder();
  }, [isFocused]); 
  useEffect(() => {
    getListOrder();
  }, [pageIndex]);// Gọi api khi pageIndex thay đổi

  const getRole = async () => {
    const {token} = await users.getListUser();
    let decode = jwt_decode(token);
    const {role} = decode;
    if (!role.includes('role_5')) {
      setCanUse(false);
    }
  };
  const paramsSearch = (
    order_status_id,
    order_no,
    customer_name,
    customer_tel,
  ) => {
    return {
      order_status_id,
      order_no,
      customer_name,
      customer_tel,
      onSetParams: _onSetParams,
    };
  };
  const getListPrinter = async () => {
    try {
      const {UserAreas} = await userInfo.getListUser();
      let listPrinters = [];
      for (const item of UserAreas) {
        const res = await BillApi.getPrinters(item.area_id);
        listPrinters.push(res);
      }
      let _list = [];
      listPrinters.map((item) => {
        for (const _item of item[0].printer_bills) {
          _list.push({
            ..._item,
            area_name: item[0].area_name,
            area_id: item[0].area_id,
          });
        }
      });
      listPrintersRef.current = _list;
    } catch (error) {
      console.log('Err @GetAllPrinters', error);
    }
  };

  const _onSetParams = (status, order_no, customer_name, customer_tel) => {
    setLoading(true);
    setListBill([]); // và setListBill về rỗng để component loading hiện lên
    statusRef.current = status;
    order_noRef.current = order_no;
    customer_nameRef.current = customer_name;
    customer_telRef.current = customer_tel;
  };

  //CALL API

  const getListOrder = async () => {
    if (!isFocused || partners?.contract_type_id === 1) return;
    try {
      if (!loadMore) setPageIndex(1);
      const res = await OrderApi.getOrdered(
        '',
        partners.id,
        pageSize,
        pageIndex,
        paramsSearch(
          statusRef.current,
          order_noRef.current,
          customer_nameRef.current,
          customer_telRef.current,
        ),
      );
      loadMore ? null : setHaveNewOrder(false);
      if (loadMore) {
        setListBill(listBill.concat(res.data)); // nếu đang load thêm thì nối mảng
      } else {
        setListBill(res.data || []); // còn ko thì tức là đang tìm kiếm, set res.data ở page 1 vào list
      }
      countOrders.current = res.total;

      setLoading(false);

      if (loadMore) {
        setLoadMore(false);
      }
    } catch (error) {
      console.log('Err @getListOrder ', error);
      setListBill([]);
    }
  };
  //EVENT
  const _onTakeAway = async () => {
    dispatch(orderAction.resetFood());
    const resCategory = await FoodApi.getComboFoods();
    const listAllFood = await FoodApi.getFoods();
    const counterAllFoods = listAllFood.reduce(
      (init, item) => init + item.items.length,
      0,
    );
    if (!resCategory.length) {
      return navigation.navigate(TAKEAWAY_FOOD, {
        id: null,
        name: 'Tất cả món ăn',
        isMoveOver: true,
      });
    } else {
      const cateNoPrice = resCategory.filter((cate) => !cate.is_price);
      if (
        cateNoPrice.length === 1 &&
        cateNoPrice[0].items.length === counterAllFoods
      ) {
        return navigation.navigate(TAKEAWAY_FOOD, {
          isMoveOverCate: true,
          id: cateNoPrice[0].id,
          name: cateNoPrice[0].name,
          isMoveOver: true,
        });
      } else {
        navigation.navigate(TAKEAWAY_CATEGORY);
      }
    }
  };

  const _onCloseAlert = () => setIsModalAlert(false);

  const checkIsSearching = () => {
    return (
      (statusRef.current.length === 0 || statusRef.current.length === 4) &&
      order_noRef.current == '' &&
      customer_nameRef.current == '' &&
      customer_telRef.current == ''
    );
  };

  const onLoadMore = () => {
    if (pageIndex >= countOrders.current / pageSize) {
      return;
    } else {
      setLoadMore(true);
      setPageIndex(pageIndex + 1);
    }
  };

  const _onPrint = (printer) => {
    if (!printer) return;
    setContentModalPrint(
      `Đang kết nối tới máy in ${printerSelected?.printer_name}`,
    );
    titleModalPrintRef.current = 'ĐANG IN';
    isPrintingRef.current = true;
    setModalPrint(true);
    // const {connect_type} = printerSelected;
    // if (connect_type === 3) {
    //   netPrint();
    // } else {
    //   blePrinter();
    // }
  };
  const handlePrint = async () => {
    const {connect_type} = printerSelected;
    if (connect_type === 3) {
      netPrint();
    } else {
      blePrinter();
    }
  };
  const netPrint = async () => {
    const {device_name} = printerSelected;
    if (!device_name) return;
    const splitDeviceName = device_name.split(':');
    NetPrinter.init();
    NetPrinter.connectPrinter(splitDeviceName[0], Number(splitDeviceName[1]))
      .then(async (printer) => {
        setContentModalPrint('Đang lấy thông tin hoá đơn...');
        const billString = await getBillString();
        if (billString?.data) {
          _onPrintBill(billString.data.receipt, 3);
          isPrintingRef.current = false;
          titleModalPrintRef.current = 'IN THÀNH CÔNG';
          setContentModalPrint('Hoá đơn được in thành công');
        } else {
          titleModalPrintRef.current = 'Thất bại';
          isPrintingRef.current = false;
          setContentModalPrint(
            `Không thể lấy thông tin biên lai\nVui lòng thử lại sau`,
          );
        }
      })
      .then(() => NetPrinter.closeConn())
      .catch((err) => {
        console.log(err);
        titleModalPrintRef.current = 'Thất bại';
        isPrintingRef.current = false;
        setContentModalPrint(
          `Kết nối đến máy in ${printerSelected?.printer_name} thất bại`,
        );
      });
  };
  const blePrinter = () => {
    const {device_name} = printerSelected;
    if (!device_name) return;
    BLEPrinter.init();
    BLEPrinter.connectPrinter(device_name)
      .then(async (printer) => {
        setContentModalPrint('Đang lấy thông tin hoá đơn...');
        const billString = await getBillString();
        if (billString?.data) {
          _onPrintBill(billString.data.receipt, 4);
          isPrintingRef.current = false;
          titleModalPrintRef.current = 'IN THÀNH CÔNG';
          setContentModalPrint('Hoá đơn được in thành công');
        } else {
          titleModalPrintRef.current = 'Thất bại';
          isPrintingRef.current = false;
          setContentModalPrint(
            `Không thể lấy thông tin biên lai\nVui lòng thử lại sau`,
          );
        }
      })
      .then(() => BLEPrinter.closeConn())
      .catch((err) => {
        titleModalPrintRef.current = 'Thất bại';
        isPrintingRef.current = false;
        setContentModalPrint(
          `Kết nối đến máy in ${printerSelected?.printer_name} thất bại`,
        );
      });
  };
  const onCloseModalPrint = () => {
    isPrintingRef.current = false;
    setModalChoosePrinter(false);
    setPrinterSelected(null);
    // titleModalPrintRef.current = '';
    // setContentModalPrint('');
    setModalPrint(false);
  };
  const onSelectPrinter = (item) => setPrinterSelected(item);

  const getBillString = async () => {
    return await OrderApi.getReceiptString(
      orderSelect.current?.id,
      printerSelected?.id,
    );
  };

  const _onPrintBill = (string, type) => {
    if (type == 3) {
      // Alert.alert('Thông báo', 'In bill thành công');
      NetPrinter.printBill(`<C>  ${string}  \n\n\n\n\n\n\n<C>`);
    } else {
      BLEPrinter.printBill(`<C>  ${string}  \n\n\n\n\n\n\n<C>`);
    }
  };

  const _onEventButton = (item, action) => {
    setOrderStatus(item.order_status?.id);
    orderSelect.current = item;
    switch (action) {
      case 1:
        isNote.current = true; //hide dropdown reason
        contentModal.current = AlertModal.CONTENT[40];
        titleModal.current = AlertModal.TITLE[0];
        isNotConfirm.current = false; //hide button confirm
        actionType.current = action; //action button
        setIsModalAlert(true); //show modal
        break;

      case 2:
        isNote.current = false; //hide dropdown reason
        contentModal.current = AlertModal.CONTENT[41];
        titleModal.current = AlertModal.TITLE[0];
        isNotConfirm.current = false; //hide button confirm
        actionType.current = action; //action button
        setIsModalAlert(true); //show modal
        break;

      case 3:
        if (listPrintersRef.current.length === 1) {
          setPrinterSelected(listPrintersRef.current[0]);
          _onPrint(listPrintersRef.current[0]);
        } else {
          setModalChoosePrinter(true);
        }
        break;
      case 4:
        dispatch(orderAction.resetFood());
        return navigation.navigate(PAYMENT, {
          isTakeAway: true,
          ...item,
          isPayAll: true,
        });
      case 5:
        //TODO Khoi phuc order
        isNote.current = false; //hide dropdown reason
        contentModal.current = AlertModal.CONTENT[54];
        titleModal.current = AlertModal.TITLE[0];
        isNotConfirm.current = false; //hide button confirm
        actionType.current = action; //action button
        setIsModalAlert(true); //show modal
        break;

      default:
        break;
    }
  };

  const _onConfirm = (reason) => {
    switch (actionType.current) {
      case 1:
        _handleDelete(reason);
        break;

      case 2:
        _handleShipper();
        break;
      case 5:
        _handleRollback();
        break;
      default:
        break;
    }
  };

  //HANDLE
  const _handleDelete = async (reason) => {
    try {
      setIsLoadModal(true);
      const {id, order_no} = orderSelect.current;
      const {UserAreas} = await userInfo.getListUser();

      const res = await OrderApi.deleteOrderById(id, reason);

      if (res.status == 200) {
        OrderApi.pushNotiDelOrder(
          '',
          '',
          id,
          UserAreas[0].area_id,
          order_no,
          username,
        );
        titleModal.current = AlertModal.TITLE[1];
        contentModal.current = AlertModal.CONTENT[42];
        return;
      }

      titleModal.current = AlertModal.TITLE[3];
      contentModal.current = AlertModal.CONTENT[43];
    } catch (error) {
      console.log('Err @handleDelete ', error);
      titleModal.current = AlertModal.TITLE[3];
      contentModal.current = AlertModal.CONTENT[43];
    } finally {
      isNotConfirm.current = true; // hide button confirm in modal
      isNote.current = false; //hide dropdown reason
      getListOrder(); //reset list order
      setIsLoadModal(false);
    }
  };

  const _handleShipper = async () => {
    try {
      setIsLoadModal(true);
      const {id} = orderSelect.current;
      const res = await OrderApi.deliveryOrder(id);

      if (res.status == 200) {
        titleModal.current = AlertModal.TITLE[1];
        contentModal.current = AlertModal.CONTENT[44];
        return;
      }

      titleModal.current = AlertModal.TITLE[3];
      contentModal.current = AlertModal.CONTENT[45];
    } catch (error) {
      console.log('Err @handleShipper ', error);
      titleModal.current = AlertModal.TITLE[3];
      contentModal.current = AlertModal.CONTENT[45];
    } finally {
      isNotConfirm.current = true; // hide button confirm in modal
      isNote.current = false; //hide dropdown reason
      getListOrder(); //reset list order
      setIsLoadModal(false);
    }
  };

  const _handleRollback = async () => {
    try {
      setIsLoadModal(true);
      const {id, order_no} = orderSelect.current;
      const res = await OrderApi.rollbackOrder(id);
      if (res) {
        const {UserAreas} = await userInfo.getListUser();
        const res = OrderApi.pushNotiRollbackOrder(
          order_no,
          id,
          UserAreas[0].area_id,
        );
        titleModal.current = AlertModal.TITLE[1];
        contentModal.current = AlertModal.CONTENT[59];
        return;
      } else {
        titleModal.current = AlertModal.TITLE[3];
        contentModal.current = AlertModal.CONTENT[60];
        return;
      }
    } catch (error) {
    } finally {
      isNotConfirm.current = true; // hide button confirm in modal
      getListOrder(); //reset list order
      setIsLoadModal(false);
    }
  };
  const onCloseChoosePrinter = () => {
    setPrinterSelected(null);
    setModalChoosePrinter(false);
  };

  const _onRefresh = async () => {
    setListBill([]);
    setPageIndex(1);
    _onSetParams([], '', '', '');
    // setHaveNewOrder(false); ////////test
    getListOrder();
  };

  //RENDER COMPONENT
  const _renderList = () => {
    if (loading && listBill.length === 0) {
      return <LoadingData />;
    } else if (!loading && countOrders.current === 0) {
      return (
        <NoDataComponent
          title="Không tìm thấy order mang về"
          onRefresh={_onRefresh}
        />
      );
    } else
      return (
        <FlatList
          ref={listRef}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          data={listBill}
          renderItem={_renderItem}
          keyExtractor={_keyExtractor}
          ItemSeparatorComponent={_itemSeparatorComponent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              colors={[colors.ORANGE, colors.WHITE]}
              refreshing={refreshing}
              onRefresh={_onRefresh}
            />
          }
        />
      );
  };

  const LoadingData = () => {
    return [1, 2, 3].map((item, index) => (
      <SkeletonPlaceholder key={index}>
        <SkeletonPlaceholder.Item
          width={'100%'}
          height={100}
          borderTopLeftRadius={5}
          borderTopRightRadius={5}
          marginTop={index === 0 ? 0 : 10}
        />
        <SkeletonPlaceholder.Item width={'100%'} height={15} marginTop={5} />
        <SkeletonPlaceholder.Item width={'100%'} height={10} marginTop={2} />
        <SkeletonPlaceholder.Item width={'100%'} height={10} marginTop={2} />
        <SkeletonPlaceholder.Item width={'100%'} height={10} marginTop={2} />
        <SkeletonPlaceholder.Item width={'100%'} height={10} marginTop={2} />
        <SkeletonPlaceholder.Item
          width={'100%'}
          height={10}
          marginTop={2}
          borderBottomLeftRadius={5}
          borderBottomRightRadius={5}
        />
      </SkeletonPlaceholder>
    ));
  };

  const _renderItem = ({item, index}) => (
    <ItemTakeAway index={index} item={item} onPress={_onEventButton} />
  );

  const _keyExtractor = (item, index) => String(index);

  const _itemSeparatorComponent = () => <ItemSeparator />;

  const _onPressSearch = () => {
    // ngay khi bấm Tìm kiếm theo..., setPageIndex thành 1 số khác 1 để useEffect phát hiện thay đổi và call Api
    navigation.navigate(
      TAKEAWAY_SEARCH,
      paramsSearch(
        statusRef.current,
        order_noRef.current,
        customer_nameRef.current,
        customer_telRef.current,
      ),
    );
  };

  //RENDER MAIN
  return (
    <Wrapper>
      <HeaderComponent title="Đặt mang về" isNotBack />
      {partners?.contract_type_id === 1 ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}>
          <TempContractContent />
        </View>
      ) : !canUse ? (
        <ContentIfNoRole5 />
      ) : (
        <>
          <SearchBar>
            <TextComponent heavy color={colors.BLACK_GRAY} mLeft={10}>
              Có {countOrders.current} kết quả
            </TextComponent>
            <SearchBtn
              onPress={() => {
                loadMore || loading ? null : _onPressSearch();
              }}>
              <FontAwesome name="search" size={15} color={colors.PRIMARY} />
              <TextComponent color={colors.PRIMARY} mLeft={5}>
                Tìm kiếm theo
              </TextComponent>
            </SearchBtn>
          </SearchBar>
          <BodyWrap>
            {_renderList()}
            {haveNewOrder ? (
              // hộp thoại thông báo có order mới
              <NotiNewOrder>
                <TextComponent
                  onPress={_onRefresh}
                  heavy
                  color={colors.WHITE}
                  mLeft={10}>
                  Có đơn mới
                </TextComponent>
              </NotiNewOrder>
            ) : null}
            {loadMore ? (
              <ActivityIndicator color={colors.ORANGE} size="large" />
            ) : null}
            <Button onPress={_onTakeAway} />
          </BodyWrap>
        </>
      )}

      <ModalCfirmDropdownComponent
        isVisible={isModalAlert}
        title={titleModal.current}
        content={contentModal.current}
        isNotConfirm={isNotConfirm.current}
        isNote={isNote.current}
        loading={isLoadModal}
        optionSelect={orderStatus === 2 ? options_2 : options_1}
        placeHolder="Chọn lý do hủy"
        onClosePopup={_onCloseAlert}
        onConfirm={_onConfirm}
      />
      <ModalChoosePrinter
        onModalHide={() => _onPrint(printerSelected)}
        isVisible={modalChoosePrinter}
        onClosePopup={onCloseChoosePrinter}
        onPrint={() => setModalChoosePrinter(false)}
        listPrinters={listPrintersRef.current}
        onSelectPrinter={onSelectPrinter}
        printerSelected={printerSelected}
      />
      <ModalPrint
        isVisible={modalPrint}
        title={titleModalPrintRef.current}
        content={contentModalPrint}
        loading={isPrintingRef.current}
        onClosePopup={onCloseModalPrint}
        onModalShow={handlePrint}
        isConnect = {isPrintingRef.current}
      />
    </Wrapper>
  );
};

export default TakeAway;
