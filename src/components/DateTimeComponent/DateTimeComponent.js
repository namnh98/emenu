import React, {useState} from 'react';
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {colors} from './../../assets/';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FormatMoment from './../../untils/FormatMoment';

const {width, height} = Dimensions.get('window');

function DateTimeComponent({mode, datePicker, newDate, is24Hour}) {
  const [date, setDate] = useState(newDate ? new Date(newDate) : new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    datePicker(currentDate);
    setDate(currentDate);
    setShow(false);
  };

  const iOSScreen = () => {};

  return (
    <View>
      {Platform.OS === 'ios' ? (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          display="default"
          onChange={onChange}
          is24Hour={is24Hour}
          style={{
            width: width * 0.225,
            borderRadius: 20,
            color: colors.WHITE,
            backgroundColor: colors.ORANGE,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      ) : (
        <>
          <TouchableOpacity
            onPress={() => setShow(true)}
            activeOpacity={0.7}
            style={styles.buttonTime}>
            <MaterialCommunityIcons
              name="clock-time-five"
              size={18}
              color={colors.WHITE}
            />
            <Text style={{color: `${colors.WHITE}`, paddingLeft: 15}}>
              {FormatMoment.FormatTime(date)}
            </Text>
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              display="default"
              onChange={onChange}
              is24Hour={true}
            />
          )}
        </>
      )}
    </View>
  );
}

export default DateTimeComponent;

const styles = StyleSheet.create({
  butonDate: {
    height: 40,
    marginTop: 2,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e4e4e4',
    flexDirection: 'row',
    minWidth: width * 0.3,
    borderRadius: 5,
    // paddingLeft: 10,
  },
  textValue: {
    color: `${colors.BLACK}`,
    marginLeft: 10,
  },
  buttonTime: {
    height: 40,
    marginTop: 2,
    alignItems: 'center',
    backgroundColor: `${colors.ORANGE}`,
    borderRadius: 5,
    borderWidth: 1,
    width: 130,
    borderColor: '#e4e4e4',
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
});
