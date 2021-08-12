import React from 'react';
import {FlatList} from 'react-native';
import {colors} from '../../assets';
import {FormatNumber, Moment} from '../../untils';
import ButtonComponent from '../ButtonComponent';
import TextComponent from '../TextComponent';
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

const ListBillComponent = ({data, onPress, onRefresh}) => {
  const _keyExtractor = (item) => item.id;
  const _renderItem = ({item, index}) => {
    const marginRight = (index + 1) % 2 !== 0;
    return (
      <Container onPress={() => onPress(item)} marginRight={marginRight}>
        <PaymentWrapper>
          <TextComponent
            style={{transform: [{rotate: '-30deg'}], opacity: 0.5}}
            large
            center
            color={colors.RED}>
            Đã thanh toán
          </TextComponent>
        </PaymentWrapper>
        <Header>
          <ButtonComponent mRight={8} disabled={true} iconName="clockcircle" />
          <TextComponent color={colors.WHITE}>
            Order lúc {Moment.FormatTime(item.check_in)}
          </TextComponent>
        </Header>

        <BodyWrapper>
          <Content>
            <TextComponent heavy numberLine={1} mBottom={5}>
              {item.customer_name}
            </TextComponent>
            <TextComponent small numberLine={1}>
              {item.customer_tel}
            </TextComponent>
          </Content>

          <FootWrap>
            <Person>
              <TextComponent>No:</TextComponent>
              <TextComponent heavy>{item.bill_no}</TextComponent>
            </Person>
            <PriceWrap>
              <Price>
                <TextComponent>Thành tiền:</TextComponent>
              </Price>
              <Price>
                <FormatNumber
                  value={item.total_payment}
                  heavy
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
      data={data}
      keyExtractor={_keyExtractor}
      renderItem={_renderItem}
      numColumns={2}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ListBillComponent;
