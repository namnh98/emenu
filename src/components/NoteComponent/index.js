import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../assets';

const NoteComponent = (props) => {
  const { placeholder } = props
  return (
    <TextInput
      {...props}
      style={[
        styles.container,
        props.style,
        props.height && { height: props.height },
        { textAlignVertical: 'top' },
      ]}
      multiline
      placeholder={placeholder ? placeholder : 'Note'}
    />
  );
};

export default NoteComponent;

const styles = StyleSheet.create({
  container: {
    height: 70,
    borderWidth: 1,
    borderColor: colors.BG_GRAY,
    borderRadius: 5,
    padding: 10,
  },
});
