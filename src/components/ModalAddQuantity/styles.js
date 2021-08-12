import styled from 'styled-components/native';
import {colors} from '../../assets';
import ButtonComponent from '../ButtonComponent';

export const Container = styled.View`
  background-color: ${colors.WHITE};
  border-radius: 5px;
`;

export const ContentWrapper = styled.View`
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const Option = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Minus = styled(ButtonComponent).attrs(() => ({
  iconName: 'minus-circle',
  iconColor: colors.ORANGE,
  iconSize: 25,
}))``;

export const Plus = styled(ButtonComponent).attrs(() => ({
  iconName: 'plus-circle',
  iconColor: colors.ORANGE,
  iconSize: 25,
}))``;

export const Confirm = styled.TouchableOpacity`
  padding: 8px 15px;
  border-radius: 5px;
  margin-top: 30px;
  background-color: ${colors.ORANGE};
`;
