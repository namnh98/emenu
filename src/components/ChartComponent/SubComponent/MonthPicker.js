import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Text, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from './../../../assets'

function MonthPicker({ listmonth, listYear, widthItem, onChangeItem, selected, selectedYear, onChangeYear, widthYear }) {
  const [open, setOpen] = useState(false);
  const [openYear, setOpenYear] = useState(false);
  const [selection, setSelection] = useState(selected ? selected : 0);
  const [selectionYear, setSelectionYear] = useState(selectedYear)

  const handleOnClick = (item) => {
    setSelection(item.index);
    setOpen(!open)
    onChangeItem(item, item.index)
  }

  const onClickYear = (item) => {
    setSelectionYear(item.index);
    setOpenYear(false)
    onChangeYear(item, item.index)
  }

  const renderMonth = month => {
    return (
      month.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => handleOnClick(item)} style={[styles.dropDownItem, selection === item.index ? styles.activeItem : null, widthItem]}>
          <Text style={{ color: selection === item.index ? `${colors.WHITE}` : '#707070' }}>{item.title}</Text>
        </TouchableOpacity>
      ))
    )
  }

  const renderYear = year => {
    return (
      <View style={{ position: 'absolute', top: 0, zIndex: 100, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ paddingTop: 15, width: '100%', height: '100%', backgroundColor: '#fff', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          {year.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => onClickYear(item)} style={[styles.dropDownItem, selectionYear === item.index ? styles.activeItem : null, widthYear ]}>
              <Text style={{ color: selectionYear === item.index ? `${colors.WHITE}` : '#707070' }}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }

  const onShowDropdown = () => {
    setOpen(!open)
    setOpenYear(false)
  }
  let styleiOS = Platform.OS === 'ios' ? { position: 'relative', zIndex: 10 } : {};
  return (
    <View style={[styles.dropDown,styleiOS]}>
      <TouchableOpacity onPress={() => onShowDropdown()} style={styles.header} activeOpacity={1}>
        <View style={styles.titleHeader}>
          <Text>{listmonth[selection].title}</Text>
        </View>
        <MaterialCommunityIcons name={open ? "chevron-down" : "chevron-right"} color="#ccc" size={24} />
      </TouchableOpacity>
      {open && (
        <View style={styles.dropDownBox}>
          {renderMonth(listmonth)}
          <TouchableOpacity style={styles.titleYear} onPress={() => setOpenYear(!openYear)} >
            <Text style={styles.titleYear2}>{'Năm ' + listYear[selectionYear].title}</Text>
          </TouchableOpacity>
          {openYear && renderYear(listYear)}
        </View>
      )}
    </View>
  );
}

export default MonthPicker;


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
    paddingTop: 15,
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
  },

  titleYear: {
    width: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },

  titleYear2: {
    color: '#707070',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10
  }
});
