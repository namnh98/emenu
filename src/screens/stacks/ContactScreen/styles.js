import { StyleSheet } from 'react-native';
import { colors } from '../../../assets';
import styled from 'styled-components/native';
import ButtonComponent from '../../../components/ButtonComponent';

export const Wrapper = styled.View`
  flex: 1;
  color:${colors.WHITE};
`;
export const Body = styled.ScrollView`
  padding: 10px;
  padding-bottom:30px;
`;
export const ViewContent = styled.View`

`;
export const ViewRow = styled.View`
 flex-direction: row;
 align-items: center;
 margin-top:10px;
`;

export const ViewRowStart = styled.View`
 flex-direction: row;
 margin-top:10px;
`;
export const ViewRowEnd = styled.View`
 flex-direction: row;
 justify-content:flex-end;
`;

export const SendBtn = styled(ButtonComponent).attrs(() => ({
  title: 'Gửi',
  iconName: 'send',
  iconSize: 14,
  titleColor: colors.ORANGE,
  iconColor: colors.ORANGE,
  iconStyle: {
    marginRight: 5,
  },
}))`
  flex-direction: row;
  align-items: center;
  border: 0.5px solid ${colors.ORANGE};
  padding: 5px 10px;
  border-radius: 5px;
  align-self: flex-end;
  margin-top:10px;
  margin-bottom:30px;
`;

