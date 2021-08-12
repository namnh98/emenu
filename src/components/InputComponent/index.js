import React from 'react';
import {StyleSheet, TextInput} from 'react-native';

const InputComponent = ({
  style,
  placeholder,
  value,
  onChangeText,
  borColor,
  radius,
  padding,
  paddingV,
  paddingH,
  width,
  flex,
  right,
  left,
  center,
  keyboardType,
  borBottomColor,
  ...props
}) => {
  const inputStyle = [
    style,
    styles.container,
    borColor && {borderWidth: 1, borderColor: borColor},
    radius && {borderRadius: radius},
    padding && {padding},
    paddingV && {paddingVertical: paddingV},
    paddingH && {paddingHorizontal: paddingH},
    width && {width},
    flex && {flex},
    right && {textAlign: 'right'},
    left && {textAlign: 'left'},
    center && {textAlign: 'center'},
    borBottomColor && {borderBottomWidth: 1, borderColor: borBottomColor},
  ];

  return (
    <TextInput
      {...props}
      style={inputStyle}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
    />
  );
};

export default InputComponent;

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
});
