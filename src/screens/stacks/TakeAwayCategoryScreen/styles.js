import {Platform} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '../../../assets';
import {ButtonComponent} from '../../../components';

export const Wrapper = styled.View`
  flex: 1;
`;

export const BodyWrap = styled.View`
  flex: 1;
  padding: 10px;
`;

export const ListCategory = styled.FlatList.attrs(() => ({
  numColumns: 2,
  showsVerticalScrollIndicator: false,
  columnWrapperStyle: {
    justifyContent: 'space-between',
  },
}))``;

export const CardWrap = styled.TouchableOpacity`
  padding: 30px 15px;
  border-radius: 5px;
  margin-bottom: 15px;
  background-color: ${colors.WHITE};
  justify-content: center;
  align-items: center;
  width: 48%;
`;

export const CardImage = styled.Image`
  width: 70px;
  height: 70px;
`;

export const BtnDetails = styled(ButtonComponent).attrs(() => ({
  title: 'Các món đã gọi',
  iconName: 'eye',
  titleColor: colors.PRIMARY,
  iconColor: colors.PRIMARY,
  borColor: colors.PRIMARY,
  iconSize: 18,
  borRadius: 5,
  paddingV: 5,
  paddingH: 10,
  width: 80,
  height: 60,
  center: true,
  bgButton: colors.WHITE,
  titleStyle: {
    textAlign: 'center',
  },
}))`
  position: absolute;
  right: 15px;
  bottom: ${Platform.OS === 'ios' ? '40px' : '15px'};
`;
