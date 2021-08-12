import { Platform, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../../../assets';
import { ButtonComponent } from '../../../components/index';

export const Wrapper = styled.View`
  flex: 1;
`;

export const BodyWrap = styled.ScrollView.attrs(() => ({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: { padding: 10},
}))``;

export const AvatarWrap = styled.View`
  background-color: ${colors.WHITE};
  margin-bottom: 3px;
  padding: 10px;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`;

export const Avatar = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: ${80 / 2}px;
`;

export const RowWrap = styled.View`
  flex-direction: row;
  background-color: ${colors.WHITE};
  border-radius: 5px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
  padding: 10px;
`;

export const RowWrap2 = styled.View`
  flex-direction: row;
  border-radius: 5px;
  justify-content: flex-end;
  position: absolute;
  left: 40px;
  right: 0;
  top: ${Platform.OS === 'ios' ? '30px' : '30px'};
`;

export const FootWrap = styled.View`
  justify-content: center;
  align-items: center;
`;

export const Logout = styled(ButtonComponent).attrs(() => ({
  iconName: 'logout',
  titleColor: colors.ORANGE,
  iconColor: colors.WHITE,
}))`
  flex-direction: row;
  align-items: center;
  top:18px;
  right:10px;
  height:30;
  width:30;
  justify-content: center;
  align-items: center;
`;

export const CheckOut = styled(ButtonComponent).attrs(() => ({
  title: 'Check Out\nca làm việc',
  iconName: 'checkout',
  titleColor: colors.ORANGE,
  iconColor: colors.ORANGE,
  center: true,
  iconSize:30,
  titleStyle:{paddingTop:10,textAlign:'center'}
}))`

  border: 1px solid ${colors.ORANGE};
  border-radius: 5px;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px ;
  align-self: center;
  background-color: #fff;
  margin-left: 20px;
`;

export const OrderdHistory = styled(ButtonComponent).attrs(() => ({
  title: 'Lịch sử \nhóa đơn',
  iconName: 'order-history',
  titleColor: colors.ORANGE,
  iconColor: colors.ORANGE,
  center: true,
  iconSize:30,
  titleStyle:{paddingTop:10, textAlign:'center'},
}))`
  border: 1px solid ${colors.ORANGE};
  border-radius: 5px;
  flex-direction: column;
  align-items: center;
  padding: 9px 32px;
  align-self: center;
  background-color: #fff;
`;

export const AllowOption = styled.View``;
export const LinkNavigate = styled.Pressable``;
export const ViewCheckOut = styled.View`
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;
export const ViewBlockRow = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: 15px;
`;
export const ViewBlockCol = styled.View`
`;
