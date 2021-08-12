import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {colors} from '../../assets';
import ButtonComponent from '../ButtonComponent';
import TextComponent from '../TextComponent';

const SlideDown = ({item, onPress}) => {
  const {name, items, isDown, isOrder} = item;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: colors.WHITE,
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TextComponent color={colors.BG_GRAY} heavy>
          {name}
        </TextComponent>

        {isOrder && (
          <ButtonComponent
            disabled
            mLeft={10}
            iconName="circle"
            iconColor={colors.GREEN}
            shadow
          />
        )}
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TextComponent color={colors.ORANGE} mRight={10}>
          {items?.length}
        </TextComponent>

        {isDown ? (
          <FontAwesome5Icon
            name="chevron-down"
            color={colors.ORANGE}
            size={18}
          />
        ) : (
          <FontAwesome5Icon
            name="chevron-left"
            color={colors.BG_GRAY}
            size={18}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SlideDown;

const styles = StyleSheet.create({});
