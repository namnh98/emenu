import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './styles';
import {colors} from '../../assets';

const SelectTimeComponent = (props) => {
  return (
    <TouchableOpacity {...props} style={styles.container}>
      <MaterialCommunityIcons
        name="clock-time-five"
        size={18}
        color={colors.WHITE}
      />

      <Text style={styles.textTime}> 19:30</Text>
    </TouchableOpacity>
  );
};

export default SelectTimeComponent;
