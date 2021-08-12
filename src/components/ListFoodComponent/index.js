import React, {useRef} from 'react';
import styled from 'styled-components/native';
import {colors, images} from '../../assets';
import {Dimension} from '../../common';
import {FormatNumber} from '../../untils';
import ButtonComponent from '../ButtonComponent';
import TextComponent from '../TextComponent';
import {Platform, View} from 'react-native';

const HEIGHT_ITEM = Dimension.width / 2.5;

const ListFood = ({data, isCategoryPrice, onPress}) => {
  const _renderDiscount = item => {
    return (
      item?.promotion && (
        <DisCount>
          <TextComponent numberLine={1} small color={colors.WHITE}>
            {item?.promotion?.discount_item_value}%
          </TextComponent>
        </DisCount>
      )
    );
  };

  const _renderBtnMinus = item => {
    const {unit_item} = item || {};
    const isEnterQty = unit_item?.qty_type === 1;
    return (
      item.count > 0 && (
        <Minus onPress={() => onPress(item, 2)} isEdit={isEnterQty} />
      )
    );
  };

  const _renderCount = item =>
    +item.count ? (
      <Count>
        <TextComponent
          large
          bold
          center
          color={colors.RED}
          numberLine={1}
          style={{width: '100%'}}>
          {(+item.count > 0 && item.count) || (item.count < 0 && 1)}
          {+item.count > 0 && (
            <TextComponent medium bold color={colors.RED} mTop={10}>
              ({item.unit_item?.name})
            </TextComponent>
          )}
        </TextComponent>
      </Count>
    ) : null;
  const _renderFoodInfo = item => (
    <Bottom>
      <TextComponent medium numberLine={1} color={colors.WHITE}>
        {item.name}
      </TextComponent>
      {_renderMoney(item)}
    </Bottom>
  );

  const _renderMoney = item => {
    if (isCategoryPrice) {
      return (
        <TextComponent color={colors.ORANGE} small heavy>
          0đ
        </TextComponent>
      );
    }
    if (item.is_open_price) {
      return (
        <TextComponent color={colors.ORANGE} heavy medium>
          Theo thời giá
        </TextComponent>
      );
    }
    const price = item.promotion
      ? item.promotion.sale_price_discount
      : item.sale_price;

    return (
      <Price>
        <FormatNumber value={price} textColor={colors.ORANGE} heavy />
        {item.promotion && (
          <FormatNumber
            textLine={true}
            mLeft={5}
            textDecoration={'line-through'}
            value={item.sale_price}
          />
        )}
      </Price>
    );
  };

  const _renderItem = ({item}) => {
    return (
      <CardWrap onPress={() => (!item.in_stock ? null : onPress(item, 1))}>
        <Image source={item.image ? {uri: item.image} : images.IMAGE_DEFAULT}>
          {!item.in_stock && (
            <Status>
              <StatusText>Đã hết mon</StatusText>
            </Status>
          )}
          {_renderDiscount(item)}
          {_renderBtnMinus(item)}
          {_renderCount(item)}
          {_renderFoodInfo(item)}
        </Image>
      </CardWrap>
    );
  };

  const _keyExtractor = item => item.id;
  return (
    <List
      ListFooterComponent={() => <View style={{height: 70}} />}
      data={data}
      keyExtractor={_keyExtractor}
      renderItem={_renderItem}
    />
  );
};

const List = styled.FlatList.attrs(() => ({
  showsVerticalScrollIndicator: false,
  numColumns: 2,
  columnWrapperStyle: {
    justifyContent: 'space-between',
  },
}))``;

const CardWrap = styled.TouchableOpacity`
  flex: ${1 / 2.05};
  height: ${HEIGHT_ITEM}px;
  margin-bottom: 15px;
`;

const Image = styled.ImageBackground.attrs(() => ({
  resizeMode: 'contain',
  imageStyle: {
    borderRadius: 5,
  },
}))`
  flex: 1;
  justify-content: flex-end;
  background-color: ${colors.GRAY};
  border-radius: 5px;
`;

const DisCount = styled.ImageBackground.attrs(() => ({
  source: images.DISCOUNT_RED,
}))`
  position: absolute;
  top: 0;
  right: 0;
  width: ${HEIGHT_ITEM / 2}px;
  align-items: center;
`;

const Minus = styled(ButtonComponent).attrs(props => ({
  iconName: props.isEdit ? 'edit' : 'minus',
}))`
  position: absolute;
  top: 5px;
  left: 5px;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  background-color: ${colors.ORANGE};
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const Count = styled.View`
  position: absolute;
  top: 40%;
  right: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background-color: ${colors.WHITE};
`;

const Bottom = styled.View`
  background-color: ${colors.BLACK_GRAY};
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  padding: 10px;
`;

const Price = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Status = styled.View`
  position: absolute;
  top: 35%;
  align-self: center;
  justify-content: center;
  align-items: center;
  background-color: white;
  transform: rotate(-15deg);
  padding: 5px;
`;

const StatusText = styled.Text`
  color: ${colors.RED};
  opacity: 0.6;
  text-align: center;
  font-size: 17px;
  font-weight: 400;
`;

export default ListFood;
