import styled from 'styled-components/native';
import {colors} from '../../../assets';

export const Container = styled.View`
  flex: 1;
`;

export const BodyWrapper = styled.View`
  flex: 1;
  padding: 10px;
`;

export const ModalContainer = styled.View`
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: ${colors.WHITE};
  border-radius: 10px;
`;

export const Wrapper = styled.View`
  height: 100px;
  width: 90%;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;
