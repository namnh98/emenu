import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { colors } from '../../../assets';
import {
  AmountComponent,
  ButtonComponent,
  HeaderComponent,
  InputComponent,
  NoteComponent,
  TableTypeComponent,
} from '../../../components';
import DateTimeComponent from '../../../components/DateTimeComponent/DateTimeComponent';
import DatePicker from '../../../components/DateTimeComponent/DatePicker';
import styles from './styles';
import CheckboxComponent from './../../../components/CheckboxComponent';
import FormatMoment from './../../../untils/FormatMoment';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { ODER_TABLE } from '../../../navigators/ScreenName';

const BookSearchTable = ({ route }) => {
  const routePramsSeach = route.params;
  const navigation = useNavigation();
  const [name, setName] = useState(
    routePramsSeach.guest_name ? routePramsSeach.guest_name : '',
  );
  const [phone, setPhone] = useState(
    routePramsSeach.phone_number ? routePramsSeach.phone_number : '',
  );
  const statusRef = useRef(
    routePramsSeach.status ? routePramsSeach.status : [],
  );
  const [fromDate, setFromDate] = useState(
    routePramsSeach.from_date ? routePramsSeach.from_date : Date.now(),
  );
  const [toDate, setToDate] = useState(
    routePramsSeach.to_date ? routePramsSeach.to_date : moment().add(7, 'days'),
  );

  const _onChecked = (listChecked) => {
    statusRef.current = listChecked;
  };

  const _renderStatus = () => {
    const statusBooking = [
      { key: 1, value: 'Đợi xác nhận' },
      { key: 2, value: 'Đã xác nhận' },
      { key: 3, value: 'Đã xếp bàn' },
      { key: 4, value: 'Đã hủy' },
      { key: 5, value: 'Khách hàng hủy' },
      { key: 6, value: 'Khách đã vào bàn' },
    ];

    return (
      <CheckboxComponent
        items={statusBooking}
        checked={statusRef.current}
        iconColor={colors.ORANGE}
        iconSize={30}
        onChecked={(value) => _onChecked(value)}
        style={{ width: 150 }}
      />
    );
  };

  const _onSearch = () => {
    const { onSetParams } = route.params;
    onSetParams(statusRef.current, name, phone, fromDate, toDate);
    navigation.goBack();
  };

  let styleiOS =
    Platform.OS === 'ios' ? { position: 'relative', zIndex: 10 } : {};

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <HeaderComponent title="Tìm kiếm theo" />

        <View style={styles.bodyContainer}>
          <View style={[styles.rowItem, styleiOS]}>
            <Text style={{ width: 70 }}> Từ ngày </Text>
            <DatePicker onChangeDate={(value) => setFromDate(value)} newDate={fromDate} />
          </View>
          <View style={[styles.rowItem, styleiOS]}>
            <Text style={{ width: 70 }}> Đến ngày </Text>
            <DatePicker onChangeDate={(value) => setToDate(value)} newDate={toDate} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ width: 70 }}>Trạng thái</Text>
            <View
              style={[
                styles.datePicker,
                {
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                },
              ]}>
              {_renderStatus()}
            </View>
          </View>

          <InputComponent
            style={styles.input}
            placeholder="Tên"
            value={name}
            onChangeText={setName}
          />
          <InputComponent
            style={styles.input}
            placeholder="Điện thoại"
            value={phone}
            onChangeText={setPhone}
            keyboardType="numeric"
          />

          <ButtonComponent
            style={[styles.button, { backgroundColor: colors.ORANGE }]}
            titleStyle={[styles.buttonText, { color: colors.WHITE }]}
            title="Tìm kiếm"
            iconName="search"
            iconColor={colors.WHITE}
            iconSize={18}
            onPress={_onSearch}
          />
        </View>
      </View>
    </TouchableWithoutFeedback >
  );
};

export default BookSearchTable;
