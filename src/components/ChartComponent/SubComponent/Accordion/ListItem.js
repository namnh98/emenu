import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
// export const LIST_ITEM_HEIGHT = 54;
import styled from 'styled-components/native';
import { colors } from '../../../../assets';
import Avatar from "../Avatar";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Container = styled.View`
        background-color: ${colors.WHITE_BLUE};
        flex-direction: row;
        /* justify-content: space-between;
        align-items: center; */
        border-color: #f4f4f6;
    `
const TextName = styled.Text`
  font-size: 16px;
  color:${colors.BLACK};
  text-transform:uppercase;
  margin-right:30px;
`

const ListView = styled.View`
  flex:1;
  justify-content:space-between;
  flex-direction:row;
  align-items:center;
  height:50px;
  border-bottom-width:1px;
  border-color:#eee;
  padding-left:10px;
  padding-right:10px;
`
const ViewCenterRow = styled.View`
  flex-direction:row;
  align-items:center;
  justify-content:center;
`
const TextNormal = styled.Text`
  color:${colors.BLACK};
`
const ViewCenterColumn = styled.View`
  padding-left:10px;
  flex-direction:column;
  align-items:flex-start;
`
const _renderStatus = (status)=>{
  switch (status) {
    case -1:
      return
    case 0:
      return <FontAwesome name="circle" size={16} color={colors.ORANGE} /> 
    case 1:
      return  <FontAwesome name="circle" size={16} color="#5cce0e" />   
    default:
      break;
  }
}
export default ({ item, index }) => {
  return (<Container>
    <ListView key={index} style={{ borderBottomWidth: item.length === index + 1 ? 0 : 1 }}>
      <ViewCenterRow>
        <TextNormal>{index + 1}</TextNormal>
        <ViewCenterColumn>
          <ViewCenterRow>
            <TextName>{item.full_name}</TextName>
            {_renderStatus(item.status)}
          </ViewCenterRow>
          <TextNormal style={{ color: colors.ORANGE }}>
            {item.areas.length > 0 ?
              item.areas.map((area) => {
                return 'Khu vực:' + area.Area.name
              }) : null
            }
          </TextNormal>
        </ViewCenterColumn>
      </ViewCenterRow>
      <Avatar imageSource={item.avatar ? item.avatar : ""} />

    </ListView>
  </Container>);
};