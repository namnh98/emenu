import React, {useState, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, Text, Platform} from 'react-native';
import styles from './styles';
import {
  HeaderComponent,
  ModalCfirmComponent,
  AmountComponent,
  TableTypeComponent,
  NoteComponent,
  ButtonComponent,
  InputComponent,
} from '../../../components';
import {useSelector} from 'react-redux';
import DateTimeComponent from '../../../components/DateTimeComponent/DateTimeComponent';
import DatePicker from '../../../components/DateTimeComponent/DatePicker';
import {colors} from '../../../assets';
import FormatMoment from './../../../untils/FormatMoment';
import {userInfo} from '../../../stores';
import moment from 'moment';
import BookingTable from './../../../api/BookingTable';
import {NotifyApi} from './../../../api';
const BookTableEdit = ({route}) => {
  const bookItem = route.params;

  //config popup confirm
  const titleRef = useRef();
  const contentRef = useRef();
  const isNoteRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isNotConfirm, setIsNotConfirm] = useState(false); // not show button confirm in modal
  const isBackRef = useRef(false);

  const [name, setName] = useState(bookItem.guest_name);
  const [phone, setPhone] = useState(bookItem.phone_number);
  const [note, setNote] = useState(bookItem.description);
  const [newDate, setNewDate] = useState(bookItem.check_in);
  const [newTime, setNewTime] = useState(
    moment(bookItem.check_in).format('HH:mm'),
  );
  const [typeTable, setTypeTable] = useState(bookItem.table_type);
  const [numberCustomer, setNumberCustomer] = useState(
    bookItem.total_guest_number,
  );
  const [showError, setShowError] = useState([]);
  const {close_time, open_time} = useSelector((state) => state.partners);
  const navigation = useNavigation();

  const _onBackScreen = () => navigation.goBack();
  const _onGetCount = (count) => {
    setNumberCustomer(count);
  };

  const _onGetTypeTable = (type) => {
    if (type) {
      setTypeTable(2);
    } else {
      setTypeTable(1);
    }
  };

  const getDatePicker = (value) => {
    setNewDate(value);
  };
  const getTimesPicker = (value) => {
    const time = FormatMoment.FormatTime(value);
    setNewTime(time);
  };

  const onSave = () => {
    let errArray = checkValidateForm();
    if (errArray.length === 0) {
      setShowError([]);
      const _timeBooking = moment(newDate).format('YYYY-MM-DD') + ' ' + newTime;
      if (moment(_timeBooking) - moment() < 3600000) {
        titleRef.current = 'C???nh b??o';
        contentRef.current =
          'Th???i gian ?????t b??n qu?? g???n v???i hi???n t???i\n B???n c?? ch???c ch???n t???o ?????t b??n n??y?';
      } else {
        titleRef.current = 'B???n ch???c ch???n';
        contentRef.current = 'Mu???n l??u th??ng tin ?????t b??n n??y ';
      }
      setIsNotConfirm(false);
      setIsVisible(true);
      isBackRef.current = false;
    } else {
      setShowError(errArray);
    }
  };

  const _onClosePopup = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (isBackRef.current) {
        _onBackScreen();
      }
    }, 500);
  };

  const _onModalSuccess = async () => {
    const {partner_id} = await userInfo.getListUser();
    const {id} = bookItem;
    isBackRef.current = true;
    let checkIn = `${moment(newDate).format('YYYY-MM-DD')} ${newTime}`;
    const data = {
      guest_name: name,
      phone_number: phone,
      check_in: checkIn,
      total_guest_number: numberCustomer,
      table_type: typeTable,
      description: note,
      partner_id: partner_id,
    };
    const res = await BookingTable.updateBookingTable(id, data);
    if (res) {
      const content = 'V???a c?? 1 c???p nh???t th??ng tin ?????t b??n.';
      await NotifyApi.pushNotiCreateBooking(partner_id, id, content); //push noti
      titleRef.current = '???? ho??n th??nh';
      contentRef.current = 'Th??ng tin ?????t b??n ???? ???????c c???p nh???t th??nh c??ng';
      setIsNotConfirm(true);
    }
  };
  const checkOpenAndCloseTimeOfRestaurant = () => {
    const splitCloseTime = close_time.split(':');
    const splitOpenTime = open_time.split(':');
    const splitBookingTime = newTime.split(':');
    return (
      parseInt(splitBookingTime[0]) * 60 + parseInt(splitBookingTime[1]) >=
        parseInt(splitCloseTime[0]) * 60 + parseInt(splitCloseTime[1]) ||
      parseInt(splitBookingTime[0]) * 60 + parseInt(splitBookingTime[1]) <
        parseInt(splitOpenTime[0]) * 60 + parseInt(splitOpenTime[1])
    );
  };

  const compareTime = () => {
    const _timeBooking = moment(newDate).format('YYYY-MM-DD') + ' ' + newTime;
    return moment(_timeBooking) < moment();
  };

  //Check form
  const checkValidateForm = () => {
    let temp = '';
    let arrNew = [];
    if (name === '') {
      temp = 'Vui l??ng nh???p h??? t??n';
      arrNew.push(temp);
    }
    if (phone === '') {
      temp = 'Vui l??ng nh???p s??? ??i???n tho???i';
      arrNew.push(temp);
    }
    if (!/((09|03|07|08|05)+([0-9]{8})\b)/g.test(phone)) {
      temp = 'S??? ??i???n tho???i sai ?????nh d???ng.';
      arrNew.push(temp);
    }
    if (compareTime()) {
      temp = 'Th???i gian ?????t b??n kh??ng h???p l???';
      arrNew.push(temp);
    }
    if (checkOpenAndCloseTimeOfRestaurant()) {
      temp = `Th???i gian  ho???t ?????ng c???a nh?? h??ng l?? t??? ${open_time} ?????n ${close_time}. Gi??? ?????t b??n kh??ng h???p l???`;
      arrNew.push(temp);
    }
    return arrNew;
  };

  //render error
  const renderError = (listError) => {
    return (
      <View style={styles.blockError}>
        {listError.map((itemErr, index) => {
          return (
            <Text key={index} style={styles.textError}>
              {itemErr}
            </Text>
          );
        })}
      </View>
    );
  };
  let styleiOS =
    Platform.OS === 'ios' ? {position: 'relative', zIndex: 10} : {};

  return (
    <View style={styles.container}>
      <HeaderComponent title="S???a th??ng tin ?????t b??n" />
      <View style={styles.bodyContainer}>
        <InputComponent
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <InputComponent
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
        />

        <View style={[styles.rowCenter, styleiOS]}>
          <DatePicker onChangeDate={(value) => getDatePicker(value)} />
          <View style={styles.devicesWidth} />
          <DateTimeComponent
            is24Hour={true}
            mode="time"
            newDate={newDate}
            datePicker={(value) => getTimesPicker(value)}
          />
        </View>

        <View
          style={{
            marginVertical: 10,
            flexDirection: 'column',
            height: 80,
          }}>
          <AmountComponent
            onGetCount={_onGetCount}
            defaultValue={numberCustomer}
          />
          <TableTypeComponent
            onGetTypeTable={_onGetTypeTable}
            selected={typeTable === 2 ? true : false}
          />
        </View>
        <NoteComponent
          value={note}
          onChangeText={setNote}
          style={{backgroundColor: colors.WHITE}}
        />
        {showError.length > 0 ? renderError(showError) : null}
      </View>
      <ModalCfirmComponent
        isVisible={isVisible}
        title={titleRef.current}
        content={contentRef.current}
        onClosePopup={_onClosePopup}
        onConfirm={_onModalSuccess}
        isNote={isNoteRef.current}
        isNotConfirm={isNotConfirm}
      />
      <ButtonComponent
        style={styles.buttonSave}
        titleStyle={styles.buttonText}
        title="L??u"
        iconName="save"
        iconColor={colors.PRIMARY}
        onPress={onSave}
      />
    </View>
  );
};

export default BookTableEdit;
