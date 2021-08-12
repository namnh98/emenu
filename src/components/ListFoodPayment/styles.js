import styled from 'styled-components/native';
import {colors} from '../../assets';

export const Container = styled.TouchableOpacity`
  background-color: ${colors.WHITE};
  padding: 10px;
  margin-bottom: 1px;
  border-radius: 5px;
  flex-direction: row;
  align-items: center;
`;

export const ImageWrapper = styled.Image`
  width: 80px;
  height: 80px;
`;

export const ContentWrapper = styled.View`
  flex: 1;
  padding-left: 8px;
`;

export const RowWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const CheckedInfo = styled.View`
  height: 4%;
  width: 100%;
  padding: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Button = styled.TouchableOpacity`
  padding: 5px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border-width: 1px;
  width: 25%;
  background-color: ${colors.WHITE};
  border-color: ${(props) => (props.red ? colors.RED : colors.ORANGE)};
`;

export const ButtonWrap = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 25px;
  margin-bottom: 30px;
`;
export const CountWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const InputQty = styled.TextInput`
  width: 50px;
  height: 20px;
  padding: 3px; 
  border-width: 1px;
  border-color: ${colors.WHITE}
  border-bottom-color : ${colors.ORANGE};
  color: ${colors.ORANGE};
  font-weight: bold;
`;

export const Number = styled.Text`
  width: 30px;
  text-align: center;
`;

export const ButtonQty = styled.TouchableOpacity`
  width: 30px;
  justify-content: center;
  align-items: center;
`;
