/* eslint-disable react-native/no-inline-styles */
import moment from 'moment';
import React, { useRef, useState, useEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../../../assets';
import { AlertModal } from '../../../../../common';
import { HeaderComponent, ModalCfirmComponent, ModalPrint, ModalChoosePrinter } from '../../../../../components';
import { useNavigation } from '@react-navigation/core';
import { useDispatch } from 'react-redux';
import actions from './../../redux/actions';
import { ConfirmOrderApi } from '../../../../../api';
import { NetPrinter, BLEPrinter } from 'react-native-thermal-receipt-printer'
import {
  Body,
  BtnCheck,
  Container,
  ItemWrap,
  ListData,
  NameFoodWrap,
  RowItem,
  Separator,
  SpaceHeader,
  Text,
  TextFood,
  TextQty,
  BtnIcon,
} from './styles';
const TYPE_PRINT = { 'wifi': 3, 'bluetooth': 4 }
const OrderDetails = ({ route }) => {
  const {
    item: orderItem,
    onHandleProcess,
    isPrintItem,
    listPrinters,
    print: printRoute
  } = route.params;
  const navigation = useNavigation();
  const titleRef = useRef();
  const contentRef = useRef();
  const typeConfirm = useRef(null);
  const printTitle = useRef();
  const printContent = useRef();

  const [isVisible, setIsVisible] = useState(false);
  const [isNotConfirm, setIsNotConfirm] = useState(false);

  // config print order

  const [isShowPrint, setIsShowPrint] = useState(false)
  const [isConnect, setIsConnect] = useState()
  const [isLoadingPrint, setIsLoadingPrint] = useState()

  const [modalChoosePrinter, setModalChoosePrinter] = useState(false);
  const listPrintersRef = useRef(listPrinters);
  const [printerSelected, setPrinterSelected] = useState(printRoute);
  const [errPrint, setErrPrint] = useState(false)

  const isConnectRef = useRef(null)


  const dispatch = useDispatch();

  const onShowConfirmAll = () => {
    titleRef.current = AlertModal.TITLE[0];
    contentRef.current = AlertModal.CONTENT[65];
    setIsVisible(true);
  };

  const _onClosePopup = async () => {
    setIsVisible(false);
    setIsNotConfirm(false);
  };

  const _onModalSuccess = async () => {
    titleRef.current = AlertModal.TITLE[2];
    contentRef.current = AlertModal.CONTENT[66];
    setIsNotConfirm(true);
    await _onUpdateProcessAll();// update xác nhận order
  };

  const onHandleProcessAll = () => {
    if (isPrintItem) {//Kiểm tra Partner có chức năng in
      if (listPrintersRef.current.length === 0) {//
        if (printerSelected) {//khu vuc co 1 may
          typeConfirm.current = 'PROCESS_ALL'
          showPopUpPrinter()
        }else{
          onShowConfirmAll()
        }
      } else {
        setModalChoosePrinter(true)
      }
    } else {
      onShowConfirmAll()
    }
  }



  const _onUpdateProcessAll = async () => {
    const body = orderItem?.order_items?.map(({ id }) => {
      return { order_item_id: id };
    });
    const { customer_name } = orderItem
    dispatch({
      type: actions.ORDER_PROCESSING,
      order_id: orderItem.id,
      body: body || [],
      notification: {
        table_name: orderItem?.table.name,
        customer_name: customer_name,
        order_id: orderItem.id,
        items: JSON.stringify(body),
        area_id: orderItem?.table?.area?.id,
        table_id: orderItem?.table?.id,
      },
    });

    if (isPrintItem && isConnect) {//Nhà hàng có setup in món
      await onPrintStart(orderItem.order_items, orderItem.id)
    }
    navigation.goBack();
  };

  //In order tới bếp bar
  const onPrintStart = async (OrderItems, orderId) => {
    const { id, connect_type } = printerSelected
    const listItems = OrderItems?.map(({ id, item_name, qty, note }) => {
      return { item_id: id, item_name, qty, note };
    });
    const body = {
      "printer_id": `${id}`,
      "order_items": listItems || []
    }
    const receiptCook = await ConfirmOrderApi.postReceiptCook(orderId, body)
    if (receiptCook) {
      if (connect_type === TYPE_PRINT.wifi) {
        NetPrinter.printText(`<C> ${receiptCook.receipt} \n\n\n\n\n\n\n<C>`)
      } else {
        BLEPrinter.printBill(`<C> ${receiptCook.receipt} \n\n\n\n\n\n\n<C>`)
      }
    } else {
      showPopUpError()
    }

  }


  const _onClosePrint = () => setIsShowPrint(false)

  const _onCancel = () => {
    typeConfirm.current = '';
    setIsShowPrint(false)
  }

  //Check kết nối máy in trong khu vực
  const checkConnectPrint = (print) => {
    const { connect_type, device_name } = print;

    if (connect_type === TYPE_PRINT.wifi) {
      const strName = device_name.split(":");
      NetPrinter.init()
      NetPrinter.connectPrinter(strName[0], Number(strName[1])).then((printer) => {
        isConnectRef.current = true
        setIsShowPrint(false)
        setIsConnect(true);
        setIsLoadingPrint(false)

      })
        .catch((err) => {
          isConnectRef.current = false
          printTitle.current = AlertModal.TITLE.errConnect
          printContent.current = AlertModal.CONTENT.errPrint
          setIsLoadingPrint(false)
          setIsConnect(false)
          console.log('@NetPrinter', err)
        });

    } else if (connect_type === TYPE_PRINT.bluetooth) {
      BLEPrinter.init()
      BLEPrinter.connectPrinter(device_name)
        .then(() => {
          isConnectRef.current = true;
          setIsLoadingPrint(false)
          setIsConnect(true)

        })
        .catch((err) => {
          isConnectRef.current = false
          printTitle.current = AlertModal.TITLE.errConnect
          printContent.current = AlertModal.CONTENT.errPrint;
          setIsLoadingPrint(false)
          setIsConnect(false)
          console.log('@BLEPrinter', err)

        });
    }
  }


  const onSelectPrinter = (item) => setPrinterSelected(item)

  const _onContinute = () => {
    setIsShowPrint(false)
  }


  const showPopUpPrinter = () => {
    printTitle.current = 'ĐANG KẾT NỐI MÁY IN';
    printContent.current = 'Vui lòng đợi trong giây lát!...'
    setIsLoadingPrint(true)
    setIsShowPrint(true)
  }

  const showPopUpError = () => {
    printTitle.current = 'THẤT BẠI';
    printContent.current = 'Không thể lấy thông tin order\nVui lòng thử lại sau'
    setIsLoadingPrint(false)
    setErrPrint(true)
    setIsShowPrint(true)
  }

  const handleConnectPrinter = () => {
    checkConnectPrint(printerSelected)
  }

  const onModalHidePrint = async () => {
    if (errPrint) {
      setErrPrint(false);
      return
    }
    if (!isConnect) {
      setIsConnect()
    }
    if (typeConfirm.current = 'PROCESS_ALL') {
      setIsNotConfirm(false);
      onShowConfirmAll()
    }
  }

  const _renderItem = ({ item, index }) => {
    return (
      <ItemWrap key={`ItemOrder-${index}`} onPress={() => onHandleProcess(item)}>
        <RowItem>
          <Text>{index + 1}</Text>
          <NameFoodWrap>
            <TextFood>{item?.item_name}</TextFood>
          </NameFoodWrap>
        </RowItem>
        <NameFoodWrap>
          <Text style={{ marginRight: 5 }}>
            SL
            <TextQty> {item?.qty} </TextQty>
            Dĩa
          </Text>
        </NameFoodWrap>
      </ItemWrap>
    );
  };

  return (
    <Container>
      <HeaderComponent title={orderItem?.table.name} />
      <Body>
        <RowItem>
          <Text>{orderItem?.table?.area?.name}</Text>
          <Text>{moment(orderItem?.check_in).format('hh:mm')}</Text>
        </RowItem>
        <SpaceHeader />
        <RowItem>
          <Text>{orderItem?.order_no}</Text>
          <BtnCheck onPress={() => onHandleProcessAll()}>
            <MaterialCommunityIcons
              name="check"
              size={20}
              color="#0972FF"
            />
            <Text>Xác nhận</Text>
          </BtnCheck>
        </RowItem>
        <SpaceHeader />
        <ListData
          data={orderItem?.order_items}
          keyExtractor={(_, index) => `OrderDetails-${index}`}
          renderItem={_renderItem}
          ItemSeparatorComponent={() => <Separator />}
          showsVerticalScrollIndicator={false}
        />
      </Body>

      <ModalCfirmComponent
        isVisible={isVisible}
        title={titleRef.current}
        content={contentRef.current}
        onClosePopup={_onClosePopup}
        isNotConfirm={isNotConfirm}
        onConfirm={(_onModalSuccess)}
        confirmItem='CONFIRM_ITEMS'
        ProcessAll={typeConfirm.current}
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
        onCancel={_onCancel}
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

    </Container>
  );
};

export default OrderDetails;
