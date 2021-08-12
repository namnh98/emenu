import React, {useRef} from 'react';
import {Platform} from 'react-native';
import styled from 'styled-components/native';
import {colors, images} from '../../assets';
import ButtonComponent from '../ButtonComponent';
import {NoteWrapper} from '../ListOrdered/styles';
import TextComponent from '../TextComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FormatNumber} from '../../untils';

import { Sizes } from '@dungdang/react-native-basic'

const STATUS_DELETE = 5;

const ListEditFood = ({
  data,
  isEdit,
  isOrdered,
  onSetCount,
  onShipFood,
  onDeleteFood,
  onNote,
  onConfirmFood,
  onOpenModalEnterQty,
}) => {
  const _keyExtractor = (item) => item.id;
  const isNoted = useRef();
  const otherNote = useRef();
  const _renderItem = ({item, index}) => {
    const {
      order_item_status,
      image,
      item_name,
      qty,
      note,
      is_takeaway,
      unit_item,
      is_open_price,
      amount,
      price,
      sale_price,
    } = item;
    const {id, name_vn} = order_item_status || {};
    isNoted.current = !!note ? true : false;
    otherNote.current = note;
    return (
      <ItemWrapper>
        <InfoWrapper>
          <RowBetween>
            <TakeName>
              <TextComponent heavy medium numberLine={1}>
                {item_name}
              </TextComponent>
            </TakeName>

            {is_takeaway && (
              <TakeWrap>
                <TextComponent heavy color={colors.ORANGE}>
                  Mang về
                </TextComponent>
              </TakeWrap>
            )}
          </RowBetween>

          <CountWrapper>
            <TextComponent>Số lượng: </TextComponent>
            <ButtonCount>
              {isEdit && id !== 4 && !is_open_price && (
                <BtnLeft onPress={() => onSetCount(item, index, -1)} />
              )}
              <TextComponent heavy center>
                {qty} {unit_item?.name}
              </TextComponent>
              {isEdit && id !== 4 && (
                <BtnRight
                  nameIcon={
                    is_open_price ||
                    (!is_open_price && unit_item?.qty_type === 1)
                      ? 'edit'
                      : 'plus-circle'
                  }
                  onPress={() =>
                    is_open_price
                      ? onOpenModalEnterQty(item)
                      : onSetCount(item, index, 1)
                  }
                />
              )}
            </ButtonCount>
          </CountWrapper>
          <RowBetween>
            <TextComponent mTop={5}>Đơn giá: </TextComponent>
            <FormatNumber value={price} heavy textColor={colors.ORANGE} />
          </RowBetween>
          <RowBetween>
            <TextComponent mTop={5}>Trạng thái: </TextComponent>
            <TextComponent
              color={
                name_vn === 'Đã hủy' || name_vn === 'Hết món'
                  ? colors.RED
                  : name_vn === 'Đã xong' || name_vn === 'Chờ xử lý'
                  ? colors.PRIMARY
                  : colors.ORANGE
              }>
              {name_vn}
            </TextComponent>
          </RowBetween>

          {_renderButton(item)}
        </InfoWrapper>

        <Avatar source={image ? {uri: image} : images.IMAGE_DEFAULT} />
      </ItemWrapper>
    );
  };

  const breakString = (text) => {
    let newtext = text.trim()
    let count = parseInt(text.length * 0.75)
    let halfcount = parseInt(text.length * 0.59)
    return text.length > 100 ? newtext.slice(0, halfcount) + "..." : text
  }

  const _renderButton = (item) => {
    const {id} = item.order_item_status || {};
    if (isOrdered) return null;

    return (
      <Row>
        {id === 5 || id === 4 || id === 6 || isEdit ? null : id === 3 ? (
          <BtnConfirm
            mRight={10}
            onPress={() => onConfirmFood(item)}
            color={colors.ORANGE}
          />
        ) : (
          <BtnShipFood onPress={() => onShipFood(item)}>
            <ImageShip source={images.BELL} />
            <TextComponent color={colors.PRIMARY}>Giao món</TextComponent>
          </BtnShipFood>
        )}

        {id === 4 || id === 2 || id === 6 || isEdit ? null : (
          <BtnDelete onPress={() => onDeleteFood(item)} color={colors.RED} />
        )}
        {isEdit && id !== 4 && (
          <>
            <NoteWrapper onPress={() => onNote(item)}>
              <AntDesign name={isNoted.current === false ? "message1" : "edit"} size={15} color={colors.ORANGE} />
              {isNoted.current === false ? (
                <TextComponent tiny color={colors.ORANGE} mLeft={5}>
                  Thêm ghi chú ....
                </TextComponent>
              ) : <TextComponent tiny color={colors.ORANGE} paddingH={Sizes.h16}
                paddingV={Sizes.h16} mTop={Sizes.s20} pTop={Sizes.h20}
                lineHeight={Sizes.h20} height={Sizes.h30 * 4}
                width={Sizes.s200 * 2} lineHeight={13}>
                {breakString(otherNote.current)}
              </TextComponent>}
            </NoteWrapper>
          </>
        )}
      </Row>
    );
  };

  return (
    <ListWrapper
      data={data}
      keyExtractor={_keyExtractor}
      renderItem={_renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ListEditFood;

const ListWrapper = styled.FlatList.attrs(() => ({
  contentContainerStyle: {paddingBottom: Platform.OS === 'ios' ? 90 : 70},
}))`
  margin-top: 10px;
  padding-bottom: 50px;
`;

const ItemWrapper = styled.View`
  background-color: ${colors.WHITE};
  padding: 10px;
  margin-bottom: 1px;
  border-radius: 5px;
  height: 170px;
  flex-direction: row;
  align-items: center;
`;

const InfoWrapper = styled.View`
  flex: 1;
`;

const Avatar = styled.Image`
  width: 125px;
  height: 125px;
  border-radius: 5px;
`;

const RowBetween = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-right:  5px;
`;

const Row = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

const ItemFoot = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

const CountWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
  justify-content: space-between;
  padding-right: 5px;
`;

const ButtonCount = styled.View`
  flex-direction: row;
  align-items: center;
`;

const EditWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  align-self: flex-end;
`;

const ImageShip = styled.Image.attrs(() => ({
  resizeMode: 'contain',
}))`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

const Button = styled(ButtonComponent).attrs((props) => ({
  titleColor: props.color,
  iconColor: props.color,
  borColor: props.color,
  padding: 5,
  borRadius: 5,
  rowItem: true,
  height: 30,
  alignItems: 'center',
}))``;

const BtnShipFood = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid ${colors.PRIMARY};
  margin-right: 10px;
  height: 30px;
`;

const BtnDelete = styled(Button).attrs(() => ({
  title: 'Hủy',
  iconName: 'close',
}))``;

const BtnConfirm = styled(Button).attrs(() => ({
  title: 'Xác nhận',
  iconName: 'check-circle',
  iconColor: colors.ORANGE,
}))``;

const BtnNote = styled(Button).attrs(() => ({
  iconName: 'message1',
  iconColor: '#b5b5b5',
}))``;

const TakeName = styled.View`
  flex: 8;
`;

const TakeWrap = styled.View`
  flex: 3;
  margin-left: 5px;
  justify-content: center;
  align-items: center;
`;

const BtnLeft = styled(ButtonComponent).attrs(() => ({
  iconName: 'minus-circle',
  iconColor: colors.ORANGE,
  mRight: 5,
  iconSize: 22,

}))`
`;

const BtnRight = styled(ButtonComponent).attrs((props) => ({
  iconName: props.nameIcon,
  iconColor: colors.ORANGE,
  mLeft: 5,
  iconSize: 22,
}))``;
