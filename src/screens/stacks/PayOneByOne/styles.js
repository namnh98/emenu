import styled from 'styled-components/native';
import {colors, images} from '../../../assets';

export const Container = styled.View`
  flex: 1;
`;

export const ListWrap = styled.ScrollView`
  padding: 10px;
  padding-top: 0;
`;

export const Button = styled.TouchableOpacity`
  padding: 5px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border-width: 2px;
  background-color: ${colors.WHITE};
  border-color: ${(props) => (props.red ? colors.RED : colors.ORANGE)};
  margin-top: 20px;
`;

export const ButtonWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 25px;
  margin-bottom: 30px;
`;

export const CheckedInfo = styled.View`
  height: 4%;
  width: 100%;
  padding: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const BodyWrap = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
