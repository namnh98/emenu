import React from 'react';
import { Text } from 'react-native';

const TextComponent = ({
  style,
  children,
  lineHeight,
  mTop,
  mLeft,
  mRight,
  mBottom,
  pTop,
  pLeft,
  pRight,
  pBottom,
  color,
  title,
  large,
  medium,
  small,
  tiny,
  light,
  semi,
  bold,
  heavy,
  center,
  left,
  right,
  marginV,
  marginH,
  numberLine,
  backgroundColor,
  paddingH,
  paddingV,
  radiusTopLeft,
  radiusTopRight,
  radiusBottomLeft,
  radiusBottomRight,
  italic,
  width,
  upperCase,
  textLine,
  flex,
  ellipsizeMode,
  height,

  ...props
}) => {
  const textStyle = [
    height && { height },
    style,
    light && { fontWeight: '200' },
    semi && { fontWeight: '300' },
    bold && { fontWeight: 'bold' },
    heavy && { fontWeight: '700' },
    italic && { fontStyle: 'italic' },
    lineHeight && { lineHeight },
    mTop && { marginTop: mTop },
    mLeft && { marginLeft: mLeft },
    mRight && { marginRight: mRight },
    mBottom && { marginBottom: mBottom },
    pTop && { paddingTop: pTop },
    pLeft && { paddingLeft: pLeft },
    pRight && { paddingRight: pRight },
    pBottom && { paddingBottom: pBottom },
    color && { color },
    title && { fontSize: 32 },
    large && { fontSize: 24 },
    medium && { fontSize: 16 },
    small && { fontSize: 13 },
    tiny && { fontSize: 11 },
    center && { textAlign: 'center' },
    left && { textAlign: 'left' },
    right && { textAlign: 'right' },
    marginV && { marginVertical: marginV },
    marginH && { marginHorizontal: marginH },
    backgroundColor && { backgroundColor },
    paddingH && { paddingHorizontal: paddingH },
    paddingV && { paddingVertical: paddingV },
    radiusTopLeft && { borderTopLeftRadius: radiusTopLeft },
    radiusTopRight && { borderTopRightRadius: radiusTopRight },
    radiusBottomLeft && { borderBottomLeftRadius: radiusBottomLeft },
    radiusBottomRight && { borderBottomLeftRadius: radiusBottomRight },
    width && { width },
    upperCase && { textTransform: 'uppercase' },
    textLine && { textDecorationLine: 'line-through' },
    flex && { flex },
  ];

  return (
    <Text
      {...props}
      numberOfLines={numberLine}
      style={textStyle}
      ellipsizeMode={ellipsizeMode}>
      {children}
    </Text>
  );
};

export default TextComponent;
