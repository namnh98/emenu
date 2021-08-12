import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { ButtonComponent } from '../../../components';
import colors from '../../../assets/colors';
export const Container = styled.View`
  flex: 1;
`;

export const BodyWrapper = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
}))`
  flex: 1;
  padding: 10px;
`;

export const OptionWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-left:10px;
  padding-right:10px;
  align-items: center;
  position:absolute;
  bottom:0;
  height:60px;
  width:100%;
  border-top-width:.5px;
  border-top-color:#bebebe;
  background-color:${colors.WHITE};
  padding-bottom:8px;
`;

export const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0px;
  padding: 10px;
  border-radius: 5px;
  background-color: ${colors.WHITE};
`;
export const ButtonShowAll = styled(ButtonComponent).attrs(() => ({
  title: 'Hiển thị tất cả',
  titleColor: colors.PRIMARY,
}))``;

export const Row2 = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;