import { useNavigation } from '@react-navigation/core';
import moment from 'moment';
import React, { useRef, useState, useEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NotifyApi, ConfirmOrderApi } from '../../../../../api';
import { AlertModal } from '../../../../../common';
import { ORDER_DETAILS } from '../../../../../navigators/ScreenName';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../redux/actions';
import { ModalCfirmComponent, ModalPrint, ModalChoosePrinter } from './../../../../../components';
import { NetPrinter, BLEPrinter } from 'react-native-thermal-receipt-printer'
import {
  Body,
  BodyWrap,
  BtnCheck,
  BtnIcon,
  BtnMore,
  Container,
  Header,
  ItemWrap,
  NameFoodWrap,
  NameWrap,
  RowItem,
  SpaceHeader,
  Text,
  TextFood,
  TextMore,
  TextName,
  TextQty,
} from './styles';

const TYPE_PRINT = { 'wifi': 3, 'bluetooth': 4 }
const ItemOrder = ({ item, isPrintItem }) => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const titleRef = useRef();
  const contentRef = useRef();
  const typeConfirm = useRef(null); // PROCESS_ALL, PROCESS, CANCEL
  const printTitle = useRef();
  const printContent = useRef();

  const [isVisible, setIsVisible] = useState(false);
  const [isNotConfirm, setIsNotConfirm] = useState(false);
  const itemRef = useRef();


  // config print order
  const [isShowPrint, setIsShowPrint] = useState(false)
  const [isConnect, setIsConnect] = useState()
  const [isLoadingPrint, setIsLoadingPrint] = useState()

  const [modalChoosePrinter, setModalChoosePrinter] = useState(false);
  const listPrintersRef = useRef([]);
  const [printerSelected, setPrinterSelected] = useState(null);
  const [errPrint, setErrPrint] = useState(false)

  const isConnectRef = useRef(null)
  const existPrintRef = useRef()

  useEffect(() => {
    fectchPrinter()
  }, [])

  //Get api danh sach may in
  const fectchPrinter = async () => {
    const resListPrint = await ConfirmOrderApi.getPrintChickenBar(item.table.area.id)
    if (resListPrint) {
      if (resListPrint[0].printer_chicken_bars.length === 1) {
        setPrinterSelected(resListPrint[0].printer_chicken_bars[0])
        return
      }

      listPrintersRef.current = resListPrint[0].printer_chicken_bars

    } else {
      console.log('Err@callApiGetPrinterBar', error);
    }
  }


  const onShowConfirmAll = () => {
    titleRef.current = AlertModal.TITLE[0];
    contentRef.current = AlertModal.CONTENT[65];
    typeConfirm.current = 'PROCESS_ALL';
    setIsVisible(true);
  };


  const onShowConfirmProcess = (value) => {
    titleRef.current = AlertModal.TITLE[0];
    contentRef.current = `${AlertModal.CONTENT[68]} ${value.item_name} ${AlertModal.CONTENT[7]}`;
    setIsVisible(true);
  };

  const _onClosePopup = () => {
    setIsVisible(false);
    setIsNotConfirm(false);
  };

  const _onModalSuccess = async () => {
    titleRef.current = AlertModal.TITLE[2];
    const { item_name } = itemRef.current || {};

    switch (typeConfirm.current) {
      case 'PROCESS_ALL':
        contentRef.current = AlertModal.CONTENT[66];
        setIsNotConfirm(true);
        await _onUpdateProcessAll();// update x??c nh???n order
        break;
      case 'PROCESS':
        contentRef.current = `${AlertModal.CONTENT[23]} ${item_name} ${AlertModal.CONTENT[67]}`;
        setIsNotConfirm(true)
        await _onUpdateProcess();// update x??c nh???n 1 item
        break;
      default:
        break;
    }
  };

  const _onDelItem = async () => {
    const { item_name, id, item_id } = itemRef.current

    titleRef.current = AlertModal.TITLE[2];
    contentRef.current = `${AlertModal.CONTENT[23]} ${item_name} ${AlertModal.CONTENT[24]}`;
    await _onUpdateCancel(id, item_id);
    setIsNotConfirm(true);

  }

  // x??c nh???n nhi???u item c???a order
  const _onUpdateProcessAll = async () => {
    const body = item?.order_items?.map(({ id }) => {
      return { order_item_id: id };
    });

    const { customer_name } = item
    dispatch({
      type: actions.ORDER_PROCESSING,
      order_id: item.id,
      body: body || [],
      notification: {
        table_name: item?.table.name,
        customer_name: customer_name,
        order_id: item.id,
        items: JSON.stringify(body),
        area_id: item?.table?.area?.id,
        table_id: item?.table?.id,
      },
    });

    if (isPrintItem && isConnect) {//Nh?? h??ng c?? setup in m??n
      await onPrintStart(item.order_items, item.id)
    }

  };

  const onHandleProcess = (value) => {
    itemRef.current = value;
    if (isPrintItem) {//Ki???m tra Partner c?? ch???c n??ng in
      if (listPrintersRef.current.length === 0) {//
        if (printerSelected) {//khu vuc co 1 may in
          typeConfirm.current = 'PROCESS';
          showPopUpPrinter()
        }else{
          showPopUpNotPrint()
        }
      } else {
        setModalChoosePrinter(true)
      }
    } else {
      typeConfirm.current = 'PROCESS';
      onShowConfirmProcess(value)
    }
  }

  const onHandleProcessAll = () => {
    if (isPrintItem) {//Ki???m tra Partner c?? ch???c n??ng in
      if (listPrintersRef.current.length === 0) {//
        if (printerSelected) {//khu vuc co 1 may in
          typeConfirm.current = 'PROCESS_ALL';
          showPopUpPrinter()
        }
        else{
          showPopUpNotPrint()
        }
      } else {
        setModalChoosePrinter(true)
      }
    } else {
      typeConfirm.current = 'PROCESS_ALL';
      onShowConfirmAll()
    }
  }

  // X??c nh???n 1 item c???a order
  const _onUpdateProcess = async () => {
    const { id, item_id, item_name } = itemRef.current;
    const { customer_name } = item
    dispatch({
      type: actions.ORDER_PROCESSING,
      order_id: item.id,
      order_item_id: item_id,
      body: [{ order_item_id: id }],
      notification: {
        item_name: item_name,
        table_name: item?.table.name,
        customer_name: customer_name,
        order_id: item.id,
        items: id,
        area_id: item?.table?.area?.id,
        table_id: item?.table?.id,
      },
    });

    if (isPrintItem && isConnect) {//Nh?? h??ng c?? setup in m??n
      await onPrintStart([itemRef.current], item.id)
    }
  };

  // H???y x??c nh???n order
  const _onUpdateCancel = async () => {
    const { id, item_id, item_name } = itemRef.current;
    dispatch({
      type: actions.ORDER_CANCEL,
      order_id: item.id,
      order_item_id: id,
      item_id,
      body: {
        reason: '',
      },
      notification: {
        item_name: item_name,
        table_name: item?.table.name,
        order_id: item.id,
        item_id: item_id,
        area_id: item?.table?.area?.id,
        table_id: item?.table?.id,
      },
    });

  };

  const _onShowMore = () => {
    const listPrinters = listPrintersRef.current;
    const print = printerSelected
    navigation.navigate(ORDER_DETAILS, {
      item,
      isPrintItem,
      onHandleProcess,
      listPrinters,
      print
    });
  }

  //In order t???i b???p bar
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

  const onModalHidePrint = async () => {
    if(existPrintRef.current !== undefined && !existPrintRef.current){
      return
    }
    if (errPrint) {
      setErrPrint(false);
      return
    }
    if (!isConnect) {
      setIsConnect()
    }
    switch (typeConfirm.current) {
      case 'PROCESS_ALL':
        setIsNotConfirm(false);
        onShowConfirmAll()
        break;
      case 'PROCESS':
        setIsNotConfirm(false);
        onShowConfirmProcess(itemRef.current)
        break;
      default:
        break;
    }
  }


  const _onCancel = () => {
    typeConfirm.current = '';
    setIsShowPrint(false)
  }

  //Check k???t n???i m??y in trong khu v???c
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
    }else{
      showPopUpNotPrint()
    }
  }


  const onSelectPrinter = (item) => setPrinterSelected(item)

  const _onContinute = () => {
    setIsShowPrint(false)
  }


  const showPopUpPrinter = () => {
    printTitle.current = '??ANG K???T N???I M??Y IN';
    printContent.current = 'Vui l??ng ?????i trong gi??y l??t!...'
    setIsLoadingPrint(true)
    setIsShowPrint(true)
  }

  const showPopUpError = () => {
    printTitle.current = 'TH???T B???I';
    printContent.current = 'Kh??ng th??? l???y th??ng tin order\nVui l??ng th??? l???i sau'
    setIsLoadingPrint(false)
    setErrPrint(true)
    setIsShowPrint(true)
  }

  const showPopUpNotPrint = () => {
    printTitle.current = 'C???NH B??O';
    printContent.current = 'L???i c??i ?????t m??y in\n Vui l??ng ki???m tra l???i'
    existPrintRef.current =false;
    setIsShowPrint(true)
  }

  const handleConnectPrinter = () => {
    checkConnectPrint(printerSelected)
  }


  const _renderItem = (value, index) => {
    if (index > 9) return
    return (
      <ItemWrap key={`ItemOrder-${index}`} index={index} onPress={() => onHandleProcess(value)}>
        <RowItem>
          <Text>{index + 1}</Text>
          <NameFoodWrap>
            <TextFood>{value?.item_name}</TextFood>
          </NameFoodWrap>
        </RowItem>
        <NameFoodWrap>
          <Text>
            SL
            <TextQty> {value?.qty}</TextQty>
          </Text>
        </NameFoodWrap>
      </ItemWrap>
    );
  };


  return (
    <Container>
      <Header>
        <RowItem>
          <Text>{item?.table?.area?.name}</Text>
          <Text>{moment(item?.check_in).format('hh:mm')}</Text>
        </RowItem>
        <SpaceHeader />
        <RowItem>
          <Text>{item?.order_no}</Text>
          <BtnCheck onPress={onHandleProcessAll}>
            <MaterialCommunityIcons
              name="check"
              size={20}
              color="#0972FF"
            />
            <Text>X??c nh???n</Text>
          </BtnCheck>
        </RowItem>
        <NameWrap>
          <TextName>B??n {item?.table?.name}</TextName>
        </NameWrap>
      </Header>
      <Body>
        <BodyWrap>{item?.order_items?.map(_renderItem)}</BodyWrap>
        {item?.order_items?.length > 9?
          <BtnMore onPress={_onShowMore}>
            <TextMore>Xem th??m</TextMore>
          </BtnMore> : null
        }

      </Body>
      <ModalCfirmComponent
        isVisible={isVisible}
        title={titleRef.current}
        content={contentRef.current}
        onClosePopup={_onClosePopup}
        isNotConfirm={isNotConfirm}
        onConfirm={(_onModalSuccess)}
        // onModalHide={_onModalSuccess}
        confirmItem='CONFIRM_ITEMS'
        onDelItem={_onDelItem}
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
        existPrint={existPrintRef.current}
      />

      <ModalChoosePrinter
        isVisible={modalChoosePrinter}
        onClosePopup={() => setModalChoosePrinter(false)}
        onPrint={() => setModalChoosePrinter(false)}
        onModalHide={() => checkConnectPrint(printerSelected)}
        listPrinters={listPrintersRef.current}
        onSelectPrinter={onSelectPrinter}
        printerSelected={printerSelected}
        textAgree="?????ng ??"
      // area_name={item.table.area.name}
      />


    </Container>
  );
};

export default ItemOrder;
