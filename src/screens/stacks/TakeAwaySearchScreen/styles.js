import styled from 'styled-components/native';
import { colors, images } from '../../../assets';

export const Container = styled.View``;

export const Text = styled.Text``;

export const Input = styled.View`
  height: 40px;
  width: 90%;
  border-radius: 5px;
  align-self: center;
  margin-top: 15px;
  padding: 5px;
  background-color: white;
  border-color: ${colors.GRAY};
  border-width: 1px;
  flex-direction: row;
`;
export const InputText = styled.TextInput`
  height: 40px;
  flex: 9;
  padding: 5px;
  align-self: center;
`;

export const CheckBoxWrap = styled.View`
  padding-left: 10px;
`;

export const SearchBtn = styled.TouchableOpacity`
  margin-top: 20px;
  border-radius: 20px;
  padding: 10px;
  align-self: flex-end;
  margin-right: 20px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background:${colors.ORANGE}
`;

export const Icon = styled.Image`
  height: 20px;
  width: 20px;
  margin-right: 7px;
  color:${colors.WHITE};
`;

export const StatusWrap = styled.View`
  flex-direction: row;
  padding: 20px;
`;
