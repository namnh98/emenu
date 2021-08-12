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

export const FootWrap = styled.View`
  flex-direction: row;
  align-items: center;
  position: absolute;
  right: 10px;
  bottom: ${Platform.OS === 'ios' ? '30px' : '10px'};
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
  titleStyle: {
    textAlign: 'center',
  },
}))``;

export const BtnDetails = styled(Button).attrs(() => ({
  title: 'Các món đã gọi',
  iconName: 'eye',
}))``;

export const BtnPayment = styled(Button).attrs(() => ({
  title: 'Thanh toán',
  iconName: 'payment',
}))`
  margin-left: 20px;
`;

export const HeaderWrap = styled.View`
  margin-bottom: 10px;
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

export const RowWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const BtnSearch = styled(ButtonComponent).attrs(() => ({
  title: 'Tìm kiếm theo',
  titleColor: colors.PRIMARY,
  titleStyle: {
    fontSize: 16,
    fontWeight: '700',
  },
}))``;

export const ModalInputCustomerInfo = styled.Modal`
  height: 400px;
  width: 90%;
`;

export const ModalWrap = styled.View`
  flex: 1;
  justify-content : center;
  align-items: center;

`;

export const InputName = styled.TextInput`
  background-color: ${colors.WHITE};
  width: 90%;
  border-radius: 5px;
  padding: 5px 10px;
  margin-top: 15px;
`;

export const InputPhone = styled.TextInput`
  background-color: ${colors.WHITE};
  width: 90%;
  border-radius: 5px;
  padding: 5px 10px;
  margin-top: 10px;
`;

export const ModalContent = styled.View`
  height: 250px;
  width: 90%;
  background-color: ${colors.BG_GRAY};
  justify-content : center;
  align-items: center;
  border-radius: 20px;

`;

export const ButtonWrap = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
`;

export const TitleModal = styled.View`
  height: 60px; 
  background-color: ${colors.ORANGE};
  width: 100%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  justify-content: center;
  align-items: center;
`;

export const ButtonModal = styled.TouchableOpacity`
  width: 100px;
  height: 30px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.WHITE};
  border-radius: 20px;
  border-width: 2px;
  border-color:  ${props => props.comfirm? colors.ORANGE: colors.RED};
  margin-horizontal: 10px;
`;