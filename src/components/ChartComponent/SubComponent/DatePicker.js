import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Text, Dimensions, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
const { width, height } = Dimensions.get('screen');
import moment from 'moment';

export default function DatePicker({ onChangeDate }) {
  //const [sliderState, setSliderState] = useState({ currentPage: 0 });
  const [show, setShow] = useState(false)
  const curDate = Date.now();
  const [selected, setSelected] = useState(curDate);
  LocaleConfig.locales['vi'] = {
    formatAccessibilityLabel: "dddd d 'of' MMMM 'of' yyyy",
    monthNames: [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12'
    ],
    monthNamesShort: ['Th 2', 'th 3', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
    dayNames: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'],
    dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
  };

  LocaleConfig.defaultLocale = 'vi';
  const onDayPress = day => {
    setSelected(day.dateString);
    onChangeDate(day.dateString);
    setShow(false)
  };

  let styleiOS = Platform.OS === 'ios' ? { position: 'relative', zIndex: 10 } : {};
  return (
    <View style={[styles.dropDown, styleiOS]}>
      <TouchableOpacity onPress={() => setShow(!show)} style={styles.header} activeOpacity={1}>
        <View style={styles.titleHeader}>
          <Text>{moment(selected).format('DD-MM-YYYY')}</Text>
        </View>
        {/* <MaterialCommunityIcons name={s ? "chevron-down" : "chevron-right"} color="#ccc" size={24} /> */}
      </TouchableOpacity>
      {show && (
        <View style={styles.dropDownBox}>
          <Calendar
            onDayPress={onDayPress}
            current={moment(selected).format('YYYY-MM-DD')}
            style={{ width: width }}
            markedDates={{
              [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: 'orange',
                selectedTextColor: '#fff'
              }
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dropDown: {
    paddingVertical: 2,
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomColor: '#e4e4e4',
    width: '100%',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
  },

  titleHeader: {
    flex: 1,
    alignItems: 'center'
  },

  dropDownBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 1000,
    flexDirection: 'row',
    backgroundColor: '#fff',
    flexWrap: 'wrap',
    position: 'absolute',
    top: 52,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },

});
