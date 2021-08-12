
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { colors, images } from '../../../../assets';
const { width, height } = Dimensions.get('screen');

export const Wrapper = styled.ScrollView`
  flex: 1;
  padding-bottom: 10px;
  background-color:${colors.DARK_WHITE};
`
export const ChildScrollView = styled.ScrollView`
  background-color:${colors.WHITE};
`
export const WrapViewTop = styled.View`
  background-color:${colors.WHITE};
  padding:10px;
  margin-top:10px;
  margin-bottom:10px;
  height:380px;
`
export const TextDefault = styled.Text``
export const ViewPie = styled.View`
  align-items:center;
  position:relative;
`
export const ViewDatNull = styled.View`
  position:absolute;
  top:0;
  bottom:0;
  left:0;
  right:0;
  align-items:center;
  justify-content:center;
`
export const TextNoValue = styled.Text`
  font-size:20px;
  color:${colors.RED};
`

export const ViewPieDesc = styled.View`
  flex-direction:row;
  justify-content:space-between;
  align-items:center;
  margin-top:10px;
  margin-left:10px;
`
export const ViewRow = styled.View`
  flex-direction:row;
`
export const ViewBlock = styled.View`
  width:15px;
  height:15px;
`
export const TextName = styled.Text`
  text-transform: uppercase;
  margin-left: 10px;
  margin-right: 10px;
`
export const TextPercent = styled.Text`
  color:${colors.ORANGE};
`
export const BlockOutItems = styled.View`
  flex: 1;
  flex-direction:row;
  flex-wrap:wrap;
  align-content:center;
  justify-content:space-between;
  padding-left:10px;
  padding-right:10px;
`

export const Item = styled.View`
  width: ${width / 2.2}px;
  height: 120px;
  background:${colors.WHITE};
  border-radius:5px;
  justify-content:center;
  align-items:center;
  margin-bottom:15px;
`
export const TextNormal = styled.Text`
  color:${colors.BLACK};
`
export const SubText = styled.Text`
  color:${colors.LIGHT_BLUE};
  font-size: 20px;
  font-weight:700;
  padding-top:20px;
`
export const WrapView = styled.View`
  background-color:${colors.WHITE};
  padding:10px;
  margin-bottom:15px;
`
export const TitleView = styled.View`
  justify-content:space-between;
  flex-direction:row;
  align-items:center;
  padding:10px;
`
export const TextModule = styled.Text`
  font-size:13px;
  text-transform: uppercase;
  color: ${colors.ORANGE};
`
export const TextModuleRight = styled.Text`
  font-size:13px;
  color: ${colors.ORANGE};
`
export const ListView = styled.View`
  justify-content:space-between;
  flex-direction:row;
  align-items:center;
  height:50px;
  border-bottom-width:1px;
  border-color:#eee;
`
export const ViewCenterRow = styled.View`
  flex-direction:row;
  align-items:center;
  justify-content:center;
`
export const ViewCenterColumn = styled.View`
  padding-left:10px;
  flex-direction:column;
  align-items:flex-start;
`
export const ButtonView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center ;
  margin-bottom:20px ;
`
export const TextButton = styled.Text`
  color: ${colors.PRIMARY};
`

