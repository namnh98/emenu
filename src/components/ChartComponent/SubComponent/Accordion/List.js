import React, { useState, useEffect } from "react";
import {
  StyleSheet, Text, View, TouchableWithoutFeedback,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import Chevron from "./Chevron";
import Item from "./ListItem";
import { colors } from '../../../../assets';

const styles = StyleSheet.create({
  container: {
    backgroundColor: `${colors.BLUE}`,
    padding: 16,
    marginBottom: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: `${colors.WHITE}`
  },
  items: {
    overflow: "hidden",
  },
  count: {
    flexDirection: 'row',
  }
});

const Expanded = ({ listItem, onSelectItem }) => {
  const [layoutHeight, setLayoutHeight] = useState(0)
  useEffect(() => {
    if (listItem.isExpanded) {
      setLayoutHeight(null)
    } else {
      setLayoutHeight(0)
    }
  }, [listItem.isExpanded])

  return (
    <View>
      <TouchableWithoutFeedback onPress={onSelectItem} >
        <View style={[
          styles.container,
        ]}>
          <Text style={styles.title}>{listItem.title}</Text>
          <View style={styles.count}>
            <Text style={styles.title}>{listItem.items? listItem.items.length: '0'} người</Text>
            <Chevron open={listItem.isExpanded} />
          </View>
        </View>
      </TouchableWithoutFeedback>
      <View style={[styles.items, { height: layoutHeight, overflow: 'hidden' }]}>
        {listItem?.items?.length> 0 && listItem.items.map((item, key) => (<Item {...{ item, key }} isLast={key === listItem.items.length - 1} index={key} />))}
      </View>
    </View>
  )
}

const List = ({ lists = [] }) => {
  const [listUser, setListUser] = useState(lists)
  if (Platform.OS === 'android'){
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }
  const onSelectItem = (curIndex) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    const arr = [...listUser]
    arr.map((value, index) => {
      index === curIndex
        ? arr[index]['isExpanded'] = !arr[index]['isExpanded']
        : arr[index]['isExpanded'] = false
    })
    setListUser(arr)
  }
  return (
    listUser?.length>0 && listUser.map((listItem, index) => {
      return (<Expanded key={index} listItem={listItem} onSelectItem={() => onSelectItem(index)} />);
    })
  )

}

export default List;