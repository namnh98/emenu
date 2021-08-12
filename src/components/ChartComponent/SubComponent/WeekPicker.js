import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Text, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../assets'
import moment from 'moment';

function WeekPicker({ fromDate, toDate, onChange }) {

  const [fromD, setFromDate] = useState(fromDate)
  const [toD, setToDate] = useState(toDate)

  const onNextWeek = () => {
    const newToW = new Date(toD.setDate(toD.getDate() + 7))
    const newFromW = new Date(fromD.setDate(fromD.getDate() + 7))
    setToDate(newToW)
    setFromDate(newFromW)
    onChange(newFromW, newToW)
  }

  const onPrevWeek = () => {
    const newToW = new Date(toD.setDate(toD.getDate() - 7))
    const newFromW = new Date(fromD.setDate(fromD.getDate() - 7))
    setToDate(newToW)
    setFromDate(newFromW)
    onChange(newFromW, newToW)
  }
  let styleiOS = Platform.OS === 'ios' ? { position: 'relative', zIndex: 10 } : {};
  return (
    <View style={[styles.dropDown, styleiOS]}>
      <View style={styles.header} >
        <TouchableOpacity onPress={() => onPrevWeek()} activeOpacity={1}>
          <View style={styles.Buttonheader}>
            <MaterialCommunityIcons name="chevron-left" color="#ccc" size={24} />
          </View>
        </TouchableOpacity>
        <View style={styles.titleHeader}>
          <Text>{'Từ ' + moment(fromD).format('DD/MM/YYYY') + ' - ' + moment(toD).format('DD/MM/YYYY')}</Text>
        </View>
        <TouchableOpacity onPress={() => onNextWeek()} activeOpacity={1}>
          <View style={styles.Buttonheader}>
            <MaterialCommunityIcons name="chevron-right" color="#ccc" size={24} />
          </View>
        </TouchableOpacity>
      </View>

    </View>
  );
}

export default WeekPicker;


const styles = StyleSheet.create({

  dropDown: {
    paddingVertical: 2,
    alignItems: 'center',
  },
  Buttonheader: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    backgroundColor: '#fff',
    borderBottomColor: '#e4e4e4',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
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

  dropDownItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3e3e3',
    borderRadius: 5,
    width: 170,
    height: 50,
    margin: 5,
  },
  activeItem: {
    backgroundColor: `${colors.PRIMARY}`,
    color: `${colors.WHITE}`
  }
});
