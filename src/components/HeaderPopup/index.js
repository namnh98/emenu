import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../../assets';
import {ButtonComponent} from '../../components';

const HeaderPopup = ({title = 'Header', onClose}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {onClose && (
        <ButtonComponent
          onPress={onClose}
          style={styles.button}
          iconName="close"
          center
        />
      )}
    </View>
  );
};

HeaderPopup.prototype = {
  title: PropTypes.string,
  onClose: PropTypes.func,
};

export default HeaderPopup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopStartRadius: 5,
    borderTopEndRadius: 5,
  },
  title: {
    fontSize: 16,
    color: 'white',
  },
  button: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    paddingHorizontal: 10,
  },
});
