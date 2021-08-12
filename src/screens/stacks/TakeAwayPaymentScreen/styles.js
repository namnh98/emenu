import {Platform} from 'react-native';
import styled from 'styled-components/native';
import colors from '../../../assets/colors';
import {ButtonComponent} from '../../../components';

export const Wrapper = styled.View`
  flex: 1;
`;

export const Container = styled.ScrollView.attrs(() => ({
  keyboardShouldPersistTaps: 'always',
  showsVerticalScrollIndicator: false,
}))`
  margin-bottom: ${Platform.OS === 'ios' ? '30px' : 0};
`;

export const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0px;
  padding: 10px;
  border-radius: 5px;
  background-color: ${colors.WHITE};
`;

export const CardWrap = styled.View`
  background-color: ${colors.WHITE};
  padding: 10px;
  margin-bottom: 1px;
  flex-direction: row;
  align-items: center;
`;

export const CardImage = styled.Image`
  width: 80px;
  height: 80px;
`;

export const CardInfo = styled.View`
  flex: 1;
  padding-left: 10px;
`;

export const RowItem = styled.View`
  flex-direction: row;
  justify-content: ${(props) =>
    props.isBetween ? 'space-between' : 'flex-start'};
  align-items: center;
`;

export const BottomWrap = styled.View`
  background-color: ${colors.WHITE};
  margin-top: 9px;
`;

export const ButtonShowAll = styled(ButtonComponent).attrs(() => ({
  title: 'Hiển thị tất cả',
  titleColor: colors.PRIMARY,
}))``;

export const ButtonPrinter = styled(ButtonComponent).attrs((props) => ({
  title: 'In hóa đơn',
  iconName: props.isPrint ? 'check-circle' : 'circle',
  iconColor: colors.ORANGE,
  iconSize: 30,
  rowItem: true,
  alignLeft: true,
}))`
  margin-left: 10px;
`;

export const CheckTakeAway = styled(ButtonComponent).attrs((props) => ({
  title: 'Mang về',
  iconName: props.isTakeAway ? 'check-circle' : 'circle',
  iconColor: colors.ORANGE,
  iconSize: 30,
  rowItem: true,
  alignLeft: true,
}))`
  margin-left: 10px;
`;

export const InfoWrap = styled.View`
  background-color: ${colors.GRAY};
  padding: 20px;
  margin-top: 20px;
  align-items: center;
  border-radius: 5px;
  margin-left: 10px;
  margin-right: 10px;
`;

export const InputName = styled.TextInput`
  background-color: ${colors.WHITE};
  width: 95%;
  border-radius: 5px;
  padding: 5px 10px;
  margin-top: 15px;
  height: 40px;
`;

export const InputPhone = styled.TextInput`
  background-color: ${colors.WHITE};
  width: 95%;
  border-radius: 5px;
  padding: 5px 10px;
  margin-top: 10px;
  height: 40px;
`;

export const RowCenter = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

export const Button = styled(ButtonComponent).attrs((props) => ({
  rowItem: true,
  selfCenter: true,
  titleColor: props.color,
  iconColor: props.color,
  borColor: props.color,
  paddingV: 5,
  paddingH: 15,
  borRadius: 5,
}))``;

export const ButtonPayment = styled(Button).attrs(() => ({
  title: 'Thanh toán',
  iconName: 'payment',
}))`
  margin-bottom: 10px;
  height: 35px;
`;

export const ButtonBackToHome = styled(Button).attrs(() => ({
  title: 'Trở về trang chủ',
  iconName: 'home',
}))`
  margin-bottom: 10px;
  margin-left: 10px;
  height: 35px;
  /* margin-top: 10px; */
`;

export const ButtonSave = styled(Button).attrs(() => ({
  title: 'Lưu',
  iconName: 'save',
}))`
  margin-bottom: 10px;
  margin-left: 10px;
  height: 35px;
`;

export const PaymentWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 10px;
`;
