import React, {useState, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import styles from './styles';
import {
  HeaderComponent,
  AmountComponent,
  TableTypeComponent,
  NoteComponent,
  ButtonComponent,
  InputComponent,
  ModalCfirmComponent,
} from '../../../components';
import DateTimeComponent from '../../../components/DateTimeComponent/DateTimeComponent';
import DatePicker from '../../../components/DateTimeComponent/DatePicker';
import BookingTable from '../../../api/BookingTable';
import NotifyApi from '../../../api/NotifyApi';
import {colors} from '../../../assets';
import FormatMoment from './../../../untils/FormatMoment';
import moment from 'moment';
import {userInfo} from '../../../stores';
import TimePicker from '../HistoryPaymentScreen/custom/TimePicker';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

const BookTable = () => {
//config popup confirm
  const titleRef = useRef();
  const contentRef = useRef();
  const isNoteRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isNotConfirm, setIsNotConfirm] = useState(false); // not show button confirm in modal
  const isBackRef = useRef(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [newDate, setNewDate] = useState(Date.now());
  const [newTime, setNewTime] = useState(moment().format('HH:mm'));
  const [typeTable, setTypeTable] = useState(2);
  const [numberCustomer, setNumberCustomer] = useState(1);
  const [showError, setShowError] = useState([]);
  const {close_time, open_time} = useSelector(
    state => state.partners?.working_times[0]
  );
  const navigation = useNavigation();
  const [time, settime] = useState(
    `${
      new Date().getHours() < 10
        ? '0' + new Date().getHours()
        : new Date().getHours()
    }:${
      new Date().getMinutes() < 10
        ? '0' + new Date().getMinutes()
        : new Date().getMinutes()
    }`,
  );
  const _onBackScreen = () => navigation.goBack();

  const _onGetCount = count => {
    setNumberCustomer(count);
  };

  const _onGetTypeTable = type => {
    if (type) {
      setTypeTable(2);
    } else {
      setTypeTable(1);
    }
  };

  const getDatePicker = value => {
    setNewDate(value);
  };
  const getTimesPicker = value => {
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

  const compareTime = () => {
    const _timeBooking = moment(newDate).format('YYYY-MM-DD') + ' ' + newTime;
    return moment(_timeBooking) < moment();
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

  const _onClosePopup = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (isBackRef.current) {
        _onBackScreen();
      }
    }, 300);
  };

  const _onModalSuccess = async () => {
    const {partner_id} = await userInfo.getListUser();
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

    const res = await BookingTable.createBookingTable(data);
    if (res) {
      const content = `Kh??ch h??ng ${name} v???a y??u c???u ?????t b??n`;
      await NotifyApi.pushNotiCreateBooking(partner_id, res.id, content); //push noti
      await BookingTable.updateStatusBooking(res.id, 2, '');
      titleRef.current = '???? ho??n th??nh';
      contentRef.current = 'Th??ng tin ?????t b??n ???? ???????c ?????t th??nh c??ng';
      setIsNotConfirm(true);
    }
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
      temp = `Th???i gian  ho???t ?????ng c???a nh?? h??ng l?? t??? ${open_time} ?????n ${close_time}. Gi??? ?????t b??n kh??ng h???p l???.`;
      arrNew.push(temp);
    }
    return arrNew;
  };

  //render error
  const renderError = listError => {
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
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <HeaderComponent title="?????t b??n" />
        <View style={styles.bodyContainer}>
          <InputComponent
            style={styles.input}
            placeholder="H??? t??n (*)"
            value={name}
            onChangeText={setName}
          />
          <InputComponent
            style={styles.input}
            placeholder="S??? ??i???n tho???i(*)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="numeric"
          />
          <View style={styles.rowCenter}>
            <DatePicker onChangeDate={value => getDatePicker(value)} />
            <View style={styles.backgroundTimePicker}>
              <Text style={styles.time}>
                {newTime || moment().format('HH:MM')}
              </Text>
              <TimePicker
                titleBottomSheet="Ch???n th???i gian"
                onSelect={value => {
                  setNewTime(
                    (value.hour < 10 ? `0${value.hour}` : value.hour) +
                      ':' +
                      (value.min < 10 ? `0${value.min}` : value.min),
                  );
                }}
              />
            </View>
          </View>
          <View style={[styles.rowCenter, {marginVertical: 10}]}>
            <AmountComponent onGetCount={_onGetCount} defaultValue={1} />
          </View>
          <View style={[styles.rowCenter, {marginVertical: 10}]}>
            <TableTypeComponent onGetTypeTable={_onGetTypeTable} />
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
          style={styles.button}
          titleStyle={styles.buttonText}
          title="?????t b??n"
          iconName="save"
          iconColor={colors.WHITE}
          onPress={onSave}
          bgButton={colors.ORANGE}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default BookTable;
