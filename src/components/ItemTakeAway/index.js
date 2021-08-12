import React from 'react';
import styled from 'styled-components/native';
import { colors, images } from '../../assets';
import { FormatNumber } from '../../untils';
import TextComponent from '../TextComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FormatMoment from '../../untils/FormatMoment';

const ItemTakeAway = ({ item, onPress, index }) => {
  const {
    order_no,
    customer_name,
    customer_tel,
    order_items,
    order_status,
    sub_total,
    created_at,
    is_delivery_completed,
  } = item || {};
  const _order_no = order_no.slice(order_no.length - 3);
  return (
    <CardWrap>
      <CardTop>
        <TextComponent color={colors.BLACK} heavy medium>
          MÃ HOÁ ĐƠN: {_order_no}
        </TextComponent>
        <TextComponent color={colors.BLACK}>
          {FormatMoment.FormatBirthday(created_at)} -
          {FormatMoment.FormatTime(created_at)}
        </TextComponent>
        <RowItem>
          <ColLeft>
            <TextComponent color={colors.BLACK} upperCase heavy>
              {customer_name}
            </TextComponent>
            <TextComponent color={colors.BLACK} heavy>
              {customer_tel}
            </TextComponent>
          </ColLeft>
          <ColRight>
            <RowItem>
              <TextComponent color={colors.BLACK}>Số món:</TextComponent>
              <TextComponent
                color={colors.BLACK}
                mLeft={2}
                color={colors.BLUE}
                heavy>
                {order_items?.length}
              </TextComponent>
            </RowItem>
            <RowItem>
              <TextComponent color={colors.BLACK}>Tổng:</TextComponent>
              <FormatNumber value={sub_total} heavy textColor={colors.BLUE} />
            </RowItem>
          </ColRight>
        </RowItem>
      </CardTop>

      <CardBottom>
        <MenuWrap>
          <Menu>
            <MenuTM>
              <TextComponent>Tên món</TextComponent>
            </MenuTM>
            <MenuSL>
              <TextComponent>SL</TextComponent>
            </MenuSL>
            <MenuDG>
              <TextComponent>Đơn giá</TextComponent>
            </MenuDG>
            <MenuTT>
              <TextComponent>Th.Tiền</TextComponent>
            </MenuTT>
          </Menu>
        </MenuWrap>

        {order_items?.map((food, index) => {
          const { item_name, qty, price, amount, discount_value } = food || {};
          const PRICE = discount_value ? price - discount_value : price;
          return (
            <MenuWrap key={index}>
              <Menu>
                <MenuTM>
                  <TextComponent>{item_name}</TextComponent>
                </MenuTM>
                <MenuSL>
                  <TextComponent>{qty}</TextComponent>
                </MenuSL>
                <MenuDG>
                  <FormatNumber value={PRICE} numberLine={1} />
                </MenuDG>
                <MenuTT>
                  <FormatNumber value={amount} numberLine={1} />
                </MenuTT>
              </Menu>
              <MenuLine source={images.LINE_BOTTOM} />
            </MenuWrap>
          );
        })}
        <RowCenter>
          {order_status?.id === 2 ? ( /// Nếu đã thanh toán
            <>
              {is_delivery_completed ? null : (
                <ButtonHuy onPress={() => onPress(item, 1)}>
                  <AntDesign name="closecircleo" size={12} color={colors.WHITE} />
                  <TextComponent color={colors.WHITE} mLeft={5}>
                    Hủy
                  </TextComponent>
                </ButtonHuy>
              )}
              {is_delivery_completed ? null : (
                <Button
                  color={colors.ORANGE}
                  left
                  onPress={() => onPress(item, 2)}>
                  <Icon source={images.DELIVERY} />
                  <TextComponent color={colors.WHITE} mLeft={5}>
                    Giao hàng
                  </TextComponent>
                </Button>
              )}
              <Button
                color={colors.ORANGE}
                left
                onPress={() => onPress(item, 3)}>
                <Icon source={images.PRINTER} />
                <TextComponent color={colors.WHITE} mLeft={5}>
                  In hóa đơn
                </TextComponent>
              </Button>
            </>
          ) : order_status?.id === 1 ? (
            <>
              <ButtonHuy onPress={() => onPress(item, 1)}>
                <AntDesign name="closecircleo" size={12} color={colors.WHITE} />
                <TextComponent color={colors.WHITE} mLeft={5}>
                  Hủy
                </TextComponent>
              </ButtonHuy>
              <ButtonThanhToan
                color={colors.DARK_PRIMARY}
                left
                onPress={() => onPress(item, 4)}>
                <Icon source={images.PAYMENT} />
                <TextComponent color={colors.WHITE} mLeft={5}>
                  Thanh toán
                </TextComponent>
              </ButtonThanhToan>
            </>
          ) : (
            <Button
              color={colors.DARK_PRIMARY}
              onPress={() => onPress(item, 5)}>
              <MaterialCommunityIcons
                name="file-restore"
                size={12}
                color={colors.DARK_PRIMARY}
              />
              <TextComponent color={colors.DARK_PRIMARY} mLeft={5}>
                Khôi phục
              </TextComponent>
            </Button>
          )}
        </RowCenter>
        {is_delivery_completed && (
          <PaymentWrap style={{ bottom: 85 }}>
            <PaymentText>Đã giao hàng</PaymentText>
          </PaymentWrap>
        )}

        {(order_status?.id === 2 || order_status?.id === 32) && (
          <PaymentWrap>
            <PaymentText>Đã thanh toán</PaymentText>
          </PaymentWrap>
        )}
      </CardBottom>
    </CardWrap>
  );
};

export default ItemTakeAway;

const CardWrap = styled.View``;

const CardTop = styled.View`
  background-color: ${colors.WHITE};
  padding: 5px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  justify-content: center;
  align-items: center;
`;

const CardBottom = styled.View`
  background-color: ${colors.DARK_GRAY};
  padding: 5px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

const RowItem = styled.View`
  align-items: center;
  flex-direction: row;
`;

const RowCenter = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

const ColLeft = styled.View`
  flex: 1;
  justify-content: center;
  align-items: flex-start;
  margin-left: 5px;
`;
const ColRight = styled.View`
  flex: 1;
  justify-content: center;
  align-items: flex-end;
  margin-left: 5px;
`;

const Button = styled.TouchableOpacity`
  padding: 6px;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
  align-self: flex-start;
  border-radius: 20px;
  background-color: ${colors.ORANGE};
  margin-left: ${({ left }) => (left ? '10px' : 0)};
  flex-direction: row;
`;
const ButtonHuy = styled.TouchableOpacity`
  padding: 6px;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
  align-self: flex-start;
  borderRadius:20px;
  background-color: ${colors.RED};
  margin-left: ${({ left }) => (left ? '10px' : 0)};
  flex-direction: row;
`;
const ButtonThanhToan = styled.TouchableOpacity`
  padding: 6px;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
  align-self: flex-start;
  borderRadius:20px;
  background-color: ${colors.ORANGE};
  margin-left: ${({ left }) => (left ? '10px' : 0)};
  flex-direction: row;
`;


const MenuWrap = styled.View`
  margin-bottom: 5px;
`;

const Menu = styled.View`
  flex-direction: row;
  align-items: center;
`;

const MenuTM = styled.View`
  flex: 4;
`;

const MenuSL = styled.View`
  flex: 1;
  align-items: center;
`;

const MenuDG = styled.View`
  flex: 2.5;
  align-items: center;
`;

const MenuTT = styled.View`
  flex: 2.5;
  align-items: center;
`;

const MenuLine = styled.Image`
  margin-top: 5px;
  width: 100%;
`;

const PaymentWrap = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 35px;
  justify-content: center;
  align-items: center;
`;

const PaymentText = styled.Text`
  color: ${colors.RED};
  opacity: 0.6;
  transform: rotate(-15deg);
  font-size: 17px;
  text-align: center;
  font-weight: 400;
`;

const Icon = styled.Image`
  width: 12px;
  height: 12px;
  tintColor: ${colors.WHITE};
`;
