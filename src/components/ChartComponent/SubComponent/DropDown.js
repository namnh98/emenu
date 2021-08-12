import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Text,Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from './../../../assets'

function DropDown({ listYear, widthItem, onChangeItem, selected}) {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState(selected);

 const handleOnClick = (item) => {
    setSelection(item.index);
    setOpen(!open)
    onChangeItem(item, item.index)
  }
  let styleiOS = Platform.OS === 'ios' ? { position: 'relative', zIndex: 10 } : {};

  return (
    <View style={[styles.dropDown,styleiOS]}>
       <TouchableOpacity onPress={() => setOpen(!open)} style={styles.header} activeOpacity={1}>
        <View style={styles.titleHeader}>
          <Text>{listYear[selection].title}</Text>
        </View>
        <MaterialCommunityIcons name={open ? "chevron-down" : "chevron-right"} color="#ccc" size={24} />
      </TouchableOpacity>
      {open && (
        <View style={styles.dropDownBox}>
          {listYear.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => handleOnClick(item, index)} style={[styles.dropDownItem, selection === item.index ? styles.activeItem : null, widthItem]}>
              <Text style={{ color: selection === item.index ? `${colors.WHITE}` : '#707070' }}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

export default DropDown;


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
