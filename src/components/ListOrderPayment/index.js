import React, {useRef, useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import {colors} from '../../assets';
import {FormatNumber, Moment} from '../../untils';
import ButtonComponent from '../ButtonComponent';
import TextComponent from '../TextComponent';
import {OrderApi} from '../../api';
import {
  BodyWrapper,
  Container,
  Content,
  FootWrap,
  Header,
  PaymentWrapper,
  Person,
  Price,
  PriceWrap,
} from './styles';

const ListOrderPayment = ({data, onPress, action}) => {
  const _keyExtractor = (item, index) => index.toString();
  const [toggle, setToggle] = useState(false);

  const _renderItem = ({item, index}) => {
    const {
      order_status,
      check_in,
      customer_name,
      customer_tel,
      order_no,
      order_items,
      order_combo_items,
      total_money,
      isChosen,
    } = item;
    const qtyFoods =
      order_items != undefined
        ? order_items.filter((item) => item.order_item_status?.id != 6).length +
          (order_combo_items.length === 0
            ? 0
            : order_combo_items[0].order_items?.filter(
                (item) => item.order_item_status?.id != 6,
              ).length)
        : null;
    const isPayment = order_status?.id === 2;
    const marginRight = (index + 1) % 2 !== 0;
    return (
      <Container
        disabled={isPayment}
        onPress={() => {
          if ((action === 2 && qtyFoods > 0) || action != 2) {
            onPress(item);
          } else return;
        }}
        marginRight={marginRight}>
        <PaymentWrapper>
          <TextComponent
            numberLine={1}
            style={{
              transform: [{rotate: '-20deg'}],
              opacity: 0.5,
              fontSize: 20,
            }}
            center
            color={colors.RED}>
            {order_status?.id === 2 ||
            order_status?.id === 31 ||
            order_status?.id === 32
              ? order_status?.name_vn
              : qtyFoods === 0
              ? 'Chưa gọi món'
              : ''}
          </TextComponent>
        </PaymentWrapper>

        <Header>
          <ButtonComponent mRight={8} disabled={true} iconName="clockcircle" />
          <TextComponent flex={1} color={colors.WHITE} numberLine={1} center>
            Đã vào bàn {check_in && Moment.FormatTime(check_in)}
          </TextComponent>
        </Header>

        <BodyWrapper>
          <Content>
            <TextComponent heavy numberLine={1} mBottom={5}>
              {customer_name}
            </TextComponent>
            <TextComponent small numberLine={1}>
              {customer_tel}
            </TextComponent>
          </Content>

          <FootWrap>
            {qtyFoods != null && (
              <Person>
                <TextComponent>
                  {isPayment ? 'Mã đơn:' : 'Số lượng:'}
                </TextComponent>
                <TextComponent heavy>
                  {isPayment ? order_no : qtyFoods}
                </TextComponent>
              </Person>
            )}

            <PriceWrap>
              <Price>
                <TextComponent>Tạm tính:</TextComponent>
              </Price>
              <Price>
                <FormatNumber
                  notUnit
                  value={total_money}
                  textColor={colors.ORANGE}
                  numberLine={1}
                />
              </Price>
            </PriceWrap>
          </FootWrap>
        </BodyWrapper>
      </Container>
    );
  };

  return (
    <FlatList
      extraData={toggle}
      data={data}
      keyExtractor={_keyExtractor}
      renderItem={_renderItem}
      numColumns={2}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ListOrderPayment;
