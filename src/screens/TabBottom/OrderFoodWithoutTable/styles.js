import {Platform} from 'react-native';
import styled from 'styled-components/native';
import colors from '../../../assets/colors';
import {ButtonComponent} from '../../../components';

export const Wrapper = styled.View`
  flex: 1;
`;

export const BodyWrap = styled.View`
  flex: 1;
  padding: 10px;
  padding-top: 0;
  /* position: relative;
  top: -30px; */
`;

export const Button = styled(ButtonComponent).attrs(() => ({
  title: 'Thêm',
  iconName: 'plus',
  titleColor: colors.PRIMARY,
  iconColor: colors.PRIMARY,
}))`
  border: 1px solid ${colors.PRIMARY};
  position: absolute;
  right: 10px;
  bottom: 10px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  width: 70px;
  height: 60px;
  background-color: ${colors.WHITE};
`;

export const ListOrder = styled.FlatList.attrs(() => ({
  contentContainerStyle: {paddingBottom: 10},
}))``;

export const ItemSeparator = styled.View`
  height: 15px;
`;

export const SearchBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  margin-top: 5px;
`;

export const ColLeft = styled.View`
  flex: 1;
  align-items: flex-start;
  justify-content: center;
`;

export const ColRight = styled.View`
  flex: 1;
  align-items: flex-end;
  justify-content: center;
`;

export const SearchBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-vertical: 5px;
  padding-horizontal: 10px;
`;

export const SearchIcon = styled.Image`
  width: 12px;
  height: 12px;
`;

export const NotiNewOrder = styled.TouchableOpacity`
  padding: 5px;
  width: 30%;
  align-self: center;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background-color: ${colors.RED};
  position: absolute;
  top: 10px;
`;
