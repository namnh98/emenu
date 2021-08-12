import styled from 'styled-components/native';
import { colors } from '../../assets';
import ButtonComponent from '../ButtonComponent';
import InputComponent from '../InputComponent';

export const Container = styled.View`
  background-color: ${colors.WHITE};
  padding: 10px;
  border-radius: 5px;
`;

export const RowWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => (props.isBottom ? '10px' : 0)};
`;

export const FootWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-top: 20px;
  margin-bottom: 10px;
  border-top-width: 1px;
  border-top-color: ${colors.GRAY};
`;

export const VoucherWrapper = styled.View``;

export const DiscountWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const Discount = styled.View``;

export const Promotion = styled(ButtonComponent).attrs(() => ({
  title: 'Khuyến mãi',
  iconName: 'question-circle-o',
  disabled: true,
  titleColor: colors.PRIMARY,
  iconColor: colors.PRIMARY,
  isIconRight: true,
  rowItem: true,
}))``;

export const InputVoucher = styled(InputComponent).attrs(() => ({
  placeholder: 'Nhập voucher',
  borBottomColor: colors.GRAY,
  radius: 5,
  flex: 1,
}))``;

export const BtnVoucher = styled(ButtonComponent).attrs(() => ({
  iconName: 'check',
  bgButton: colors.ORANGE,
  paddingV: 5,
  paddingH: 8,
  borRadius: 5,
  mLeft: 15,
}))``;

export const BtnConfirm = styled(ButtonComponent).attrs(() => ({
  title: 'Áp dụng Ngay',
  titleColor: colors.WHITE,
  paddingV: 8,
  padding: 10,
  borRadius: 5,
  bgButton: colors.PRIMARY,
  alignLeft: true,
  mTop: 10,
}))``;

export const BtnCloseVoucher = styled(ButtonComponent).attrs(() => ({
  iconName: 'close',
  iconColor: colors.ORANGE,
  isIconRight: true,
  rowItem: true,
  mLeft: 10,
}))``;

export const CloseVoucher = styled(ButtonComponent).attrs(() => ({
  iconName: 'check-circle',
  iconColor: colors.PRIMARY,
  titleColor: colors.PRIMARY,
  rowItem: true,
  alignLeft: true,
  disabled: true,
  mTop: 8,
}))``;

export const Row = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

export const ButtonPhuThu = styled.TouchableOpacity`
 flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => (props.isBottom ? '10px' : 0)};
`;
export const UnderLine = styled.View`
  width: 80px;
  border-bottom-width:.55px;
  border-bottom-color: gray;
  position: absolute;
  bottom: -3px;
  right: 12px;
`