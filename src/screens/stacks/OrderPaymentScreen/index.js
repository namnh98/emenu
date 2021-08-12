import React, {useRef, useState, useEffect} from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {OrderApi, TableApi, FoodApi} from '../../../api';
import Modal from 'react-native-modal';
import {useIsFocused} from '@react-navigation/native';
import {
  HeaderComponent,
  ListOrderPayment,
  ModalCfirmDropdownComponent,
  NoDataComponent,
  ModalOptionPayment,
  ButtonComponent,
  ModalAddMoreOrder,
  TextComponent,
  ModalQrCodeComponent,
} from '../../../components';
import {
  EDIT_FOOD,
  HOME,
  PAYMENT,
  FOOD_CATEGORY,
  ORDER_FOOD,
} from '../../../navigators/ScreenName';
import {BodyWrapper, Container, ModalContainer, Wrapper} from './styles';
import {AlertModal} from '../../../common';
import {colors} from '../../../assets';

const OrderPayment = ({navigation, route}) => {
  const {table, areaId} = route.params;
  const listOrder = useRef(table.orders);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalAlert, setIsModalAlert] = useState(false);
  const [isNotConfirm, setIsNotConfirm] = useState(false);
  const [isNoteReason, setIsNoteReason] = useState(true);
  const [dataLenght, setDataLength] = useState(null);
  const [modalDelOrAdd, setModalDelOrAdd] = useState(false);
  const [isModalQrCode, setIsModalQrCode] = useState(false);

  const [isModalAddMoreOrder, setIsModalAddMoreOrder] = useState(false);
  const order = useRef(null);
  const titleModal = useRef('');
  const contentModal = useRef('');
  const orderSelected = useRef({image_qrcode: ''});
  const [optionSelect, setOptionSelect] = useState([]);
  const [isdisabled, setIsdisabled] = useState(false);
  const [listInfoOrder, setListInfoOrder] = useState([]);
  const [actionOnModal, setActionOnModal] = useState(0);
  const [modalOptionPayment, setModalOptionPayment] = useState(false);
  const [qrCodeGenerated, setQrCodeGenerated] = useState(null);
  const isFocused = useIsFocused();

  const titlePopupQrCode = useRef('');

  useEffect(() => {
    getListOrderDetail(listOrder.current);
  }, [isFocused]);
  const getListOrderDetail = async (list) => {
    if (!list.length) return;
    let arr = [];
    for (item of list) {
      const res = await OrderApi.getOrderedById(item.id);
      if (res) {
        arr.push(res);
      }
    }
    setListInfoOrder(arr);
  };
  const _handleDeleteOrRollbackOrder = (item) => {
    const options = [
      {label: 'Khách hàng không đến', value: 'Khách hàng không đến'},
      {label: 'Khách về do đợi lâu', value: 'Khách về do đợi lâu'},
      {label: 'Khách không hài lòng', value: 'Khách không hài lòng'},
      {label: 'Khác', value: 4},
    ];
    setIsNoteReason(orderSelected.current.order_status?.id === 1);
    setOptionSelect(options);
    titleModal.current = AlertModal.TITLE[0];
    contentModal.current =
      orderSelected.current.order_status?.id === 1
        ? AlertModal.CONTENT[30]
        : AlertModal.CONTENT[54];
    setIsNotConfirm(false);
    setIsModalAlert(true);
  };

  //confirm delete order
  const _onConfirmOrder = async (value) => {
    try {
      const {id, order_no} = orderSelected.current;
      const {table, name} = route.params;

      const areaId = route.params.areaId;
      const res =
        orderSelected.current.order_status?.id === 1
          ? await OrderApi.deleteOrderById(id, value)
          : await OrderApi.rollbackOrder(id);
      if (res) {
        const resPushNoti =
          orderSelected.current.order_status?.id === 1
            ? await OrderApi.pushNotiDelOrder(
                table.id,
                table.name,
                id,
                areaId,
                order_no,
              )
            : await OrderApi.pushNotiRollbackOrder(
                order_no,
                id,
                areaId,
                table.id,
                table.name,
              );
        titleModal.current = AlertModal.TITLE[2];
        contentModal.current =
          orderSelected.current.order_status?.id === 1
            ? AlertModal.CONTENT[31]
            : AlertModal.CONTENT[59];
        setIsNoteReason(false);
        setIsNotConfirm(true);
        getListOrderDetail(listOrder.current);
      } else {
        titleModal.current = AlertModal.TITLE[3];
        contentModal.current = AlertModal.CONTENT[62];
        setIsNoteReason(false);
        setIsNotConfirm(true);
      }
    } catch (error) {
      titleModal.current = AlertModal.TITLE[3];
      contentModal.current = AlertModal.CONTENT[62];
      setIsNoteReason(false);
      setIsNotConfirm(true);
      console.log('Err @deleteOrderById ', error);
    }
  };
  const _onSelectOrder = async (item) => {
    orderSelected.current = item;
    switch (route.params.selected) {
      case 1:
        navigation.navigate(EDIT_FOOD, {...item, table: table});
        break;
      case 2:
        // if (item.order_combo_items.length != 0) {
        //   navigation.navigate(PAYMENT, item);
        //   break;
        // } else {
        //   setModalOptionPayment(true);
        //   break;
        // }
        //Ẩn thanh toán theo mon
        navigation.navigate(PAYMENT, item);
        break;
      case 4:
        setModalDelOrAdd(true);
        break;
      default:
        break;
    }
  };
  const _onCloseQrCode = () => setIsModalQrCode(false);
  const _onOrderMore = async () => {
    const {id, name, areaId, table_join_id} = route.params;
    try {
      const listCate = await FoodApi.getComboFoods();
      const listAllFood = await FoodApi.getFoods();
      const counterAllFoods = listAllFood.reduce(
        (init, item) => init + item.items.length,
        0,
      );
      if (!listCate.length) {
        navigation.navigate(ORDER_FOOD, {
          orderId: null,
          area_id: areaId,
          table_id: id,
          table_name: name,
          combo_id: '',
          combo_name: '',
          isPrice: false,
          table_join_id,
          isMoveOver: true,
          table: route.params.table
        });
        return;
      } else if (
        listCate.length === 1 &&
        listCate[0].items.length === counterAllFoods
      ) {
        navigation.navigate(ORDER_FOOD, {
          orderId: null,
          area_id: areaId,
          table_id: id,
          table_name: name,
          combo_id: listCate[0].id,
          combo_name: listCate[0].name,
          isPrice: listCate[0].is_price,
          table_join_id,
          isMoveOver: true,
          table: route.params.table,
        });
        return;
      } else {
        navigation.navigate(FOOD_CATEGORY, {
          orderId: null,
          areaId: areaId,
          tableId: id,
          tableName: name,
          order_combo_items: [],
          table: route.params.table,
        });
        return;
      }
    } catch (error) {
      console.log('Err@GetDataInOrderPaymentScreen', error);
    } finally {
      setIsModalAddMoreOrder(false);
    }
  };
  const _onClosePopup = () => {
    if (listOrder.current.length === 1) {
      setIsModalAlert(false);
      // navigation.navigate(HOME);
      return;
    }
    setIsModalAlert(false);
  };
  const _onShowQRCodeType3 = async () => {
    const qrcodeString = await TableApi.generateQRCode(route.params.table.id);
    if (qrcodeString) {
      setQrCodeGenerated(qrcodeString);
    }
    setIsModalAddMoreOrder(true);
  };

  if (isLoading) {
    return (
      <Container>
        <HeaderComponent title="Vui lòng chọn order" />
        <BodyWrapper>
          <SkeletonPlaceholder>
            {[1, 1].map((item, index) => {
              return (
                <View
                  key={`loadOrderPayment-${index}`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 15,
                  }}>
                  <View
                    style={{
                      flex: 0.5,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View style={{width: 170, height: 20}} />
                    <View style={{width: 170, height: 60, marginTop: 5}} />
                    <View style={{width: 170, height: 20, marginTop: 3}} />
                    <View style={{width: 170, height: 20, marginTop: 3}} />
                  </View>
                  <View
                    style={{
                      flex: 0.5,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View style={{width: 170, height: 20}} />
                    <View style={{width: 170, height: 60, marginTop: 5}} />
                    <View style={{width: 170, height: 20, marginTop: 3}} />
                    <View style={{width: 170, height: 20, marginTop: 3}} />
                  </View>
                </View>
              );
            })}
          </SkeletonPlaceholder>
        </BodyWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <HeaderComponent title="Danh sách order" />

      <BodyWrapper>
        {listOrder.current?.length ? (
          <ListOrderPayment
            data={listInfoOrder}
            onPress={_onSelectOrder}
            action={route.params.selected}
          />
        ) : (
          <NoDataComponent title="Hiện tại bạn không có order!" />
        )}
      </BodyWrapper>
      {optionSelect.length > 0 && (
        <ModalCfirmDropdownComponent
          onModalHide={() => setActionOnModal(0)}
          isVisible={isModalAlert}
          title={titleModal.current}
          content={contentModal.current}
          isNotConfirm={isNotConfirm}
          loading={isLoading}
          onClosePopup={() => _onClosePopup()}
          onConfirm={(value) => _onConfirmOrder(value)}
          isNote={isNoteReason}
          placeHolder={'Chọn lý do hủy'}
          optionSelect={optionSelect}
          isDisabled={isdisabled}
        />
      )}
      <ModalOptionPayment
        onModalHide={() => setActionOnModal(0)}
        isVisible={modalOptionPayment}
        onClosePopup={() => setModalOptionPayment(false)}
        order={orderSelected.current}
        table={table}
        navigation={navigation}
        areaId={areaId}
      />
      <Modal
        onModalHide={() => {
          if (actionOnModal === 0) {
            return;
          } else if (actionOnModal === 1) {
            titlePopupQrCode.current = "QRCODE THÊM ORDER VÀO CHUNG BÀN"
            setIsModalQrCode(true);
          } else if (actionOnModal === 2) {
            _handleDeleteOrRollbackOrder();
          }
        }}
        onBackdropPress={() => {
          setActionOnModal(0);
          setModalDelOrAdd(false);
        }}
        isVisible={modalDelOrAdd}>
        <ModalContainer>
          <TextComponent large heavy>
            Bàn {route.params.name}
          </TextComponent>
          <Wrapper>
            <ButtonComponent
              onPress={() => {
                setActionOnModal(2);
                setModalDelOrAdd(false);
              }}
              iconSize={23}
              iconName={
                orderSelected.current.order_status?.id === 1
                  ? 'delete'
                  : 'rollback'
              }
              title={
                orderSelected.current.order_status?.id === 1
                  ? 'Huỷ order'
                  : 'Khôi phục'
              }
              iconColor={colors.RED}
              row
              center
              titleColor={colors.RED}
              borColor={colors.RED}
              padding={5}
              borRadius={5}
            />

            <ButtonComponent
              onPress={() => {
                setActionOnModal(1);
                setModalDelOrAdd(false);
              }}
              iconSize={23}
              iconName="add-fr"
              title="Thêm bạn"
              iconColor={colors.DARK_PRIMARY}
              row
              center
              titleColor={colors.DARK_PRIMARY}
              borColor={colors.DARK_PRIMARY}
              padding={5}
              borRadius={5}
              margin={10}
            />
          </Wrapper>
        </ModalContainer>
      </Modal>
      <ModalQrCodeComponent
        onModalHide={() => setActionOnModal(0)}
        isAddFriend={true}
        isVisible={isModalQrCode}
        imageQrCode={
          orderSelected.current.image_qrcode || route.params.qrcode_table
        }
        onClosePopup={_onCloseQrCode}
        onOrderMore={_onOrderMore}
        titleHeader={titlePopupQrCode.current}
      />

      <ModalAddMoreOrder
        onModalHide={() => setActionOnModal(0)}
        isVisible={isModalAddMoreOrder}
        imageQrCode={qrCodeGenerated?.qrcode_staff || route.params.qrcode_table}
        onClosePopup={() => setIsModalAddMoreOrder(false)}
        onOrderMore={_onOrderMore}
      />
      {!route.params.toPayment && (
        <ButtonComponent
          onPress={_onShowQRCodeType3}
          style={{position: 'absolute', bottom: 20, right: 20}}
          iconName="cart-plus"
          title="Thêm"
          iconColor={colors.PRIMARY}
          titleColor={colors.PRIMARY}
          borRadius={5}
          borColor={colors.PRIMARY}
          center
          width={70}
          height={60}
        />
      )}
    </Container>
  );
};

export default OrderPayment;
