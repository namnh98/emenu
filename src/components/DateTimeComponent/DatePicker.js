import React, { useState } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
const { width, height } = Dimensions.get('screen');
import { colors } from '../../assets';
import moment from 'moment';

export default function DatePicker({ onChangeDate, newDate }) {
  const [show, setShow] = useState(false);
  let curDate = newDate ? new Date(newDate) : new Date();
  const [selected, setSelected] = useState(curDate);
  LocaleConfig.locales['vi'] = {
    formatAccessibilityLabel: "dddd 'of' MMMM 'of' yyyy",
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
      'Tháng 12',
    ],
    monthNamesShort: [
      'Th 2',
      'th 3',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec',
    ],
    dayNames: [
      'Thứ 2',
      'Thứ 3',
      'Thứ 4',
      'Thứ 5',
      'Thứ 6',
      'Thứ 7',
      'Chủ Nhật',
    ],
    dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  };

  LocaleConfig.defaultLocale = 'vi';
  const onDayPress = (day) => {
    setSelected(day.dateString);
    onChangeDate(day.dateString);
    setShow(false);
  };

  return (
    <View style={styles.dropDown}>
      {/* <TouchableOpacity
        onPress={() => {
          setShow(!show);
        }}
        style={styles.header}
        activeOpacity={1}> */}
      <View style={styles.titleHeader}>
        <View
          style={{
            backgroundColor: '#fff',
            height: (height * 0.1) / 1.95,
            width: width * 0.55,
            borderRadius: 5,
          }}>
          <Text
            style={{
              top: (height * 0.1) / 5.5,
              textAlign: 'center',
              textAlignVertical: 'center',
              color: 'gray',
            }}>
            {moment(selected).format('DD/MM/YYYY')}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setShow(!show);
          }}
          style={{ marginLeft: 10, backgroundColor: '#bfbfbf', borderRadius: 5 }}>
          <MaterialCommunityIcons
            name={show ? 'chevron-down' : 'chevron-right'}
            color="#fff"
            size={36}
          />
        </TouchableOpacity>
      </View>

      {/* </TouchableOpacity> */}

      {show && (
        <View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={show}
            onRequestClose={() => setShow(!show)}>
            <ScrollView
              scrollEnabled={false}
              keyboardShouldPersistTaps="handled">
              <TouchableWithoutFeedback
                onPress={() => setShow(!show)}
                style={{ backgroundColor: 'yellow' }}>
                <View
                  style={[
                    styles.dropDownBox,
                    {
                      backgroundColor: `${show ? 'rgba(0,0,0,0.5)' : '#fff'}`,
                    },
                  ]}>
                  <Calendar
                    onDayPress={onDayPress}
                    current={moment(selected).format('YYYY-MM-DD')}
                    style={styles.calendar}
                    markedDates={{
                      [selected]: {
                        selected: true,
                        disableTouchEvent: true,
                        selectedColor: 'orange',
                        selectedTextColor: '#fff',
                      },
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </Modal>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dropDown: {
    // alignItems: 'center',
    flex: 1,
  },
  header: {
    backgroundColor: '#000',
    opacity: 0.5,
    borderBottomColor: '#e4e4e4',
    // width: '100%',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 100,
    borderRadius: 5,
    borderColor: colors.GRAY,
  },

  titleHeader: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },

  dropDownBox: {
    // position: 'absolute',
    // backgroundColor: colors.WHITE,
    // top: height * 0.1,
    // left: 0,
    // right: 0,
    // zIndex: 10,
    // // height: height * 0.5,
    // alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0.5, height: 0.5 },
    // shadowOpacity: 0.2,
    // shadowRadius: 3,
    // elevation: 3,
    // borderBottomLeftRadius: 5,
    // borderBottomRightRadius: 5,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0.5, height: 0.5 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  calendar: {
    width: width * 0.925,
    height: height * 0.44,
    justifyContent: 'center',
    borderRadius: 5,
  },
  calendar2: {
    width: width * 0.925,
    height: height * 0.4,
    justifyContent: 'center',
    borderRadius: 5,
  },
});
