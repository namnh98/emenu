import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import styles from './styles';
import {colors} from '../../assets';

const SelectDateComponent = () => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.time}>
        <Fontisto name="date" size={15} color={colors.ORANGE} />
        <Text> 15/3/2020</Text>
      </View>

      <TouchableOpacity>
        <FontAwesome5
          name="chevron-circle-down"
          size={18}
          color={colors.ORANGE}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default SelectDateComponent;
