/* eslint-disable react-hooks/exhaustive-deps */
import messaging from '@react-native-firebase/messaging';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {Transition, Transitioning} from 'react-native-reanimated';
import {useSelector, useDispatch} from 'react-redux';
import {orderAction, areaAction} from '../../../redux/actions';
import colors from '../../../assets/colors';
import Feather from 'react-native-vector-icons/Feather';
import {
  OrderApi,
  TableApi,
  NotifyApi,
  NotificationApi,
  FoodApi,
} from '../../../api';
import BillApi from '../../../api/BillApi';
import {AlertModal} from '../../../common';
import {users, userInfo} from '../../../stores'; /// test
import {
  ButtonChangeTable,
  ButtonSearch,
  ButtonSelectArea,
  HeaderHome,
  ListAreaComponent,
  ListTableComponent,
  LoaderHomeComponent,
  LoadingComponent,
  ModalAddMoreOrder,
  ModalButtonType,
  ModalCfirmComponent,
  ModalCfirmDropdownComponent,
  ModalOptionPayment,
  ModalQrCodeComponent,
  NoDataComponent,
  PopupAlertComponent,
  ModalTablesComponent,
  ModalChooseOrder,
  TextComponent,
  PopUpTempContract,
  HeaderComponent,
  PopUpStaffHasNoArea,
  ModalCheckInOut,
} from '../../../components';
import {
  EDIT_FOOD,
  FOOD_CATEGORY,
  LIST_BILL,
  ORDER_PAYMENT,
  PAYMENT,
  PAY_ONEBYONE,
  SELECT_USER,
  ORDER_FOOD,
} from '../../../navigators/ScreenName';
import {
  BodyWrap,
  CancelMerge,
  ConfirmMerge,
  MergeTable,
  MergeWrap,
  WarningPanel,
  TextWarningPanel,
} from './styles';
import moment from 'moment';
import {Linking, BackHandler} from 'react-native';

const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={200} />
    <Transition.Change />
    <Transition.Out type="fade" durationMs={200} />
  </Transition.Together>
);

const Home = ({navigation, route}) => {
  const URL_OMENU_REGISTER = 'https://omenu.vn';
  const isFocused = useIsFocused();
  const {partners, shift, area} = useSelector(state => state);
  const transitionRef = useRef();
  const RBSheetRef = useRef();
  const areaLength = useRef(null);
  const areaIdRef = useRef(area || null);
  const areaNameRef = useRef('');
  const listTableUsedRef = useRef([]);
  const listTableEmptyRef = useRef([]);
  const titleModalRef = useRef('');
  const titleModal = useRef('');
  const contentModalRef = useRef('');
  const contentModal = useRef('');
  const isNotConfirmRef = useRef(false);
  const isNotConfirmDd = useRef(false);
  const buttonTypeRef = useRef(0);
  const billRef = useRef();
  const resultSearch = useRef({});
  const tableId = useRef(null);
  const userId = useRef(null);
  const sheetTableRef = useRef();
  const numRef = useRef();
  const dispatch = useDispatch();
  const [listTable, setListTable] = useState([]);
  const [isEmptyTable, setIsEmptyTable] = useState(true); // change status table
  const [isSelectArea, setIsSelectArea] = useState(false); // modal select area
  const [isVisible, setIsVisible] = useState(false); // modal notification for contract
  const [isLoading, setIsLoading] = useState(true); // loading component
  const [isModalAlert, setIsModalAlert] = useState(false); // modal confirm change status table
  const [tableSelected, setTableSelected] = useState({}); // modal confirm change status table
  const [isModalQrCode, setIsModalQrCode] = useState(false);
  const [isLoadOrder, setIsLoadOrder] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // show of modal confirm action BottonSheet
  const [isNoteReason, setIsNoteReason] = useState(true);
  const [optionSelect, setOptionSelect] = useState([]);
  const [isMergeTable, setIsMergeTable] = useState(false);
  const [showOptionPayment, setShowOptionPayment] = useState({visible: false});
  const [isShowOrder, setIsShowOrder] = useState(false);
  const [isShowDelPayment, setIsShowDelPayment] = useState(false);
  const [isModalAddMoreOrder, setIsModalAddMoreOrder] = useState(false);
  const [listTableMerged, setListTableMerged] = useState([]);
  const actionOnSheetTableRef = useRef(0);
  const [qrCodeGenerated, setQrCodeGenerated] = useState(''); //QR code string của bàn
  const [ordersOfTable, setOrdersOfTable] = useState(null); //Orders của bàn/ bàn ghép được chọn
  const orderSelected = useRef(null); // Ref lưu order chọn để chuyển bàn
  const [modalChooseOrder, setModalChooseOrder] = useState(false); // modal chọn order để chuyển bàn
  const [isHandling, setIsHandling] = useState(false); // state của modal loading khi gọi api
  const needToChangeTableEmpty = useRef(false); // Flag check xem có cần chuyển bàn gốc về bàn trống sau khi chuyển order sang bàn khác hay không
  const actionWhenModalChooseOrderHide = useRef(0); // Flag lưu action cần xử lý khi modal choose order hide - 0: do nothing, 1: tiếp tục cho chọn bàn
  const [popUpTempContract, setPopUpTempContract] = useState(false);
  const [staffHaveNoArea, setStaffHaveNoArea] = useState(false);
  const content1PopUpNoArea = useRef('');
  const content2PopUpNoArea = useRef('');
  const needConfirmOnPopUpNoArea = useRef(false);
  const areaSelected = useRef(null);
  const [needRejectAction, setNeedRejectAction] = useState(false);
  const [modalConfirmSeparateTables, setModalConfirmSeparateTables] = useState(
    false,
  );
  const contentMergeTableRef = useRef('');
  const isEmptyRef = useRef(true);
  const [modalCheckInOut, setModalCheckInOut] = useState(false);
  const [timeUsed, setTimeUsed] = useState(60 * 1000);
  const timeInterval = useRef();
  const [handlingInModal, setHandlingInModal] = useState(false);
  useEffect(() => {
    if (timeInterval.current) clearInterval(timeInterval.current);
    if (isEmptyTable || !findTheEarliestOrder(tableSelected.orders)) {
      return;
    } else {
      setTimeUsed(
        msToHMS(
          moment() -
            moment(findTheEarliestOrder(tableSelected.orders)?.check_in),
        ),
      );
      timeInterval.current = setInterval(() => {
        setTimeUsed(
          msToHMS(
            moment() -
              moment(findTheEarliestOrder(tableSelected.orders)?.check_in),
          ),
        );
      }, 1000);
    }
  }, [tableSelected]);
  function msToHMS(duration) {
    let minutes = parseInt((duration / (1000 * 60)) % 60);
    let hours = parseInt(duration / (1000 * 60 * 60));
    minutes = minutes < 10 ? '0' + minutes : hours > 99 ? '59' : minutes;
    hours = hours < 10 ? '0' + hours : hours > 99 ? 99 : hours;

    return hours + ' giờ ' + minutes + ' phút';
  }
  const findTheEarliestOrder = orders => {
    if (!orders || orders?.length === 0) return null;
    else {
      let res = orders[0];
      for (const item of orders) {
        if (moment(item?.check_in) < moment(res?.check_in)) {
          res = item;
        }
      }
      return res;
    }
  };
  const checkTimeCheckOut = () => {
    if (!shift?.check_in) return true;
    const {isOverNight, end_time} = shift;
    if (!end_time) return true;
    let splitEndTime = shift?.end_time.split(':');
    let timeNow = new Date().getHours() * 60 + new Date().getMinutes();
    let timeCheckOut =
      parseInt(splitEndTime[0]) * 60 +
      parseInt(splitEndTime[1]) +
      (isOverNight ? 24 * 60 : 0);
    if (timeNow >= timeCheckOut) return false;
    return true;
  };
  useEffect(() => {
    checkStaffArea();
    const subscriber = messaging().onMessage(async remoteMessage => {
      const {action, body_data} = remoteMessage.data;
      if (
        action === 'reset_table' ||
        action === 'staff_order_item' ||
        action === 'request-into-table' ||
        action === 'merge_table' ||
        action === 'unmerge_table' ||
        action === 'add_table' ||
        action === 'move_table' ||
        action === 'finished_payment' ||
        action === 'cancel_payment' ||
        action === 'cancel_order'
      ) {
        getDataTable(areaIdRef.current, isEmptyRef.current);
      }
    });
    return subscriber;
  }, []);

  useEffect(() => {
    getDataTable(areaIdRef.current, isEmptyRef.current);
    // setListTable(
    //   isEmptyRef.current ? listTableEmptyRef.current : listTableUsedRef.current,
    // );
  }, [isEmptyRef.current]);
  useEffect(() => {
    getDataTable(areaIdRef.current, isEmptyRef.current);
  }, [isFocused]);
  const checkStaffArea = async () => {
    const {UserAreas} = await userInfo.getListUser();
    if (UserAreas.length === 0) {
      content1PopUpNoArea.current = 'Bạn chưa được phân công khu vực làm việc';
      content2PopUpNoArea.current = 'Vui lòng liên hệ quản lý';
      setStaffHaveNoArea(true);
    }
  };
  const getDataTable = async (areaId, isEmpty) => {
    if (!isFocused) return;

    try {
      setIsMergeTable(false);
      const user = await userInfo.getListUser();
      const res = await TableApi.getListTable();
      const topic = `area_${areaId ? areaId : user.UserAreas[0].area_id}`;
      const listNoti = await NotificationApi.getListNotify(
        //Lấy các thông báo yêu cầu vào bàn
        0,
        100,
        'request_into_table',
        '0',
        topic,
      );
      let listTableWithNoti = res.map(item => {
        return {
          ...item,
          tables: item.tables.map(_item => {
            //Thêm data trong noti để xử lý xác nhận vào bàn
            let itemFound = listNoti.data.find(
              itemNoti => itemNoti.body_data.table_id === _item.id,
            );
            if (
              itemFound &&
              moment() - moment(itemFound.updated_at) <= 60 * 60 * 1000
            ) {
              return {
                ..._item,
                idNotiNeedHandle: itemFound.notification_create_id,
                user_into_table_id: itemFound.body_data.user_id,
              };
            } else return {..._item, idNotiNeedHandle: null};
          }),
        };
      });
      let listTableWithGroupOrder = await Promise.all(
        listTableWithNoti.map(async (item) => {
          return {
            ...item,
            tables: await Promise.all(
              item.tables.map(async (_item) => {
                if (
                  _item.table_join_id != null &&
                  _item.table_join_id != '' &&
                  _item.orders.length === 0 &&
                  _item.is_table_join
                ) {
                  const _orders = await OrderApi.getOrdered(
                    _item.table_join_id,
                  );
                  if (res) {
                    return {
                      ..._item,
                      orders: _orders.data,
                    };
                  } else return _item;
                } else return _item;
              }),
            ),
          };
        }),
      );
      const areas = listTableWithGroupOrder.find(
        value => value.id === (areaId ? areaId : user.UserAreas[0]?.area_id),
      );
      const {tables, name, id} = areas || res[0];

      const newArr = tables.map(item => {
        if (
          item.is_table_join &&
          item.table_join_id != null &&
          item.table_join_id != ''
        ) {
          return {
            ...item,
            listMergedTables: tables.filter(
              _item => _item.table_join_id === item.table_join_id,
            ),
            isSelect: true,
          };
        } else return {...item, isSelect: true};
      });
      const arrTableTemp = newArr.filter(value => value.status === 0);
      const arrTableUsed = newArr.filter(value => value.status !== 0);
      areaLength.current = res.length;
      areaNameRef.current = name;
      areaIdRef.current = id;
      listTableEmptyRef.current = arrTableTemp.sort((a, b) => a.name - b.name);
      listTableUsedRef.current = arrTableUsed.sort((a, b) => a.name - b.name);
      setListTable(
        isEmptyRef.current
          ? listTableEmptyRef.current
          : listTableUsedRef.current,
      );
      // const {tableName, seatCount} = resultSearch.current;
      // _onSearch(tableName, seatCount, isEmpty);
    } catch (error) {
      console.log('Err @getDataTable ', error);
      setListTable([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getListPayment = async () => {
    try {
      setIsLoadOrder(true);

      let data = tableSelected.orders.filter(
        item => item.order_status?.id === 2,
      );
      if (data.length === 1) {
        const params = data[0];
        billRef.current = params;
        const options = [
          {label: 'Ghi sai order', value: 'Ghi sai order'},
          {label: 'Khách hàng đổi/trả món', value: 'Khách hàng đổi/trả món'},
          {label: 'Thu ngân tính sai tiền', value: 'Thu ngân tính sai tiền'},
          {label: 'Khác', value: 4},
        ];
        setIsNoteReason(true);
        setOptionSelect(options);
        isNotConfirmDd.current = false;
        titleModal.current = AlertModal.TITLE[0];
        contentModal.current = `${AlertModal.CONTENT[6]} ${params.customer_name} ${AlertModal.CONTENT[7]}`;
        setShowConfirm(true);
        return;
      }

      return navigation.navigate(LIST_BILL, {
        ...tableSelected,
        listBill: data,
        areaId: areaIdRef.current,
      });
    } catch (error) {
      console.log('Err @getListBill', error);
    } finally {
      setIsLoadOrder(false);
    }
  };

  //EVENT
  const _onSelectArea = () => setIsSelectArea(!isSelectArea);

  const _onChangeTable = isEmpty => {
    if (!checkTimeCheckOut()) {
      setModalCheckInOut(true);
      return;
    }
    if (isLoading || isMergeTable) {
      return;
    }
    setIsEmptyTable(isEmpty);
    isEmptyRef.current = isEmpty;
    transitionRef.current.animateNextTransition();
  };

  const _onSelectTable = item => {
    if (!checkTimeCheckOut()) {
      setModalCheckInOut(true);
      return;
    }
    if (item.orders.length > 0) numRef.current = item.orders.length;
    try {
      console.log(item.listMergedTables);
      setTableSelected(item);
      if (isMergeTable) {
        setListTable(curTable =>
          curTable.map(value => {
            return value.id === item.id &&
              (isEmptyTable ? !value.is_table_join : true)
              ? {...value, isSelect: !value.isSelect}
              : value;
          }),
        );
        return;
      }

      //Tim xem co order nao qua 4 tieng chua thanh toan ko
      const haveUnPadiOrder = !item.orders.length
        ? false
        : !isEmptyTable &&
          item.orders.reduce(
            (init, order) =>
              init ||
              (moment().diff(moment(order?.check_in), 'minutes') >= 480 &&
                order?.order_status?.id === 1),
            false,
          );
      if (haveUnPadiOrder) {
        titleModalRef.current = AlertModal.TITLE[6];
        // contentModalRef.current = `Các order tại bàn ${item.name} đã tồn tại quá lâu\nVui lòng kiểm tra lại thông tin trước khi sử dụng`;
        contentModalRef.current = `Bàn ${item.name
          } đã sử dụng trong thời gian dài (${msToHMS(
            moment() - moment(findTheEarliestOrder(item.orders)?.check_in),
          )}). ${AlertModal.CONTENT.dialogWarning}`;
        isNotConfirmRef.current = true;
        buttonTypeRef.current = 'temp-for-have-unpaid-orders';
        setIsModalAlert(!isModalAlert);
        return;
      }

      if (partners?.contract_type_id != 1 && partners?.is_table) {
        RBSheetRef.current.open();
        setListTableMerged([]);
        buttonTypeRef.current = 0;
        const listOrder = item.orders;
        if (listOrder.length > 1) {
          setIsShowOrder(true);
        }
        if (listOrder.length > 0) {
          listOrder.find(item => {
            if (item.order_status?.id === 2) {
              setIsShowDelPayment(true);
            }
          });
        }
        return;
      } else {
        const content = isEmptyTable
          ? AlertModal.CONTENT[1]
          : AlertModal.CONTENT[2];
        buttonTypeRef.current = 'temp_contract_action';
        isNotConfirmRef.current = false;
        titleModalRef.current = AlertModal.TITLE[0];
        contentModalRef.current = `${AlertModal.CONTENT[0]} ${item.name} ${content}`;

        setIsModalAlert(!isModalAlert);
        return;
      }
    } catch (error) {
      console.log('Err @onSelectTable ', error);
    }
  };

  const _onActionSheet = actionType => {
    buttonTypeRef.current = actionType;
    setTimeUsed(60 * 1000);
    RBSheetRef.current.close();
  };
  //Thanh toán tất cả
  const _onCloseSheet = async () => {
    setIsShowOrder(false);
    setIsShowDelPayment(false);
    //close when not action
    if (buttonTypeRef.current === 0) {
      return;
    }
    if (isEmptyTable) {
      _handleActionEmpty();
    } else {
      _handleActionUsed();
    }
    //action empty table
  };

  // show modal warning contract
  const _onPopupAlert = () => setIsVisible(!isVisible);
  const onCheckArea = async () => {
    const {UserAreas} = await userInfo.getListUser();
    let result = UserAreas.find(item => item.area_id === areaInfo.id);
    if (!result) {
      needConfirmOnPopUpNoArea.current = true;
      content1PopUpNoArea.current =
        'Bạn chưa được phân công làm việc ở khu vực này';
      content2PopUpNoArea.current = 'Cân nhắc trước khi chuyển khu vực';
      setStaffHaveNoArea(true);
      return;
    }
    return;
  };

  // callback from modal list area
  const _onSetListTable = async (areaInfo = null) => {
    try {
      const {UserAreas} = await userInfo.getListUser();
      let result = UserAreas.find(item => item.area_id === areaInfo.id);
      if (!result) {
        areaSelected.current = areaInfo;
        needConfirmOnPopUpNoArea.current = true;
        content1PopUpNoArea.current =
          'Bạn chưa được phân công làm việc\n ở khu vực này';
        content2PopUpNoArea.current = 'Bạn chắc chắn muốn chuyển khu vực?';
        setStaffHaveNoArea(true);
        return;
      } else {
        setIsLoading(true);
        setIsSelectArea(false);
        dispatch(areaAction.set(areaInfo.id));
        await getDataTable(areaInfo.id, isEmptyTable);
      }
    } catch (error) {
      console.log('Err @onSetListTable ', error);
      setListTable([]);
      setIsSelectArea(false);
    } finally {
      setIsLoading(false);
    }
  };
  const onConfirmChangeArea = async () => {
    setIsLoading(true);
    setIsSelectArea(false);
    setStaffHaveNoArea(false);
    dispatch(areaAction.set(areaSelected.current.id));
    await getDataTable(areaSelected.current.id, isEmptyTable);
    return;
  };
  //Hàm chọn bàn trong bottom sheet tách/thêm/chuyển bàn
  const onSelectTableOnSheet = item => {
    const numOfItemsHaveChosen = listTableMerged.reduce(
      (init, item) => init + (item.isSelect ? 1 : 0),
      0,
    );
    const res = listTableMerged.map(_item => {
      if (
        _item.id === item.id &&
        (actionOnSheetTableRef.current === 2
          ? (numOfItemsHaveChosen < listTableMerged.length - 1 &&
              !_item.isSelect) ||
            _item.isSelect
          : true)
      ) {
        return {..._item, isSelect: !_item.isSelect};
      } else
        return actionOnSheetTableRef.current === 4
          ? {..._item, isSelect: false}
          : _item;
    });
    setListTableMerged(res);
  };

  //Hàm xử lý nút xác nhận trên bottom sheet chonj bàn ách/thêm/chuyển bàn
  const _onConfirmMergedSheet = async () => {
    //1: Chỉ xem thông tin bàn ghép, ko có action
    //2: tách bàn
    //3: thêm bàn
    //4: chuyển bàn
    const {id, table_join_id} = tableSelected;
    switch (actionOnSheetTableRef.current) {
      case 2:
        isNotConfirmRef.current = false;
        const separatedTables = listTableMerged
          .filter(item => item.isSelect)
          .reduce(
            (init, item, index) =>
              (init += index === 0 ? item.name : `, ${item.name}`),
            '',
          );
        contentMergeTableRef.current = `Sau khi tách ra, bàn ${separatedTables} sẽ được chuyển về bàn trống`;
        setModalConfirmSeparateTables(true);
        break;
      case 3:
        setIsHandling(true);
        try {
          const data = listTableMerged
            .filter(item => item.isSelect)
            .map(item => {
              return {table_id: item.id};
            });
          if (data.length < 1) {
            setIsHandling(false);
            return;
          }
          const table_id =
            table_join_id != null && table_join_id != '' ? table_join_id : id;
          const res = await TableApi.mergerTable(table_id, data, false);
          if (res) {
            await TableApi.pushNotiAddTable(
              tableSelected,
              listTableMerged.filter(item => item.isSelect),
              areaIdRef.current,
            );
            if (!isEmptyTable) {
              for (item of data) {
                const res = await TableApi.updateStatusTable(
                  item.table_id,
                  true,
                );
              }
            }
            getDataTable(areaIdRef.current, isEmptyTable);

            setIsHandling(false);
          } else {
            setIsHandling(false);
            titleModal.current = AlertModal.TITLE[5];
            contentModal.current = AlertModal.CONTENT[62];
            isNotConfirmRef.current = true;
          }
        } catch (error) {
          console.log('Err@CallMergeTable', error);
          setIsHandling(false);
        }
        sheetTableRef.current.close();
        break;
      case 4:
        if (listTableMerged.length == 0) {
          return;
        }
        const tableChange = listTableMerged.filter(item => item.isSelect);
        if (!tableChange.length) {
          setIsHandling(false);
          return;
        }
        contentMergeTableRef.current = `Bạn muốn chuyển order ${
          orderSelected.current?.order_no || ''
        } của bàn ${tableSelected.name} sang bàn ${tableChange[0].name}`;
        setModalConfirmSeparateTables(true);
        break;
      default:
        break;
    }
  };

  const onConfirmSeparateTables = async () => {
    setIsHandling(true);
    if (actionOnSheetTableRef.current === 2) {
      const list = listTableMerged
        .filter(item => item.isSelect)
        .map(item => {
          return {table_id: item.id};
        });
      if (list.length < 1) {
        return;
      }
      setIsHandling(true);
      const res = await TableApi.mergerTable(
        tableSelected.table_join_id,
        list,
        true,
      );
      if (res) {
        await TableApi.pushNotiUnMergeTable(
          listTableMerged.filter(item => item.isSelect),
          listTableMerged.filter(item => !item.isSelect),
          areaIdRef.current,
        );
        setModalConfirmSeparateTables(false);
        sheetTableRef.current.close();
        getDataTable(areaIdRef.current, isEmptyTable);
        setIsHandling(false);
      } else {
        titleModal.current = AlertModal.TITLE[5];
        contentModal.current = AlertModal.CONTENT[62];
        isNotConfirmRef.current = true;
        setIsModalAlert(true);
        setIsHandling(false);
      }
    } else {
      try {
        const tableChange = listTableMerged
          .filter(item => item.isSelect)
          .map(item => {
            return {
              table_id:
                item.table_join_id != null && item.table_join_id != ''
                  ? item.table_join_id
                  : item.id,
            };
          });
        if (!tableChange) {
          setIsHandling(false);
          return;
        }
        const res = await OrderApi.changeTable(
          orderSelected.current.id,
          tableChange[0],
        );
        if (res) {
          await OrderApi.pushNotiChangeTable(
            orderSelected.current.id,
            orderSelected.current.order_no,
            listTableMerged.find(item => item.isSelect).name,
            tableSelected.name,
            areaIdRef.current,
          );

          _onChangeStatusTable(
            listTableMerged.find(item => item.isSelect),
            true,
          );

          if (needToChangeTableEmpty.current) {
            _onChangeStatusTable();
            needToChangeTableEmpty.current = false;
          }

          sheetTableRef.current.close();
          getDataTable(areaIdRef.current, isEmptyRef.current);
          setModalConfirmSeparateTables(false);
        } else {
          titleModal.current = AlertModal.TITLE[5];
          contentModal.current = AlertModal.CONTENT[62];
          isNotConfirmRef.current = true;
          setIsModalAlert(true);
        }
        setIsHandling(false);
      } catch (error) {
        titleModal.current = AlertModal.TITLE[5];
        contentModal.current = AlertModal.CONTENT[62];
        isNotConfirmRef.current = true;
        setIsModalAlert(true);
        console.log('Err@CallMergeTable', error);
        setIsHandling(false);
      }
    }
  };

  // change status table empty <=> used
  const _onChangeStatusTable = async (table, emptyStatus) => {
    let status = emptyStatus ? emptyStatus : isEmptyTable;
    try {
      setHandlingInModal(true);
      // setIsModalAlert(false);
      const _table = table ? table : tableSelected;
      const {id, name, table_join_id, is_table_join} = _table;
      const res = await TableApi.updateStatusTable(
        is_table_join && table_join_id != null && table_join_id != ''
          ? table_join_id
          : id,
        status,
      );
      if (res.status === 200 && !table) {
        TableApi.pushNotiChangeStatus(id, name, areaIdRef.current);
        titleModalRef.current = 'Thành công';
        contentModalRef.current = `Bàn ${tableSelected.name} đã được chuyển về bàn trống`;
        isNotConfirmRef.current = true;
        setHandlingInModal(false);
        await getDataTable(areaIdRef.current, isEmptyTable);
      }
    } catch (error) {
      console.log('Err @onChangeStatusTable ', error);
      titleModalRef.current = 'Thất bại';
      contentModalRef.current = `Đã xảy ra sự cố khi chuyển bàn trống\nVui lòng kiếm tra lại trạng thái order của bàn ${tableSelected.name}`;
      isNotConfirmRef.current = true;
      setHandlingInModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const _onCloseQrCode = () => setIsModalQrCode(false);

  const _onCloseAlert = () => {
    isNotConfirmRef.current = false;
    setIsModalAlert(false);
  };

  //confirm delete bill đọi xử lý
  const _onConfirmBill = async value => {
    const {id, order_id, customer_name} = billRef.current;
    try {
      const {id: tableId, name} = tableSelected;
      const areaId = areaIdRef.current;

      const res = await OrderApi.deleteOrderById(id, value);
      if (res?.status === 200) {
        setIsNoteReason(false);
        titleModal.current = AlertModal.TITLE[1];
        contentModal.current = `${AlertModal.CONTENT[8]} ${customer_name} ${AlertModal.CONTENT[9]}`;
        isNotConfirmDd.current = true;
        BillApi.pushNotiDelBill(tableId, name, id, areaId); //push notifi khi hủy thanh toán
        getDataTable(areaIdRef.current, isEmptyTable);
      } else {
        isNotConfirmDd.current = true;
        titleModal.current = AlertModal.TITLE[3];
        contentModal.current = `${AlertModal.CONTENT[8]} ${customer_name} ${AlertModal.CONTENT[10]}`;
        setIsNoteReason(false);
        // getDataTable(areaIdRef.current, isEmptyTable);
      }
    } catch (error) {
      console.log('Err @deleteOrderById ', error);
      isNotConfirmDd.current = true;
      titleModal.current = AlertModal.TITLE[3];
      contentModal.current = `${AlertModal.CONTENT[8]} ${customer_name} ${AlertModal.CONTENT[10]}`;
      getDataTable(areaIdRef.current, isEmptyTable);
    }
  };

  const _onClosePopup = () => {
    setShowConfirm(false);
  };

  const _onCloseArea = () => setIsSelectArea(false);
  // modal xác nhận chuyển bàn trống
  const _onConfirmOption = async () => {
    if (buttonTypeRef.current === 2) {
      const {order_id} = await OrderApi.addOrderFood(tableId.current, []);
      await getDataTable(areaIdRef.current, isEmptyTable);
      NotifyApi.postNotiConfirmUser(
        tableId.current,
        order_id,
        areaIdRef.current,
        userId.current,
      );
      setIsModalAlert(false);
      // setIsEmptyTable(false);
      return;
    }
    if (buttonTypeRef.current === 3) {
      const {id, name} = tableSelected;
      _onChangeStatusTable(null, false);
      return;
    }
    if (buttonTypeRef.current === 9 || buttonTypeRef.current === 10) {
      setIsModalAlert(false);
    }
    if (buttonTypeRef.current === 'temp_contract_action') {
      const res = await TableApi.updateStatusTable(
        tableSelected.id,
        isEmptyTable,
      );
      getDataTable(areaIdRef.current, isEmptyTable);
      setIsModalAlert(false);
    }
    if (buttonTypeRef.current == 'confirm-request-into-table') {
      //Xử lý tạo order và push noti về app KH
      onRejectOrConfirmRequestIntoTable(2);
    }
  };
  const onRejectOrConfirmRequestIntoTable = async actionStatus => {
    setIsModalAlert(false);
    const res = await NotificationApi.updateHandledStatusNoti(
      tableSelected.idNotiNeedHandle,
      actionStatus,
    );
    if (res) {
      const [res1, res2] = await Promise.all([
        TableApi.pushNotiConfirmIntoTable(
          actionStatus,
          tableSelected.id,
          tableSelected.name,
          areaIdRef.current,
          tableSelected.user_into_table_id,
        ),
        NotificationApi.changeStatusNotify(tableSelected.idNotiNeedHandle, 1),
      ]);
      if (res1 && res2) {
        titleModalRef.current = AlertModal.TITLE[1];
        contentModalRef.current =
          actionStatus === 2 ? AlertModal.CONTENT[69] : AlertModal.CONTENT[73];
        isNotConfirmRef.current = true;
        setIsModalAlert(true);
      } else {
        titleModalRef.current = AlertModal.TITLE[1];
        actionStatus === 2 ? AlertModal.CONTENT[70] : AlertModal.CONTENT[74];
        isNotConfirmRef.current = true;
        setIsModalAlert(true);
      }
      getDataTable(areaIdRef.current, isEmptyTable);
    } else {
      setIsHandling(false);
      titleModalRef.current = AlertModal.TITLE[5];
      contentModalRef.current = AlertModal.CONTENT[62];
      isNotConfirmRef.current = true;
      setIsModalAlert(true);
    }
  };

  const _onRefresh = () => getDataTable(areaIdRef.current, isEmptyTable);

  // handle merge tables
  const _onMergeTable = async action => {
    /*
      1 => cancel merge
      2 => confirm merge
      3 => show merge
    */
    const {UserAreas} = await userInfo.getListUser();
    if (UserAreas.length === 0) {
      content1PopUpNoArea.current = 'Bạn chưa được phân công khu vực làm việc';
      content2PopUpNoArea.current = 'Vui lòng liên hệ quản lý';
      setStaffHaveNoArea(true);
      return;
    }
    const isSelect = action !== 3;
    setIsMergeTable(curIsMerge => !curIsMerge);
    setListTable(curTable =>
      curTable.map(value => {
        return {...value, isSelect};
      }),
    );
    if (action === 2) {
      //Xử lý ghép bàn
      try {
        const data = listTable
          .filter(item => item.isSelect)
          .map(item => {
            return {table_id: item.id};
          });
        if (data.length < 2) {
          return;
        }
        let table_id = data[0].table_id;
        if (!isEmptyTable) {
          let _item = listTable.find(
            item => (item.table_join_id != null) & (item.table_join_id != ''),
          );
          if (_item) {
            table_id = _item.table_join_id;
          }
        }
        const res = await TableApi.mergerTable(table_id, data, false);
        if (res) {
          await TableApi.pushNotiMergeTable(
            listTable.filter(item => item.isSelect),
            areaIdRef.current,
          );
          getDataTable(areaIdRef.current, isEmptyTable);
        } else {
          titleModal.current = AlertModal.TITLE[5];
          contentModal.current = AlertModal.CONTENT[62];
          isNotConfirmRef.current = true;
          setIsModalAlert(true);
        }
      } catch (error) {
        titleModal.current = AlertModal.TITLE[5];
        contentModal.current = AlertModal.CONTENT[62];
        isNotConfirmRef.current = true;
        setIsModalAlert(true);
        console.log('Err@CallMergeTable', error);
      }
    }
  };

  const _onCloseSearch = () => {
    resultSearch.current = {};
    const arrTable = isEmptyTable
      ? listTableEmptyRef.current
      : listTableUsedRef.current;
    setListTable(arrTable);
  };

  const _onSearch = (tableName, seatCount, isEmpty) => {
    resultSearch.current = {tableName, seatCount};
    const arrTable = isEmpty
      ? listTableEmptyRef.current
      : listTableUsedRef.current;
    //filter name
    const filterName = arrTable.filter(table => {
      const itemData = table.name ? table.name.toUpperCase() : ''.toUpperCase();
      const textData = tableName.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    //filter seat
    const filterSeat = filterName.filter(
      table => table.seat_number >= seatCount,
    );
    const newTable = seatCount > 0 ? filterSeat : filterName;
    setListTable(newTable);
  };

  const _onConfirmTable = (table_id, user_id) => {
    userId.current = user_id;
    tableId.current = table_id;
    buttonTypeRef.current = 2;
    titleModalRef.current = AlertModal.TITLE[0];
    contentModalRef.current = AlertModal.CONTENT[52];
    isNotConfirmRef.current = false;
    setIsModalAlert(true);
  };

  //HANDLE
  const _handleActionEmpty = async () => {
    //1: Goi mom
    //2: Xac nhan vao ban
    //Hien thi Qr code
    const {UserAreas} = await userInfo.getListUser();
    if (UserAreas.length === 0) {
      content1PopUpNoArea.current = 'Bạn chưa được phân công khu vực làm việc';
      content2PopUpNoArea.current = 'Vui lòng liên hệ quản lý';
      setStaffHaveNoArea(true);
      return;
    }
    const {id, name, table_join_id} = tableSelected;
    switch (buttonTypeRef.current) {
      case 1:
        setIsHandling(true);
        dispatch(orderAction.resetFood());
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
              area_id: areaIdRef.current,
              table_id: id,
              table_name: name,
              combo_id: '',
              combo_name: '',
              isPrice: false,
              table_join_id,
              isMoveOver: true,
              table: tableSelected,
            });
          } else if (
            listCate.length === 1 &&
            listCate[0].items.length === counterAllFoods
          ) {
            navigation.navigate(ORDER_FOOD, {
              orderId: null,
              area_id: areaIdRef.current,
              table_id: id,
              table_name: name,
              combo_id: listCate[0].id,
              combo_name: listCate[0].name,
              isPrice: listCate[0].is_price,
              table_join_id,
              isMoveOver: true,
              table: tableSelected,
            });
          } else {
            navigation.navigate(FOOD_CATEGORY, {
              orderId: null,
              areaId: areaIdRef.current,
              tableId: id,
              table_join_id,
              tableName: name,
              order_combo_items: [],
              table: tableSelected,
            });
          }
          setIsHandling(false);
        } catch (error) {
          console.log('Error when call api get list category', error);
          setIsHandling(false);
        }

        break;
      case 2:
        titleModalRef.current = AlertModal.TITLE[0];
        contentModalRef.current = `Xác nhận khách hàng vào bàn ${tableSelected.name}`;
        buttonTypeRef.current = 'confirm-request-into-table';
        isNotConfirmRef.current = false;
        setNeedRejectAction(true);
        setIsModalAlert(true);
        break;
      case 3:
        const qrcodeString = await TableApi.generateQRCode(tableSelected.id);
        if (qrcodeString) {
          setQrCodeGenerated(qrcodeString);
        }
        setIsModalQrCode(true);

        break;
      case 4: //Thông tin bàn ghép
        setIsHandling(true);
        const res = await TableApi.getMergedTableInfo(tableSelected.id);
        if (res?.length) {
          actionOnSheetTableRef.current = 1;
          setListTableMerged([
            {...tableSelected, isSelect: true},
            ...res.map(item => {
              return {...item, isSelect: true};
            }),
          ]);
        }
        setIsHandling(false);
        sheetTableRef.current.open();
        break;
      case 5: //Tachs bàn
        setIsHandling(true);
        const _res = await TableApi.getMergedTableInfo(tableSelected.id);
        if (_res?.length) {
          actionOnSheetTableRef.current = 2;
          setListTableMerged([
            {...tableSelected, isSelect: false},
            ..._res.map(item => {
              return {...item, isSelect: false};
            }),
          ]);
        }
        setIsHandling(false);
        sheetTableRef.current.open();
        break;
      case 6: // Thêm bàn
        setIsHandling(true);
        actionOnSheetTableRef.current = 3;
        const list = listTableEmptyRef.current.filter(
          item =>
            !item.is_table_join ||
            item.table_join_id === null ||
            item.table_join_id === '',
        );
        setListTableMerged(
          list.map(item => {
            return {...item, isSelect: false};
          }),
        );
        setIsHandling(false);
        sheetTableRef.current.open();
        break;
      default:
        break;
    }
  };

  const _handleActionUsed = async () => {
    // 1: Danh sach mon
    // 2: Thanh toan
    // 3: Chuyen ban trong
    // 4: Danh sach order
    //5, 6: tam thoi bo qua
    //7: Thong tin ban ghep
    //8: Tach ban
    //9: Them ban
    //10: Chuyen ban
    const {UserAreas} = await userInfo.getListUser();
    if (UserAreas.length === 0) {
      content1PopUpNoArea.current = 'Bạn chưa được phân công khu vực làm việc';
      content2PopUpNoArea.current = 'Vui lòng liên hệ quản lý';
      setStaffHaveNoArea(true);
      return;
    }
    const {name, orders} = tableSelected;
    switch (buttonTypeRef.current) {
      case 1:
        orders.length === 1
          ? navigation.navigate(EDIT_FOOD, {...orders[0], table: tableSelected})
          : navigation.navigate(ORDER_PAYMENT, {
              table: tableSelected,
              orders: orders,
              selected: buttonTypeRef.current,
              areaId: areaIdRef.current,
              toPayment: false,
            });
        break;
      case 2:
        const newOrders = orders.filter(value => value.order_status.id === 1);
        if (!orders.length) {
          titleModalRef.current = AlertModal.TITLE[1];
          contentModalRef.current = AlertModal.CONTENT[11];
          isNotConfirmRef.current = true;
          setIsModalAlert(true);
          return;
        }
        if (!newOrders.length) {
          titleModalRef.current = AlertModal.TITLE[1];
          contentModalRef.current = AlertModal.CONTENT[12];
          isNotConfirmRef.current = true;
          setIsModalAlert(true);
          return;
        } else {
          if (newOrders.length === 1) {
            const data = await OrderApi.getOrderedById(newOrders[0].id);
            if (
              (data.order_combo_items.length === 0 || // ko có suất
                (data.order_combo_items.length === 1 && // Hoặc là có suất nhưng
                  data.order_combo_items[0].order_items.length === 0)) && // chưa gọi món của suất đó
              data.order_items.length === 0 // ko có món lẻ nào khác
            ) {
              titleModalRef.current = AlertModal.TITLE[3];
              contentModalRef.current = AlertModal.CONTENT[49];
              isNotConfirmRef.current = true;
              setIsModalAlert(true);
              return;
            } else {
              // if (data.order_combo_items.length != 0) {
              //   navigation.navigate(PAYMENT, {
              //     ...orders[0],
              //     areaId: areaIdRef.current,
              //   });
              // } else {
              //   setShowOptionPayment({
              //     visible: true,
              //     // data: data.order_items,
              //     order: data,
              //   });
              // }
              // ẩn thanh toán theo món
              navigation.navigate(PAYMENT, {
                ...newOrders[0],
                areaId: areaIdRef.current,
                table: tableSelected,
              });
            }
          } else {
            navigation.navigate(ORDER_PAYMENT, {
              table: tableSelected,
              orders: newOrders,
              selected: buttonTypeRef.current,
              areaId: areaIdRef.current,
              toPayment: true,
            });
          }

          break;
        }
      case 3:
        const orderHaventPaidYet = orders.find(
          item => item.order_status?.id === 1,
        );

        if (orderHaventPaidYet) {
          titleModalRef.current = AlertModal.TITLE[6];
          contentModalRef.current = AlertModal.CONTENT[64];
          isNotConfirmRef.current = true;
        } else {
          titleModalRef.current = AlertModal.TITLE[0];
          contentModalRef.current = `${AlertModal.CONTENT[13]} ${name} ${AlertModal.CONTENT[2]}`;
          isNotConfirmRef.current = false;
        }

        setIsModalAlert(true);
        break;
      case 4:
        navigation.navigate(ORDER_PAYMENT, {
          table: tableSelected,
          selected: buttonTypeRef.current,
          areaId: areaIdRef.current,
          toPayment: false,
        });
        break;
      case 5:
        getListPayment();
        break;
      case 6:
        setIsModalAddMoreOrder(true);
        break;
      case 7:
        setIsHandling(true);
        const res = await TableApi.getMergedTableInfo(tableSelected.id);
        if (res?.length) {
          actionOnSheetTableRef.current = 1;
          setListTableMerged([
            {...tableSelected, isSelect: true},
            ...res.map(item => {
              return {...item, isSelect: true};
            }),
          ]);
        }
        setIsHandling(false);
        sheetTableRef.current.open();

        break;
      case 8:
        setIsHandling(true);
        const _res = await TableApi.getMergedTableInfo(tableSelected.id);
        if (_res?.length) {
          actionOnSheetTableRef.current = 2;
          setListTableMerged([
            {...tableSelected, isSelect: false},
            ..._res.map(item => {
              return {...item, isSelect: false};
            }),
          ]);
        }
        setIsHandling(false);
        sheetTableRef.current.open();
        break;
      case 9:
        actionOnSheetTableRef.current = 3;
        const _list = listTableEmptyRef.current.filter(
          item =>
            !item.is_table_join ||
            item.table_join_id === null ||
            item.table_join_id === '',
        );
        setListTableMerged(
          _list.map(item => {
            return {...item, isSelect: false};
          }),
        );
        sheetTableRef.current.open();
        break;
      case 10:
        setIsHandling(true);
        const unPaidOrder = orders.filter(value => value.order_status.id === 1);

        if (!orders.length) {
          //TODO: xu ly truong hop ko co order nao:
          titleModalRef.current = 'KHÔNG THÀNH CÔNG';
          contentModalRef.current =
            'Bàn này không có order,\n không thể chuyển bàn';
          isNotConfirmRef.current = true;
          setIsHandling(false);
          setIsModalAlert(true);
          return;
        } else if (unPaidOrder.length === 1 && orders.length === 1) {
          orderSelected.current = orders[0];
          needToChangeTableEmpty.current = true;
          actionOnSheetTableRef.current = 4;
          const __list = listTableEmptyRef.current;
          setListTableMerged(
            __list.map(item => {
              return {...item, isSelect: false};
            }),
          );
          setIsHandling(false);
          sheetTableRef.current.open();
          return;
        } else {
          setOrdersOfTable(
            orders.map(item => {
              return {...item, isChosen: false};
            }),
          );
          setIsHandling(false);
          setModalChooseOrder(true);
        }
        break;
      default:
        break;
    }
  };

  //---------Function handle click choose order to exchange table ---------//
  const onChooseOrder = item => {
    orderSelected.current = item;
    actionOnSheetTableRef.current = 4;
    setListTableMerged(
      listTableEmptyRef.current.map(item => {
        return {...item, isSelect: false};
      }),
    );
    setModalChooseOrder(false);
    actionWhenModalChooseOrderHide.current = 1;
  };
  //------------Function handles event when modal choose order hides-------//
  const onModalChooseOrderHide = () => {
    switch (actionWhenModalChooseOrderHide.current) {
      case 0:
        break;
      case 1:
        sheetTableRef.current.open();
        break;
      default:
        break;
    }
    return;
  };

  //RENDER COMPONENT
  const _renderListTable = () => {
    if (isLoading) {
      return <LoaderHomeComponent />;
    }
    if (!listTable.length) {
      return (
        <NoDataComponent
          title={`Hiện tại không có bàn ${
            isEmptyTable ? 'trống' : 'đang dùng'
          }`}
          onRefresh={_onRefresh}
        />
      );
    }

    return (
      <ListTableComponent
        isHome={true}
        listTable={listTable}
        isEmptyTable={isEmptyTable}
        onSelectTable={_onSelectTable}
        onConfirmTable={_onConfirmTable}
      />
    );
  };

  const _onModalAlertHide = () => {
    setNeedRejectAction(false);
    if (buttonTypeRef.current === 'temp-for-have-unpaid-orders') {
      RBSheetRef.current.open();
      setListTableMerged([]);
      buttonTypeRef.current = 0;
      const listOrder = tableSelected.orders;
      if (listOrder.length > 1) {
        setIsShowOrder(true);
      }
      if (listOrder.length > 0) {
        listOrder.find(item => {
          if (item.order_status?.id === 2) {
            setIsShowDelPayment(true);
          }
        });
      }
      return;
    }
  };

  const _renderMergeTable = () => {
    if (partners.contract_type_id === 1 || !partners?.is_table) {
      return null;
    } else if (isEmptyTable && listTableEmptyRef.current.length > 1) {
      return isMergeTable ? (
        <MergeWrap>
          <CancelMerge onPress={() => _onMergeTable(1)} />
          <ConfirmMerge onPress={() => _onMergeTable(2)} />
        </MergeWrap>
      ) : (
        <MergeTable isEmpty={isEmptyTable} onPress={() => _onMergeTable(3)} />
      );
    }
  };

  /** Gọi thêm món */
  const _onOrderMore = () => {
    const {id, name, table_join_id} = tableSelected;
    navigation.navigate(FOOD_CATEGORY, {
      orderId: null,
      areaId: areaIdRef.current,
      tableId: id,
      tableName: name,
      order_combo_items: [],
      table_join_id,
      table: tableSelected,
    });
    setIsModalAddMoreOrder(false);
  };

  const onOpenOmenuWebSite = async () => {
    const supported = await Linking.canOpenURL(URL_OMENU_REGISTER);
    if (supported) {
      await Linking.openURL(URL_OMENU_REGISTER);
    } else {
      return;
    }
  };
  //RENDER MAIN
  return (
    <Transitioning.View
      ref={transitionRef}
      style={{flex: 1}}
      transition={transition}>
      {partners?.is_table ? (
        <HeaderHome />
      ) : (
        <HeaderComponent isNotBack title="Danh Sách Bàn" />
      )}

      {partners?.contract_type_id === 1 ? (
        <WarningPanel onPress={onOpenOmenuWebSite}>
          <TextComponent center color={colors.WHITE}>
            Bạn chưa đăng ký hợp đồng chính thức
          </TextComponent>
          <TextWarningPanel>
            <TextComponent center color={colors.WHITE} mRight={7}>
              Các tính năng đang bị giới hạn
            </TextComponent>
            <Feather name="external-link" color={colors.WHITE} size={15} />
          </TextWarningPanel>
        </WarningPanel>
      ) : null}

      <BodyWrap>
        {/* select table */}
        {areaLength.current !== 1 ? (
          <ButtonSelectArea
            showIcon={true}
            areaName={areaNameRef.current}
            onSelectArea={_onSelectArea}
          />
        ) : null}

        {/* box status table */}
        <ButtonChangeTable
          isEmptyTable={isEmptyTable}
          countTableEmpty={listTableEmptyRef.current.length}
          countTableUsed={listTableUsedRef.current.length}
          onPress={_onChangeTable}
        />
        {/* Tìm bàn */}
        <ButtonSearch
          isEmpty={isEmptyTable}
          onClose={_onCloseSearch}
          onConfirm={_onSearch}
        />

        {/* list table */}
        {_renderListTable()}
        {_renderMergeTable()}
      </BodyWrap>
      {/* popup select area */}
      <ListAreaComponent
        onModalHide={onCheckArea}
        isVisible={isSelectArea}
        areaId={areaIdRef.current}
        onClose={_onCloseArea}
        onConfirm={_onSetListTable}>
        <PopUpStaffHasNoArea
          visible={staffHaveNoArea}
          onClosePopup={() => setStaffHaveNoArea(false)}
          content1={content1PopUpNoArea.current}
          content2={content2PopUpNoArea.current}
          onConfirm={() => onConfirmChangeArea()}
          needConfirm={needConfirmOnPopUpNoArea.current}
        />
      </ListAreaComponent>

      {/* modal change status table */}
      <ModalCfirmComponent
        isVisible={isModalAlert}
        title={titleModalRef.current}
        content={contentModalRef.current}
        isNotConfirm={isNotConfirmRef.current}
        onClosePopup={_onCloseAlert}
        onReject={
          needRejectAction ? () => onRejectOrConfirmRequestIntoTable(3) : null
        }
        loading={handlingInModal}
        onModalHide={_onModalAlertHide}
        onConfirm={_onConfirmOption}
      />
      {/* Modal chon cach thanh toan  */}
      <LoadingComponent isLoading={isHandling} />

      <ModalOptionPayment
        isVisible={showOptionPayment.visible}
        onClosePopup={() => setShowOptionPayment({visible: false})}
        order={showOptionPayment.order}
        table={tableSelected}
        navigation={navigation}
        areaId={areaIdRef.current}
      />

      {/* modal button type */}
      {partners?.contract_type_id != 1 && partners?.is_table ? (
        <ModalButtonType
          isHaveRequestIntoTable={tableSelected.idNotiNeedHandle}
          isMerged={
            tableSelected.is_table_join &&
            tableSelected.table_join_id != null &&
            tableSelected.table_join_id != ''
          }
          orders={tableSelected.orders}
          setRef={RBSheetRef}
          itemSelect={tableSelected}
          isEmptyTable={isEmptyTable}
          onPress={_onActionSheet}
          onCloseSheet={_onCloseSheet}
          isDelOrder={isShowOrder}
          isDelPayment={isShowDelPayment}
          timeUsed={timeUsed}
          num={numRef.current && numRef.current > 0 ? numRef.current : null}
        />
      ) : null}

      {/* modal qr code */}
      <ModalQrCodeComponent
        isAddFriend={false}
        isVisible={isModalQrCode}
        imageQrCode={
          qrCodeGenerated.qrcode_staff
            ? qrCodeGenerated.qrcode_staff
            : tableSelected.qrcode_table
        }
        onClosePopup={_onCloseQrCode}
        onOrderMore={_onOrderMore}
        tblName={tableSelected?.name || ''}
      />

      {/* modal thêm order */}
      <ModalAddMoreOrder
        isVisible={isModalAddMoreOrder}
        imageQrCode={qrCodeGenerated.qrcode_staff}
        onClosePopup={() => setIsModalAddMoreOrder(false)}
        onOrderMore={_onOrderMore}
      />

      {/* popup Alert */}
      <PopupAlertComponent
        isVisible={isVisible}
        imageQrCode={tableSelected.qrcode_table}
        onPress={_onPopupAlert}
      />

      <ModalTablesComponent
        onClose={() => {}}
        onSelectTable={onSelectTableOnSheet}
        tableSelected={tableSelected}
        listTable={listTableMerged}
        action={actionOnSheetTableRef.current}
        setRef={sheetTableRef}
        onConfirm={_onConfirmMergedSheet}>
        <ModalCfirmComponent
          isVisible={modalConfirmSeparateTables}
          title={AlertModal.TITLE[0]}
          content={contentMergeTableRef.current}
          isNotConfirm={isNotConfirmRef.current}
          onClosePopup={() => setModalConfirmSeparateTables(false)}
          onConfirm={onConfirmSeparateTables}
        />
      </ModalTablesComponent>
      {/** Modal confirm hủy order và hủy thanh toán*/}
      {optionSelect.length > 0 ? (
        <ModalCfirmDropdownComponent
          isVisible={showConfirm}
          title={titleModal.current}
          content={contentModal.current}
          isNotConfirm={isNotConfirmDd.current}
          loading={false}
          onClosePopup={() => _onClosePopup()}
          onConfirm={_onConfirmBill}
          isNote={isNoteReason}
          placeHolder={'Chọn lý do hủy'}
          optionSelect={optionSelect}
        />
      ) : null}

      {/* lading */}
      <LoadingComponent isLoading={isLoadOrder} />

      <ModalChooseOrder
        onModalHide={onModalChooseOrderHide}
        data={ordersOfTable}
        visible={modalChooseOrder}
        onPress={value => onChooseOrder(value)}
        onModalShow={() => (actionWhenModalChooseOrderHide.current = 0)}
        onClose={() => {
          actionWhenModalChooseOrderHide.current = 0;
          setModalChooseOrder(false);
        }}
      />

      <PopUpTempContract
        visible={popUpTempContract}
        onClosePopup={() => setPopUpTempContract(false)}
      />
      <ModalCheckInOut
        visible={modalCheckInOut}
        shift={shift}
        onClose={() => setModalCheckInOut(false)}
      />
    </Transitioning.View>
  );
};

export default Home;
