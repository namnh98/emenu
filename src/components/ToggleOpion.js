import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function ToggleOpion({ selected, onChange }) {
  const [isSelect, setIsSelect] = useState(selected === null ? false : selected);
  const _onChange = () => {
    setIsSelect(!isSelect)
    onChange(!isSelect)
  }

  return (
    <View style={{ position: 'relative', width: 50, height: 30 }}>
      <TouchableOpacity activeOpacity={1} onPress={_onChange} style={{ position: 'absolute', top: -10, left: 0 }}>
        <MaterialCommunityIcons
          name={isSelect ? 'toggle-switch' : 'toggle-switch-off'}
          size={50}
          color={isSelect ? 'orange' : 'gray'}
        />
      </TouchableOpacity>
    </View>
  );
}

export default ToggleOpion;