import DropDownPicker from 'react-native-dropdown-picker';
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

export const DropDown = styled(DropDownPicker).attrs(() => ({
  containerStyle: {height: 40},
  itemStyle: {justifyContent: 'flex-start'},
  dropDownStyle: {backgroundColor: colors.WHITE},
  placeholderStyle: {color: colors.BG_GRAY},
  activeLabelStyle: {color: colors.PRIMARY},
  selectedLabelStyle: {color: colors.PRIMARY},
}))`
  background-color: ${colors.WHITE};
`;

export const Search = styled.TextInput.attrs(() => ({
  placeholder: 'Nhập tên món ăn',
}))`
  border: 0.5px solid ${colors.BG_GRAY};
  margin-top: 10px;
  background-color: ${colors.WHITE};
  padding: 10px 
  border-radius: 5px;
`;

export const BtnSearch = styled(ButtonComponent).attrs(() => ({
  title: 'Tìm kiếm',
  iconName: 'search',
  titleColor: colors.ORANGE,
  iconColor: colors.ORANGE,
  iconSize: 18,
  iconStyle: {
    marginRight: 5,
  },
}))`
  border: 0.5px solid ${colors.ORANGE};
  padding: 5px 10px;
  border-radius: 5px;
  margin-top: 10px;
  flex-direction: row;
  align-items: center;
  align-self: flex-end;
`;
