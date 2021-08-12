import React, {useEffect, useRef, useState} from 'react';
import {View, Keyboard} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {colors} from '../../../assets';
import {AlertModal} from '../../../common';
import {
  ButtonComponent,
  HeaderComponent,
  ListAreaComponent,
  LoadingComponent,
  ModalCfirmComponent,
  ModalQrCodeComponent,
  ModalTablesComponent,
  TextComponent,
} from '../../../components';
import {BOOK_TABLE_EDIT} from './../../../navigators/ScreenName';
import styles from './styles';
import FormatMoment from './../../../untils/FormatMoment';
import BookingTable from './../../../api/BookingTable';
import {TableApi} from './../../../api';
import {userInfo} from '../../../stores';
import LoadingDetail from './../../../components/OrderTableComponent/LoadingDetailComponent/index';
import moment from 'moment';

const BookTableDetailScreen = ({route}) => {
  const RBSheetRef = useRef();
  const titleRef = useRef();
  const contentRef = useRef();
  const isNoteRef = useRef(false);

  const navigation = useNavigation();
  const [isLoad, setIsLoad] = useState(true);
  const [bookItem, setBookItem] = useState();
  const isFocusd = useIsFocused();

  const [isVisible, setIsVisible] = useState(0);
  const [isNotConfirm, setIsNotConfirm] = useState(false); // not show button confirm in modal
  const [isModalQr, setIsModalQr] = useState(false);
  const [listTable, setListTable] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [isModalArea, setIsModalArea] = useState(false);
  const [showErrNote, setShowErrNote] = useState(false);

  const [tableOfBookking, setTableOfBooking] = useState([]);

  //
  const areaIdRef = useRef('');
  const areaLengthRef = useRef();
  const areaNameRef = useRef('');
  const listTableEmptyRef = useRef('');
  const listTableUsedRef = useRef('');
  const isSortTableRef = useRef(false);
  const actionWhenSheetClose = useRef(0);

  useEffect(() => {
    getDetailBooking();
  }, [isFocusd]);

  useEffect(() => {
    getListTableByArea();
  }, []);

  useEffect(() => {
    getInfoTableOfBooking();
  }, [isSortTableRef.current]);

  /** Thông tin detail item */
  const getDetailBooking = async () => {
    try {
      const {id} = route.params;
      const res = await BookingTable.getBookingById(id);
      if (res) {
        setBookItem(res);
        setIsLoad(false);
      } else {
        setBookItem([]);
        setIsLoad(false);
      }
    } catch (error) {
      console.log('@getDetailBooking', error);
    }
  };

  // lấy ds bàn trống mặc định ở khu vực đầu tiên
  const getListTableByArea = async () => {
    try {
      const resListArea = await TableApi.getListArea();
      const resTable = await TableApi.getListTable();
      areaIdRef.current = resListArea[0].id;
      const areas = resTable.find((value) => value.id === areaIdRef.current);
      const {tables, name} = areas;
      areaLengthRef.current = areas.length;
      areaNameRef.current = name;
      let _tables = tables.map((item) => {
        if (tableOfBookking.find((_item) => _item.id === item.id)) {
          return {...item, isSelect: true};
        } else {
          return item;
        }
      });
      setListTable(_tables);
    } catch (error) {
      console.log('@getListTableByArea', error);
      setListTable([]);
    }
  };

  //CALL API table
  const getDataTable = async (areaId, isEmpty) => {
    try {
      const res = await TableApi.getListTable();

      const areas = res.find((value) => value.id === areaId);
      const {tables, name} = areas || res[0];

      areaNameRef.current = name;
      areaIdRef.current = areas ? areas.id : res[0].id;
      let _tables = tables.map((item) => {
        if (tableOfBookking.find((_item) => _item.id === item.id)) {
          return {...item, isSelect: true};
        } else {
          return item;
        }
      });

      setListTable(_tables || []);
    } catch (error) {
      console.log('Err @getDataTable ', error);
      setListTable([]);
    }
  };

  // callback from modal list area
  const _onSetListTable = async (areaInfo = null) => {
    try {
      setIsLoading(true);
      await getDataTable(areaInfo.id, true);
    } catch (error) {
      console.log('Err @onSetListTable ', error);
    } finally {
            setIsModalArea(false);

      setIsLoading(false);
    }
  };

  /** danh sách bàn đã chọn cho booking */
  const getInfoTableOfBooking = async () => {
    try {
      const {id} = route.params;
      const res = await BookingTable.getListTableOfBooking(id);
      if (res) {
        setTableOfBooking(res);
      } else {
        setTableOfBooking([]);
      }
    } catch (error) {
      console.log('@getInfoTableOfBooking', error);
      setTableOfBooking([]);
    }
  };

  const _onClosePopup = () => {
    setIsVisible(0);
  };

  //Hide Keyboard
  const _onBackdropPress = () => {
    Keyboard.dismiss();
  };

  //** Alert thành công */
  const _onModalSuccess = async (note) => {
    titleRef.current = AlertModal.TITLE[2];
    const {id} = route.params;
    switch (isVisible) {
      case 1:
        const resConfirmBooking = await BookingTable.updateStatusBooking(
          bookItem.id,
          2,
          '',
        );
        if (resConfirmBooking) {
          const res = await userInfo.getListUser();
          await BookingTable.pushNotiConfirmOrCancelBooking(
            false,
            bookItem.id,
            bookItem.guest_name,
            res.UserAreas[0].area_id,
            bookItem.phone_number,
            '',
          );
          contentRef.current = AlertModal.CONTENT[14];
          getDetailBooking();
        } else {
          contentRef.current = AlertModal.CONTENT[62];
          titleRef.current = AlertModal.TITLE[5];
          getDetailBooking();
        }
        break;
      case 2:
        if (!note) {
          titleRef.current = AlertModal.TITLE[0];
          return setShowErrNote(true);
        }
        const resCancelBooking = await BookingTable.updateStatusBooking(
          id,
          4,
          note,
        );
        if (resCancelBooking) {
          const _res = await userInfo.getListUser();
          await BookingTable.pushNotiConfirmOrCancelBooking(
            true,
            bookItem.id,
            bookItem.guest_name,
            _res.UserAreas[0].area_id,
            bookItem.phone_number,
            note,
          );
        }
        getDetailBooking();
        setShowErrNote(false);
        contentRef.current = AlertModal.CONTENT[15];
        break;
      case 3:
        const resConfirmCustomerIntoTable = await BookingTable.updateStatusBooking(
          id,
          6,
          '',
        );
        if (resConfirmCustomerIntoTable) {
          for (item of tableOfBookking) {
            await TableApi.updateStatusTable(item.id, true);
          }
          await BookingTable.pushNotiConfirmCustIntoTable(
            id,
            bookItem.guest_name,
            bookItem.phone_number,
            tableOfBookking,
          );
        }
        getDetailBooking();
        contentRef.current = AlertModal.CONTENT[16];
        break;
      case 4:
        let selectItem = listTable.filter((item) => item.isSelect === true);
        const dataFormat = selectItem.map((value) => {
          return value.id;
        });
        await BookingTable.sortTableOfBooking(id, dataFormat);
        await BookingTable.updateStatusBooking(id, 3, '');
        getDetailBooking();
        isSortTableRef.current = true;
        contentRef.current = AlertModal.CONTENT[16];
        break;

      default:
        break;
    }
    isNoteRef.current = false;
    setIsNotConfirm(true);
  };

  // confirm button xác nhận
  const _onConfirm = () => {
    titleRef.current = AlertModal.TITLE[0];
    contentRef.current = AlertModal.CONTENT[17];
    isNoteRef.current = false;
    setIsNotConfirm(false);
    setIsVisible(1);
  };

  //ham goi khi sheet close
  const _onSheetClose = () => {
    if (actionWhenSheetClose.current === 0) {
      return;
    } else {
      setIsVisible(4);
    }
  };

  // confirm button hủy
  const _onCancel = () => {
    titleRef.current = AlertModal.TITLE[0];
    contentRef.current = AlertModal.CONTENT[18];
    isNoteRef.current = true;
    setIsNotConfirm(false);
    setShowErrNote(false);
    setIsVisible(2);
  };

  // confirm button khách đã vào bàn
  const _onCustomerTable = () => {
    const {check_in} = bookItem;
    if (
      moment(check_in).valueOf() - new Date().getTime() >
      5 * 60 * 60 * 1000
    ) {
      titleRef.current = AlertModal.TITLE[6];
      contentRef.current = AlertModal.CONTENT[51];
    } else {
      titleRef.current = AlertModal.TITLE[0];
      contentRef.current = AlertModal.CONTENT[19];
    }
    isNoteRef.current = false;
    setIsNotConfirm(false);
    setIsVisible(3);
  };
  // confirm chọn bàn cho booking
  const _onConfirmTable = () => {
    let selectItem = listTable.filter((item) => item.isSelect === true);
    if (selectItem.length === 0) {
      return;
    }
    actionWhenSheetClose.current = 1;
    const {total_guest_number} = route.params;
    let totalSeat = 0;
    selectItem.map((item) => (totalSeat += item.seat_number));
    if (totalSeat < total_guest_number) {
      titleRef.current = AlertModal.TITLE[6];
      contentRef.current = AlertModal.CONTENT[50];
    } else {
      titleRef.current = AlertModal.TITLE[0];
      contentRef.current = AlertModal.CONTENT[46];
    }
    isNoteRef.current = false;
    isSortTableRef.current = false;
    setIsNotConfirm(false);
    RBSheetRef.current.close();
  };

  const _onShowQrCode = () => {
    setIsModalQr(!isModalQr);
  };

  const _onShowModalTable = () => {
    actionWhenSheetClose.current = 0;
    RBSheetRef.current.open();
  };

  const _onSelectTableItem = (item) => {
    const result = listTable.map((value) => {
      if (value.id === item.id) return {...value, isSelect: !value.isSelect};
      return value;
    });
    setListTable(result);
  };

  const _onSelectArea = () => setIsModalArea(!isModalArea);

  const _onEditHeader = () => {
    navigation.navigate(BOOK_TABLE_EDIT, bookItem);
  };

  const _renderInfo = () => {
    return (
      <View>
        <View style={{borderWidth: 1, borderColor: '#e2e2e2', padding: 10}}>
          <TextComponent
            center
            upperCase
            color={colors.PRIMARY}
            lineHeight={30}
            medium>
            THÔNG TIN KHÁCH HÀNG
          </TextComponent>
          <TextComponent>
            <TextComponent bold lineHeight={25}>
              Họ tên:
            </TextComponent>
            {bookItem.guest_name}
          </TextComponent>
          <TextComponent mTop={5}>
            <TextComponent bold lineHeight={25} width={500}>
              Điện thoại:
            </TextComponent>
            {bookItem.phone_number}
          </TextComponent>
          <View style={[styles.rowBetween, {marginTop: 5}]}>
            <TextComponent>
              <TextComponent lineHeight={25} bold>
                Ngày:
              </TextComponent>
              {FormatMoment.FormatBirthday(bookItem.check_in)}
            </TextComponent>
            <TextComponent>
              <TextComponent lineHeight={25} bold>
                Giờ:
              </TextComponent>
              {FormatMoment.FormatTime(bookItem.check_in)}
            </TextComponent>
          </View>
          <View style={[styles.rowBetween, {marginTop: 5}]}>
            <TextComponent>
              <TextComponent bold lineHeight={25}>
                Số lượng:
              </TextComponent>
              {bookItem.total_guest_number} người
            </TextComponent>
            <TextComponent>
              <TextComponent bold lineHeight={30}>
                Loại bàn:
              </TextComponent>
              {bookItem.table_type === 1 ? 'Thường' : 'VIP'}
            </TextComponent>
          </View>
          {bookItem.description !== '' && (
            <TextComponent mTop={5}>
              <TextComponent bold lineHeight={20}>
                Ghi chú:
              </TextComponent>
              {bookItem.description}
            </TextComponent>
          )}
        </View>

        {tableOfBookking.length > 0 ? (
          <View
            style={{
              borderWidth: 1,
              borderColor: '#e2e2e2',
              padding: 10,
              marginTop: 20,
            }}>
            <TextComponent
              center
              upperCase
              color={colors.PRIMARY}
              lineHeight={30}
              medium>
              Thông tin đặt bàn
            </TextComponent>
            <TextComponent lineHeight={25}>
              Bàn:
              {tableOfBookking.map((table, index) => {
                return (
                  ' ' +
                  table.name +
                  `${tableOfBookking.length - 1 === index ? ' ' : ', '}`
                );
              })}
            </TextComponent>
            <TextComponent lineHeight={25}>
              Khu vực {tableOfBookking[0].area.name}
            </TextComponent>
          </View>
        ) : null}
      </View>
    );
  };
  const _renderButton = () => {
    const status = bookItem.status;
    if (status === 4 || status === 5 || status === 6) return;
    return (
      <View style={{marginTop: 20}}>
        <View style={styles.rowCenter}>
          {status === 1 && (
            <ButtonComponent
              onPress={_onConfirm}
              style={[
                styles.button,
                {borderColor: colors.PRIMARY, backgroundColor: colors.WHITE},
              ]}
              titleStyle={[styles.buttonText, {color: colors.PRIMARY}]}
              iconName="like"
              iconColor={colors.PRIMARY}
              title="Xác nhận"
              disabled={status !== 1 || status == 4 ? true : false}
            />
          )}
          <ButtonComponent
            onPress={_onCancel}
            style={[
              styles.button,
              {borderColor: colors.RED, backgroundColor: colors.WHITE},
            ]}
            titleStyle={[styles.buttonText, {color: colors.RED}]}
            iconName="cancel"
            iconColor={colors.RED}
            title="Hủy đặt bàn"
          />
          {status !== 1 && status !== 2 ? (
            <ButtonComponent
              onPress={_onCustomerTable}
              style={[
                styles.button,
                {borderColor: colors.PRIMARY, backgroundColor: colors.WHITE},
              ]}
              titleStyle={[styles.buttonText, {color: colors.PRIMARY}]}
              iconName="table-left"
              iconColor={colors.PRIMARY}
              title={'Khách\n đã vào bàn'}
              titleCenter
            />
          ) : null}
          {status !== 1 ? (
            <ButtonComponent
              onPress={_onShowModalTable}
              style={[
                styles.button,
                {borderColor: colors.PRIMARY, backgroundColor: colors.WHITE},
              ]}
              titleStyle={[styles.buttonText, {color: colors.PRIMARY}]}
              iconName="table-plus"
              iconColor={colors.PRIMARY}
              title="Chọn bàn"
            />
          ) : null}
        </View>
      </View>
    );
  };

  // hiện thị trạng thái booking
  const _renderStatus = () => {
    let strTitle = '';
    if (bookItem) {
      const status = bookItem.status;
      switch (status) {
        case 1:
          return (strTitle = 'Trạng thái: Đợi xác nhận');
        case 2:
          return (strTitle = 'Trạng thái: Đã xác nhận');
        case 3:
          return (strTitle = 'Trạng thái: Đã xếp bàn');
        case 4:
          return (strTitle = 'Trạng thái: Đã hủy');
        case 5:
          return (strTitle = 'Trạng thái: Khách hàng hủy');
        case 6:
          return (strTitle = 'Trạng thái: Khách đã vào bàn');
        default:
          break;
      }
    }
  };

  return (
    <View style={styles.container}>
      <HeaderComponent title={_renderStatus()} />
      {isLoad ? (
        <LoadingDetail />
      ) : (
        <View style={styles.bodyContainer}>
          {_renderInfo()}
          {_renderButton()}
        </View>
      )}
      {!isLoad &&
        bookItem?.status !== 4 &&
        bookItem?.status !== 5 &&
        bookItem?.status !== 6 && (
          <ButtonComponent
            title="Sửa"
            iconName="edit"
            iconColor={colors.PRIMARY}
            titleStyle={[styles.buttonText, {color: colors.PRIMARY}]}
            style={styles.buttonEdit}
            onPress={_onEditHeader}
          />
        )}

      <ModalTablesComponent
        onClose={() => _onSheetClose()}
        setRef={RBSheetRef}
        listTable={listTable}
        onSelectTable={_onSelectTableItem}
        onSelectArea={_onSelectArea}
        onConfirm={_onConfirmTable}
        areaName={areaNameRef.current}
        areaLength={areaLengthRef.current}>
        <ListAreaComponent
          isVisible={isModalArea}
          areaId={areaIdRef.current}
          onClose={() => setIsModalArea(!isModalArea)}
          onConfirm={_onSetListTable}
        />
      </ModalTablesComponent>

      {/* modal area */}

      <ModalCfirmComponent
        isVisible={
          isVisible === 1 ||
          isVisible === 2 ||
          isVisible === 3 ||
          isVisible === 4 ||
          isVisible === 5 ||
          isVisible === 6
        }
        onBackdropPress={_onBackdropPress}
        title={titleRef.current}
        content={contentRef.current}
        onClosePopup={_onClosePopup}
        onConfirm={_onModalSuccess}
        isNote={isNoteRef.current}
        isNotConfirm={isNotConfirm}
        isError={showErrNote}
      />

      <ModalQrCodeComponent
        isVisible={isModalQr}
        onClosePopup={_onShowQrCode}
        imageQrCode={bookItem?.qrcode_table}
      />
    </View>
  );
};

export default BookTableDetailScreen;
