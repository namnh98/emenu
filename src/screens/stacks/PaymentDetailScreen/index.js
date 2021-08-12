import React, {useRef, useState, useEffect} from 'react';
import {NotifyApi, OrderApi, TableApi, BillApi} from '../../../api';
import {colors} from '../../../assets';
import {AlertModal} from '../../../common';
import {Alert, Keyboard, TouchableWithoutFeedback} from 'react-native';
import {
  ButtonComponent,
  HeaderComponent,
  ModalCfirmComponent,
  ModalPaymentPOS,
  TextComponent,
  ModalShowPrice,
  ModalChoosePrinter,
  ModalPrint,
  MoneyKeyboardComponent,
} from '../../../components';
import {userInfo, users} from '../../../stores';
import {
  INVOICE,
  TAB_WITH_CHECK_IN,
  BOTTOM_TAB,
} from '../../../navigators/ScreenName';
import {FormatNumber} from '../../../untils';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  BodyWrapper,
  Container,
  Content,
  CustomerMoney,
  ExtraWrapper,
  RowWrapper,
  ShowMoney,
  RowWrapper2,
  RowBottom,
  RowButton,
  ButtonPhuThu,
  UnderLine,
} from './styles';
import {_renderBtnOption} from '../PaymentScreen';
import {useSelector} from 'react-redux';
import {NetPrinter, BLEPrinter} from 'react-native-thermal-receipt-printer';
import BaseUrl from '../../../api/BaseUrl';
import axios from 'axios';
import FormatMoment from './../../../untils/FormatMoment';

const PaymentDetail = ({navigation, route}) => {
  const {
    isPayAll,
    id,
    table,
    isPaymentOffline,
    listFood,
    valueSurcharge,
    totalPayment,
    areaId,
    isTakeAway,
    order_no,
    voucherValue,
  } = route.params;
  const moneyReceived = useRef(0);
  const titleAlert = useRef('');
  const contentAlert = useRef('');
  const connectType = useRef(0);
  const [customerMoney, setCustomerMoney] = useState('');
  const [extraMoney, setExtraMoney] = useState(0);
  const [isTakeNot, setIsTakeNot] = useState(false);
  const [isModalAlert, setIsModalAlert] = useState(false);
  const [isModalPOS, setIsModalPOS] = useState(false);
  const [isNotConfirm, setIsNotConfirm] = useState(false);
  const [isLoadModal, setIsLoadModal] = useState(false);
  const [tablePay, setTablePay] = useState('');
  const [modalShowPrice, setModalShowPrice] = useState(false);

  const {currency} = useSelector((state) => state.partners);

  const [currentPrinter, setCurrentPrinter] = useState();
  const [bill, setBill] = useState([]);
  const [idprinter, setidprinter] = useState('');
  const listPrintersRef = useRef([]);
  const [printerSelected, setPrinterSelected] = useState(null);
  const [contentModalPrint, setContentModalPrint] = useState('');
  const isPrintingRef = useRef(false);
  const titleModalPrintRef = useRef('');
  const [modalChoosePrinter, setModalChoosePrinter] = useState(false);
  const [modalPrint, setModalPrint] = useState(false);

  const [isShowMoneyKeyboard, setIsShowMoneyKeyboard] = useState(false);

  useEffect(() => {
    getMergedInfro();
    getListPrinter();
  }, []);
  const getListPrinter = async () => {
    try {
      if (areaId) {
        const res = await BillApi.getPrinters(areaId);
        if (res) {
          listPrintersRef.current = res[0].printer_bills.map((item) => ({
            ...item,
            area_name: res[0].area_name,
          }));
        }
      } else {
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
      }
    } catch (error) {
      console.log('Err @GetAllPrinters', error);
    }
  };
  //Phan in billl

  const _onPrint = (printer) => {
    if (!printer) return;
    setContentModalPrint(`Đang kết nối tới máy in ${printer?.printer_name}`);
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
  const onCloseChoosePrinter = () => {
    setPrinterSelected(null);
    setModalChoosePrinter(false);
  };
  const handlePrint = async () => {
    const {connect_type} = printerSelected;
    if (connect_type === 3) {
      netPrint();
    } else {
      blePrinter();
    }
  };

  const getBillString = async () => {
    return await OrderApi.getReceiptString(id, printerSelected?.id);
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

  // const getBillString = async () => {
  //   console.log(orderSelect.current?.id, printerSelected?.id);
  //   return await OrderApi.getReceiptString(
  //     orderSelect.current?.id,
  //     printerSelected?.id,
  //   );
  // };

  const _onPrintBill = (string, type) => {
    if (type == 3) {
      // Alert.alert('Thông báo', 'In bill thành công');
      NetPrinter.printBill(`<C>  ${string}  \n\n\n\n\n\n\n<C>`);
    } else {
      BLEPrinter.printBill(`<C>  ${string}  \n\n\n\n\n\n\n<C>`);
    }
  };

  //End In bill

  const _setModalAlert = (title = '', content = '') => {
    titleAlert.current = title;
    contentAlert.current = content;
  };

  const _onChangeText = (price) => {
    let c = price.slice(price.length - 1);
    if ((c >= '0' && c <= '9') || price === '') {
      setCustomerMoney(price);
    } else {
      return;
    }
  };

  const getMergedInfro = async () => {
    let _tablePay = table?.name;
    const mergedTable = await TableApi.getMergedTableInfo(table?.id);
    if (mergedTable) {
      for (item of mergedTable) {
        _tablePay += `, ${item.name}`;
      }
    }
    setTablePay(_tablePay);
  };

  const _onValueChange = ({value}) => {
    moneyReceived.current = +value;
    if (value > totalPayment) {
      setExtraMoney(value - totalPayment);
    } else {
      setExtraMoney(0);
    }
  };

  const _onTakeNotMoney = () => setIsTakeNot(!isTakeNot);

  const _onCollectMoney = () => {
    if (customerMoney === '') {
      return;
    }
    if (moneyReceived.current < totalPayment) {
      _setModalAlert(
        AlertModal.TITLE[6],
        `Số tiền ${moneyReceived.current} ${currency?.name_vn} không đủ \n Vui lòng kiểm tra lại
        `,
      );
      setIsNotConfirm(true);
      setIsModalAlert(true);
    } else {
      _setModalAlert(AlertModal.TITLE[0], AlertModal.CONTENT[32]);
      setIsNotConfirm(false);

      if (isPaymentOffline) return setIsModalAlert(true);
      _handleCollectOn();
    }
  };

  const _onCloseModal = () => setIsModalAlert(false);

  const _onClosePOS = () => setIsModalPOS(false);

  const _handleCollectOff = async () => {
    try {
      if (moneyReceived.current < totalPayment) {
        _setModalAlert(AlertModal.TITLE[5], AlertModal.CONTENT[33]);
        return;
      }

      const bill = {
        surcharge_value: valueSurcharge,
        voucher_code: '',
        money_received: moneyReceived.current,
        is_change: false,
      };

      const bill_items = isPayAll
        ? []
        : listFood.map((food) => {
            const {id, item_id, qty, note, is_takeaway} = food;
            return {
              order_item_id: id,
              item_id,
              qty,
              note,
              is_takeaway,
            };
          });

      setIsLoadModal(true);
      const res = await OrderApi.postPayment(id, bill, bill_items);
      if (res?.status === 200) {
        const {bill_id} = res.data.data || {};
        const {table, id} = route.params || {};
        const {UserAreas} = await userInfo.getListUser();
        const params = {
          table_name: tablePay,
          table_id: table?.id,
          order_id: id,
          bill_id,
          area_id: table?.area?.id || UserAreas[0]?.area_id,
          isTakeAway,
          order_no,
        };
        NotifyApi.postPayment(params);
        _setModalAlert(AlertModal.TITLE[1], AlertModal.CONTENT[48]);
        navigation.reset({
          index: 0,
          routes: [
            {
              name: BOTTOM_TAB,
              params: {
                areaId: table?.area?.id || UserAreas[0]?.area_id,
              },
            },
          ],
        });
      } else {
        _setModalAlert(
          AlertModal.TITLE[5],
          AlertModal.CONTENT[36],
          // `${AlertModal.CONTENT[34]} ${table?.name} ${AlertModal.CONTENT[35]}`,
        );
      }
    } catch (error) {
      console.log('Err @handleCollectOff ', error);
      _setModalAlert(AlertModal.TITLE[5], AlertModal.CONTENT[36]);
    } finally {
      setIsNotConfirm(true);
      setIsLoadModal(false);
    }
  };

  const onPrintBtnPress = () => {
    if (listPrintersRef.current.length === 1) {
      setPrinterSelected(listPrintersRef.current[0]);
      _onPrint(listPrintersRef.current[0]);
      return;
    } else {
      setModalChoosePrinter(true);
      return;
    }
  };
  const _handleCollectOn = () => {
    setIsModalPOS(true);
  };

  const onShowMoney = () => setModalShowPrice(true);

  const _MoneyKeyboard = (value) => {
    setCustomerMoney(value);
    _onValueChange({value});
  };

  const _renderButtonPrint = () => {
    return (
      <RowWrapper2>
        <ButtonComponent
          onPress={onPrintBtnPress}
          title="In hóa đơn"
          iconName="print"
          titleColor={colors.PRIMARY}
          iconColor={colors.PRIMARY}
          rowItem
          borColor={'#F2F2F2'}
          paddingV={5}
          // paddingH={10}
          borRadius={5}
        />
      </RowWrapper2>
    );
  };

  const _renderPaymentOffline = () => {
    return (
      <ExtraWrapper>
        {/* <CustomerMoney>
          <TextComponent>Tiền khách đưa</TextComponent>

          <RowWrapper>
            <FormatNumber
              rightText={true}
              value={customerMoney}
              placeholder="Tiền khách đưa"
              onChangeText={_onChangeText}
              width={200}
              onValueChange={_onValueChange}
            />
            <TextComponent mLeft={10} color={colors.ORANGE}>
              {currency?.name_vn || 'VND'}
            </TextComponent>
          </RowWrapper>

        </CustomerMoney>

         */}

        <ButtonPhuThu onPress={() => setIsShowMoneyKeyboard(true)} isBottom>
          <TextComponent>Tiền khách đưa</TextComponent>
          <RowWrapper>
            <TextComponent style={{color: '#767676', fontSize: 15}}>
              {customerMoney === ''
                ? '0'
                : FormatMoment.NumberWithCommas(customerMoney)}
            </TextComponent>
            <UnderLine />
            <TextComponent mLeft={5}>
              {currency?.name_vn || 'VND'}
            </TextComponent>
          </RowWrapper>
        </ButtonPhuThu>

        {extraMoney > 0 && (
          <ExtraWrapper>
            <CustomerMoney>
              <TextComponent>Tiền trả lại cho khách</TextComponent>
              <FormatNumber
                value={isTakeNot ? 0 : extraMoney}
                textColor={colors.ORANGE}
              />
            </CustomerMoney>

            <CustomerMoney>
              <ButtonComponent
                onPress={_onTakeNotMoney}
                title="Khách không lấy tiền thừa"
                iconName={isTakeNot ? 'check-circle' : 'circle'}
                iconColor={colors.ORANGE}
                rowItem
              />
              <FormatNumber
                value={isTakeNot ? extraMoney : 0}
                textColor={colors.ORANGE}
              />
            </CustomerMoney>
          </ExtraWrapper>
        )}
      </ExtraWrapper>
    );
  };

  const _renderPaymentOnline = () => {
    return (
      <ExtraWrapper>
        <CustomerMoney>
          <TextComponent>Hình thức thanh toán ATM</TextComponent>
          <FormatNumber value={0} textColor={colors.ORANGE} />
        </CustomerMoney>

        <CustomerMoney>
          <TextComponent>Tiền trả lại cho khách</TextComponent>
          <FormatNumber value={0} textColor={colors.ORANGE} />
        </CustomerMoney>

        <ButtonComponent
          disabled
          title="Thu tiền bằng máy  POS BIDV"
          iconName="check-circle"
          iconColor={colors.ORANGE}
          rowItem
          alignLeft
          mTop={10}
        />
      </ExtraWrapper>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container>
        <HeaderComponent
          title={table ? `Bàn ${table?.name} thanh toán` : 'Thanh toán'}
        />

        <BodyWrapper>
          {_renderButtonPrint()}
          <Content>
            {isPaymentOffline
              ? _renderPaymentOffline()
              : _renderPaymentOnline()}
          </Content>
        </BodyWrapper>
        {_renderBtnOption(
          totalPayment,
          _onCollectMoney,
          onShowMoney,
          'Thu tiền',
        )}

        <ModalCfirmComponent
          isVisible={isModalAlert}
          isNotConfirm={isNotConfirm}
          title={titleAlert.current}
          content={contentAlert.current}
          loading={isLoadModal}
          onConfirm={_handleCollectOff}
          onClosePopup={_onCloseModal}
        />

        <ModalPaymentPOS isVisible={isModalPOS} onClose={_onClosePOS} />
        <ModalShowPrice
          visible={modalShowPrice}
          onClosePopup={() => setModalShowPrice(false)}
          price={totalPayment}
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
          isConnect={isPrintingRef.current}
        />
        {isShowMoneyKeyboard && (
          <MoneyKeyboardComponent
            isShowMoneyKeyboard={isShowMoneyKeyboard}
            valueMoney={customerMoney === '' ? 0 : customerMoney}
            title="Tiền khách đưa"
            CloseMoneyKeyboard={() => setIsShowMoneyKeyboard(false)}
            MoneyKeyboard={(value) => _MoneyKeyboard(value)}
          />
        )}
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default PaymentDetail;
