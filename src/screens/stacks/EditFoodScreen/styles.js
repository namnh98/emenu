import {Platform} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '../../../assets';
import {ButtonComponent} from '../../../components';

export const Wrapper = styled.View`
  flex: 1;
`;

export const Container = styled.View`
  flex: 1;
  padding: 10px;
`;

export const EditWrapper = styled.View`
  flex-direction: row;
  position: absolute;
  right: 10px;
  bottom: ${Platform.OS === 'ios' ? '30px' : '10px'};
`;

export const RowItem = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

export const Button = styled(ButtonComponent).attrs((props) => ({
  titleColor: props.color,
  iconColor: props.color,
  borColor: props.color,
  bgButton: colors.WHITE,
  paddingV: 5,
  paddingH: 10,
  borRadius: 5,
  center: true,
  width: 70,
  height: 60,
}))``;

export const BtnCancel = styled(Button).attrs(() => ({
  title: 'Hủy',
  iconName: 'cancel',
}))`
  margin-right: 15px;
`;

export const BtnSave = styled(Button).attrs(() => ({
  title: 'Lưu',
  iconName: 'save',
}))``;

export const BtnEdit = styled(Button).attrs(() => ({
  title: 'Sửa',
  iconName: 'edit',
}))`
  align-self: flex-end;
`;

export const BtnAdd = styled(Button).attrs(() => ({
  title: 'Thêm',
  iconName: 'plus',
}))`
  margin-right: 10px;
`;

export const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
