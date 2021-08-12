import React from 'react';
import {Text, TouchableOpacity, View, ActivityIndicator} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import {colors} from '../../assets';

const ButtonComponent = ({
  heavy,
  style,
  onPress,
  disabled,
  title,
  titleStyle,
  titleCenter,
  titleColor,
  iconName,
  iconSize,
  iconColor,
  center,
  borColor,
  padding,
  paddingV,
  paddingH,
  pTop,
  pLeft,
  pRight,
  pBottom,
  borRadius,
  margin,
  marginV,
  marginH,
  mTop,
  mLeft,
  mRight,
  mBottom,
  selfCenter,
  bgButton,
  row,
  rowItem,
  iconStyle,
  justCenter,
  alignCenter,
  isIconRight,
  badge,
  shadow,
  isLoading,
  loadColor,
  alignLeft,
  alignRight,
  titleMedium,
  width,
  absolute,
  top,
  left,
  right,
  bottom,
  height,
  textLine,
  rowItemRev,
  ...props
}) => {
  const _renderIcon = () => {
    switch (iconName) {
      case 'close-circle':
        return (
          <Ionicons
            name="close-circle"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'chevron-down':
        return (
          <FontAwesome
            name="chevron-down"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'chevron-up':
        return (
          <FontAwesome
            name="chevron-up"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'edit':
        return (
          <FontAwesome
            name="edit"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'payment':
        return (
          <MaterialIcons
            name="payment"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'check-circle-o':
        return (
          <FontAwesome
            name="check-circle-o"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'credit-card-alt':
        return (
          <FontAwesome
            name="credit-card-alt"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'credit-card':
        return (
          <FontAwesome
            name="credit-card"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'print':
        return (
          <FontAwesome
            name="print"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'arrowleft':
        return (
          <AntDesign
            name="arrowleft"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'like':
        return (
          <AntDesign
            name="like2"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'message1':
        return (
          <AntDesign
            name="message1"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'cancel':
        return (
          <MaterialIcons
            name="cancel"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'check-circle':
        return (
          <Feather
            name="check-circle"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'question-circle-o':
        return (
          <FontAwesome
            name="question-circle-o"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'circle':
        return (
          <Feather
            name="circle"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'table-left':
        return (
          <MaterialCommunityIcons
            name="table-arrow-left"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'table-plus':
        return (
          <MaterialCommunityIcons
            name="table-plus"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'qr-code':
        return (
          <AntDesign
            name="qrcode"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'clockcircle':
        return (
          <AntDesign
            name="clockcircle"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'refresh':
        return (
          <FontAwesome
            name="refresh"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'close':
        return (
          <FontAwesome
            name="close"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'clipboard-list':
        return (
          <FontAwesome5
            name="clipboard-list"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'concierge-bell':
        return (
          <FontAwesome5
            name="concierge-bell"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'chevron-left':
        return (
          <FontAwesome5
            name="chevron-left"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'arrow-left':
        return (
          <FontAwesome5
            name="arrow-left"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'check':
        return (
          <FontAwesome5
            name="check"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'dollar-sign':
        return (
          <FontAwesome5
            name="dollar-sign"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'exchange-alt':
        return (
          <FontAwesome5
            name="exchange-alt"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'plus':
        return (
          <FontAwesome5
            name="plus"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'cart-plus':
        return (
          <FontAwesome5
            name="cart-plus"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'bell':
        return (
          <FontAwesome5
            name="bell"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'copy':
        return (
          <FontAwesome5
            name="copy"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'minus':
        return (
          <FontAwesome5
            name="minus"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'delete':
        return (
          <MaterialCommunityIcons
            name="delete"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'food':
        return (
          <MaterialCommunityIcons
            name="food"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'logout':
        return (
          <MaterialCommunityIcons
            name="logout"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'user-plus':
        return (
          <FontAwesome5
            name="user-plus"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'eye-slash':
        return (
          <FontAwesome5
            name="eye-slash"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'eye':
        return (
          <FontAwesome5
            name="eye"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'plus-circle':
        return (
          <AntDesign
            name="pluscircle"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'minus-circle':
        return (
          <AntDesign
            name="minuscircle"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'save':
        return (
          <FontAwesome5
            name="save"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'search':
        return (
          <FontAwesome5
            name="search"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'sync':
        return (
          <FontAwesome5
            name="sync"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'commenting':
        return (
          <FontAwesome
            name="commenting"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'home':
        return (
          <FontAwesome
            name="home"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
        case 'checkout':
          return (
            <MaterialIcons
              name="directions-run"
              size={iconSize || 20}
              color={iconColor || 'white'}
            />
          );
      case 'order-history':
        return (
          <Entypo
            name="back-in-time"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'list-order':
        return (
          <FontAwesome
            name="list-alt"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'add-fr':
        return (
          <Ionicons
            name="person-add"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'list-merged':
        return (
          <FontAwesome5
            name="th-list"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'split-table':
        return (
          <MaterialCommunityIcons
            name="arrow-split-vertical"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'change-empty':
        return (
          <FontAwesome
            name="long-arrow-left"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'clock':
        return (
          <AntDesign
            name="clockcircle"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'rollback':
        return (
          <MaterialCommunityIcons
            name="file-restore"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      case 'send':
        return (
          <Feather
            name="send"
            size={iconSize || 20}
            color={iconColor || 'white'}
          />
        );
      default:
        break;
    }
  };

  const buttonStyle = [
    style,
    center && {justifyContent: 'center', alignItems: 'center'},
    justCenter && {justifyContent: 'center'},
    alignCenter && {alignItems: 'center'},
    borColor && {borderWidth: 1, borderColor: borColor},
    padding && {padding},
    paddingV && {paddingVertical: paddingV},
    paddingH && {paddingHorizontal: paddingH},
    pTop && {paddingTop: pTop},
    pLeft && {paddingLeft: pLeft},
    pRight && {paddingRight: pRight},
    pBottom && {paddingBottom: pBottom},
    borRadius && {borderRadius: borRadius},
    margin && {margin},
    marginV && {marginVertical: marginV},
    marginH && {marginHorizontal: marginH},
    mTop && {marginTop: mTop},
    mLeft && {marginLeft: mLeft},
    mRight && {marginRight: mRight},
    mBottom && {marginBottom: mBottom},
    selfCenter && {alignSelf: 'center'},
    row && {flexDirection: 'row'},
    rowItem && {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    rowItemRev && {
      flexDirection: 'row-reverse',
      justifyContent: 'center',
      alignItems: 'center',
    },
    bgButton && {backgroundColor: bgButton},
    shadow && {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
    },
    alignLeft && {alignSelf: 'flex-start'},
    alignRight && {alignSelf: 'flex-end'},
    width && {width},
    height && {height},
    absolute && {position: 'absolute'},
    top && {top},
    left && {left},
    right && {right},
    bottom && {bottom},
  ];

  const logoStyle = [iconStyle];

  const textStyle = [
    titleStyle,
    titleCenter && {textAlign: 'center'},
    titleColor && {color: titleColor},
    heavy && {fontWeight: 'bold'},
    rowItem && (isIconRight ? {marginRight: 5} : {marginLeft: 5}),
    titleMedium && {fontSize: 16},
  ];

  return (
    <TouchableOpacity
      {...props}
      disabled={disabled}
      onPress={onPress}
      style={buttonStyle}>
      {badge > 0 && (
        <View
          style={{
            position: 'absolute',
            top: -8,
            right: -8,
            width: 20,
            height: 20,
            borderRadius: 20,
            backgroundColor: colors.RED,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: colors.WHITE}}>{badge}</Text>
        </View>
      )}

      {!isIconRight && iconName && (
        <View style={logoStyle}>{_renderIcon()}</View>
      )}

      {title &&
        (isLoading ? (
          <ActivityIndicator
            animating
            size="small"
            color={loadColor || 'white'}
          />
        ) : (
          <Text numberOfLines={textLine} style={textStyle}>
            {title}
          </Text>
        ))}

      {isIconRight && <View style={logoStyle}>{_renderIcon()}</View>}
    </TouchableOpacity>
  );
};

export default ButtonComponent;
