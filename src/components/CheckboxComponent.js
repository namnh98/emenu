import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function CheckboxComponent({
  items,
  checked,
  onChecked,
  iconSize,
  iconColor,
  style,
}) {
  const [selection, setSelection] = useState(checked ? checked : []);
  const handleOnClick = (item) => {
    if (!selection.some((current) => current === item.key)) {
      setSelection([...selection, item.key]);
      onChecked([...selection, item.key]);
    } else {
      let selectionAfterRemoval = selection;
      selectionAfterRemoval = selectionAfterRemoval.filter(
        (current) => current !== item.key,
      );
      setSelection([...selectionAfterRemoval]);
      onChecked([...selectionAfterRemoval]);
    }
  };

  const isItemInSelection = (item) => {
    if (selection.some((current) => current === item.key)) {
      return true;
    }
    return false;
  };

  return items.map((item, index) => {
    return (
      <TouchableOpacity
        key={index}
        style={[styles.checkboxContainer, {...style}]}
        onPress={() => handleOnClick(item)}
        activeOpacity={0.7}>
        <View style={styles.checked}>
          {isItemInSelection(item) ? (
            <MaterialCommunityIcons
              name="checkbox-marked"
              size={iconSize || 20}
              color={iconColor || 'white'}
            />
          ) : (
            <MaterialCommunityIcons
              name="checkbox-blank-outline"
              size={iconSize || 20}
              color={iconColor || 'white'}
            />
          )}
        </View>
        <Text style={styles.label}>{item.value}</Text>
      </TouchableOpacity>
    );
  });
}

export default CheckboxComponent;

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
});
