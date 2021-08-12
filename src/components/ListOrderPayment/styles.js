import styled from 'styled-components/native';
import {colors} from '../../assets';

export const Container = styled.TouchableOpacity`
  opacity: ${(props) =>
    props.isChosen === undefined ||
    props.isChosen === null ||
    props.isChosen === true
      ? 1
      : 0.5};
  flex: 0.5;
  margin-bottom: 10px;
  margin-right: ${({marginRight}) => (marginRight ? '15px' : 0)};
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);
`;

export const Header = styled.View`
  background-color: ${colors.PRIMARY};
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  flex-direction: row;
  padding: 5px;
`;

export const BodyWrapper = styled.View`
  background-color: ${colors.WHITE};
  padding: 10px;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  padding-bottom: 15px;
`;

export const Content = styled.View`
  background-color: ${colors.TWITTER};
  padding: 10px;
  border-radius: 5px;
  align-items: center;
`;

export const Person = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;
export const PriceWrap = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
`;

export const PaymentWrapper = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 10;
  justify-content: center;
  align-items: center;
`;

export const FootWrap = styled.View`
  height: 50px;
`;

export const Price = styled.View``;
