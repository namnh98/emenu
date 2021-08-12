import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {colors} from '../../assets';

import styles from './styles';

const TableTypeComponent = ({onGetTypeTable, selected}) => {
  const [isVIP, setIsVIP] = useState(selected !== null ? selected : true);

  const _onVipTable = () => {
    if (isVIP) return;
    onGetTypeTable(true);
    setIsVIP(true);
  };
  const _onNormalTable = () => {
    if (!isVIP) return;
    onGetTypeTable(false);
    setIsVIP(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loại bàn</Text>
      <View style={styles.rowCenter}>
        <TouchableOpacity onPress={_onVipTable} style={styles.rowCenter}>
          <FontAwesome
            name={isVIP ? 'circle' : 'circle-o'}
            size={25}
            color={colors.ORANGE}
          />
          <Text style={styles.typeTable}>VIP</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={_onNormalTable} style={styles.rowCenter}>
        <FontAwesome
          name={!isVIP ? 'circle' : 'circle-o'}
          size={25}
          color={colors.ORANGE}
        />
        <Text style={styles.typeTable}>Thường</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TableTypeComponent;
