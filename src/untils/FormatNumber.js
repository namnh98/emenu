import React from 'react';
import NumberFormat from 'react-number-format';
import {colors} from '../assets';
import {InputComponent, TextComponent} from '../components';
import {useSelector} from 'react-redux';
import {View} from 'react-native';

const FormatNumber = ({
  setRef,
  value,
  onChangeText,
  placeholder,
  width,
  textColor,
  heavy,
  medium,
  onValueChange,
  notUnit,
  numberLine,
  titleStyle,
  leftUnit,
  textLine,
  rightText,
  large,
  mLeft,
}) => {
  const {currency} = useSelector((state) => state.partners);
  const _renderText = (value) => {
    if (onChangeText || onValueChange) {
      return (
        <InputComponent
          right={rightText}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          borBottomColor={colors.GRAY}
          radius={5}
          width={width || 100}
          center
          keyboardType="numeric"
        />
      );
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}>
        <TextComponent
          style={titleStyle}
          color={textColor}
          heavy={heavy}
          large={large}
          medium={medium}
          right={rightText}
          textLine={textLine}
          mLeft={mLeft}
          italic={textLine}
          numberLine={numberLine}>
          {leftUnit}
          {value}
        </TextComponent>
         {!notUnit && <TextComponent color={textColor}> {currency?.name_vn || 'VND'} </TextComponent>}
        {/* <TextComponent
          mLeft={5}
          style={titleStyle}
          color={textColor}
          heavy={heavy}
          medium
          textLine={textLine}
          numberLine={1}>
          {currency?.name_vn || 'VND'}
        </TextComponent> */}
      </View>
    );
  };

  return (
    <NumberFormat
      ref={setRef}
      value={onChangeText ? value : Math.round(value)}
      displayType={'text'}
      thousandSeparator={','}
      decimalSeparator={'.'}
      renderText={_renderText}
      onValueChange={onValueChange}
    />
  );
};

export default FormatNumber;
