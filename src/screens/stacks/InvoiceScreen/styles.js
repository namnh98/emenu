import styled from 'styled-components/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../../assets/colors';

export const Wrapper = styled(SafeAreaView)`
  flex: 1;
  background-color: ${colors.WHITE};
`;

export const Container = styled.ScrollView.attrs(() => ({
  showsVerticalScrollIndicator: false,
}))`
  padding-left: 10px;
  padding-right: 10px;
`;

export const BodyWrap = styled.View`
  flex: 1;
`;

export const Heading = styled.View`
  justify-content: center;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
`;

export const Title = styled.View``;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Logo = styled.Image`
  width: 50px;
  height: 50px;
`;

export const LogoTitle = styled.View`
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  flex: 1;
`;

export const DeviceWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  margin-bottom: 20px;
`;

export const Line = styled.Image``;

export const LineLeft = styled.Image`
  margin-left: 3px;
`;

export const LineRight = styled.Image`
  margin-right: 3px;
`;

export const RowBetween = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const RowTop = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
`;

export const Menu = styled.View`
  margin-top: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-top-width: 2px;
  border-bottom-width: 2px;
  border-top-color: ${colors.TEXT_GRAY};
  border-bottom-color: ${colors.TEXT_GRAY};
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
`;

export const MenuName = styled.View`
  flex: 2;
`;

export const MenuSL = styled.View`
  flex: 1;
  align-items: center;
`;

export const MenuPrice = styled.View`
  flex: 1.5;
  align-items: center;
`;

export const MenuTotal = styled.View`
  flex: 2;
  align-items: flex-end;
`;

export const UnitWrapper = styled.View`
  position: absolute;
  top: -8px;
  right: -5px;
`;

export const ItemWrapper = styled.View``;

export const Item = styled.View`
  margin-top: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
`;

export const LineItem = styled.Image`
  width: 100%;
  color: red;
`;

export const PriceWrapper = styled.View`
  margin-top: 10px;
  border-bottom-width: 2px;
  border-bottom-color: ${colors.TEXT_GRAY};
  padding-bottom: 10px;
`;

export const Voucher = styled.View`
  margin-top: 10px;
`;

export const Scanner = styled.Image`
  align-self: center;
  margin-top: 10px;
  width: 100px;
  height: 100px;
`;

export const Footer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 10px;
`;

export const DiscountWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8px;
`;

export const Discount = styled.View``;

export const ShowPrice = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;
