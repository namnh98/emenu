import styled from 'styled-components/native';
import {colors} from '../../../assets';
import {ButtonComponent} from '../../../components';

export const Container = styled.View`
  flex: 1;
`;

export const ButtonOrder = styled(ButtonComponent).attrs(() => ({
  title: 'Gọi món',
  iconName: 'bell',
  iconColor: colors.ORANGE,
  center: true,
  titleColor: colors.ORANGE,
}))`
  position: absolute;
  right: 10px;
  bottom: ${Platform.OS === 'ios' ? '30px' : '10px'};
  border: 1px solid ${colors.ORANGE};
  border-radius: 5px;
  width: 80px;
  height: 60px;
  background-color: ${colors.WHITE};
`;
