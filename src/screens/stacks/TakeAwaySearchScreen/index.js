import React, { useRef, useState } from 'react';
import {
  HeaderComponent,
  TextComponent,
  ButtonComponent,
} from '../../../components';
import CheckboxComponent from '../../../components/CheckboxComponent';
import {
  Container,
  CheckBoxWrap,
  Input,
  SearchBtn,
  Icon,
  StatusWrap,
  InputText,
} from './styles';
import { Keyboard, TouchableWithoutFeedback, Image, StyleSheet } from 'react-native';

import { colors, images } from '../../../assets';
export default function TakeAwaySearchScreen({ navigation, route }) {
  const [billID, setBillID] = useState(
    route.params.order_no ? route.params.order_no : '',
  );
  const [customerName, setCustomerName] = useState(
    route.params.customer_name ? route.params.customer_name : '',
  );
  const [customerPhone, setCustomerPhone] = useState(
    route.params.customer_tel ? route.params.customer_tel : '',
  );
  const listOrderStatus = useRef(
    route.params.order_status_id ? route.params.order_status_id : [],
  );
  const itemsCheckbox = [
    {
      key: 2,
      value: 'Đã thanh toán',
    },
    {
      key: 1,
      value: 'Chưa thanh toán',
    },
    {
      key: 31,
      value: 'Đã hủy',
    },
    {
      key: 35,
      value: 'Đã giao hàng',
    },
  ];
  const _onChecked = (listChecked) => {
    listOrderStatus.current = listChecked;
  };

  const _onPress = () => {
    if (listOrderStatus.current.includes(31)) {
      listOrderStatus.current.push(32);
    } else {
      let listAfterRemove32 = listOrderStatus.current.filter(
        (item) => item != 32,
      );
      listOrderStatus.current = listAfterRemove32;
    }
    const { onSetParams } = route.params;
    onSetParams(listOrderStatus.current, billID, customerName, customerPhone);
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container>
        <HeaderComponent title="Tìm Kiếm Theo" />

        <StatusWrap>
          <TextComponent mTop={7}>Trạng thái</TextComponent>
          <CheckBoxWrap>
            <CheckboxComponent
              iconColor={colors.ORANGE}
              checked={listOrderStatus.current}
              items={itemsCheckbox}
              onChecked={(value) => _onChecked(value)}
              iconSize={30}
              style={{ alignSelf: 'baseline' }}
            />
          </CheckBoxWrap>
        </StatusWrap>
        <Input>
          <InputText
            placeholder="Mã hóa đơn"
            value={billID}
            onChangeText={(text) => setBillID(text)}
          />
          {billID != '' ? (
            <ButtonComponent
              onPress={() => setBillID('')}
              iconName="close-circle"
              iconColor={colors.ORANGE}
            />
          ) : null}
        </Input>
        <Input>
          <InputText
            placeholder="Tên"
            value={customerName}
            onChangeText={(text) => setCustomerName(text)}
          />
          {customerName != '' ? (
            <ButtonComponent
              onPress={() => setCustomerName('')}
              iconName="close-circle"
              iconColor={colors.ORANGE}
            />
          ) : null}
        </Input>
        <Input>
          <InputText
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            value={customerPhone}
            onChangeText={(text) => setCustomerPhone(text)}
          />
          {customerPhone != '' ? (
            <ButtonComponent
              onPress={() => setCustomerPhone('')}
              iconName="close-circle"
              iconColor={colors.ORANGE}
            />
          ) : null}
        </Input>
        <SearchBtn onPress={_onPress}>
          <Image source={images.SEARCH_ICON} style={styles.icon} />
          <TextComponent heavy color={colors.WHITE}>
            Tìm kiếm
          </TextComponent>
        </SearchBtn>
      </Container>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  icon: {
    resizeMode: 'contain',
    width: '10%',
    height: '140%',
    tintColor: colors.WHITE
  }
})
