import {StackRouter, useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useDispatch, useSelector} from 'react-redux';
import {OrderApi, FoodApi} from '../../../api';
import colors from '../../../assets/colors';
import {AlertModal} from '../../../common';
import {userInfo} from '../../../stores';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useScrollToTop} from '@react-navigation/native';

import {
  ItemTakeAway,
  ModalCfirmDropdownComponent,
  NoDataComponent,
  TextComponent,
  HeaderComponent,
  HeaderHome,
  PopUpTempContract,
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
import jwt_decode from 'jwt-decode';
import {users} from '../../../stores';
import {images} from '../../../assets';
import {ActivityIndicator, FlatList} from 'react-native';
import {RefreshControl} from 'react-native';
import messaging from '@react-native-firebase/messaging';

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

const OrderFoodWithoutTable = ({navigation}) => {
  const STATUS = [1, 2];
  //START RENDER
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {partners} = useSelector((state) => state);
  const scroll = useSelector((state) => state.scroll);
  const titleModal = useRef(null);
  const contentModal = useRef(null);
  const isNotConfirm = useRef(null);
  const isNote = useRef(null);
  const actionType = useRef(null);
  const orderSelect = useRef({});
  const [listBill, setListBill] = useState([]);
  const [isModalAlert, setIsModalAlert] = useState(false);
  const [isLoadModal, setIsLoadModal] = useState(false);
  const [countOrders, setCountOrders] = useState(0);
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
  const [orderStatus, setOrderStatus] = useState(0);
  const [popUpTempContract, setPopUpTempContract] = useState(false);
  const [canUse, setCanUse] = useState(true);
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
        // const res = await OrderApi.getOrderedById(order_id);
        // setListBill([...listBill, res]);
        // setCountOrders((prev) => prev + 1);
      }
    });
  }, []);

  //AFTER RENDER
  useEffect(() => {
    getRole();
    getListOrder();
  }, [ isFocused]); 
  // Gọi api khi pageIndex thay đổi
    useEffect(() => {
      getRole();
      getListOrder();
    }, [pageIndex]);
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

  const _onSetParams = (status, order_no, customer_name, customer_tel) => {
    setLoading(true);
    setPageIndex(1); // Khi bấm tìm kiếm ở màn hình tìm kiếm, lập tức set pageIndex về 1
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
      if (loadMore) {
        setListBill(listBill.concat(res.data)); // nếu đang load thêm thì nối mảng
      } else {
        setListBill(res.data); // còn ko thì tức là đang tìm kiếm, set res.data ở page 1 vào list
      }
      setCountOrders(res.total);
      setLoadMore(false);
      setLoading(false);
      loadMore ? null : setHaveNewOrder(false);
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
    if (pageIndex >= countOrders / pageSize) {
      return;
    } else {
      setLoadMore(true);
      setPageIndex(pageIndex + 1);
    }
  };

  const _onEventButton = (item, action) => {
    switch (action) {
      case 1:
        isNote.current = true; //hide dropdown reason
        contentModal.current = AlertModal.CONTENT[40];
        break;

      case 2:
        isNote.current = false; //hide dropdown reason
        contentModal.current = AlertModal.CONTENT[41];
        break;

      case 3:
        return navigation.navigate(INVOICE, {
          listFood: item?.order_items,
          tableName: item?.table?.name,
          valueSurcharge: 0,
          isProvisional: true,
          ...item,
        });

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
        break;

      default:
        break;
    }

    titleModal.current = AlertModal.TITLE[0];
    isNotConfirm.current = false; //hide button confirm
    actionType.current = action; //action button
    orderSelect.current = item;
    setOrderStatus(item.order_status.id); //add item for variable
    setIsModalAlert(true); //show modal
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
      const {id} = orderSelect.current;

      const res = await OrderApi.deleteOrderById(id, reason);

      if (res.status == 200) {
        const {UserAreas} = await userInfo.getListUser();
        OrderApi.pushNotiDelOrder('', '', id, UserAreas[0].area_id);
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

  const _onRefresh = async () => {
    if (partners?.contract_type_id === 1) {
      setPopUpTempContract(true);
      return;
    }
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
    } else if (!loading && countOrders === 0) {
      return (
        <NoDataComponent
          title="Không tìm thấy order gọi món"
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

  const _renderItem = ({item}) => (
    <ItemTakeAway item={item} onPress={_onEventButton} />
  );

  const _keyExtractor = (item, index) => String(index);

  const _itemSeparatorComponent = () => <ItemSeparator />;

  const _onPressSearch = () => {
    if (partners?.contract_type_id === 1) {
      setPopUpTempContract(true);
      return;
    }
    setPageIndex(10000000); // ngay khi bấm Tìm kiếm theo..., setPageIndex thành 1 số khác 1 để useEffect phát hiện thay đổi và call Api
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
      <HeaderHome />
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
              Có {countOrders} kết quả
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
    </Wrapper>
  );
};

export default OrderFoodWithoutTable;
