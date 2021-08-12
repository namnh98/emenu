import styled from 'styled-components/native';
import { colors } from '../../../assets';

export const Container = styled.View`
  flex: 1;
`;

export const BodyWrapper = styled.View`
  flex: 1;
  padding: 10px;
`;

export const RowWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
`;
export const RowWrapper1 = styled.View`
  ${'' /* align-items: center; */}
  justify-content: space-between;
  margin-top: 5px;
`;

export const Wrapper = styled.View`
  ${'' /* align-items: center;
  justify-content: center; */}
`;

export const RowWrapper2 = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

export const RowButton = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;
export const RowBottom = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;
  align-items: center;
  position: absolute;
  bottom: 0;
  height: 60px;
  width: 100%;
  border-top-width: 0.5px;
  border-top-color: #bebebe;
  background-color: ${colors.WHITE};
`;

export const CustomerMoney = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;

export const Content = styled.View`
  background-color: ${colors.WHITE};
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
`;

export const ExtraWrapper = styled.View``;
export const ShowMoney = styled.TouchableOpacity`
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