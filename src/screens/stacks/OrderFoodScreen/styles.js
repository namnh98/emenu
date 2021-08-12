import {Platform} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '../../../assets';
import {ButtonComponent} from '../../../components';


export const Container = styled.View`
  flex: 1;
`;

export const Body = styled.View`
  flex: 1;
  padding: 10px;
`;

export const ItemFoodWrap = styled.View`
  margin-top: 10px;
`;

export const Button = styled(ButtonComponent).attrs((props) => ({
  titleColor: props.color,
  iconColor: props.color,
  borColor: props.color,
  iconSize: 18,
  borRadius: 5,
  paddingV: 5,
  paddingH: 10,
  width: 80,
  height: 60,
  center: true,
  bgButton: colors.WHITE,
}))``;

export const BtnDetails = styled(Button).attrs(() => ({
  title: 'Chi tiết',
  iconName: 'eye',
}))``;

export const BtnOrderFood = styled(Button).attrs(() => ({
  title: 'Gọi món',
  iconName: 'bell',
}))`
  margin-left: 20px;
`;

export const HeaderWrap = styled.View`
  margin-bottom: 10px;
`;

export const RowWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const CateWrap = styled(ButtonComponent).attrs(() => ({
  iconName: 'close-circle',
  iconColor: colors.RED,
  isIconRight: true,
  titleStyle: {
    fontSize: 18,
    fontWeight: '700',
  },
  iconStyle: {
    marginLeft: 2,
  },
}))`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

export const BtnSearch = styled(ButtonComponent).attrs(() => ({
  title: 'Tìm kiếm theo',
  titleColor: colors.PRIMARY,
  iconName: 'search', 
  iconColor: colors.PRIMARY,
  rowItem: true, 
  iconSize: 15
}))``;

export const FootWrap = styled.View`
  flex-direction: row;
  align-items: center;
  position: absolute;
  right: 10px;
  bottom: ${Platform.OS === 'ios' ? '30px' : '10px'};
`;
