import styled from 'styled-components/native';
import { colors, images } from '../../../assets';
import { ButtonComponent } from '../../../components';
import { Sizes } from '@dungdang/react-native-basic'

export const Wrapper = styled.View`
  flex: 1;
`;

export const BodyWrap = styled.ImageBackground.attrs(() => ({
  source: images.BACKGROUND,
}))`
  flex: 1;
  padding: 10px;
`;

export const MergeWrap = styled.View`
  position: absolute;
  flex-direction: row;
  right: 10px;
  z-index: 10;
  bottom: 10px;
`;

export const MergeTable = styled(ButtonComponent).attrs((props) => ({
  title: props.isEmpty ? 'Ghép bàn' : 'Gộp bàn',
  iconName: 'table-left',
  iconColor: colors.PRIMARY,
  titleColor: colors.PRIMARY,
  center: true,
  titleCenter: true,
}))`
  margin-bottom: 10px;
  background-color: ${colors.WHITE};
  align-self: flex-start;
  padding: 8px;
  border-radius: 5px;
  position: absolute;
  right: 10px;
  bottom: 0px;
  height: 60px;
  z-index: 10;
  width: ${Sizes.s200};
`;

export const ConfirmMerge = styled(ButtonComponent).attrs(() => ({
  title: 'Xác nhận',
  iconName: 'table-left',
  iconColor: colors.PRIMARY,
  titleColor: colors.PRIMARY,
  center: true,
}))`
  width: ${Sizes.s200};
  margin-left: 10px;
  background-color: ${colors.WHITE};
  padding: 8px;
  border-radius: 5px;
  z-index: 10;
  height:60px;
`;

export const CancelMerge = styled(ButtonComponent).attrs(() => ({
  title: 'Hủy',
  iconName: 'close',
  iconColor: colors.RED,
  titleColor: colors.RED,
  center: true,
}))`
  background-color: ${colors.WHITE};
  padding: 8px;
  border-radius: 5px;
  z-index: 10;
  width: ${Sizes.s200};
  height:60px;
`;

export const WarningPanel = styled.TouchableOpacity`
  width: 100%;
  background-color: ${colors.DARK_PRIMARY};
  justify-content: center;
  align-items: center;
  padding: 6px;
`;

export const TextWarningPanel = styled.View`
  flex-direction: row;
  justify-content: center;
`;
