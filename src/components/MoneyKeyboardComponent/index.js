/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  Dimensions
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { TextComponent } from '../../components'
import FormatMoment from './../../untils/FormatMoment'
import {
  ModalContainer,
  KeyboardContent,
  FlexRow,
  FlexRow2,
  ButtonPress,
  ButtonPress2
} from './styles'
import Modal from 'react-native-modal';
import { colors } from '../../assets';
import {useSelector} from 'react-redux'

const { width, height } = Dimensions.get('window');
const heightKeyboard = height / 3 * 1.2;
const COLORS = {
  primary: '#2699FB',
  gray: '#F3F3F3',
  red: '#FF1010',
  yellow: '#F5E50A',
  green: '#10775E',
};

export default function MoneyKeyboardComponent(props) {
  const {
    isShowMoneyKeyboard,
    MoneyKeyboard,
    CloseMoneyKeyboard,
    title,
    valueMoney } = props
  const selected = useRef();
  const [number, setNumber] = useState(valueMoney ? valueMoney : 0);
  const { currency } = useSelector((state) => state.partners);
  const _handleSubmit = () => {
    selected.current = null
    MoneyKeyboard(number);
    CloseMoneyKeyboard()
  };

  const _onSelectItem = value => {
    if (value > 9) {
      setNumber(value);
    } else {     
      const numberValue = number === 0 ? `${value}` : `${number}${value}`;
      setNumber(numberValue);
    }
    selected.current = value;
  };

  const _onRemoveItem = () => {
    if (String(number)) {
      const subStr = String(number).slice(0, number.length - 1);
      setNumber(subStr);
    } else {
      setNumber(0)
    }
  };

  const _onRemoveAll = () => setNumber(0);
  const onClose = () => {
    setNumber(0);
    selected.current = null
    CloseMoneyKeyboard()
  }

  return (
    <Modal
      backdropColor={'transparent'}
      style={{ margin: 0, backgroundColor: 'rgba(0,0,0,.6)' }}
      statusBarTranslucent
      animationIn="zoomInDown"
      animationOut="zoomOutDown"
      animationOutTiming={500}
      animationInTiming={500}
      useNativeDriver={true}
      hideModalContentWhileAnimating
      isVisible={isShowMoneyKeyboard}>
      <ModalContainer>
        <View style={{ flex: 2.5, marginHorizontal: 5, }}>
          <View style={{ flex: 1.5 }} />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 5,
              paddingHorizontal: 10,
              borderRadius: 10,
              backgroundColor: 'white',
            }}>
            <TextComponent mRight={5} style={{ textAlign: 'left' }} >{title}</TextComponent>
            <Text numberOfLines={1}
              style={{
                fontSize: 20,
                borderWidth: 1,
                borderColor: '#b3b3b3',
                flex: 1,
                borderRadius: 5,
                textAlign: 'right',
                paddingVertical: 5,
                paddingRight: 9,
                fontWeight: 'bold',
                color: colors.PRIMARY,
              }}>
              {FormatMoment.NumberWithCommas(number)}{' '}
            </Text>
          </View>
          <View style={{ flex: 3.5, marginTop: 10 }}>
            <FlexRow2>
              {[500000, 200000, 100000].map((value, index) => (
                <ButtonPress
                  key={index}
                  style={{
                    backgroundColor:
                      selected.current === value ? COLORS.primary : COLORS.gray,
                    margin: 5,
                    borderRadius: 10,
                  }}
                  onPress={() => _onSelectItem(value)}>
                  <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{FormatMoment.NumberWithCommas(value)}</Text>
                </ButtonPress>
              ))}
            </FlexRow2>
            <FlexRow2>
              {[50000, 20000, 10000].map((value, index) => (
                <ButtonPress
                  key={index}
                  style={{
                    margin: 5,
                    borderRadius: 10,
                    backgroundColor:
                      selected.current === value ? COLORS.primary : COLORS.gray,
                  }}
                  onPress={() => _onSelectItem(value)}>
                  <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{FormatMoment.NumberWithCommas(value)}</Text>
                </ButtonPress>
              ))}
            </FlexRow2>
            <FlexRow2>
              {[5000, 2000, 1000].map((value, index) => (
                <ButtonPress
                  key={index}
                  style={{
                    margin: 5,
                    borderRadius: 10,
                    backgroundColor:
                      selected.current === value ? COLORS.primary : COLORS.gray,
                  }}
                  onPress={() => _onSelectItem(value)}>
                  <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{FormatMoment.NumberWithCommas(value)}</Text>
                </ButtonPress>
              ))}
            </FlexRow2>
          </View>
        </View>

        <KeyboardContent style={{ height: heightKeyboard }}>
          <FlexRow2>
            <ButtonPress
              onPress={() => onClose()}>
              <TextComponent color={'white'} medium bold >Đóng</TextComponent>
            </ButtonPress>
            <TextComponent flex={3} center medium >Nhập số tiền ({currency?.name_vn})</TextComponent>
            <ButtonPress
              onPress={_handleSubmit}>
              <TextComponent color={colors.ORANGE} medium bold >Xong</TextComponent>
            </ButtonPress>
          </FlexRow2>
          <FlexRow>
            {[1, 2, 3].map((value, index) => (
              <ButtonPress2
                key={index}
                style={{
                  backgroundColor:
                    selected.current === value ? COLORS.primary : COLORS.gray,
                }}
                onPress={() => _onSelectItem(value)}>
                <TextComponent medium bold >{value}</TextComponent>
              </ButtonPress2>
            ))}
          </FlexRow>

          <FlexRow>
            {[4, 5, 6].map((value, index) => (
              <ButtonPress2
                key={index}
                style={{
                  backgroundColor:
                    selected.current === value ? COLORS.primary : COLORS.gray,
                }}
                onPress={() => _onSelectItem(value)}>
                <TextComponent medium bold >{value}</TextComponent>
              </ButtonPress2>
            ))}

          </FlexRow>

          <FlexRow>
            {[7, 8, 9].map((value,index) => (
              <ButtonPress2
              key={index}
                style={{
                  backgroundColor:
                    selected.current === value ? COLORS.primary : COLORS.gray,
                }}
                onPress={() => _onSelectItem(value)}>
                <TextComponent medium bold >{value}</TextComponent>
              </ButtonPress2>
            ))}
          </FlexRow>

          <FlexRow>
            <ButtonPress2
              style={{
                backgroundColor: COLORS.yellow,
              }}
              onPress={_onRemoveAll}>
              <TextComponent medium bold >C</TextComponent>
            </ButtonPress2>
            <ButtonPress2
              style={{
                backgroundColor:
                  selected.current === 0 ? COLORS.primary : COLORS.gray,
              }}
              onPress={() => _onSelectItem(0)}>
              <TextComponent medium bold>0</TextComponent>
            </ButtonPress2>
            <ButtonPress2
              style={{
                backgroundColor: COLORS.red,
              }}
              onPress={_onRemoveItem}>
              <Feather name="delete" medium color="white" size={18} />
            </ButtonPress2>
          </FlexRow>
        </KeyboardContent>
      </ModalContainer>
    </Modal>
  );
}


