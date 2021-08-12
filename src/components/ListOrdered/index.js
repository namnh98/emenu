import React from 'react';
import { FlatList, Platform } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { colors, images } from '../../assets';
import { FormatNumber } from '../../untils';
import ButtonComponent from '../ButtonComponent';
import TextComponent from '../TextComponent';
import { Sizes } from '@dungdang/react-native-basic'
import {
  Avatar,
  Container,
  Content,
  NoteWrapper,
  Option,
  PersonWrapper,
  Wrapper,
  RowItem,
} from './styles';

const ListOrdered = ({ data, isEdit, isShowBtn, onPress }) => {
  const bottom = isShowBtn
    ? { paddingBottom: Platform.OS === 'ios' ? 100 : 80 }
    : { paddingBottom: Platform.OS === 'ios' ? 20 : 10 };

  const _keyExtractor = (item, index) => String(index);

  const _renderItem = ({ item }) => {
    const {
      amount,
      discount_value,
      count,
      image,
      name,
      sale_price,
      description,
      price,
      statusName,
      unit_item,
      is_open_price,
    } = item;
    const PRICE = !!discount_value ? price - discount_value : price;
    const breakString = (text) => {
      let newtext = text.trim()
      let count = parseInt(text.length * 0.75)
      let halfcount = parseInt(text.length * 0.59)
      return text.length > 100 ? newtext.slice(0, halfcount) + "..." : text
    }
    return (
      <Container>
        <Wrapper>
          <Avatar
            source={image ? { uri: image } : images.IMAGE_DEFAULT}
            resizeMode="contain"
          />
          <Content>
            <TextComponent heavy medium>
              {name}
            </TextComponent>

            <PersonWrapper>
              <TextComponent mRight={5}>Số lượng:</TextComponent>
              <Option>
                {isEdit &&
                  (!is_open_price) && (
                    <ButtonComponent
                      onPress={() => onPress(item, 1)}
                      iconName="minus-circle"
                      iconColor={colors.ORANGE}
                      mRight={5}
                      iconSize={25}
                    />
                  )}
                <TextComponent heavy>{count}</TextComponent>
                {isEdit && (
                  <ButtonComponent
                    onPress={() => onPress(item, 2)}
                    iconName={
                      is_open_price ||
                        (!is_open_price && unit_item?.qty_type === 1)
                        ? 'edit'
                        : 'plus-circle'
                    }
                    iconColor={colors.ORANGE}
                    mLeft={5}
                    iconSize={25}
                  />
                )}
              </Option>
            </PersonWrapper>
            <RowItem isTop isBetween>
              <TextComponent>Đơn giá</TextComponent>
              <FormatNumber
                value={(price ? price : sale_price)}
              />
            </RowItem>
            {isEdit && (
              <NoteWrapper onPress={() => onPress(item, 3)}>
                <AntDesign name={!description ? "message1" : "edit"} size={15} color={colors.ORANGE} />
                {!description ? <TextComponent mLeft={5} tiny color={colors.ORANGE}>
                  Thêm ghi chú ...
                </TextComponent> :
                  <TextComponent tiny color={colors.ORANGE} paddingH={Sizes.h16}
                    paddingV={Sizes.h16} mTop={Sizes.s20} pTop={Sizes.h20 * 1.5}
                    lineHeight={Sizes.h20} height={Sizes.h30 * 4}
                    width={Sizes.s200 * 2} lineHeight={13}>
                    {breakString(description)}
                  </TextComponent>}
              </NoteWrapper>
            )}
            {!isEdit && statusName && (
              <RowItem>
                <TextComponent color={colors.GREEN}>
                  Trạng thái: {statusName}
                </TextComponent>
              </RowItem>
            )}

            

            {!isEdit && (
              <RowItem isTop isBetween>
                <TextComponent>Thành tiền</TextComponent>
                <FormatNumber value={amount} heavy />
              </RowItem>
            )}
          </Content>
        </Wrapper>
      </Container >
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={_keyExtractor}
      renderItem={_renderItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={bottom}
    />
  );
};

export default ListOrdered;
